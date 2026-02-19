'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useProductivity } from '@/hooks/useVibeCode';

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

function getLast7Days(): string[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
}

function dayLabel(dateStr: string) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
    return (
        <div className="w-full h-2 bg-[hsl(var(--bg-dark))] rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
            />
        </div>
    );
}

type StepStatus = 'done' | 'partial' | 'idle';

function StepBlock({ num, title, desc, status, metric }: {
    num: number; title: string; desc: string; status: StepStatus; metric?: string;
}) {
    const dotClass = status === 'done'
        ? 'bg-green-500 shadow shadow-green-500/40'
        : status === 'partial'
            ? 'bg-yellow-500 shadow shadow-yellow-500/40'
            : 'bg-[hsl(var(--border-color))]';

    const borderClass = status === 'done'
        ? 'border-green-500/20 bg-green-500/5'
        : status === 'partial'
            ? 'border-yellow-500/20 bg-yellow-500/5'
            : 'border-[hsl(var(--border-color))] bg-[hsl(var(--bg-dark))]/30';

    return (
        <div className={`rounded-2xl p-5 border ${borderClass} transition-all duration-300`}>
            <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                    <div className="w-6 h-6 rounded-lg bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] flex items-center justify-center text-[10px] font-black text-[hsl(var(--text-muted))]">
                        {num}
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[hsl(var(--text-primary))] mb-1 flex items-center justify-between gap-2 flex-wrap">
                        <span>{title}</span>
                        {metric && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--text-muted))] bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] px-2 py-0.5 rounded-full">
                                {metric}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    );
}

