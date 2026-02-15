'use client';

import { useState, useEffect } from 'react';
import { useProductivity } from '@/hooks/useVibeCode';
import {
    Task, TaskCategory, CATEGORY_ICONS, WEEKLY_TEMPLATE,
    formatDate, getTodayString
} from '@/lib/models';
import * as storage from '@/lib/storage'; // Keeping for local preference (freelance mode)

export default function Calendar() {
    const { tasks, isLoaded } = useProductivity();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDayDetail, setSelectedDayDetail] = useState<{ date: string, tasks: any[] } | null>(null);
    const [isFreelanceMode, setIsFreelanceMode] = useState(false);

    useEffect(() => {
        setIsFreelanceMode(storage.isFreelanceClientActive());
    }, []);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gradient font-bold flex flex-col items-center gap-4">
                    <div>Loading Temporal Map...</div>
                    <div className="text-sm text-[hsl(var(--text-muted))] font-normal">Syncing with Supabase</div>
                </div>
            </div>
        );
    }

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const days = [];
    // Add empty slots for the beginning of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Add actual days
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Executive Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        Planning Architecture
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
                        Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">Calendar</span>
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] font-medium">
                        Mapping {tasks.length} objectives across the temporal landscape.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[hsl(var(--bg-dark))] rounded-2xl border border-[hsl(var(--border-color))] p-1 shadow-sm">
                        <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center hover:bg-[hsl(var(--border-color))] rounded-xl transition-all text-lg font-bold">←</button>
                        <span className="px-6 font-black min-w-[160px] text-center text-sm uppercase tracking-widest text-[hsl(var(--text-primary))]">
                            {monthName} {year}
                        </span>
                        <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center hover:bg-[hsl(var(--border-color))] rounded-xl transition-all text-lg font-bold">→</button>
                    </div>
                </div>
            </header>

            {/* Calendar Grid Section */}
            <section className="card p-6 md:p-8 shadow-xl overflow-x-auto border-[hsl(var(--border-color))]">
                <div className="min-w-[900px]">
                    {/* Weekdays */}
                    <div className="grid grid-cols-7 mb-6">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--text-muted))] py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grid Days */}
                    <div className="grid grid-cols-7 gap-3">
                        {days.map((day, i) => {
                            if (day === null) return <div key={`empty-${i}`} className="h-40 rounded-3xl bg-[hsl(var(--bg-dark))]/40 border border-dashed border-[hsl(var(--border-color))]/50" />;

                            const date = new Date(year, currentDate.getMonth(), day);
                            const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dayTasksFromStorage = tasks.filter(t => t.date === dateStr);
                            const isToday = dateStr === getTodayString();

                            const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            const weekday = weekdayNames[date.getDay()];
                            const templateTasks = WEEKLY_TEMPLATE[weekday] || [];

                            const displayTasks = dayTasksFromStorage.length > 0
                                ? dayTasksFromStorage
                                : templateTasks.map(t => ({
                                    ...t,
                                    id: `planned-${dateStr}-${t.title}`,
                                    completed: false,
                                    date: dateStr,
                                    isPlanned: true
                                }));

                            return (
                                <div
                                    key={dateStr}
                                    className={`h-40 rounded-[2rem] border-2 p-4 flex flex-col transition-all group cursor-pointer hover:shadow-xl hover:-translate-y-1 duration-300 ${isToday
                                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 shadow-lg shadow-[hsl(var(--primary))]/5'
                                        : 'border-[hsl(var(--border-color))] bg-[hsl(var(--card-bg))]'
                                        }`}
                                    onClick={() => setSelectedDayDetail({ date: dateStr, tasks: displayTasks })}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-xl font-black ${isToday ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--text-secondary))]'}`}>
                                            {day}
                                        </span>
                                        {displayTasks.length > 0 && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                                        )}
                                    </div>

                                    <div className="space-y-1.5 overflow-hidden flex-1">
                                        {displayTasks.slice(0, 3).map((task: any) => (
                                            <div
                                                key={task.id}
                                                className={`text-[9px] px-2.5 py-1.5 rounded-xl flex items-center gap-2 border transition-all ${task.completed
                                                    ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10 grayscale-[0.5]'
                                                    : isFreelanceMode && (task.category === 'Freelancing' || task.category === 'Lead')
                                                        ? 'bg-[hsl(var(--text-muted))]/10 text-[hsl(var(--text-muted))] border-[hsl(var(--border-color))] opacity-70'
                                                        : task.isPlanned
                                                            ? 'bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-muted))] border-dashed border-[hsl(var(--border-color))]'
                                                            : 'bg-[hsl(var(--primary))]/5 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/10 font-bold'
                                                    }`}
                                            >
                                                <span className="flex-shrink-0 text-[10px]">{CATEGORY_ICONS[task.category as TaskCategory]}</span>
                                                <span className="truncate uppercase tracking-tighter">{task.title}</span>
                                            </div>
                                        ))}
                                        {displayTasks.length > 3 && (
                                            <div className="text-[9px] font-black text-[hsl(var(--text-muted))] px-2 uppercase tracking-widest pt-1">
                                                + {displayTasks.length - 3} more
                                            </div>
                                        )}
                                    </div>

                                    {displayTasks.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-[hsl(var(--border-color))] flex justify-between items-center">
                                            <div className="h-1 flex-1 bg-[hsl(var(--border-color))] rounded-full overflow-hidden mr-3">
                                                <div
                                                    className="h-full bg-[hsl(var(--primary))] transition-all duration-500"
                                                    style={{ width: `${Math.round((displayTasks.filter(t => t.completed).length / displayTasks.length) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-black text-[hsl(var(--text-muted))]">
                                                {displayTasks.filter(t => t.completed).length}/{displayTasks.length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Metrics & Taxonomy Footer */}
            <footer className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <section className="lg:col-span-4 space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] px-2">Taxonomy</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                            <div key={cat} className="p-4 bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] rounded-2xl flex items-center gap-3 transition-colors hover:bg-[hsl(var(--card-bg))] shadow-sm">
                                <span className="text-xl">{icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--text-primary))]">{cat}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="lg:col-span-8 flex flex-col justify-between p-10 bg-[#0f172a] rounded-[40px] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 mb-10 text-white">Project Intelligence</h3>
                        <div className="grid grid-cols-3 gap-12">
                            <div>
                                <div className="text-5xl font-black tracking-tighter mb-2">{tasks.length}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Total Objectives</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black tracking-tighter mb-2">{tasks.filter(t => t.completed).length}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Achievements</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black tracking-tighter mb-2">
                                    {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0}%
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Efficiency Factor</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-4 relative z-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] opacity-${100 - (i * 20)}`} />
                            ))}
                        </div>
                        <span className="text-xs font-medium opacity-60">Visualizing recursive performance optimization</span>
                    </div>
                </section>
            </footer>

            {/* Day Detail Modal */}
            {selectedDayDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[hsl(var(--bg-dark))]/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-[hsl(var(--card-bg))] w-full max-w-4xl rounded-[40px] border border-[hsl(var(--border-color))] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-10">
                            <header className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
                                        📅 Objective Overview
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight">{formatDate(selectedDayDetail.date)}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedDayDetail(null)}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--border-color))] transition-colors text-3xl"
                                >
                                    ×
                                </button>
                            </header>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                                {selectedDayDetail.tasks.length > 0 ? (
                                    selectedDayDetail.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-5 ${task.completed
                                                ? 'bg-emerald-500/5 border-emerald-500/10 grayscale-[0.5]'
                                                : isFreelanceMode && (task.category === 'Freelancing' || task.category === 'Lead')
                                                    ? 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] opacity-60'
                                                    : task.isPlanned
                                                        ? 'bg-[hsl(var(--bg-dark))] border-dashed border-[hsl(var(--border-color))]'
                                                        : 'bg-[hsl(var(--card-bg))] border-[hsl(var(--border-color))] shadow-sm'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] flex items-center justify-center text-2xl">
                                                {CATEGORY_ICONS[task.category as TaskCategory]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className={`text-lg font-bold ${task.completed ? 'line-through text-emerald-800/60' : 'text-[hsl(var(--text-primary))]'}`}>
                                                        {task.title}
                                                    </div>
                                                    {task.isPlanned && (
                                                        <span className="text-[10px] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-3 py-1 rounded-full uppercase font-black tracking-widest">
                                                            Routine
                                                        </span>
                                                    )}
                                                    {isFreelanceMode && (task.category === 'Freelancing' || task.category === 'Lead') && !task.completed && (
                                                        <span className="text-[10px] bg-[hsl(var(--text-muted))]/10 text-[hsl(var(--text-muted))] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest border border-[hsl(var(--border-color))]">
                                                            Optional
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(var(--text-muted))]">
                                                    {task.category}
                                                </div>
                                            </div>
                                            {task.completed && (
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-[hsl(var(--bg-dark))] rounded-3xl border border-dashed border-[hsl(var(--border-color))]">
                                        <div className="text-4xl mb-4 opacity-20">📅</div>
                                        <p className="text-[hsl(var(--text-muted))] font-bold uppercase tracking-widest text-xs">No entries for this cycle</p>
                                    </div>
                                )}
                            </div>

                            <footer className="mt-10 pt-8 border-t border-[hsl(var(--border-color))] flex justify-end">
                                <button
                                    onClick={() => setSelectedDayDetail(null)}
                                    className="h-14 bg-[hsl(var(--primary))] text-white px-10 rounded-2xl transition-all font-bold uppercase text-xs tracking-[0.2em] hover:scale-[1.02] shadow-xl shadow-[hsl(var(--primary))/0.2]"
                                >
                                    Acknowledge
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
