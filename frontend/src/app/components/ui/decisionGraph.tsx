"use client";

interface DecisionGraphProps {
    steps: string[];
    isLoading?: boolean;
}

interface GraphNode {
    label: string;
    type: "start" | "action" | "decision" | "email" | "end";
}

function categorizeStep(text: string): GraphNode["type"] {
    if (text.startsWith("✉") || text.toLowerCase().includes("email")) return "email";
    if (text.startsWith("⚠") || text.toLowerCase().includes("delay")) return "decision";
    if (text.startsWith("✓")) return "end";
    return "action";
}

function parseSteps(steps: string[]): GraphNode[] {
    if (steps.length === 0) return [];
    const nodes: GraphNode[] = [{ label: "Start", type: "start" }];
    for (const step of steps) {
        const cleaned = step.replace(/^[⚠✓✉🔍📧]\s*/u, "").trim();
        const shortLabel = cleaned.length > 40 ? cleaned.slice(0, 37) + "..." : cleaned;
        nodes.push({ label: shortLabel, type: categorizeStep(step) });
    }
    nodes.push({ label: "Complete", type: "end" });
    return nodes;
}

const nodeColors: Record<GraphNode["type"], { bg: string; border: string; text: string; dot: string }> = {
    start: { bg: "bg-slate-800", border: "border-slate-600", text: "text-slate-300", dot: "bg-slate-400" },
    action: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-300", dot: "bg-indigo-400" },
    decision: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
    email: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-300", dot: "bg-sky-400" },
    end: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400" },
};

export default function DecisionGraph({ steps, isLoading }: DecisionGraphProps) {
    const nodes = parseSteps(steps);

    if (nodes.length === 0 && !isLoading) return null;

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Agent Decision Path
                </h3>
            </div>

            <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {nodes.map((node, i) => {
                    const colors = nodeColors[node.type];
                    return (
                        <div key={i} className="flex items-center shrink-0">
                            <div className={`${colors.bg} border ${colors.border} rounded-lg px-3 py-2 min-w-[80px] max-w-[180px] text-center transition-transform hover:scale-105`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} mx-auto mb-1`} />
                                <p className={`text-xs font-medium ${colors.text} leading-tight`}>{node.label}</p>
                            </div>
                            {i < nodes.length - 1 && (
                                <svg className="w-6 h-6 text-[var(--text-muted)] shrink-0 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex items-center shrink-0">
                        <svg className="w-6 h-6 text-[var(--text-muted)] shrink-0 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="border border-dashed border-slate-600 rounded-lg px-3 py-2 min-w-[80px] text-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mb-1 animate-pulse" />
                            <p className="text-xs text-slate-500">Processing...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
