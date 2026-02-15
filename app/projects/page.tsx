'use client';

import { useState } from 'react';
import { Project, ProjectStatus, ProjectType } from '@/lib/models';
import * as db from '@/lib/db';
import { useProductivity } from '@/hooks/useVibeCode';

const PROJECT_TYPES: ProjectType[] = ['SaaS', 'Automation', 'DevOps Lab', 'Extension', 'VibeCode', 'Portfolio', 'Other'];
const PROJECT_STATUSES: ProjectStatus[] = ['Idea', 'In Progress', 'Deployment Ready', 'Published', 'Archived'];

export default function ProjectsPage() {
    const { projects, loadAll } = useProductivity();
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const filteredProjects = filterStatus === 'All'
        ? projects
        : projects.filter(p => p.status === filterStatus);

    const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newProject: Project = {
            id: editingProject?.id || '', // DB will generate if empty
            name: formData.get('name') as string,
            type: formData.get('type') as ProjectType,
            status: formData.get('status') as ProjectStatus,
            description: formData.get('description') as string,
            github_url: formData.get('github_url') as string,
            deployment_url: formData.get('deployment_url') as string,
            monetization_plan: formData.get('monetization_plan') as string,
            commit_streak: editingProject?.commit_streak || 0,
            last_commit_date: editingProject?.last_commit_date,
            checklist: editingProject?.checklist || [],
            createdAt: editingProject?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (editingProject) {
            await db.updateProject(newProject);
        } else {
            // @ts-ignore - remove ID to let DB generate it
            delete newProject.id;
            await db.addProject(newProject as Project);
        }

        setIsModalOpen(false);
        setEditingProject(null);
        loadAll(); // Refresh from DB
    };

    const handleStatusChange = async (project: Project, newStatus: ProjectStatus) => {
        const updated = { ...project, status: newStatus, updatedAt: new Date().toISOString() };

        // Add checklist if moving to Deployment Ready
        if (newStatus === 'Deployment Ready' && (!project.checklist || project.checklist.length === 0)) {
            updated.checklist = [
                { id: '1', label: 'Linting & Type Check Passed', completed: false },
                { id: '2', label: 'Environment Variables Secure', completed: false },
                { id: '3', label: 'Build Succeeds Locally', completed: false },
                { id: '4', label: 'Database Migrations Applied', completed: false },
                { id: '5', label: 'Smoke Test Critical Paths', completed: false },
            ];
        }

        await db.updateProject(updated);
        loadAll();
    };

    const handleLogCommit = async (project: Project) => {
        const today = new Date().toISOString().split('T')[0];
        if (project.last_commit_date === today) return; // Already logged

        const updated = {
            ...project,
            commit_streak: (project.commit_streak || 0) + 1,
            last_commit_date: today,
            updatedAt: new Date().toISOString()
        };
        await db.updateProject(updated);
        loadAll();
    };

    const toggleChecklistItem = async (project: Project, itemId: string) => {
        if (!project.checklist) return;

        const updatedChecklist = project.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        const updated = { ...project, checklist: updatedChecklist, updatedAt: new Date().toISOString() };
        await db.updateProject(updated);
        loadAll();
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        Command Center <span className="text-[hsl(var(--primary))]">v1</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-medium mt-2">
                        Manage your execution engine. Ship or die.
                    </p>
                </div>
                <button
                    onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[hsl(var(--primary))]/20 hover:-translate-y-1 transition-all"
                >
                    + New Project
                </button>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
                {(['All', ...PROJECT_STATUSES] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${filterStatus === status
                            ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]'
                            : 'bg-[hsl(var(--card-bg))] border-[hsl(var(--border-color))] hover:border-[hsl(var(--text-muted))]'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-3xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${project.status === 'Published' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                project.status === 'Deployment Ready' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                    'bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-muted))] border-[hsl(var(--border-color))]'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        {/* Title & Type */}
                        <div className="mb-4 pr-20">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-1">
                                {project.type}
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">{project.name}</h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[hsl(var(--text-secondary))] mb-6 line-clamp-2 h-10">
                            {project.description || 'No description set.'}
                        </p>

                        {/* Commit Streak */}
                        <div className="bg-[hsl(var(--bg-dark))] rounded-xl p-4 mb-6 border border-[hsl(var(--border-color))]">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Commit Streak</div>
                                <div className="flex items-center gap-1 text-[hsl(var(--primary))] font-bold">
                                    🔥 {project.commit_streak || 0}
                                </div>
                            </div>
                            <button
                                onClick={() => handleLogCommit(project)}
                                className="w-full py-2 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-lg text-xs font-bold hover:bg-[hsl(var(--primary))] hover:text-white transition-colors"
                            >
                                Log Today's Commit
                            </button>
                        </div>

                        {/* Deployment Checklist (If Ready) */}
                        {project.status === 'Deployment Ready' && (
                            <div className="mb-6 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Pre-Flight Checks</h4>
                                <div className="space-y-2">
                                    {project.checklist?.map(item => (
                                        <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => toggleChecklistItem(project, item.id)}
                                                className="rounded border-orange-500/30 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className={`text-xs font-bold ${item.completed ? 'line-through opacity-50' : ''}`}>{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border-color))]">
                            <div className="flex gap-2">
                                {project.github_url && (
                                    <a href={project.github_url} target="_blank" className="p-2 rounded-lg bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--primary))] hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                    </a>
                                )}
                                {project.deployment_url && (
                                    <a href={project.deployment_url} target="_blank" className="p-2 rounded-lg bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--primary))] hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                )}
                            </div>

                            <select
                                value={project.status}
                                onChange={(e) => handleStatusChange(project, e.target.value as ProjectStatus)}
                                className="bg-transparent text-xs font-bold text-[hsl(var(--text-secondary))] outline-none cursor-pointer hover:text-[hsl(var(--primary))]"
                            >
                                {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Edit Button Overlay */}
                        <button
                            onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                            className="absolute top-6 right-24 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] w-full max-w-2xl rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black">{editingProject ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-2xl hover:text-[hsl(var(--primary))]">&times;</button>
                        </div>

                        <form onSubmit={handleSaveProject} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Project Name</label>
                                    <input name="name" defaultValue={editingProject?.name} required className="input-field mt-1" placeholder="e.g. Project Zenith" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Type</label>
                                    <select name="type" defaultValue={editingProject?.type || 'SaaS'} className="input-field mt-1">
                                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Status</label>
                                <select name="status" defaultValue={editingProject?.status || 'Idea'} className="input-field mt-1">
                                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Description</label>
                                <textarea name="description" defaultValue={editingProject?.description} className="input-field mt-1 min-h-[100px]" placeholder="Value prop..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">GitHub URL</label>
                                    <input name="github_url" defaultValue={editingProject?.github_url} className="input-field mt-1" placeholder="https://github.com/..." />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Deployment URL</label>
                                    <input name="deployment_url" defaultValue={editingProject?.deployment_url} className="input-field mt-1" placeholder="https://..." />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))]">Monetization Plan</label>
                                <input name="monetization_plan" defaultValue={editingProject?.monetization_plan} className="input-field mt-1" placeholder="Freemium, One-time payment..." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--border-color))] transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-bold flex-1 shadow-lg shadow-[hsl(var(--primary))]/20 hover:scale-[1.02] transition-transform">
                                    {editingProject ? 'Save Changes' : 'Launch Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
