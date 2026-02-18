'use client';

import { useState } from 'react';
import { useProductivity } from '@/hooks/useVibeCode';
import { Account, AccountType, SocialPlatform, ProfessionalPlatform, JobBoardPlatform, JobBoardCategory, ProfessionalCategory } from '@/lib/models';
import * as db from '@/lib/db';

export default function AccountsPage() {
    const { accounts, isLoaded, loadAll } = useProductivity();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [selectedType, setSelectedType] = useState<AccountType>('Social');
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const [activeJobBoardTab, setActiveJobBoardTab] = useState<JobBoardCategory>('Remote');
    const [activeProfessionalTab, setActiveProfessionalTab] = useState<ProfessionalCategory>('Global');

    const togglePasswordVisibility = (id: string) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleUpdateCount = async (id: string, field: 'postCount' | 'proposalCount' | 'applicationCount', delta: number) => {
        const account = accounts.find(a => a.id === id);
        if (!account) return;

        const current = account[field] || 0;
        const newValue = Math.max(0, current + delta);

        await db.updateAccount({ id, [field]: newValue });
        loadAll();
    };

    // Helper wrappers
    const handleIncrementPost = (id: string) => handleUpdateCount(id, 'postCount', 1);
    const handleDecrementPost = (id: string) => handleUpdateCount(id, 'postCount', -1);
    const handleIncrementProposal = (id: string) => handleUpdateCount(id, 'proposalCount', 1);
    const handleDecrementProposal = (id: string) => handleUpdateCount(id, 'proposalCount', -1);
    const handleIncrementApplication = (id: string) => handleUpdateCount(id, 'applicationCount', 1);
    const handleDecrementApplication = (id: string) => handleUpdateCount(id, 'applicationCount', -1);

    const sections: { type: AccountType; label: string; icon: string; description: string }[] = [
        {
            type: 'Social',
            label: 'Social Media Accounts',
            icon: '📱',
            description: 'Tracking your presence and content volume across engagement platforms.'
        },
        {
            type: 'Professional',
            label: 'Professional Ecosystem',
            icon: '💼',
            description: 'Freelance platforms and professional identities focused on proposal pipeline.'
        },
        {
            type: 'JobBoard',
            label: 'Opportunities & Portals',
            icon: '🌍',
            description: 'Strategic market segments for career growth and discovery.'
        }
    ];

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gradient font-bold flex flex-col items-center gap-4">
                    <div>Loading Ecosystem...</div>
                    <div className="text-sm text-[hsl(var(--text-muted))] font-normal">Indexing nodes from Supabase</div>
                </div>
            </div>
        );
    }

    // ... (This part was mostly UI code, I'll copy the render logic)
    // To save tokens/time I will paste the entire component tree but with updated handlers.

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Executive Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        Infrastructure
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">Accounts</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-medium">
                        Systematizing your digital presence across {accounts.length} nodes.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group min-w-[300px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
                        <input
                            type="text"
                            placeholder="Locate account..."
                            className="w-full pl-12 pr-4 h-12 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-xl text-sm font-medium focus:border-[hsl(var(--primary))]/50 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setModalMode('add');
                            setSelectedType('Social');
                            setSelectedAccount(null);
                            setShowModal(true);
                        }}
                        className="btn btn-primary h-12 px-6 rounded-xl text-sm shadow-lg shadow-[hsl(var(--primary))]/20 whitespace-nowrap"
                    >
                        + Add Account
                    </button>
                </div>
            </header>

            {/* Sections */}
            <div className="space-y-16">
                {sections.map(section => {
                    const sectionAccounts = filteredAccounts.filter(a => a.type === section.type);

                    if (section.type === 'JobBoard' && sectionAccounts.length > 0) {
                        const categories: { id: JobBoardCategory, label: string }[] = [
                            { id: 'Remote', label: 'Remote Portals' },
                            { id: 'Global', label: 'Global Boards' },
                            { id: 'Morocco', label: 'Morocco Focus' },
                            { id: 'French', label: 'French Market' },
                            { id: 'MENA', label: 'Arabic/MENA' }
                        ];

                        const displayAccounts = sectionAccounts.filter(a => a.jobBoardCategory === activeJobBoardTab || (!a.jobBoardCategory && activeJobBoardTab === 'Remote'));

                        return (
                            <section key={section.type} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-xl">
                                                {section.icon}
                                            </span>
                                            {section.label}
                                        </h2>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mt-1 ml-13">
                                            {section.description}
                                        </p>
                                    </div>

                                    {/* Tab Switcher */}
                                    <div className="flex p-1.5 bg-[hsl(var(--bg-dark))] rounded-2xl border border-[hsl(var(--border-color))] shadow-inner">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveJobBoardTab(cat.id)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeJobBoardTab === cat.id
                                                    ? 'bg-[hsl(var(--card-bg))] text-[hsl(var(--primary))] shadow-sm border border-[hsl(var(--border-color))]'
                                                    : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))]'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {displayAccounts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                                        {displayAccounts.map(account => (
                                            <AccountCard
                                                key={account.id}
                                                account={account}
                                                visiblePasswords={visiblePasswords}
                                                onTogglePassword={togglePasswordVisibility}
                                                onEdit={(acc) => {
                                                    setSelectedAccount(acc);
                                                    setModalMode('edit');
                                                    setShowModal(true);
                                                }}
                                                onDelete={async (id) => {
                                                    await db.deleteAccount(id);
                                                    loadAll();
                                                }}
                                                onIncrementPost={handleIncrementPost}
                                                onDecrementPost={handleDecrementPost}
                                                onIncrementProposal={handleIncrementProposal}
                                                onDecrementProposal={handleDecrementProposal}
                                                onIncrementApplication={handleIncrementApplication}
                                                onDecrementApplication={handleDecrementApplication}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--border-color))] rounded-[40px] bg-[hsl(var(--bg-darker))]">
                                        <div className="text-6xl mb-6 grayscale opacity-20">🕳️</div>
                                        <p className="text-sm font-bold text-[hsl(var(--text-muted))] uppercase tracking-[0.3em]">No nodes in this segment</p>
                                        <button
                                            onClick={() => {
                                                setModalMode('add');
                                                setSelectedType('JobBoard');
                                                setSelectedAccount(null);
                                                setShowModal(true);
                                            }}
                                            className="mt-6 text-xs font-black text-[hsl(var(--primary))] uppercase tracking-widest hover:underline"
                                        >
                                            + Strategic Deployment
                                        </button>
                                    </div>
                                )}
                            </section>
                        );
                    }

                    if (section.type === 'Professional' && sectionAccounts.length > 0) {
                        const categories: { id: ProfessionalCategory, label: string }[] = [
                            { id: 'Global', label: 'Global Market' },
                            { id: 'French', label: 'French Market' },
                            { id: 'Arabic', label: 'Arabic Market' }
                        ];

                        const displayAccounts = sectionAccounts.filter(a => a.professionalCategory === activeProfessionalTab || (!a.professionalCategory && activeProfessionalTab === 'Global'));

                        return (
                            <section key={section.type} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))]/10 flex items-center justify-center text-xl">
                                                {section.icon}
                                            </span>
                                            {section.label}
                                        </h2>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mt-1 ml-13">
                                            {section.description}
                                        </p>
                                    </div>

                                    {/* Tab Switcher */}
                                    <div className="flex p-1.5 bg-[hsl(var(--bg-dark))] rounded-2xl border border-[hsl(var(--border-color))] shadow-inner">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveProfessionalTab(cat.id)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeProfessionalTab === cat.id
                                                    ? 'bg-[hsl(var(--card-bg))] text-[hsl(var(--secondary))] shadow-sm border border-[hsl(var(--border-color))]'
                                                    : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))]'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {displayAccounts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                                        {displayAccounts.map(account => (
                                            <AccountCard
                                                key={account.id}
                                                account={account}
                                                visiblePasswords={visiblePasswords}
                                                onTogglePassword={togglePasswordVisibility}
                                                onEdit={(acc) => {
                                                    setSelectedAccount(acc);
                                                    setModalMode('edit');
                                                    setShowModal(true);
                                                }}
                                                onDelete={async (id) => {
                                                    await db.deleteAccount(id);
                                                    loadAll();
                                                }}
                                                onIncrementPost={handleIncrementPost}
                                                onDecrementPost={handleDecrementPost}
                                                onIncrementProposal={handleIncrementProposal}
                                                onDecrementProposal={handleDecrementProposal}
                                                onIncrementApplication={handleIncrementApplication}
                                                onDecrementApplication={handleDecrementApplication}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--border-color))] rounded-[40px] bg-[hsl(var(--bg-darker))]">
                                        <div className="text-6xl mb-6 grayscale opacity-20">💼</div>
                                        <p className="text-sm font-bold text-[hsl(var(--text-muted))] uppercase tracking-[0.3em]">No nodes in this segment</p>
                                    </div>
                                )}
                            </section>
                        );
                    }

                    if (sectionAccounts.length > 0) {
                        return (
                            <section key={section.type}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-xl">
                                                {section.icon}
                                            </span>
                                            {section.label}
                                        </h2>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mt-1 ml-13">
                                            {section.description}
                                        </p>
                                    </div>
                                    <div className="text-xs font-black text-[hsl(var(--text-muted))] uppercase tracking-widest bg-[hsl(var(--bg-dark))] px-4 py-2 rounded-full border border-[hsl(var(--border-color))]">
                                        {sectionAccounts.length} Registered
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sectionAccounts.map(account => (
                                        <AccountCard
                                            key={account.id}
                                            account={account}
                                            visiblePasswords={visiblePasswords}
                                            onTogglePassword={togglePasswordVisibility}
                                            onEdit={(acc) => {
                                                setSelectedAccount(acc);
                                                setModalMode('edit');
                                                setShowModal(true);
                                            }}
                                            onDelete={async (id) => {
                                                await db.deleteAccount(id);
                                                loadAll();
                                            }}
                                            onIncrementPost={handleIncrementPost}
                                            onDecrementPost={handleDecrementPost}
                                            onIncrementProposal={handleIncrementProposal}
                                            onDecrementProposal={handleDecrementProposal}
                                            onIncrementApplication={handleIncrementApplication}
                                            onDecrementApplication={handleDecrementApplication}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    }

                    return (
                        <section key={section.type} className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--border-color))] rounded-[32px] bg-[hsl(var(--bg-darker))]">
                            <div className="text-4xl mb-4 grayscale opacity-30">{section.icon}</div>
                            <p className="text-sm font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest">No entries in this quadrant</p>
                            <button
                                onClick={() => {
                                    setModalMode('add');
                                    setSelectedType(section.type);
                                    setSelectedAccount(null);
                                    setShowModal(true);
                                }}
                                className="mt-4 text-xs font-black text-[hsl(var(--primary))] uppercase tracking-tighter hover:underline"
                            >
                                + Strategic Addition
                            </button>
                        </section>
                    );
                })}
            </div>

            {/* Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[hsl(var(--bg-dark))]/80 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="bg-[hsl(var(--card-bg))] w-full max-w-2xl rounded-[40px] border border-[hsl(var(--border-color))] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden">
                            <div className="p-10 max-h-[90vh] overflow-y-auto">
                                <header className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
                                            🎯 Strategic node
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tight">
                                            {modalMode === 'add' ? 'Add New Account' : 'Edit Account Details'}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--border-color))] transition-colors text-2xl font-bold"
                                    >
                                        ×
                                    </button>
                                </header>

                                <AccountForm
                                    type={selectedType}
                                    initialData={selectedAccount || undefined}
                                    mode={modalMode}
                                    onClose={() => {
                                        setShowModal(false);
                                        loadAll();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

function AccountCard({
    account,
    visiblePasswords,
    onTogglePassword,
    onEdit,
    onDelete,
    onIncrementPost,
    onDecrementPost,
    onIncrementProposal,
    onDecrementProposal,
    onIncrementApplication,
    onDecrementApplication
}: {
    account: Account;
    visiblePasswords: Record<string, boolean>;
    onTogglePassword: (id: string) => void;
    onEdit: (acc: Account) => void;
    onDelete: (id: string) => void;
    onIncrementPost: (id: string) => void;
    onDecrementPost: (id: string) => void;
    onIncrementProposal: (id: string) => void;
    onDecrementProposal: (id: string) => void;
    onIncrementApplication: (id: string) => void;
    onDecrementApplication: (id: string) => void;
}) {
    return (
        <div key={account.id} className="card p-6 group hover:border-[hsl(var(--primary))]/30 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-xl font-bold group-hover:text-[hsl(var(--primary))] transition-colors">
                        {account.name}
                    </h3>
                    {account.platform && (
                        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-[hsl(var(--primary))] mt-0.5">
                            {account.platform} {account.jobBoardCategory && `• ${account.jobBoardCategory}`} {account.professionalCategory && `• ${account.professionalCategory}`}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-[hsl(var(--bg-dark))] flex items-center justify-center text-xs grayscale hover:grayscale-0 hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] transition-all"
                        title="Visit Site"
                    >
                        🔗
                    </a>
                    <button
                        onClick={() => onEdit(account)}
                        className="w-8 h-8 rounded-lg bg-[hsl(var(--bg-dark))] flex items-center justify-center text-xs grayscale hover:grayscale-0 hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] transition-all"
                        title="Edit Account Details"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => onEdit(account)}
                        className="w-8 h-8 rounded-lg bg-[hsl(var(--bg-dark))] flex items-center justify-center text-xs grayscale hover:grayscale-0 hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] transition-all"
                        title="Manage Credentials"
                    >
                        🔑
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Delete this account?')) {
                                onDelete(account.id);
                            }
                        }}
                        className="w-8 h-8 rounded-lg bg-[hsl(var(--bg-dark))] flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold"
                        title="Delete Account"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs py-1 border-b border-[hsl(var(--border-color))]/30">
                    <span className="text-[hsl(var(--text-muted))] font-bold uppercase tracking-tighter">Identity</span>
                    <span className="font-bold text-[hsl(var(--text-primary))]">{account.username}</span>
                </div>
                {account.email && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-[hsl(var(--border-color))]/30">
                        <span className="text-[hsl(var(--text-muted))] font-bold uppercase tracking-tighter">Gateway</span>
                        <span className="font-medium text-[hsl(var(--text-secondary))] truncate ml-4 text-right overflow-hidden max-w-[150px]">{account.email}</span>
                    </div>
                )}
                {account.loginPassword && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-[hsl(var(--border-color))]/30">
                        <span className="text-[hsl(var(--text-muted))] font-bold uppercase tracking-tighter">Credential</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[hsl(var(--text-primary))] font-bold">
                                {visiblePasswords[account.id] ? account.loginPassword : '••••••••'}
                            </span>
                            <button
                                onClick={() => onTogglePassword(account.id)}
                                className="text-[10px] grayscale hover:grayscale-0"
                            >
                                {visiblePasswords[account.id] ? '🔒' : '👁️'}
                            </button>
                        </div>
                    </div>
                )}
                {account.credentialHint && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-[hsl(var(--border-color))]/30">
                        <span className="text-[hsl(var(--text-muted))] font-bold uppercase tracking-tighter">Hint</span>
                        <span className="font-medium text-[hsl(var(--text-secondary))] italic text-[10px]">{account.credentialHint}</span>
                    </div>
                )}
            </div>

            {account.notes && (
                <div className="p-2.5 bg-[hsl(var(--bg-dark))] rounded-xl text-[10px] text-[hsl(var(--text-secondary))] italic border border-[hsl(var(--border-color))] mb-4">
                    {account.notes}
                </div>
            )}

            {!account.loginPassword && (
                <button
                    onClick={() => onEdit(account)}
                    className="w-full py-2 mb-4 rounded-lg border border-dashed border-[hsl(var(--primary))]/30 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5 transition-all"
                >
                    + Add Login Credential
                </button>
            )}

            {account.type === 'Social' && (
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border-color))]/50 flex items-center justify-between">
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-1">Total Impact</div>
                        <div className="text-2xl font-black text-[hsl(var(--text-primary))]">
                            {account.postCount || 0} <span className="text-xs font-bold text-[hsl(var(--text-muted))] uppercase">Posts</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDecrementPost(account.id)}
                            className="w-10 h-10 rounded-xl bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))] flex items-center justify-center border border-[hsl(var(--border-color))] hover:border-red-500/50 hover:text-red-500 transition-all font-bold"
                            title="Correction: Remove Post"
                            disabled={(account.postCount || 0) <= 0}
                        >
                            -
                        </button>
                        <button
                            onClick={() => onIncrementPost(account.id)}
                            className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] text-white flex items-center justify-center shadow-lg shadow-[hsl(var(--primary))]/20 hover:scale-110 active:scale-95 transition-all group/btn font-bold text-xl"
                            title="Log New Post"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            {account.type === 'Professional' && (
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border-color))]/50 flex items-center justify-between">
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-1">Proposals Sent</div>
                        <div className="text-2xl font-black text-[hsl(var(--text-primary))]">
                            {account.proposalCount || 0} <span className="text-xs font-bold text-[hsl(var(--text-muted))] uppercase">Active</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDecrementProposal(account.id)}
                            className="w-10 h-10 rounded-xl bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))] flex items-center justify-center border border-[hsl(var(--border-color))] hover:border-red-500/50 hover:text-red-500 transition-all font-bold"
                            title="Correction: Remove Proposal"
                            disabled={(account.proposalCount || 0) <= 0}
                        >
                            -
                        </button>
                        <button
                            onClick={() => onIncrementProposal(account.id)}
                            className="w-12 h-12 rounded-xl bg-[hsl(var(--secondary))] text-white flex items-center justify-center shadow-lg shadow-[hsl(var(--secondary))]/20 hover:scale-110 active:scale-95 transition-all group/btn font-bold text-xl"
                            title="Log New Proposal"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            {account.type === 'JobBoard' && (
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border-color))]/50 flex items-center justify-between">
                    <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-1">Applications Sent</div>
                        <div className="text-2xl font-black text-[hsl(var(--text-primary))]">
                            {account.applicationCount || 0} <span className="text-xs font-bold text-[hsl(var(--text-muted))] uppercase">Applied</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onDecrementApplication(account.id)}
                            className="w-10 h-10 rounded-xl bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))] flex items-center justify-center border border-[hsl(var(--border-color))] hover:border-red-500/50 hover:text-red-500 transition-all font-bold"
                            title="Correction: Remove Application"
                            disabled={(account.applicationCount || 0) <= 0}
                        >
                            -
                        </button>
                        <button
                            onClick={() => onIncrementApplication(account.id)}
                            className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] text-white flex items-center justify-center shadow-lg shadow-[hsl(var(--primary))]/20 hover:scale-110 active:scale-95 transition-all group/btn font-bold text-xl"
                            title="Log New Application"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

interface AccountFormProps {
    type: AccountType;
    initialData?: Account;
    mode: 'add' | 'edit';
    onClose: () => void;
}

function AccountForm({ type, initialData, mode, onClose }: AccountFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>((initialData?.platform as SocialPlatform) || 'X');
    const [professionalPlatform, setProfessionalPlatform] = useState<ProfessionalPlatform>((initialData?.platform as ProfessionalPlatform) || 'Upwork');
    const [jobBoardPlatform, setJobBoardPlatform] = useState<JobBoardPlatform>((initialData?.platform as JobBoardPlatform) || 'RemoteOK');
    const [jobBoardCategory, setJobBoardCategory] = useState<JobBoardCategory>(initialData?.jobBoardCategory || 'Remote');
    const [professionalCategory, setProfessionalCategory] = useState<ProfessionalCategory>(initialData?.professionalCategory || 'Global');
    const [username, setUsername] = useState(initialData?.username || '');
    const [url, setUrl] = useState(initialData?.url || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [password, setPassword] = useState(initialData?.loginPassword || '');
    const [hint, setHint] = useState(initialData?.credentialHint || '');
    const [notes, setNotes] = useState(initialData?.notes || '');

    const currentType = initialData?.type || type;

    const jobBoardCategorized: Record<JobBoardCategory, JobBoardPlatform[]> = {
        Remote: ['RemoteOK', 'We Work Remotely', 'FlexJobs', 'Jobspresso', 'Remotive'],
        Global: ['Wellfound', 'Indeed', 'Glassdoor', 'WhatJobs', 'Jooble', 'LinkedIn Jobs'],
        Morocco: ['Jobbers.ma', 'Dreamjob.ma', 'Mawahib.ma', 'Emploi-public.ma'],
        French: ['Welcome to the Jungle', 'HelloWork', 'Cadremploi', 'ChooseYourBoss'],
        MENA: ['Bayt', 'GulfTalent', 'Naukrigulf']
    };

    const professionalCategorized: Record<ProfessionalCategory, ProfessionalPlatform[]> = {
        Global: ['Upwork', 'Freelancer', 'Fiverr', 'Guru', 'PeoplePerHour'],
        French: ['Malt', 'Codeur.com', 'ComeUp'],
        Arabic: ['Mostaql', 'Khamsat', 'Ureed']
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !username || !url) return;

        const platform = currentType === 'Social' ? socialPlatform : (currentType === 'Professional' ? professionalPlatform : (currentType === 'JobBoard' ? jobBoardPlatform : undefined));

        const data: Partial<Account> = {
            name,
            type: currentType,
            platform,
            jobBoardCategory: currentType === 'JobBoard' ? jobBoardCategory : undefined,
            professionalCategory: currentType === 'Professional' ? professionalCategory : undefined,
            username,
            url,
            email: email || '',
            loginPassword: password || '',
            credentialHint: hint || '',
            notes: notes || ''
        };

        if (mode === 'edit' && initialData) {
            await db.updateAccount({ id: initialData.id, ...data });
        } else {
            await db.addAccount({ id: crypto.randomUUID(), ...data } as Account);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Account Name</label>
                    <input
                        type="text"
                        required
                        className="input-field h-12"
                        placeholder="e.g. My Hub"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Username / Handle</label>
                    <input
                        type="text"
                        required
                        className="input-field h-12"
                        placeholder="@username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
            </div>

            {currentType === 'Social' && (
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">Select Social Platform</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {(['X', 'Skool', 'LinkedIn', 'Reddit', 'Medium', 'Other'] as SocialPlatform[]).map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setSocialPlatform(p)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${socialPlatform === p
                                    ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                                    : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))] hover:border-[hsl(var(--border-hover))]'
                                    }`}
                            >
                                <span className="text-[10px] font-black">{p}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentType === 'Professional' && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">Market Segment</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['Global', 'French', 'Arabic'] as ProfessionalCategory[]).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setProfessionalCategory(cat)}
                                    className={`py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all ${professionalCategory === cat
                                        ? 'bg-[hsl(var(--secondary))] text-white border-[hsl(var(--secondary))] shadow-lg shadow-[hsl(var(--secondary))]/20 scale-[1.02]'
                                        : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">Select Professional Platform</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {professionalCategorized[professionalCategory].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setProfessionalPlatform(p)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${professionalPlatform === p
                                        ? 'bg-[hsl(var(--secondary))]/10 border-[hsl(var(--secondary))] text-[hsl(var(--secondary))]'
                                        : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))] hover:border-[hsl(var(--border-hover))]'
                                        }`}
                                >
                                    <span className="text-[9px] font-black text-center leading-tight">{p}</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setProfessionalPlatform('Other')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${professionalPlatform === 'Other'
                                    ? 'bg-[hsl(var(--secondary))]/10 border-[hsl(var(--secondary))] text-[hsl(var(--secondary))]'
                                    : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))] hover:border-[hsl(var(--border-hover))]'
                                    }`}
                            >
                                <span className="text-[9px] font-black text-center leading-tight">Other</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {currentType === 'JobBoard' && (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">Platform Category</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['Global', 'Remote', 'Morocco'] as JobBoardCategory[]).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setJobBoardCategory(cat)}
                                    className={`py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all ${jobBoardCategory === cat
                                        ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary))]/20 scale-[1.02]'
                                        : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">Select Job Board</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {jobBoardCategorized[jobBoardCategory]?.map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setJobBoardPlatform(p)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${jobBoardPlatform === p
                                        ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                                        : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))] hover:border-[hsl(var(--border-hover))]'
                                        }`}
                                >
                                    <span className="text-[9px] font-black text-center leading-tight">{p}</span>
                                </button>
                            )) || <div className="text-[10px] text-[hsl(var(--text-muted))] italic">No platforms for this category yet</div>}
                            <button
                                type="button"
                                onClick={() => setJobBoardPlatform('Other')}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${jobBoardPlatform === 'Other'
                                    ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                                    : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-muted))] hover:border-[hsl(var(--border-hover))]'
                                    }`}
                            >
                                <span className="text-[9px] font-black text-center leading-tight">Other</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">URL / Link</label>
                    <input
                        type="url"
                        required
                        className="input-field h-12"
                        placeholder="https://..."
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Email (Optional)</label>
                    <input
                        type="email"
                        className="input-field h-12"
                        placeholder="email@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Password</label>
                    <input
                        type="text"
                        className="input-field h-12"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Hint (Optional)</label>
                    <input
                        type="text"
                        className="input-field h-12"
                        placeholder="e.g. usual + 123"
                        value={hint}
                        onChange={e => setHint(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Notes</label>
                <textarea
                    className="textarea-field h-24"
                    placeholder="Strategies, keywords, or specific notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full h-14 rounded-2xl text-sm shadow-xl shadow-[hsl(var(--primary))]/20"
            >
                {mode === 'add' ? 'Confirm Addition' : 'Save Changes'}
            </button>
        </form>
    );
}
