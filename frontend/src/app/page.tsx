"use client";
import { useState, useRef } from "react";
import AgentTrace from "@/app/components/ui/agentTrace";
import BusinessStats from "@/app/components/ui/businessStats";
import DecisionGraph from "@/app/components/ui/decisionGraph";
import OrderHistory, { HistoryEntry } from "@/app/components/ui/orderHistory";
import SkeletonLoader from "@/app/components/ui/skeletonLoader";
import ThemeToggle from "@/app/components/ui/themeToggle";
import ToastManager, { useToastManager } from "@/app/components/ui/toastManager";
import { askAgentStream, markOrderAsNotified } from "@/lib/api";

export default function LogisticsDashboard() {
  const [orderInput, setOrderInput] = useState("ORD-002");
  const [steps, setSteps] = useState<string[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");

  const [ordersChecked, setOrdersChecked] = useState(0);
  const [emailsDrafted, setEmailsDrafted] = useState(0);
  const [emailsApproved, setEmailsApproved] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyIdRef = useRef(0);

  const { toasts, addToast, removeToast } = useToastManager();

  const processSingleOrder = async (orderId: string): Promise<{ steps: string[]; output: string }> => {
    const collectedSteps: string[] = [];
    const finalOutput = await askAgentStream(orderId, (step) => {
      collectedSteps.push(step);
      setSteps((prev) => [...prev, step]);
    });
    return { steps: collectedSteps, output: finalOutput };
  };

  const handleRunCheck = async () => {
    const orderIds = orderInput
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (orderIds.length === 0) return;

    setIsLoading(true);
    setSteps([]);
    setOutput(null);

    const isBatch = orderIds.length > 1;

    try {
      for (let i = 0; i < orderIds.length; i++) {
        const oid = orderIds[i];
        setCurrentOrderId(oid);

        if (isBatch && i > 0) {
          setSteps((prev) => [...prev, `── Processing order ${i + 1}/${orderIds.length}: ${oid} ──`]);
        }

        const result = await processSingleOrder(oid);
        const hasEmail = result.output.includes("Subject:") || result.output.includes("📧");

        setOrdersChecked((c) => c + 1);
        if (hasEmail) setEmailsDrafted((c) => c + 1);

        const summaryLine = hasEmail
          ? "Delayed — email drafted"
          : result.output.includes("on time") || result.output.includes("ON TIME")
            ? "On time — no action needed"
            : result.output.slice(0, 60);

        setHistory((prev) => [
          {
            id: ++historyIdRef.current,
            orderId: oid,
            timestamp: new Date().toLocaleTimeString(),
            hasEmail,
            approved: false,
            summary: summaryLine,
          },
          ...prev,
        ]);

        if (i === orderIds.length - 1) {
          setOutput(
            isBatch
              ? `Batch complete — ${orderIds.length} orders processed.\n\n${result.output}`
              : result.output
          );
        }
      }

      if (isBatch) {
        addToast(`Batch complete: ${orderIds.length} orders processed`, "info");
      }
    } catch (error: any) {
      setOutput(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (!currentOrderId) return;

    setEmailsApproved((c) => c + 1);
    markOrderAsNotified(currentOrderId);

    setHistory((prev) =>
      prev.map((h) =>
        h.orderId === currentOrderId && h.hasEmail ? { ...h, approved: true } : h
      )
    );
  };

  const handleUndoApprove = () => {
    setEmailsApproved((c) => Math.max(0, c - 1));
    setHistory((prev) =>
      prev.map((h, i) => (i === 0 && h.hasEmail ? { ...h, approved: false } : h))
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-8 font-sans transition-colors duration-300">
      <ToastManager toasts={toasts} removeToast={removeToast} />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">SentinelFlow</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Autonomous Agentic Reconciliation Engine</p>
          </div>
          <ThemeToggle />
        </div>

        <BusinessStats
          ordersChecked={ordersChecked}
          emailsDrafted={emailsDrafted}
          emailsApproved={emailsApproved}
        />

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Logistics Reconciliation</h2>
          </div>

          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Enter one or more order IDs (comma-separated). The AI will check each shipment and autonomously draft apologies for delays.
          </p>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Order ID (Try: ORD-001, ORD-002 — or both)
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="ORD-001, ORD-002"
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                onClick={handleRunCheck}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isLoading
                  ? `Checking ${currentOrderId}...`
                  : "Run Agent Check"}
              </button>
            </div>
          </div>
        </div>

        {isLoading && steps.length === 0 && <SkeletonLoader />}

        <AgentTrace
          steps={steps}
          output={output}
          isLoading={isLoading}
          onApprove={handleApprove}
          onUndoApprove={handleUndoApprove}
          addToast={addToast}
        />

        {(steps.length > 0 || isLoading) && (
          <DecisionGraph steps={steps} isLoading={isLoading} />
        )}

        <OrderHistory entries={history} />
      </div>
    </div>
  );
}