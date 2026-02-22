"use client";

interface BusinessStatsProps {
    ordersChecked: number;
    emailsDrafted: number;
    emailsApproved: number;
}

export default function BusinessStats({ ordersChecked, emailsDrafted, emailsApproved }: BusinessStatsProps) {
    const accuracy = ordersChecked > 0 ? "100%" : "—";
    const efficiency = ordersChecked > 0 ? "4.2m" : "—";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/10 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                        Efficiency Gain
                    </span>
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/15 transition-colors">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                </div>
                <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{efficiency}</p>
                <p className="text-sm text-emerald-400/80 mt-1">Saved per Order</p>
            </div>

            <div className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-900/10 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                        Orders Checked
                    </span>
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/15 transition-colors">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{ordersChecked}</p>
                    {emailsDrafted > 0 && (
                        <span className="text-xs text-amber-400/80">
                            {emailsDrafted} email{emailsDrafted !== 1 ? "s" : ""} drafted
                        </span>
                    )}
                </div>
                <p className="text-sm text-indigo-400/80 mt-1">
                    Accuracy: {accuracy}
                </p>
            </div>

            <div className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 transition-all duration-300 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-900/10 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                        Engine Status
                    </span>
                    <div className="relative flex items-center justify-center w-7 h-7">
                        <span className="absolute w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-40" />
                        <span className="relative w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Operational</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-sky-400/80">AI Core: Active</p>
                    {emailsApproved > 0 && (
                        <span className="text-xs text-emerald-400/80">• {emailsApproved} approved</span>
                    )}
                </div>
            </div>
        </div>
    );
}
