'use client';

import { useState } from 'react';
import { useProductivity } from '@/hooks/useVibeCode';
import { NoteType, NOTE_TYPE_ICONS } from '@/lib/models';
import * as db from '@/lib/db';

export default function NotesPage() {
    const { notes, isLoaded, loadAll } = useProductivity();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<NoteType | 'All'>('All');
    const [showAddForm, setShowAddForm] = useState(false);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gradient font-bold flex flex-col items-center gap-4">
                    <div>Loading Knowledge Base...</div>
                    <div className="text-sm text-[hsl(var(--text-muted))] font-normal">Syncing with Supabase</div>
                </div>
            </div>
        );
    }

    const noteTypes: { type: NoteType; label: string; icon: string; color: string }[] = [
        { type: 'AppIdea', label: 'App ideas', icon: '💡', color: 'text-yellow-400' },
        { type: 'SocialMedia', label: 'Social Content', icon: '📱', color: 'text-blue-400' },
        { type: 'DevOps', label: 'DevOps Learning', icon: '⚙️', color: 'text-indigo-400' },
        { type: 'Career', label: 'Career/Job', icon: '🌍', color: 'text-green-400' },
        { type: 'Improvement', label: 'App Improvement', icon: '🛠️', color: 'text-pink-400' },
        { type: 'AiAutomation', label: 'AI Automation', icon: '🤖', color: 'text-cyan-400' },
        { type: 'General', label: 'General', icon: '📓', color: 'text-gray-400' },
    ];

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.videoName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'All' || note.type === activeTab;
        return matchesSearch && matchesTab;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Executive Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        Knowledge Base
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        Reflections & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">Nexus</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-medium">
                        Systematizing {notes.length} items of captured intelligence.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn btn-primary px-6 h-12 rounded-xl text-sm shadow-xl shadow-[hsl(var(--primary))]/20"
                    >
                        + Capture Thought
                    </button>
                </div>
            </header>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Discovery Sidebar */}
                <aside className="lg:col-span-3 space-y-8">
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 px-2">Discovery</h3>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
                            <input
                                type="text"
                                placeholder="Query nexus..."
                                className="w-full pl-12 pr-4 h-12 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-2xl text-sm font-medium focus:border-[hsl(var(--primary))]/50 outline-none transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 px-2">Taxonomy</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveTab('All')}
                                className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-bold transition-all group ${activeTab === 'All' ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]' : 'hover:bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))]'}`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === 'All' ? '' : 'grayscale'}`}>📓</span>
                                    Intelligence
                                </span>
                                <span className="text-[10px] font-black opacity-40">{notes.length}</span>
                            </button>
                            {noteTypes.map(nt => (
                                <button
                                    key={nt.type}
                                    onClick={() => setActiveTab(nt.type)}
                                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-bold transition-all group ${activeTab === nt.type ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]' : 'hover:bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))]'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === nt.type ? '' : 'grayscale'}`}>{nt.icon}</span>
                                        {nt.label}
                                    </span>
                                    <span className="text-[10px] font-black opacity-40">
                                        {notes.filter(n => n.type === nt.type).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                </aside>

                {/* Feed */}
                <main className="lg:col-span-9 space-y-6">
                    {filteredNotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredNotes.map(note => {
                                const nt = noteTypes.find(t => t.type === note.type) || noteTypes[6];
                                return (
                                    <div key={note.id} className="group card p-6 flex flex-col hover:border-[hsl(var(--primary))]/30 hover:shadow-lg transition-all duration-300 relative">

                                        <button
                                            onClick={async () => {
                                                if (confirm('Delete this note permanently?')) {
                                                    await db.deleteNote(note.id);
                                                    loadAll();
                                                }
                                            }}
                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-[10px] uppercase font-bold text-red-500 bg-red-500/10 rounded-lg transition-all hover:bg-red-500/20"
                                        >
                                            Delete
                                        </button>

                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] flex items-center justify-center text-xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                                                    {nt.icon}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                                                        {nt.label}
                                                    </div>
                                                    <div className="text-[10px] font-black opacity-40 uppercase tracking-tighter">
                                                        {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            {note.timestamp && (
                                                <span className="text-[10px] font-black bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-2.5 py-1 rounded-full uppercase tracking-widest mr-8">
                                                    ⏱️ {note.timestamp}
                                                </span>
                                            )}
                                        </div>

                                        {note.videoName && (
                                            <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold text-[hsl(var(--text-secondary))] bg-[hsl(var(--bg-dark))] px-3 py-1.5 rounded-lg border border-[hsl(var(--border-color))]">
                                                <span className="grayscale group-hover:grayscale-0 transition-all">📺</span> {note.videoName}
                                            </div>
                                        )}

                                        <p className="text-[15px] font-medium text-[hsl(var(--text-primary))] whitespace-pre-wrap flex-1 leading-relaxed">
                                            {note.content}
                                        </p>

                                        {note.taskId && (
                                            <div className="mt-6 pt-5 border-t border-[hsl(var(--border-color))] flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">Linked Project:</span>
                                                    <span className="text-[10px] font-black text-[hsl(var(--text-primary))]">{note.taskId.split('-')[0].toUpperCase()}</span>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--border-color))] group-hover:bg-[hsl(var(--primary))] transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 px-10 border-2 border-dashed border-[hsl(var(--border-color))] rounded-[40px] bg-[hsl(var(--card-bg))]/50">
                            <div className="text-6xl mb-6 grayscale opacity-40">📓</div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">Nexus Empty</h3>
                            <p className="text-[hsl(var(--text-muted))] font-medium text-center">Capture ideas, logs, and insights to build your intelligence base.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Overlay */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[hsl(var(--bg-dark))]/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[hsl(var(--card-bg))] w-full max-w-4xl rounded-[32px] border border-[hsl(var(--border-color))] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="px-8 pt-8 pb-4">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-xl bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--border-color))] transition-colors text-2xl"
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <CategorizedNoteForm
                                onClose={() => {
                                    setShowAddForm(false);
                                    loadAll();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CategorizedNoteForm({ onClose }: { onClose: () => void }) {
    const [type, setType] = useState<NoteType>('General');
    const [content, setContent] = useState('');
    const [videoName, setVideoName] = useState('');
    const [timestamp, setTimestamp] = useState('');

    const noteTypes: { type: NoteType; label: string; icon: string }[] = [
        { type: 'AppIdea', label: 'App ideas', icon: '💡' },
        { type: 'SocialMedia', label: 'Social Content', icon: '📱' },
        { type: 'DevOps', label: 'DevOps Learning', icon: '⚙️' },
        { type: 'Career', label: 'Career/Job', icon: '🌍' },
        { type: 'Improvement', label: 'App Improvement', icon: '🛠️' },
        { type: 'AiAutomation', label: 'AI Automation', icon: '🤖' },
        { type: 'General', label: 'General', icon: '📓' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        await db.addNote({
            id: crypto.randomUUID(),
            content: content.trim(),
            type,
            videoName: type === 'DevOps' ? videoName : undefined,
            timestamp: type === 'DevOps' ? timestamp : undefined,
            createdAt: new Date().toISOString()
        });

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black tracking-tight">Capture Insight</h2>
                <p className="text-[hsl(var(--text-secondary))] mt-1">Select taxonomy and articulate your thought.</p>
            </div>

            <div className="space-y-6">
                <section>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">
                        Taxonomy
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {noteTypes.map(nt => (
                            <button
                                key={nt.type}
                                type="button"
                                onClick={() => setType(nt.type)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${type === nt.type
                                    ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] shadow-sm'
                                    : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] hover:border-[hsl(var(--border-hover))] text-[hsl(var(--text-secondary))]'
                                    }`}
                            >
                                <span className={`text-lg ${type === nt.type ? '' : 'grayscale'}`}>{nt.icon}</span>
                                {nt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {type === 'DevOps' && (
                    <section className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-500">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">
                                Video Source
                            </label>
                            <input
                                type="text"
                                className="input-field h-12 rounded-xl"
                                placeholder="e.g., K8s Internals"
                                value={videoName}
                                onChange={e => setVideoName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">
                                Marker
                            </label>
                            <input
                                type="text"
                                className="input-field h-12 rounded-xl"
                                placeholder="e.g., 24:05"
                                value={timestamp}
                                onChange={e => setTimestamp(e.target.value)}
                            />
                        </div>
                    </section>
                )}

                <section>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">
                        Articulation
                    </label>
                    <textarea
                        autoFocus
                        className="textarea-field min-h-[300px] text-lg leading-relaxed rounded-2xl"
                        placeholder={
                            type === 'AppIdea' ? 'What high-level concept are we exploring?' :
                                type === 'SocialMedia' ? 'Draft your high-engagement narrative...' :
                                    type === 'DevOps' ? 'Synthesize the core technical learning...' :
                                        'Refinement, log or creative drift...'
                        }
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </section>
            </div>

            <footer className="grid grid-cols-2 gap-4 pt-6 mt-4 border-t border-[hsl(var(--border-color))]">
                <button
                    type="button"
                    onClick={onClose}
                    className="h-14 bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--border-color))] rounded-2xl transition-all font-bold uppercase text-xs tracking-widest border border-[hsl(var(--border-color))]"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    className="h-14 bg-[hsl(var(--primary))] text-white rounded-2xl transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-[hsl(var(--primary))]/20 hover:scale-[1.02]"
                >
                    Commit Note
                </button>
            </footer>
        </form>
    );
}
