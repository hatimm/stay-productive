'use client';

import { useState } from 'react';
import { IntelligenceSource, DiscoveryLog, DiscoveryCategory, DiscoveryAction, AITool, Task } from '@/lib/models';
import * as db from '@/lib/db';
import { useProductivity } from '@/hooks/useVibeCode';

export default function AIIntelligencePage() {
    const { intelligenceSources: sources, discoveryLogs: logs, loadAll } = useProductivity();

    // Common State
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tool Form State
    const [toolName, setToolName] = useState('');
    const [toolLink, setToolLink] = useState('');
    const [toolNotes, setToolNotes] = useState('');

    // News Form State
    const [newsText, setNewsText] = useState('');

    const handleAddSource = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newSource: IntelligenceSource = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            url: formData.get('url') as string,
            description: formData.get('description') as string,
            checkedThisWeek: false,
            lastResetDate: new Date().toISOString()
        };

        await db.addIntelligenceSource(newSource);
        setShowSourceModal(false);
        loadAll();
    };

    const handleToggleSource = async (source: IntelligenceSource) => {
        await db.updateIntelligenceSource({ ...source, checkedThisWeek: !source.checkedThisWeek });
        loadAll();
    };

    const handleAddTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!toolName) return;
        setIsSubmitting(true);

        const newLog: DiscoveryLog = {
            id: crypto.randomUUID(),
            title: toolName,
            link: toolLink,
            summary: toolNotes,
            category: 'Tool',
            actionRequired: 'Test Tool',
            createdAt: new Date().toISOString()
        };

        await db.addDiscoveryLog(newLog);

        await db.addAITool({
            id: crypto.randomUUID(),
            name: toolName,
            official_url: toolLink,
            category: 'Other',
            pricing: 'Freemium',
            rating: 0,
            status: 'Discovered',
            tested: false,
            review_written: false,
            blog_published: false,
            social_post_published: false,
            notes: toolNotes,
            createdAt: new Date().toISOString()
        } as AITool);

        setToolName('');
        setToolLink('');
        setToolNotes('');
        setIsSubmitting(false);
        loadAll();
    };

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsText) return;
        setIsSubmitting(true);

        const newLog: DiscoveryLog = {
            id: crypto.randomUUID(),
            title: `News: ${newsText.substring(0, 50)}${newsText.length > 50 ? '...' : ''}`,
            link: '',
            summary: newsText,
            category: 'News',
            actionRequired: 'Monitor',
            createdAt: new Date().toISOString()
        };

        await db.addDiscoveryLog(newLog);

        const today = new Date().toISOString().split('T')[0];
        await db.addTask({
            id: crypto.randomUUID(),
            title: `Check News: ${newsText.substring(0, 30)}...`,
            category: 'AINews',
            priority: 'medium',
            completed: false,
            isSubTask: false,
            date: today,
            createdAt: new Date().toISOString()
        } as Task);

        setNewsText('');
        setIsSubmitting(false);
        loadAll();
    };

    return (
        <div className="min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[hsl(var(--primary))] blur-[150px] rounded-full animate-pulse opacity-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[hsl(var(--accent))] blur-[130px] rounded-full animate-pulse opacity-10" />
            </div>

            <div className="relative p-6 md:p-10 max-w-7xl mx-auto space-y-12">
                <header className="pb-8 border-b border-[hsl(var(--border-color))] space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-[hsl(var(--text-primary))]">
                        AI <span className="text-gradient">Tracker</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-medium text-lg">
                        Capture new tools and save news before they disappear.
                    </p>
                </header>

                {/* TOP: Resources Ticker */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[hsl(var(--text-primary))] flex items-center gap-2">
                            <span className="text-xl">📡</span> Resources to Check
                        </h2>
                        <button
                            onClick={() => setShowSourceModal(true)}
                            className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-center hover:bg-[hsl(var(--primary))]/20 hover:scale-105 active:scale-95 transition-all text-[hsl(var(--primary))]"
                            title="Add New Resource"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                        {sources.map(source => (
                            <div
                                key={source.id}
                                className={`snap-start shrink-0 w-[280px] group card p-4 border transition-all cursor-pointer flex items-center justify-between ${source.checkedThisWeek
                                    ? 'border-green-500/20 bg-green-500/5 opacity-50'
                                    : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--primary))]/30 bg-[hsl(var(--card-bg))]'
                                    }`}
                                onClick={() => handleToggleSource(source)}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-2.5 h-2.5 shrink-0 rounded-full border-2 ${source.checkedThisWeek ? 'bg-green-500 border-green-500' : 'bg-transparent border-[hsl(var(--border-color))]'
                                        }`} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-sm text-[hsl(var(--text-primary))] truncate">{source.name}</span>
                                        <span className="text-[9px] opacity-60 text-[hsl(var(--text-secondary))] truncate">{source.description || 'Resource'}</span>
                                    </div>
                                </div>
                                <a href={source.url} target="_blank" onClick={e => e.stopPropagation()} className="p-1.5 opacity-20 hover:opacity-100 hover:text-[hsl(var(--primary))] text-[hsl(var(--text-primary))] transition-opacity">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MAIN GRID: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* LEFT COLUMN: Tool Capture */}
                    <div className="space-y-8">
                        <div className="card p-8 border-2 border-[hsl(var(--primary))]/5 shadow-lg relative overflow-hidden group bg-[hsl(var(--card-bg))] h-full">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-focus-within:opacity-[0.08] transition-opacity">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20M5.3 5.3l13.4 13.4M5.3 18.7L18.7 5.3" /></svg>
                            </div>

                            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-[hsl(var(--text-primary))]">
                                <span className="text-2xl">⚡</span> Quick Tool Capture
                            </h2>

                            <form onSubmit={handleAddTool} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-1 text-[hsl(var(--text-secondary))]">Tool Name</label>
                                    <input
                                        value={toolName}
                                        onChange={e => setToolName(e.target.value)}
                                        placeholder="e.g. Cursor, v0.dev..."
                                        className="input-field text-[hsl(var(--text-primary))]"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-1 text-[hsl(var(--text-secondary))]">Official URL</label>
                                    <input
                                        value={toolLink}
                                        onChange={e => setToolLink(e.target.value)}
                                        placeholder="https://..."
                                        className="input-field text-[hsl(var(--text-primary))]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-1 text-[hsl(var(--text-secondary))]">Functionality / Notes</label>
                                    <textarea
                                        value={toolNotes}
                                        onChange={e => setToolNotes(e.target.value)}
                                        placeholder="Quick notes on what it does..."
                                        className="input-field min-h-[120px] text-sm py-4 text-[hsl(var(--text-primary))]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-5 font-black text-xs tracking-[0.3em] uppercase transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'ADD TOOL TO LOG'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: News & History */}
                    <div className="space-y-8">
                        {/* News Form */}
                        <div className="card p-6 border border-[hsl(var(--border-color))] bg-[hsl(var(--card-bg))] shadow-sm">
                            <h2 className="text-lg font-black mb-4 flex items-center gap-3 text-[hsl(var(--text-primary))]">
                                <span className="text-xl">📰</span> Note News Item
                            </h2>
                            <form onSubmit={handleAddNews} className="space-y-4">
                                <textarea
                                    value={newsText}
                                    onChange={e => setNewsText(e.target.value)}
                                    placeholder="Paste important AI news or findings here..."
                                    className="input-field min-h-[100px] text-sm py-3 text-[hsl(var(--text-primary))] resize-none"
                                    required
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 btn-primary font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all text-white rounded-lg"
                                    >
                                        Save News
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Recent History Feed */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 px-2 text-[hsl(var(--text-secondary))]">Recent Entries</h3>
                            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                {logs.map(log => {
                                    const isTool = log.category === 'Tool';
                                    return (
                                        <div key={log.id} className={`card p-4 border transition-all ${isTool ? 'border-[hsl(var(--primary))]/10 bg-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border-color))]'}`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 ${isTool ? 'bg-[hsl(var(--primary))]/10' : 'bg-[hsl(var(--bg-dark))]'}`}>
                                                    {isTool ? '🧰' : '📰'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${isTool ? 'bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]' : 'bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))]'}`}>
                                                            {log.category}
                                                        </span>
                                                        <span className="text-[8px] font-bold opacity-40 text-[hsl(var(--text-muted))]">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <h4 className="font-bold text-sm text-[hsl(var(--text-primary))] truncate">
                                                        {log.link ? <a href={log.link} target="_blank" className="hover:underline flex items-center gap-2">
                                                            {log.title}
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-30"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                                        </a> : log.title}
                                                    </h4>
                                                    <p className="text-[11px] opacity-70 text-[hsl(var(--text-secondary))] truncate mt-0.5 max-w-[95%]">{log.summary}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Source Modal */}
            {showSourceModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <div className="card p-10 w-full max-w-md border border-[hsl(var(--border-color))] shadow-2xl bg-[hsl(var(--card-bg))]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black italic text-[hsl(var(--text-primary))]">Add New Resource</h3>
                            <button onClick={() => setShowSourceModal(false)} className="w-10 h-10 rounded-xl bg-[hsl(var(--bg-dark))] flex items-center justify-center hover:bg-[hsl(var(--border-color))] transition-colors text-[hsl(var(--text-primary))]">✕</button>
                        </div>
                        <form onSubmit={handleAddSource} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 text-[hsl(var(--text-secondary))]">Resource Name</label>
                                <input name="name" placeholder="Name (e.g. TLDR AI, X @username)" className="input-field text-[hsl(var(--text-primary))]" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 text-[hsl(var(--text-secondary))]">URL / Link</label>
                                <input name="url" placeholder="https://..." className="input-field text-[hsl(var(--text-primary))]" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 text-[hsl(var(--text-secondary))]">Type</label>
                                <select name="description" className="input-field text-[hsl(var(--text-primary))] bg-[hsl(var(--card-bg))] cursor-pointer">
                                    <option value="Website">Website / Newsletter</option>
                                    <option value="X Account">X (Twitter) Account</option>
                                    <option value="YouTube Channel">YouTube Channel</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary py-5 rounded-2xl font-black text-xs uppercase tracking-widest mt-4">Save Resource</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
