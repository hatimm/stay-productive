'use client';

import Link from 'next/link';

const chains = [
    {
        id: 'authority',
        color: 'purple',
        emoji: '🟣',
        label: 'Authority Engine',
        tagline: 'Public Work',
        accent: 'hsl(265 90% 65%)',
        accentBg: 'rgba(147,51,234,0.08)',
        accentBorder: 'rgba(147,51,234,0.2)',
        accentText: '#9333ea',
        dotColor: 'bg-purple-500',
        badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        cardBorder: 'hover:border-purple-500/30',
        steps: [
            {
                title: 'Scan AI News or Build Something',
                desc: 'I check AI news, new tools, or I work on my own project. The goal is to find something useful, interesting, or practical.'
            },
            {
                title: 'Test or Extract Insight',
                desc: 'If it\'s a tool, I test it for 10–20 minutes. If it\'s my project, I identify what I learned or improved. I focus on real experience, not theory.'
            },
            {
                title: 'Write Clear Notes',
                desc: 'I write simple notes: what it does, what I liked, what I didn\'t like, who it is for.'
            },
            {
                title: 'Create a Post',
                desc: 'I turn my notes into a short X post, a thread, or a small review. The goal is clarity and usefulness.'
            },
            {
                title: 'Publish and Engage',
                desc: 'I publish the post. Then I reply to 2–3 people in my niche to stay visible.'
            }
        ],
        output: 'If I repeat this process every week: people start recognizing my name. I become known for testing tools and building things. I build credibility. Opportunities come more easily.\n\nThis engine builds online authority step by step.'
    },
    {
        id: 'asset',
        color: 'green',
        emoji: '🟢',
        label: 'Asset Engine',
        tagline: 'Private Skill Building',
        accent: 'hsl(142 70% 45%)',
        accentBg: 'rgba(34,197,94,0.08)',
        accentBorder: 'rgba(34,197,94,0.2)',
        accentText: '#16a34a',
        dotColor: 'bg-green-500',
        badgeClass: 'bg-green-500/10 text-green-600 border-green-500/20',
        cardBorder: 'hover:border-green-500/30',
        steps: [
            {
                title: 'Watch Video',
                desc: 'I watch 25–40 minutes of a DevOps lesson with full focus.'
            },
            {
                title: 'Take Structured Notes',
                desc: 'I write commands, concepts, and mistakes. I add timestamps when needed.'
            },
            {
                title: 'Write a Summary in My Own Words',
                desc: 'I explain what I learned in simple language. If I cannot explain it clearly, I rewatch that part.'
            },
            {
                title: 'Practice in Lab',
                desc: 'I replicate everything: run commands, break things, fix errors, deploy small test setups.'
            },
            {
                title: 'Apply in My Project',
                desc: 'If possible, I use what I learned inside my own project. For example: add Docker, improve CI/CD, improve structure.'
            }
        ],
        output: 'If I repeat this weekly: my technical level increases. I become independent. I build real infrastructure skills. I am ready for remote jobs later.\n\nThis engine builds deep competence.\n\nNo posting. No public sharing. Only real skill growth.'
    },
    {
        id: 'revenue',
        color: 'yellow',
        emoji: '🟡',
        label: 'Revenue Engine',
        tagline: 'Client Work & Opportunities',
        accent: 'hsl(45 98% 50%)',
        accentBg: 'rgba(234,179,8,0.08)',
        accentBorder: 'rgba(234,179,8,0.2)',
        accentText: '#ca8a04',
        dotColor: 'bg-yellow-500',
        badgeClass: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        cardBorder: 'hover:border-yellow-500/30',
        steps: [
            {
                title: 'Collect Leads',
                desc: 'I find people who need automation, AI integration, or website work. I use platforms or manual research.'
            },
            {
                title: 'Send Personalized Proposal',
                desc: 'I write clear proposals that explain the problem, show how I solve it, and focus on results.'
            },
            {
                title: 'Follow Up',
                desc: 'If there is no answer, I send a short and polite follow-up.'
            },
            {
                title: 'Close Deal',
                desc: 'If the client is interested, I clarify scope and timeline.'
            },
            {
                title: 'Deliver & Maintain Relationship',
                desc: 'I deliver high-quality work. I communicate clearly. I ask for a testimonial if satisfied.'
            }
        ],
        output: 'If I repeat this: I generate freelance income. I gain real-world experience. I build proof of work. I increase confidence.\n\nThis engine builds cash flow.'
    }
];

const weeklyAlignment = [
    { day: 'Monday', chains: ['Authority', 'Asset'], colors: ['bg-purple-500', 'bg-green-500'] },
    { day: 'Tuesday', chains: ['Asset'], colors: ['bg-green-500'] },
    { day: 'Wednesday', chains: ['Revenue'], colors: ['bg-yellow-500'] },
    { day: 'Thursday', chains: ['Asset'], colors: ['bg-green-500'] },
    { day: 'Friday', chains: ['Authority'], colors: ['bg-purple-500'] },
    { day: 'Saturday', chains: ['Revenue'], colors: ['bg-yellow-500'] },
    { day: 'Sunday', chains: ['Planning'], colors: ['bg-blue-400'] },
];

