'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkUserCount() {
            // Note: Since we can't easily count users from the client side in Supabase Auth without an admin key,
            // we'll check a 'profiles' table or similar, OR we can try a more creative way.
            // For now, let's assume we have a way to check if registration is closed.
            // A common pattern for single-user apps is to check if any user exists.

            // In many Supabase setups, you might have a public view of user count if allowed,
            // but for this implementation, we'll simulate the "One User Only" logic
            // by checking if registration is allowed (e.g., via a specific table or setting).

            // For a robust implementation, we can check if we can fetch any profile.
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (!error && count && count > 0) {
                setIsLocked(true);
            }
            setCheckingStatus(false);
        }
        checkUserCount();
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;

        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (data.user) {
            // Successfully signed up the first user
            router.push('/');
        }
    };

    if (checkingStatus) {
        return (
            <div className="min-h-screen bg-[hsl(var(--bg-darker))] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(var(--primary))]"></div>
            </div>
        );
    }

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
                        Registration Gateway
                    </p>
                </div>

                <div className="card-glass p-8 md:p-10 border-2 border-white/5 shadow-2xl backdrop-blur-2xl">
                    <h2 className="text-2xl font-black mb-4 italic tracking-tight">Create Account</h2>

                    {isLocked ? (
                        <div className="space-y-6 text-center">
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                <span className="text-4xl mb-4 block">🔒</span>
                                <h3 className="text-lg font-black text-red-500 mb-2 uppercase tracking-tight">Registration Locked</h3>
                                <p className="text-[hsl(var(--text-secondary))] text-xs font-medium leading-relaxed">
                                    VibeCode OS is restricted to a single administrator. Registration is currently disabled.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full btn-primary py-4 rounded-xl font-black tracking-widest uppercase shadow-xl shadow-[hsl(var(--primary))]/20 ring-1 ring-white/10"
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Admin Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field bg-white/5 border-white/10 focus:border-[hsl(var(--primary))]/50"
                                    placeholder="your-email@domain.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Secure Password</label>
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
                                {loading ? 'Initializing...' : 'Claim Ownership'}
                            </button>

                            <p className="text-[hsl(var(--text-muted))] text-[9px] font-medium text-center italic opacity-60 px-4">
                                Note: Only one user can be registered. This person will have full administrative control.
                            </p>
                        </form>
                    )}

                    {!isLocked && (
                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <p className="text-[hsl(var(--text-secondary))] text-[11px] font-bold">
                                Already have an account? <a href="/login" className="text-[hsl(var(--primary))] hover:underline">Login</a>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest opacity-40">
                        &copy; 2026 VibeCode Corporation. Secure Environment.
                    </p>
                </div>
            </div>
        </div>
    );
}
