"use client";
import React from "react";

interface AgentTraceProps {
  steps: string[];
  output: string | null;
  isLoading?: boolean;
}

function StepItem({ text, index }: { text: string; index: number }) {
  const isWarning = text.startsWith("⚠");
  const isSuccess = text.startsWith("✓");
  const isEmail = text.startsWith("✉");
  const isError = text.toLowerCase().includes("error");

  let dotColor = "bg-indigo-500";
  let textColor = "text-slate-300";
  if (isWarning) { dotColor = "bg-amber-500"; textColor = "text-amber-300"; }
  else if (isSuccess) { dotColor = "bg-emerald-500"; textColor = "text-emerald-300"; }
  else if (isEmail) { dotColor = "bg-sky-500"; textColor = "text-sky-300"; }
  else if (isError) { dotColor = "bg-red-500"; textColor = "text-red-300"; }

  return (
    <div
      className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-col items-center pt-1.5">
        <div className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
        <div className="w-px h-full bg-slate-800 min-h-[16px]" />
      </div>
      <p className={`text-sm font-mono leading-relaxed pb-3 ${textColor}`}>{text}</p>
    </div>
  );
}

export default function AgentTrace({ steps, output, isLoading }: AgentTraceProps) {
  if (steps.length === 0 && !output && !isLoading) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-400 animate-ping" : "bg-emerald-500 animate-pulse"
            }`}
        />
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {isLoading ? "Agent is Thinking..." : "Agent Execution Trace"}
        </h3>
      </div>

      {steps.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 mb-4">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <StepItem key={i} text={step} index={i} />
            ))}
          </div>
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 font-mono text-sm mt-2 pl-5">
              <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          )}
        </div>
      )}

      {steps.length === 0 && isLoading && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 mb-4">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm">
            <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Initializing agent pipeline...
          </div>
        </div>
      )}

      {output && !isLoading && (
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Final Report</span>
          </div>
          <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}