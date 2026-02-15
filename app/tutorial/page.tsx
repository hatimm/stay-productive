'use client';

import { useState } from 'react';

type GuideSection = {
    id: string;
    title: string;
    icon: string;
    description: string;
    steps: {
        label: string;
        details: string;
        action?: { label: string; href: string };
    }[];
};

const GUIDES: GuideSection[] = [
    {
        id: 'morning-protocol',
        title: 'The Morning Protocol',
        icon: '🌅',
        description: 'Start your day with high-leverage actions. Do this before opening Slack or Email.',
        steps: [
            {
                label: '1. Check AI News',
                details: 'Go to AI News & Tools. Check Trusted Sites to ensure you aren\'t missing critical shifts.',
                action: { label: 'Go to AI News', href: '/ai-intelligence' }
            },
            {
                label: '2. Check Commit Streak',
                details: 'Go to Command Center. Verify your streak. If it\'s at risk, plan a small commit immediately.',
                action: { label: 'Check Projects', href: '/projects' }
            },
            {
                label: '3. Unlock the Zone',
                details: 'Go to Dashboard. Complete your Routine & Focus tasks to unlock the Expansion Zone.',
                action: { label: 'Go to Dashboard', href: '/' }
            }
        ]
    },
    {
        id: 'deep-work',
        title: 'Deep Work Session',
        icon: '⚡',
        description: 'How to enter flow state and ship complex features.',
        steps: [
            {
                label: '1. Select a Project',
                details: 'In Command Center, pick a project marked "In Progress". Log your start time mentally.'
            },
            {
                label: '2. Capture Context',
                details: 'Open the Notes panel. Create a "DevOps" or "General" note to dump your current context/constraints before coding.',
                action: { label: 'Open Notes', href: '/notes' }
            },
            {
                label: '3. Ship & Log',
                details: 'After your session, push code. Then immediately go to Command Center and click "Log Commit" to lock in your streak.'
            }
        ]
    },
    {
        id: 'tool-hunting',
        title: 'Finding New Tools',
        icon: '🏹',
        description: 'Turn aimless scrolling into a strategic asset.',
        steps: [
            {
                label: '1. Add New Finding',
                details: 'Found a cool AI tool on X? Don\'t just bookmark it. Go to AI News & Tools and use the "Add New Finding" form.'
            },
            {
                label: '2. Try & Organize',
                details: 'Select "Next Step: Try it out myself". This adds it to your AI Tools directory.'
            },
            {
                label: '3. Testing & Reviews',
                details: 'Later, go to AI Tools. Filter by "New" or "Testing". Test the tool, then mark it as "Tested" to trigger a review task.'
            }
        ]
    },
    {
        id: 'weekly-review',
        title: 'The Sunday Review',
        icon: '📅',
        description: 'Reset your system for the week ahead.',
        steps: [
            {
                label: '1. Weekly Summary',
                details: 'Go to AI News & Tools. Fill out the "Weekly Summary" notepad based on what you learned this week.'
            },
            {
                label: '2. Reset Trusted Sites',
                details: 'The Trusted Sites checklist auto-resets on Monday. Review any missed sites now.'
            },
            {
                label: '3. Sync Template',
                details: 'On the Dashboard, click "Sync Template" to ensure your routine is fresh for Monday morning.'
            }
        ]
    }
];

export default function TutorialPage() {
    const [activeSection, setActiveSection] = useState<string | null>('morning-protocol');

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                    Operator's Manual <span className="text-[hsl(var(--primary))]">v1</span>
                </h1>
                <p className="text-[hsl(var(--text-secondary))] font-medium mt-2 text-lg">
                    Workflows for high-performance execution.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 pl-2">
                        Protocols
                    </div>
                    {GUIDES.map(guide => (
                        <button
                            key={guide.id}
                            onClick={() => setActiveSection(guide.id)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${activeSection === guide.id
                                ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary))]/10'
                                : 'bg-[hsl(var(--card-bg))] border-[hsl(var(--border-color))] hover:border-[hsl(var(--border-hover))]'
                                }`}
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">{guide.icon}</span>
                            <div>
                                <div className={`font-bold ${activeSection === guide.id ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--text-primary))]'}`}>
                                    {guide.title}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-8">
                    {activeSection && (
                        <div className="bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {(() => {
                                const guide = GUIDES.find(g => g.id === activeSection)!;
                                return (
                                    <>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-4xl">{guide.icon}</span>
                                            <div>
                                                <h2 className="text-2xl font-black">{guide.title}</h2>
                                                <p className="text-[hsl(var(--text-secondary))]">{guide.description}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8 relative">
                                            {/* Vertical Line */}
                                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-[hsl(var(--border-color))]" />

                                            {guide.steps.map((step, idx) => (
                                                <div key={idx} className="relative pl-10">
                                                    {/* Dot */}
                                                    <div className="absolute left-0 top-1.5 w-7 h-7 bg-[hsl(var(--bg-dark))] border-2 border-[hsl(var(--primary))] rounded-full flex items-center justify-center z-10 text-[10px] font-bold text-[hsl(var(--primary))]">
                                                        {idx + 1}
                                                    </div>

                                                    <h3 className="text-lg font-bold mb-2">{step.label.replace(/^\d+\.\s/, '')}</h3>
                                                    <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-3">
                                                        {step.details}
                                                    </p>
                                                    {step.action && (
                                                        <a
                                                            href={step.action.href}
                                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] hover:underline"
                                                        >
                                                            {step.action.label} ↗
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-[hsl(var(--border-color))]">
                                            <div className="p-4 bg-[hsl(var(--bg-dark))] rounded-xl text-sm italic text-[hsl(var(--text-muted))] border border-[hsl(var(--border-color))]">
                                                💡 <strong>Pro Tip:</strong> Consistency beats intensity. Execute this protocol daily.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
