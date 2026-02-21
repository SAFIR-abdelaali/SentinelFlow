# 🚀 SentinelFlow: Autonomous Logistics Reconciliation

**SentinelFlow** is an agentic workflow engine built for the Automation Innovation Hackathon 2026. It moves beyond passive notifications to actively reconcile e-commerce logistics issues using AI.

## 🏆 The Problem It Solves
When shipments are delayed, customer support teams waste hours manually cross-referencing carrier APIs, updating internal databases, and drafting apology emails. SentinelFlow automates this entire pipeline with a "Human-in-the-loop" approval process.

## 🛠️ Architecture
* **Frontend:** Next.js 15, React, Tailwind CSS
* **Backend:** FastAPI, Python 3.12+
* **Intelligence:** LangChain 1.1, Groq (Llama 3 70B)
* **Orchestration:** Docker Compose

## ⚡ Quick Start (For Judges)
We have optimized this project to run instantly on any machine using Docker.

1. Clone the repository.
2. Navigate to the `backend/` folder and copy `.env.example` to `.env`. Add your Groq API Key.
3. Run the following command from the root directory:
   ```bash
   docker-compose up --build