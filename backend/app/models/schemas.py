from pydantic import BaseModel, Field
from typing import List

class ChatRequest(BaseModel):
    prompt: str = Field(..., description="The user prompt to the agent")

class ChatResponse(BaseModel):
    output: str = Field(..., description="The agent's final response")
    steps: List[str] = Field(default_factory=list, description="The agent's thinking steps")