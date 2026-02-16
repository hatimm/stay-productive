'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const savedTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
        if (savedTheme && savedTheme !== theme) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(savedTheme);
        }
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-lg backdrop-blur-md flex items-center gap-2 group"
            aria-label="Toggle Theme"
        >
            <span className="text-lg transition-transform group-hover:rotate-12 duration-300">
                {theme === 'dark' ? '☀️' : '🌙'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))] group-hover:text-[hsl(var(--text-primary))] transition-colors">
                {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
        </button>
    );
}
