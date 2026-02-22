"use client";

export default function SkeletonLoader() {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl mt-8">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-2 h-2 rounded-full skeleton" />
                <div className="skeleton h-3 w-40" />
            </div>

            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-5 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full skeleton mt-1.5 shrink-0" />
                    <div className="skeleton h-4 w-3/4" />
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full skeleton mt-1.5 shrink-0" />
                    <div className="skeleton h-4 w-1/2" />
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full skeleton mt-1.5 shrink-0" />
                    <div className="skeleton h-4 w-2/3" />
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full skeleton mt-1.5 shrink-0" />
                    <div className="skeleton h-4 w-5/6" />
                </div>
            </div>

            <div className="mt-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-5 space-y-3">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-4 w-3/5" />
            </div>
        </div>
    );
}
