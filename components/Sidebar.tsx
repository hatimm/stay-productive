"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/", icon: "🏡" },
    { name: "Projects", href: "/projects", icon: "🚀" },
    { name: "AI Tools", href: "/ai-toolbox", icon: "🧰" },
    { name: "AI News", href: "/ai-intelligence", icon: "🧠" },
    { name: "Calendar", href: "/calendar", icon: "📅" },
    { name: "Notes", href: "/notes", icon: "📓" },
    { name: "Accounts", href: "/accounts", icon: "🔑" },
    { name: "Documents", href: "/documents", icon: "📁" },
    { name: "Tutorial", href: "/tutorial", icon: "📚" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[hsl(var(--card-bg))] border-r border-[hsl(var(--border-color))] flex flex-col z-40 transition-all hidden md:flex shadow-sm">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white shadow-lg shadow-[hsl(var(--primary))]/20">
                        <span className="text-xl font-bold">V</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">VibeCode</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))]">Productivity</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${isActive
                                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                                    : "text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-dark))] hover:text-[hsl(var(--text-primary))]"
                                    }`}
                            >
                                <span className={`text-lg transition-transform group-hover:scale-110 duration-200 ${isActive ? "" : "grayscale"}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[hsl(var(--border-color))] flex flex-col gap-4">
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all group w-full"
                >
                    <span className="text-lg grayscale group-hover:grayscale-0 transition-transform group-hover:scale-110">🚪</span>
                    Logout
                </button>
                <ThemeToggle />
                <div className="text-[10px] font-medium text-[hsl(var(--text-muted))] px-2">
                    &copy; 2026 VibeCode v2.0
                </div>
            </div>
        </aside>
    );
}
