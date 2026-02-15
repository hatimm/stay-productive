'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) {
        return <div className="min-h-screen">{children}</div>;
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 min-h-screen pb-16 md:pb-0">
                {children}
                {/* Mobile Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[hsl(var(--card-bg))] border-t border-[hsl(var(--border-color))] flex items-center justify-around z-50">
                    <Link href="/" className="text-xl">🏡</Link>
                    <Link href="/calendar" className="text-xl">📅</Link>
                    <Link href="/accounts" className="text-xl">🔑</Link>
                    <Link href="/notes" className="text-xl">📓</Link>
                </nav>
            </main>
        </div>
    );
}
