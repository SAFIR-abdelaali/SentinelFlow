# SentinelFlow
### **Autonomous Agentic Reconciliation Engine for Enterprise Logistics**

---

## The Digitalization Challenge: The Logistics Reconciliation Gap

The global logistics industry incurs over $4 billion in annual losses due to **Reconciliation Gaps**—the operational friction between physical shipment anomalies (such as meteorological disruptions, hub congestion, and carrier errors) and the internal data systems designed to monitor them. Traditional reconciliation requires manual cross-referencing across fragmented platforms, resulting in high overhead and systemic data lag.

**SentinelFlow** mitigates this inefficiency by deploying an autonomous agentic core. The system continuously monitors logistics data streams, identifies anomalies in real-time, and executes iterative **Thought-Action** cycles to resolve discrepancies before they impact the bottom line.

---

## Deployment Strategy: Containerized Orchestration

For production-grade evaluation and environment parity, SentinelFlow utilizes **Docker Compose**. This ensures that all asynchronous dependencies and AI model configurations are synchronized automatically.

### 1. Environment Configuration
Prior to deployment, environment variables must be configured to enable Large Language Model (LLM) inference:
1. Locate the `backend/.env.example` file.
2. Rename the file to `backend/.env`.
3. Input your **Groq API Key** (Llama 3) into the specified field.

### 2. Initialization
Execute the following command from the project root:
```bash
docker-compose up --build
```

### 3. Service Access
Frontend: http://localhost:3000
Backend: http://localhost:8000

### 4. Author
Abdelaali Safir
