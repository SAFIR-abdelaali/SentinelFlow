"use client";
import React, { useState, useEffect } from "react";

interface AgentTraceProps {
  steps: string[];
  output: string | null;
  isLoading?: boolean;
  onApprove?: () => void;
  onUndoApprove?: () => void;
  addToast?: (message: string, type: "success" | "info" | "warning", options?: { undoable?: boolean; onUndo?: () => void }) => number;
}

function StepItem({ text, index }: { text: string; index: number }) {
  const isWarning = text.startsWith("⚠");
  const isSuccess = text.startsWith("✓");
  const isEmail = text.startsWith("✉");
  const isError = text.toLowerCase().includes("error");

  let dotColor = "bg-indigo-500";
  let textColor = "text-indigo-300";
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
        <div className="w-px h-full bg-[var(--border-color)] min-h-[16px]" />
      </div>
      <p className={`text-sm font-mono leading-relaxed pb-3 ${textColor}`}>{text}</p>
    </div>
  );
}

function parseEmailDraft(text: string): { summary: string; draft: string } | null {
  const delimiters = ["📧 Drafted Email:\n", "Email successfully drafted:\n\n"];
  for (const delim of delimiters) {
    const idx = text.indexOf(delim);
    if (idx !== -1) {
      return {
        summary: text.slice(0, idx).trimEnd(),
        draft: text.slice(idx + delim.length).trim(),
      };
    }
  }
  if (text.includes("Subject:")) {
    const idx = text.indexOf("Subject:");
    return {
      summary: text.slice(0, idx).trimEnd(),
      draft: text.slice(idx).trim(),
    };
  }
  return null;
}

export default function AgentTrace({ steps, output, isLoading, onApprove, onUndoApprove, addToast }: AgentTraceProps) {
  const [isApproved, setIsApproved] = useState(false);
  const [editedDraft, setEditedDraft] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const parsed = output ? parseEmailDraft(output) : null;
  const hasEmailDraft = parsed !== null;

  useEffect(() => {
    setIsApproved(false);
    setIsEditing(false);
    if (parsed) {
      setEditedDraft(parsed.draft);
    } else {
      setEditedDraft("");
    }
  }, [output]);

  const handleApprove = () => {
    setIsApproved(true);
    setIsEditing(false);
    onApprove?.();
    addToast?.("Email approved and sent successfully!", "success", {
      undoable: true,
      onUndo: () => {
        setIsApproved(false);
        onUndoApprove?.();
      },
    });
  };

  if (steps.length === 0 && !output && !isLoading) return null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-400 animate-ping" : "bg-emerald-500 animate-pulse"}`}
        />
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {isLoading ? "Agent is Thinking..." : "Agent Execution Trace"}
        </h3>
      </div>

      {steps.length > 0 && (
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-5 mb-4">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <StepItem key={i} text={step} index={i} />
            ))}
          </div>
          {isLoading && (
            <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-sm mt-2 pl-5">
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
        <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-5 mb-4">
          <div className="flex items-center gap-3 text-[var(--text-muted)] font-mono text-sm">
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

          {hasEmailDraft ? (
            <>
              {parsed.summary && (
                <pre className="text-[var(--text-primary)] font-mono text-sm whitespace-pre-wrap leading-relaxed mb-4">
                  {parsed.summary}
                </pre>
              )}

              <div className="mt-2 border border-sky-500/20 rounded-lg overflow-hidden bg-[var(--bg-primary)]/60">
                <div className="flex items-center justify-between px-4 py-2.5 bg-sky-500/5 border-b border-sky-500/20">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Email Draft</span>
                  </div>
                  {!isApproved && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      {isEditing ? "Editing..." : "Click to edit"}
                    </div>
                  )}
                </div>
                <textarea
                  id="email-draft-editor"
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                  onFocus={() => !isApproved && setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  readOnly={isApproved}
                  rows={editedDraft.split("\n").length + 1}
                  className={`w-full bg-transparent px-4 py-3 font-mono text-sm leading-relaxed resize-none focus:outline-none transition-colors duration-200 ${isApproved
                    ? "text-[var(--text-muted)] cursor-default"
                    : isEditing
                      ? "text-[var(--text-primary)] ring-1 ring-sky-500/30"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]/50 cursor-text"
                    }`}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                <p className="text-xs text-[var(--text-muted)]">
                  {isApproved
                    ? "This email has been approved and sent."
                    : "Edit the draft above if needed, then approve to send."}
                </p>
                <button
                  id="approve-send-btn"
                  onClick={handleApprove}
                  disabled={isApproved}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${isApproved
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 active:scale-95"
                    }`}
                >
                  {isApproved ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Approved ✓
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Approve &amp; Send
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <pre className="text-[var(--text-primary)] font-mono text-sm whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}