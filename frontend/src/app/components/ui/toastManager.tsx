"use client";
import { useState, useEffect, useCallback } from "react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "info" | "warning";
    undoable?: boolean;
    countdown?: number;
    onUndo?: () => void;
}

let toastId = 0;

export function useToastManager() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback(
        (message: string, type: Toast["type"] = "success", options?: { undoable?: boolean; onUndo?: () => void }) => {
            const id = ++toastId;
            setToasts((prev) => [...prev, { id, message, type, undoable: options?.undoable, countdown: 5, onUndo: options?.onUndo }]);
            return id;
        },
        []
    );

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const [countdown, setCountdown] = useState(toast.undoable ? 5 : 3);
    const [undone, setUndone] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((c) => Math.max(0, c - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (countdown === 0 && !undone) {
            onDismiss();
        }
    }, [countdown, undone, onDismiss]);

    const handleUndo = () => {
        setUndone(true);
        toast.onUndo?.();
        onDismiss();
    };

    const bgColor = toast.type === "success" ? "bg-emerald-600" : toast.type === "warning" ? "bg-amber-600" : "bg-indigo-600";

    return (
        <div className={`flex items-center gap-3 ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-4 duration-300`}>
            {toast.type === "success" && (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            {toast.undoable && !undone && (
                <button onClick={handleUndo} className="text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">
                    Undo ({countdown}s)
                </button>
            )}
        </div>
    );
}

export default function ToastManager({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}