export default function TaskChainsPage() {
    return (
        <div className="min-h-screen">
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-green-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative p-6 md:p-10 max-w-4xl mx-auto space-y-14 animate-in fade-in duration-700">

                {/* ── PAGE HEADER ── */}
                <header className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[hsl(var(--primary))]">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        Operating System
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        The 3 Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-green-500 to-yellow-500">Chains</span>
                    </h1>
                    <p className="text-lg font-semibold text-[hsl(var(--text-secondary))] max-w-xl">
                        How my weekly work turns into skills, authority, and income.
                    </p>
                    <p className="text-sm text-[hsl(var(--text-secondary))] max-w-2xl leading-relaxed border-l-2 border-[hsl(var(--border-color))] pl-4">
                        This page shows the three systems that run my week.
                        Each task in the calendar belongs to one of these systems.
                        If I follow these chains correctly, I grow every week.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/task-chains/tracking"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-green-600 to-yellow-500 hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
                        >
                            ⚡ Track Today
                            <span className="opacity-70">→</span>
                        </Link>
                    </div>
                </header>

                {/* ── 3 CHAIN CARDS ── */}
                {chains.map((chain, chainIdx) => (
                    <section
                        key={chain.id}
                        className={`card border border-[hsl(var(--border-color))] ${chain.cardBorder} p-8 md:p-10 space-y-8 transition-all duration-300`}
                        style={{ animationDelay: `${chainIdx * 120}ms` }}
                    >
                        {/* Chain Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{chain.emoji}</span>
                                    <span
                                        className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border"
                                        style={{ color: chain.accentText, background: chain.accentBg, borderColor: chain.accentBorder }}
                                    >
                                        {chain.tagline}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-[hsl(var(--text-primary))]">{chain.label}</h2>
                            </div>
                            <div className="text-4xl font-black font-mono text-[hsl(var(--text-primary))] opacity-10 tabular-nums">
                                {String(chainIdx + 1).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-0">
                            {chain.steps.map((step, i) => (
                                <div key={i}>
                                    {/* Step Block */}
                                    <div
                                        className="rounded-2xl p-5 border transition-all"
                                        style={{ background: chain.accentBg, borderColor: chain.accentBorder }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 text-white mt-0.5"
                                                style={{ background: chain.accentText }}
                                            >
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-[hsl(var(--text-primary))] mb-1">{step.title}</div>
                                                <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow between steps */}
                                    {i < chain.steps.length - 1 && (
                                        <div className="flex justify-center py-2 text-[hsl(var(--text-muted))] opacity-50 text-lg select-none">
                                            ↓
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Output */}
                        <div className="border-t border-[hsl(var(--border-color))] pt-6 space-y-2">
                            <div
                                className="text-[10px] font-black uppercase tracking-[0.3em]"
                                style={{ color: chain.accentText }}
                            >
                                Output
                            </div>
                            <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed whitespace-pre-line">
                                {chain.output}
                            </p>
                        </div>
                    </section>
                ))}

                {/* ── STRATEGIC CONNECTION ── */}
                <section className="card border border-[hsl(var(--border-color))] p-8 md:p-10 space-y-6">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--primary))]">Strategic View</div>
                        <h2 className="text-2xl font-black text-[hsl(var(--text-primary))]">How the 3 Chains Support Each Other</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-2">
                            <div className="text-lg">🟣 → 🟡</div>
                            <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                                When I build <strong className="text-[hsl(var(--text-primary))]">authority</strong>, clients trust me more.
                                <br />This feeds the <strong className="text-[hsl(var(--text-primary))]">Revenue Engine</strong>.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/15 space-y-2">
                            <div className="text-lg">🟢 → 🟣</div>
                            <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                                When I build <strong className="text-[hsl(var(--text-primary))]">projects</strong>, I get content for posting.
                                <br />This feeds the <strong className="text-[hsl(var(--text-primary))]">Authority Engine</strong>.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/15 space-y-2">
                            <div className="text-lg">🟡 → 🟢</div>
                            <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                                When I earn <strong className="text-[hsl(var(--text-primary))]">money</strong>, I can invest in better tools and learning.
                                <br />This feeds the <strong className="text-[hsl(var(--text-primary))]">Asset Engine</strong>.
                            </p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))]">
                        <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                            All three systems work together. <strong className="text-[hsl(var(--text-primary))]">If one stops, growth slows down.</strong>
                        </p>
                    </div>
                </section>

                {/* ── WEEKLY ALIGNMENT ── */}
                <section className="card border border-[hsl(var(--border-color))] p-8 md:p-10 space-y-6">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--primary))]">Weekly Schedule</div>
                        <h2 className="text-2xl font-black text-[hsl(var(--text-primary))]">Weekly Alignment</h2>
                    </div>

                    <div className="divide-y divide-[hsl(var(--border-color))]">
                        {weeklyAlignment.map((row) => (
                            <div key={row.day} className="flex items-center justify-between py-4">
                                <span className="text-sm font-bold text-[hsl(var(--text-primary))] w-28">{row.day}</span>
                                <div className="flex-1 mx-6 border-b border-dashed border-[hsl(var(--border-color))]/40" />
                                <div className="flex items-center gap-2">
                                    {row.chains.map((chain, i) => (
                                        <div key={chain} className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${row.colors[i]} shrink-0`} />
                                            <span className="text-xs font-semibold text-[hsl(var(--text-secondary))]">{chain}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-[hsl(var(--border-color))]">
                        {[
                            { color: 'bg-purple-500', label: 'Authority Engine' },
                            { color: 'bg-green-500', label: 'Asset Engine' },
                            { color: 'bg-yellow-500', label: 'Revenue Engine' },
                            { color: 'bg-blue-400', label: 'Planning' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom spacer */}
                <div className="h-8" />
            </div>
        </div>
    );
}
