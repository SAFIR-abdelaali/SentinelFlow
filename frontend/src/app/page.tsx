"use client";
import { useState } from "react";
import AgentTrace from "@/app/components/ui/agentTrace";
import { askAgentStream } from "@/lib/api";

export default function LogisticsDashboard() {
  const [orderId, setOrderId] = useState("ORD-002");
  const [steps, setSteps] = useState<string[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunCheck = async () => {
    setIsLoading(true);
    setSteps([]);
    setOutput(null);

    try {
      const finalOutput = await askAgentStream(orderId, (step) => {
        setSteps((prev) => [...prev, step]);
      });
      setOutput(finalOutput);
    } catch (error: any) {
      setOutput(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">SentinelFlow</h1>
          <p className="text-slate-400 text-sm mt-1">Autonomous Agentic Reconciliation Engine</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h2 className="text-lg font-medium text-white">Logistics Reconciliation</h2>
          </div>

          <p className="text-slate-400 text-sm mb-6">
            Enter an order ID. The AI will check the shipment status and autonomously draft an apology if it detects a delay.
          </p>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Order ID (Try: ORD-001 or ORD-002)</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                onClick={handleRunCheck}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? "AI is Thinking..." : "Run Agent Check"}
              </button>
            </div>
          </div>
        </div>

        <AgentTrace steps={steps} output={output} isLoading={isLoading} />

      </div>
    </div>
  );
}