"use client";
import { useState } from "react";

export interface HistoryEntry {
    id: number;
    orderId: string;
    timestamp: string;
    hasEmail: boolean;
    approved: boolean;
    summary: string;
}

interface OrderHistoryProps {
    entries: HistoryEntry[];
}

export default function OrderHistory({ entries }: OrderHistoryProps) {
    const [expanded, setExpanded] = useState(false);

    if (entries.length === 0) return null;

    const visible = expanded ? entries : entries.slice(0, 3);

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Activity Log
                    </h3>
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                        {entries.length}
                    </span>
                </div>
                {entries.length > 3 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                        {expanded ? "Show Less" : `Show All (${entries.length})`}
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {visible.map((entry) => (
                    <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-indigo-500/20 transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${entry.hasEmail ? (entry.approved ? "bg-emerald-400" : "bg-amber-400") : "bg-indigo-400"}`} />
                            <div className="min-w-0">
                                <p className="text-sm font-mono text-[var(--text-primary)] truncate">
                                    {entry.orderId}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] truncate">{entry.summary}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                            {entry.hasEmail && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.approved ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                                    {entry.approved ? "Sent" : "Pending"}
                                </span>
                            )}
                            <span className="text-xs text-[var(--text-muted)]">{entry.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
