'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // router removed

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login error:', error.message);
            setError(error.message);
            setLoading(false);
        } else {
            console.log('Login successful, redirecting...');
            // Using href for a full reload to ensure middleware reflects auth state
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--bg-darker))] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[hsl(var(--primary))] blur-[150px] rounded-full animate-pulse opacity-30" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[hsl(var(--accent))] blur-[130px] rounded-full animate-pulse opacity-20" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white shadow-2xl shadow-[hsl(var(--primary))]/30 mb-6 group hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl font-black">V</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">
                        VibeCode <span className="text-gradient">OS</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">
                        High-Performance Workspace
                    </p>
                </div>

                <div className="card-glass p-8 md:p-10 border-2 border-white/5 shadow-2xl backdrop-blur-2xl">
                    <h2 className="text-2xl font-black mb-8 italic tracking-tight">Login</h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field bg-white/5 border-white/10 focus:border-[hsl(var(--primary))]/50"
                                placeholder="name@domain.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Password</label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field bg-white/5 border-white/10 focus:border-[hsl(var(--primary))]/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-xl font-black tracking-widest uppercase shadow-xl shadow-[hsl(var(--primary))]/20 ring-1 ring-white/10 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Enter Console'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-[hsl(var(--text-secondary))] text-[11px] font-bold">
                            Don&apos;t have an account? <a href="/signup" className="text-[hsl(var(--primary))] hover:underline">Request Access</a>
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest opacity-40">
                        &copy; 2026 VibeCode Corporation. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div >
    );
}