function ChainCard({ emoji, label, tagline, accentText, accentBg, accentBorder, cardBorder, pct, completedMsg, children }: {
    emoji: string; label: string; tagline: string;
    accentText: string; accentBg: string; accentBorder: string; cardBorder: string;
    pct: number; completedMsg?: string | null;
    children: React.ReactNode;
}) {
    const barColor = label.includes('Authority') ? 'bg-purple-500' : label.includes('Asset') ? 'bg-green-500' : 'bg-yellow-500';
    return (
        <section className={`card border border-[hsl(var(--border-color))] ${cardBorder} p-7 md:p-9 space-y-6 transition-all duration-300`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xl">{emoji}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border"
                            style={{ color: accentText, background: accentBg, borderColor: accentBorder }}>
                            {tagline}
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-[hsl(var(--text-primary))]">{label}</h2>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-3xl font-black tabular-nums" style={{ color: accentText }}>{pct}%</div>
                    <div className="text-[10px] text-[hsl(var(--text-muted))] font-bold uppercase tracking-widest">today</div>
                </div>
            </div>
            <div className="space-y-1.5">
                <ProgressBar pct={pct} color={barColor} />
                {pct >= 100 && completedMsg && (
                    <p className="text-xs font-bold text-center" style={{ color: accentText }}>✓ {completedMsg}</p>
                )}
            </div>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

export default function TaskChainsTrackingPage() {
    const { tasks, notes, isLoaded } = useProductivity();
    const today = getTodayStr();
    const last7 = getLast7Days();

    const data = useMemo(() => {
        const todayTasks = tasks.filter(t => t.date === today);
        const todayNotes = notes.filter(n => n.createdAt.startsWith(today));

        // AUTHORITY
        const authTasks = todayTasks.filter(t => t.category === 'AINews' || t.category === 'OnlinePresence');
        const authDone = authTasks.filter(t => t.completed);
        const authPct = authTasks.length > 0 ? Math.round((authDone.length / authTasks.length) * 100) : 0;
        const aiTasksDone = authTasks.filter(t => t.category === 'AINews' && t.completed);
        const presenceDone = authTasks.filter(t => t.category === 'OnlinePresence' && t.completed);
        const authStep1: StepStatus = authTasks.some(t => t.category === 'AINews') ? (aiTasksDone.length > 0 ? 'done' : 'partial') : 'idle';
        const authStep2: StepStatus = aiTasksDone.length > 0 ? 'done' : 'idle';
        const authStep3: StepStatus = authStep2 === 'done' ? 'done' : 'idle';
        const authStep4: StepStatus = presenceDone.length > 0 ? 'done' : authTasks.some(t => t.category === 'OnlinePresence') ? 'partial' : 'idle';
        const authStep5: StepStatus = presenceDone.length >= 2 ? 'done' : presenceDone.length >= 1 ? 'partial' : 'idle';

        // ASSET
        const assetTasks = todayTasks.filter(t => t.category === 'DevOps');
        const assetDone = assetTasks.filter(t => t.completed);
        const assetNotes = todayNotes.filter(n => n.type === 'DevOps');
        const hasSummaryNote = assetNotes.some(n => n.content.toLowerCase().includes('summary:'));
        const hasPractice = assetTasks.some(t => t.completed && t.title.toLowerCase().includes('practice'));
        const assetStepsDone = [
            assetDone.length > 0,
            assetNotes.length > 0,
            hasSummaryNote,
            hasPractice || assetDone.length >= 2
        ];
        const assetPct = Math.round((assetStepsDone.filter(Boolean).length / 4) * 100);
        const astep = (i: number): StepStatus =>
            assetStepsDone[i] ? 'done' :
                (i === 0 && assetTasks.length > 0) || (i === 1 && assetNotes.length > 0) ? 'partial' : 'idle';

        // REVENUE
        const revTasks = todayTasks.filter(t => t.category === 'Freelancing' || t.category === 'Lead');
        const revDone = revTasks.filter(t => t.completed);
        const revPct = revTasks.length > 0 ? Math.round((revDone.length / revTasks.length) * 100) : 0;
        const leadsAdded = todayTasks.filter(t => t.category === 'Lead').length;
        const proposalsDone = revDone.filter(t => t.title.toLowerCase().includes('proposal') || t.title.toLowerCase().includes('send')).length;
        const followUpsDone = revDone.filter(t => t.title.toLowerCase().includes('follow')).length;
        const revStep = (cats: string[], keyword?: string): StepStatus => {
            const matching = revTasks.filter(t => cats.includes(t.category) && (!keyword || t.title.toLowerCase().includes(keyword)));
            const done = matching.filter(t => t.completed);
            return done.length > 0 ? 'done' : matching.length > 0 ? 'partial' : 'idle';
        };

        // WEEKLY
        const weekData = last7.map(day => {
            const dt = tasks.filter(t => t.date === day);
            const dn = notes.filter(n => n.createdAt.startsWith(day));
            const authT = dt.filter(t => t.category === 'AINews' || t.category === 'OnlinePresence');
            const assetT = dt.filter(t => t.category === 'DevOps');
            const revT = dt.filter(t => t.category === 'Freelancing' || t.category === 'Lead');
            return {
                day, label: dayLabel(day), isToday: day === today,
                authDone: authT.length > 0 && authT.every(t => t.completed),
                assetDone: assetT.length > 0 && dn.some(n => n.type === 'DevOps'),
                revDone: revT.length > 0 && revT.some(t => t.completed),
            };
        });

        const allDone = authPct >= 100 && assetPct >= 100 && revPct >= 100;
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return {
            authPct, authDoneCount: authDone.length, authTotal: authTasks.length,
            authStep1, authStep2, authStep3, authStep4, authStep5,
            assetPct, assetNoteCount: assetNotes.length, assetDoneCount: assetDone.length, astep,
            revPct, revActivated: revDone.length >= 1, leadsAdded, proposalsDone, followUpsDone, revStep,
            weekData, allDone, nowStr
        };
    }, [tasks, notes, today, last7]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-green-500 to-yellow-500">
                    Loading chains...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-green-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative p-6 md:p-10 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">

                {/* Header */}
                <header className="space-y-3">
                    <Link href="/task-chains" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))] transition-colors">
                        ← Task Chains
                    </Link>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[hsl(var(--primary))]">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        Live Tracker
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        Chains <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-green-500 to-yellow-500">Tracking</span>
                    </h1>
                    <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                        Reads from your tasks and notes. Updates automatically. No manual input needed.
                    </p>
                </header>

                {/* Daily Summary */}
                <section className="card border border-[hsl(var(--border-color))] p-7 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--primary))] mb-1">Today's Strategic Execution</div>
                            <h2 className="text-lg font-black text-[hsl(var(--text-primary))]">Daily Chain Summary</h2>
                        </div>
                        {data.allDone && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 via-green-500/10 to-yellow-500/10 border border-purple-500/20 animate-in fade-in duration-500">
                                <span className="text-xl">🔥</span>
                                <span className="text-xs font-black text-[hsl(var(--text-primary))]">Full Strategic Day Completed</span>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {[
                            { label: 'Authority Engine', pct: data.authPct, bar: 'bg-purple-500', text: '#9333ea' },
                            { label: 'Asset Engine', pct: data.assetPct, bar: 'bg-green-500', text: '#16a34a' },
                            { label: 'Revenue Engine', pct: data.revPct, bar: 'bg-yellow-500', text: '#ca8a04' },
                        ].map(c => (
                            <div key={c.label} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-[hsl(var(--text-secondary))]">{c.label}</span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: c.text }}>{c.pct}%</span>
                                </div>
                                <ProgressBar pct={c.pct} color={c.bar} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Authority Engine */}
                <ChainCard emoji="🟣" label="Authority Engine" tagline="Public Work"
                    accentText="#9333ea" accentBg="rgba(147,51,234,0.08)" accentBorder="rgba(147,51,234,0.2)"
                    cardBorder="hover:border-purple-500/30" pct={data.authPct}
                    completedMsg={`Authority Chain Completed Today · ${data.nowStr}`}>
                    <StepBlock num={1} title="Discover AI Tool or News" status={data.authStep1}
                        metric={`${data.authTotal} tasks`}
                        desc="Detected from tasks with category 'AINews'. Check one news source or discover a new tool to begin the chain." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={2} title="Test the Tool or Extract Insight" status={data.authStep2}
                        desc="Mark the AINews task as complete to confirm you've spent time investigating the tool or news item." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={3} title="Write Clear Notes" status={data.authStep3}
                        desc="Record what it does, what you liked, and who it is for. These notes become the raw material for your post." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={4} title="Create and Publish a Post" status={data.authStep4}
                        metric={`${data.authDoneCount} done`}
                        desc="Detected from tasks with category 'OnlinePresence'. Turn your notes into an X post, thread, or mini review." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={5} title="Engage (2–3 replies)" status={data.authStep5}
                        desc="Reply to at least 2 people in your niche. Detected when 2+ OnlinePresence tasks are completed today." />
                </ChainCard>

                {/* Asset Engine */}
                <ChainCard emoji="🟢" label="Asset Engine" tagline="Private Skill Building"
                    accentText="#16a34a" accentBg="rgba(34,197,94,0.08)" accentBorder="rgba(34,197,94,0.2)"
                    cardBorder="hover:border-green-500/30" pct={data.assetPct}
                    completedMsg={`Asset Chain Executed Successfully Today · ${data.nowStr}`}>
                    <StepBlock num={1} title="Watch DevOps Video (25–40 min)" status={data.astep(0)}
                        metric={`${data.assetDoneCount} tasks done`}
                        desc="Detected from tasks with category 'DevOps'. At least 1 DevOps task must be completed to mark this step done." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={2} title="Take Structured Notes" status={data.astep(1)}
                        metric={`${data.assetNoteCount} notes today`}
                        desc="Detected from notes with type 'DevOps' created today. Write commands, concepts, and mistakes as you watch." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={3} title="Write Summary in Your Own Words" status={data.astep(2)}
                        desc="Detected when a DevOps note today contains 'Summary:'. If you cannot explain it simply, rewatch that section." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={4} title="Practice in Lab" status={data.astep(3)}
                        desc="Detected when a DevOps task containing 'Practice' is completed, or when 2+ DevOps tasks are finished today." />
                </ChainCard>

                {/* Revenue Engine */}
                <ChainCard emoji="🟡" label="Revenue Engine" tagline="Client Work & Opportunities"
                    accentText="#ca8a04" accentBg="rgba(234,179,8,0.08)" accentBorder="rgba(234,179,8,0.2)"
                    cardBorder="hover:border-yellow-500/30" pct={data.revPct}
                    completedMsg={data.revActivated ? `Revenue Engine Activated Today${data.proposalsDone > 0 ? ' · Proposal Sent 🔥' : ''}` : null}>
                    <StepBlock num={1} title="Collect Leads" status={data.revStep(['Lead'])}
                        metric={`${data.leadsAdded} leads`}
                        desc="Detected from tasks with category 'Lead'. Find people who need automation, AI integration, or web work." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={2} title="Send Personalized Proposal" status={data.revStep(['Freelancing'], 'proposal') !== 'idle' ? data.revStep(['Freelancing'], 'proposal') : data.revStep(['Freelancing'], 'send')}
                        metric={`${data.proposalsDone} sent`}
                        desc="Detected from Freelancing tasks with 'Proposal' or 'Send' in the title that are marked complete." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={3} title="Follow Up" status={data.revStep(['Freelancing'], 'follow')}
                        metric={`${data.followUpsDone} follow-ups`}
                        desc="Detected from Freelancing tasks with 'Follow' in the title. A polite nudge if there's no reply." />
                    <div className="flex justify-center text-[hsl(var(--text-muted))] opacity-40 select-none">↓</div>
                    <StepBlock num={4} title="Close Deal or Archive Lead" status={data.revStep(['Freelancing'], 'close') !== 'idle' ? data.revStep(['Freelancing'], 'close') : data.revStep(['Lead'])}
                        desc="If interested, clarify scope and timeline. If no response, tag the lead as archived and move on." />
                </ChainCard>

                {/* Weekly Mini View */}
                <section className="card border border-[hsl(var(--border-color))] p-7 space-y-6">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--primary))] mb-1">Last 7 Days</div>
                        <h2 className="text-lg font-black text-[hsl(var(--text-primary))]">Weekly Chain Activity</h2>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {data.weekData.map(d => (
                            <div key={d.day} className="flex flex-col items-center gap-2">
                                <div className={`text-[10px] font-black uppercase tracking-widest ${d.isToday ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--text-muted))]'}`}>
                                    {d.label}
                                </div>
                                <div className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${d.isToday ? 'border-[hsl(var(--primary))]/40 bg-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border-color))] bg-[hsl(var(--bg-dark))]/50'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${d.authDone ? 'bg-purple-500 shadow shadow-purple-500/50' : 'bg-[hsl(var(--border-color))] opacity-30'}`} />
                                    <div className={`w-2.5 h-2.5 rounded-full ${d.assetDone ? 'bg-green-500 shadow shadow-green-500/50' : 'bg-[hsl(var(--border-color))] opacity-30'}`} />
                                    <div className={`w-2.5 h-2.5 rounded-full ${d.revDone ? 'bg-yellow-500 shadow shadow-yellow-500/50' : 'bg-[hsl(var(--border-color))] opacity-30'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-5 pt-3 border-t border-[hsl(var(--border-color))]">
                        {[{ color: 'bg-purple-500', label: 'Authority' }, { color: 'bg-green-500', label: 'Asset' }, { color: 'bg-yellow-500', label: 'Revenue' }].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-8" />
            </div>
        </div>
    );
}
