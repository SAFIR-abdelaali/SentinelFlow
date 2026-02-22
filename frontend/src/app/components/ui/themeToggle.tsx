"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("sf-theme");
        if (saved === "light") {
            setIsLight(true);
            document.documentElement.classList.add("light");
        }
    }, []);

    const toggle = () => {
        const next = !isLight;
        setIsLight(next);
        if (next) {
            document.documentElement.classList.add("light");
            localStorage.setItem("sf-theme", "light");
        } else {
            document.documentElement.classList.remove("light");
            localStorage.setItem("sf-theme", "dark");
        }
    };

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] transition-colors"
            aria-label="Toggle theme"
        >
            {isLight ? (
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
