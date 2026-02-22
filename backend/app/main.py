import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from app.models.schemas import ChatRequest
from app.agents.orchestrator import run_agent_stream

app = FastAPI(title="SentinelFlow AI Engine")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return JSONResponse(
        content={"detail": "OK"},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        },
    )

@app.get("/")
def root():
    return {"status": "SentinelFlow Backend is Live"}

@app.post("/mark_notified/{order_id}")
def mark_notified(order_id: str):
    from app.tools.logistics import SENT_APOLOGIES
    SENT_APOLOGIES.add(order_id.upper())
    return {"status": "success", "message": f"Order {order_id} marked as notified"}

@app.post("/ask")
def ask_agent(request: ChatRequest):
    def event_stream():
        for event in run_agent_stream(request.prompt):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )