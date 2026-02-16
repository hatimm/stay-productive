'use client';

import { useState } from 'react';
import { useProductivity } from '@/hooks/useVibeCode';
import { DocumentType, DocumentLanguage } from '@/lib/models';
import * as db from '@/lib/db';

const DOCUMENT_SLOTS: { type: DocumentType; languages: DocumentLanguage[] }[] = [
    {
        type: 'CV',
        languages: ['English', 'French (FR)', 'French (CA)']
    },
    {
        type: 'CoverLetter',
        languages: ['English', 'French']
    },
    {
        type: 'Diploma',
        languages: ['General']
    },
    {
        type: 'Certificate',
        languages: ['General']
    }
];

const SLOT_ICONS: Record<DocumentType, string> = {
    CV: '📄',
    CoverLetter: '✉️',
    Diploma: '🎓',
    Certificate: '📜'
};

const SLOT_TITLES: Record<DocumentType, string> = {
    CV: 'Curriculum Vitae',
    CoverLetter: 'Cover Letters',
    Diploma: 'Diplomas & Degrees',
    Certificate: 'Certifications'
};

const LANG_ICONS: Record<string, string> = {
    'English': '🇬🇧',
    'French (FR)': '🇫🇷',
    'French (CA)': '🇨🇦',
    'French': '🇫🇷',
    'General': '🌐',
    'N/A': '📂'
};

export default function DocumentsPage() {
    const { documents, isLoaded, loadAll } = useProductivity();
    const [uploading, setUploading] = useState<{ type: DocumentType; lang: DocumentLanguage } | null>(null);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gradient font-bold flex flex-col items-center gap-4">
                    <div>Loading Valut...</div>
                    <div className="text-sm text-[hsl(var(--text-muted))] font-normal">Decrypting assets from Supabase</div>
                </div>
            </div>
        );
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType, language: DocumentLanguage) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading({ type, lang: language });

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target?.result as string;

            // Delete existing doc for this slot if it exists
            const existing = documents.find(d => d.type === type && d.language === language);
            if (existing) {
                await db.deleteDocument(existing.id);
            }

            await db.addDocument({
                id: crypto.randomUUID(),
                name: file.name,
                type,
                language,
                fileContent: content,
                fileName: file.name,
                fileSize: file.size,
                updatedAt: new Date().toISOString()
            });

            loadAll();
            setUploading(null);
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to remove this document from the vault?')) {
            await db.deleteDocument(id);
            loadAll();
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Executive Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        Assets & Credentials
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">Vault</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-medium">
                        Securely manage your professional artifacts across markets.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {DOCUMENT_SLOTS.map(slot => (
                    <section key={slot.type} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-2xl">
                                {SLOT_ICONS[slot.type]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{SLOT_TITLES[slot.type]}</h2>
                                <p className="text-xs font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest mt-1">Strategic Deployment Files</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {slot.languages.map(lang => {
                                const doc = documents.find(d => d.type === slot.type && d.language === lang);
                                const isThisUploading = uploading?.type === slot.type && uploading?.lang === lang;

                                return (
                                    <div
                                        key={`${slot.type}-${lang}`}
                                        className={`group relative p-6 bg-[hsl(var(--card-bg))] border rounded-[24px] transition-all duration-300 ${doc ? 'border-[hsl(var(--primary))]/20 shadow-lg shadow-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border-color))] border-dashed hover:border-[hsl(var(--primary))]/40'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${doc ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-muted))]'}`}>
                                                    {isThisUploading ? '⏳' : (LANG_ICONS[lang] || '📂')}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1">{lang} {slot.type}</div>
                                                    {doc ? (
                                                        <div className="text-sm font-black text-[hsl(var(--text-primary))] truncate max-w-[200px]">
                                                            {doc.fileName}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm font-bold text-[hsl(var(--text-muted))]">{isThisUploading ? 'Encrypting...' : 'Missing Asset'}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {doc ? (
                                                    <>
                                                        <a
                                                            href={doc.fileContent}
                                                            download={doc.fileName}
                                                            className="p-2.5 rounded-xl bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] hover:border-[hsl(var(--primary))]/50 hover:text-[hsl(var(--primary))] transition-all text-sm"
                                                            title="Download"
                                                        >
                                                            📥
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="p-2.5 rounded-xl bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] hover:border-red-500/50 hover:text-red-500 transition-all text-sm"
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </>
                                                ) : (
                                                    <label className={`cursor-pointer p-2.5 px-4 rounded-xl bg-[hsl(var(--primary))] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[hsl(var(--primary))]/20 ${isThisUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                        {isThisUploading ? '...' : 'Upload'}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            disabled={!!uploading}
                                                            onChange={(e) => handleFileUpload(e, slot.type, lang)}
                                                            accept=".pdf,.doc,.docx"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {doc && (
                                            <div className="mt-4 pt-4 border-t border-[hsl(var(--border-color))] flex justify-between items-center text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-tighter">
                                                <span>Size: {(doc.fileSize ? doc.fileSize / 1024 : 0).toFixed(1)} KB</span>
                                                <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Empty State / Motivation */}
            <div className="mt-16 p-10 text-center bg-[hsl(var(--bg-darker))] rounded-[40px] border-2 border-[hsl(var(--border-color))] border-dashed">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-2">Safe Intelligence Deployment</h3>
                <p className="max-w-xl mx-auto text-sm text-[hsl(var(--text-secondary))] leading-relaxed font-medium">
                    Keeping your dossiers up-to-date across all regional variations ensures you can strike fast when high-value opportunities arise.
                </p>
            </div>
        </div>
    );
}
