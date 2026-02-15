'use client';

import { useState, useEffect } from 'react';
import { useProductivity } from '@/hooks/useVibeCode';
import {
  Task, Note, NoteType,
  PostIdea, Lead, Project,
  TaskCategory, Video, VideoProgress,
  CATEGORY_STYLES, CATEGORY_ICONS, NOTE_TYPE_ICONS, DEVOPS_LEARNING_PATH,
  formatDate, getTodayString, WEEKLY_TEMPLATE, getCurrentWeekday, generateId
} from '@/lib/models';
import * as db from '@/lib/db';
import * as storage from '@/lib/storage'; // Keep for freelance toggle only, or move to db?
// storage.isFreelanceClientActive is local preference, can stay local.

export default function Home() {
  const {
    tasks, nextVideo, videoStats, progress, isLoaded,
    loadAll, loadTasks, loadVideoData, videoProgress,
    runMigration, isMigrating
  } = useProductivity();

  const [activePanel, setActivePanel] = useState<'none' | 'notes' | 'devopsPath'>('none');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isFreelanceMode, setIsFreelanceMode] = useState(false);

  // Migration Feedback
  const [migrationStatus, setMigrationStatus] = useState('');

  useEffect(() => {
    setIsFreelanceMode(storage.isFreelanceClientActive());
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gradient font-bold flex flex-col items-center gap-4">
          <div>Loading Productivity OS...</div>
          <div className="text-sm text-[hsl(var(--text-muted))] font-normal">Connecting to Supabase</div>
        </div>
      </div>
    );
  }

  const todayStr = getTodayString();
  const mainTasks = tasks.filter(t => !t.isSubTask && t.date === todayStr); // Filter for today
  const subTasks = tasks.filter(t => t.isSubTask && t.date === todayStr);

  const incompleteMainTasks = mainTasks.filter(t => !t.completed);
  const incompleteSubTasks = subTasks.filter(t => !t.completed);
  const completedMainTasks = mainTasks.filter(t => t.completed);
  const completedSubTasks = subTasks.filter(t => t.completed);

  const isRoutineComplete = incompleteMainTasks.filter(t =>
    !isFreelanceMode || (t.category !== 'Freelancing' && t.category !== 'Lead')
  ).length === 0;

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
    loadAll();
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    await db.updateTask({ id: taskId, completed: !currentStatus } as Task);
    loadTasks();
  };

  const handleSyncTemplate = async () => {
    if (!confirm('Sync with template will reset today\'s routine. Continue?')) return;

    // Delete today's main tasks
    const todaysTasks = tasks.filter(t => t.date === todayStr && !t.isSubTask);
    await Promise.all(todaysTasks.map(t => db.deleteTask(t.id)));

    // Add template tasks
    const weekday = getCurrentWeekday();
    const template = WEEKLY_TEMPLATE[weekday] || [];

    for (const t of template) {
      await db.addTask({
        id: crypto.randomUUID(),
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        completed: false,
        date: todayStr,
        isSubTask: false,
        createdAt: new Date().toISOString()
      } as any);
    }

    loadTasks();
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Executive Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            Active Productivity Session
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[hsl(var(--text-primary))]">
            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">Tim</span>
          </h1>
          <p className="text-[hsl(var(--text-secondary))] font-medium">
            It's {formatDate(todayStr)}. Let's make it count.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Migration Button (Temporary) */}
          <button
            onClick={async () => {
              if (confirm('Migrate local data to Supabase? This might duplicate data if run twice.')) {
                setMigrationStatus('Migrating...');
                await runMigration();
                setMigrationStatus('Done!');
                setTimeout(() => setMigrationStatus(''), 3000);
              }
            }}
            disabled={isMigrating}
            className="text-xs font-bold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]"
          >
            {isMigrating ? 'Migrating...' : migrationStatus || '☁️ Migrate Data'}
          </button>

          <button
            onClick={handleSyncTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-xl text-xs font-bold text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:border-[hsl(var(--border-hover))] transition-all shadow-sm"
          >
            🔄 Sync Template
          </button>

          <button
            onClick={() => {
              const newState = !isFreelanceMode;
              setIsFreelanceMode(newState);
              storage.setFreelanceClientActive(newState); // Keep local preference
            }}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-bold transition-all shadow-sm ${isFreelanceMode
              ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))]'
              : 'bg-[hsl(var(--card-bg))] border-[hsl(var(--border-color))] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]'
              }`}
          >
            {isFreelanceMode ? '🤝 Client Active' : '🔍 Seeking Client'}
          </button>
        </div>
      </header>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Progress Bento */}
        <div className="lg:col-span-1 card card-primary flex flex-col justify-between p-8 shadow-xl shadow-[hsl(var(--primary))]/20">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Overall Progress</div>
            <div className="text-5xl font-black mb-4">{progress.percentage}%</div>
          </div>
          <div className="space-y-4">
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-end">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                {progress.completed} / {progress.total} Tasks
              </div>
              <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">
                Phase: Execution
              </div>
            </div>
          </div>
        </div>

        {/* DevOps Bento */}
        <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2">
                <span className="text-lg">⚙️</span> DevOps Path
              </div>
              <h3 className="text-2xl font-bold mb-1">Learning Mastery</h3>
              <p className="text-sm text-[hsl(var(--text-secondary))]">Accelerate your infrastructure & cloud engineering skills.</p>
            </div>
            <div className="mt-6 flex items-center gap-6">
              <div>
                <div className="text-2xl font-black text-[hsl(var(--text-primary))]">{videoStats.percentage}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--text-muted))]">Complete</div>
              </div>
              <div className="h-8 w-px bg-[hsl(var(--border-color))]" />
              <div>
                <div className="text-2xl font-black text-[hsl(var(--text-primary))]">{Math.floor(videoStats.minutesWatched / 60)}h</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--text-muted))]">Watched</div>
              </div>
              <button
                onClick={() => setActivePanel(activePanel === 'devopsPath' ? 'none' : 'devopsPath')}
                className="ml-auto btn btn-primary px-6 h-12 rounded-xl text-sm"
              >
                {activePanel === 'devopsPath' ? 'Close Path' : 'Continue Path'}
              </button>
            </div>
          </div>
          <div className="w-full md:w-48 bg-[hsl(var(--bg-darker))] flex items-center justify-center border-l border-[hsl(var(--border-color))] p-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-[hsl(var(--border-color))]" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                <circle className="text-[hsl(var(--primary))]" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * videoStats.percentage) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {videoStats.percentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {activePanel === 'devopsPath' && (
        <div className="mb-10">
          <DevOpsPathPanel
            onClose={() => setActivePanel('none')}
            refresh={loadVideoData}
            openModal={openModal}
            videoProgress={videoProgress}
            videoStats={videoStats}
          />
        </div>
      )}

      {/* Main Task Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                📋 Routine & Focus
              </h2>
              <div className="h-px flex-1 bg-[hsl(var(--border-color))] mx-6" />
            </div>

            <div className="space-y-4">
              {incompleteMainTasks.length > 0 ? (
                incompleteMainTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    videoProgress={videoProgress}
                    onToggle={() => handleToggleTask(task.id, task.completed)}
                    onAddNote={() => {
                      setSelectedTask(task);
                      openModal(<NoteForm task={task} onClose={closeModal} />);
                    }}
                    onViewNotes={() => {
                      setSelectedTask(task);
                      setActivePanel('notes');
                    }}
                    onLogVideo={(videoId) => {
                      openModal(<LogMinutesForm videoId={videoId} onClose={closeModal} currentProgress={videoProgress.find(p => p.videoId === videoId)} />);
                    }}
                    nextVideo={nextVideo}
                    isOptional={isFreelanceMode && (task.category === 'Freelancing' || task.category === 'Lead')}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-[hsl(var(--border-color))] rounded-3xl bg-[hsl(var(--card-bg))]/50">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-bold text-lg">Morning Routine Mastered</h3>
                  <p className="text-sm text-[hsl(var(--text-muted))] text-center mt-1">Consistency is the bridge between goals and accomplishment.</p>
                </div>
              )}
            </div>
          </section>

          {/* Completed / Archived Today */}
          {completedMainTasks.length > 0 && (
            <section className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 px-2">Archive Today</h3>
              <div className="space-y-3">
                {completedMainTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    videoProgress={videoProgress}
                    onToggle={() => handleToggleTask(task.id, task.completed)}
                    onAddNote={() => {
                      setSelectedTask(task);
                      openModal(<NoteForm task={task} onClose={closeModal} />);
                    }}
                    onViewNotes={() => {
                      setSelectedTask(task);
                      setActivePanel('notes');
                    }}
                    isOptional={isFreelanceMode && (task.category === 'Freelancing' || task.category === 'Lead')}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-5">
          <section className={`card p-8 border-2 transition-all duration-700 ${!isRoutineComplete ? 'border-transparent bg-[hsl(var(--bg-darker))]' : 'border-[hsl(var(--primary))]/10'}`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🎯 Expansion Tasks
                </h2>
                <p className="text-xs text-[hsl(var(--text-muted))] font-medium mt-1">Incremental wins & sub-projects</p>
              </div>
              {isRoutineComplete && (
                <button
                  onClick={() => openModal(<SubTaskForm onClose={closeModal} />)}
                  className="w-10 h-10 bg-[hsl(var(--primary))] text-white flex items-center justify-center rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 hover:scale-105 transition-transform"
                >
                  +
                </button>
              )}
            </div>

            {!isRoutineComplete ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">🔒</div>
                <div>
                  <h3 className="font-bold text-[hsl(var(--text-primary))]">Zone Locked</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--text-muted))] mt-2 px-10">Complete your morning routine to unlock expansion tasks.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {incompleteSubTasks.length > 0 ? (
                  incompleteSubTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      videoProgress={videoProgress}
                      onToggle={() => handleToggleTask(task.id, task.completed)}
                      onAddNote={() => {
                        setSelectedTask(task);
                        openModal(<NoteForm task={task} onClose={closeModal} />);
                      }}
                      onViewNotes={() => {
                        setSelectedTask(task);
                        setActivePanel('notes');
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-[hsl(var(--text-muted))] border border-dashed border-[hsl(var(--border-color))] rounded-2xl">
                    Ready for expansion? Add your first sub-task.
                  </div>
                )}
              </div>
            )}
          </section>

          {activePanel === 'notes' && selectedTask && (
            <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500">
              <NotesPanel task={selectedTask} onClose={() => setActivePanel('none')} />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-[hsl(var(--bg-dark))] border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle, onAddNote, onViewNotes, onLogVideo, nextVideo, isOptional, videoProgress }: {
  task: Task;
  onToggle: () => void;
  onAddNote: () => void;
  onViewNotes: () => void;
  onLogVideo?: (videoId: string) => void;
  nextVideo?: Video | null;
  isOptional?: boolean;
  videoProgress: VideoProgress[];
}) {
  const isDevOpsVideo = task.category === 'DevOps' && task.title.toLowerCase().includes('video');
  const nextVideoProgress = isDevOpsVideo && nextVideo ? videoProgress.find(p => p.videoId === nextVideo.id) : null;
  const minutesWatched = nextVideoProgress?.minutesWatched || 0;

  return (
    <div className={`group p-5 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] rounded-2xl hover:border-[hsl(var(--primary))]/30 hover:shadow-md transition-all duration-300 ${task.completed ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-1 ${task.completed
            ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] shadow-sm'
            : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--primary))]'
            }`}
        >
          {task.completed && <span className="text-white text-xs font-bold">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className={`text-lg transition-all flex items-center gap-2 ${task.completed ? 'line-through text-[hsl(var(--text-muted))]' : 'font-bold text-[hsl(var(--text-primary))]'}`}>
            {task.title}
            {isOptional && !task.completed && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[hsl(var(--text-muted))]/10 text-[hsl(var(--text-muted))] rounded-full border border-[hsl(var(--border-color))]">
                Optional
              </span>
            )}
          </div>
          {task.description && (
            <div className={`text-sm mt-1 leading-relaxed ${task.completed ? 'text-[hsl(var(--text-muted))]' : 'text-[hsl(var(--text-secondary))]'}`}>
              {task.description}
            </div>
          )}

          {isDevOpsVideo && nextVideo && (
            <div className="mt-5 p-4 bg-[hsl(var(--bg-dark))] rounded-xl border border-[hsl(var(--border-color))]">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-bold text-[hsl(var(--primary))] uppercase tracking-wider">Next: {nextVideo.title}</div>
                <div className="text-[10px] font-bold text-[hsl(var(--text-muted))]">{minutesWatched}m / {nextVideo.duration}m</div>
              </div>
              <div className="w-full h-1.5 bg-[hsl(var(--border-color))] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-[hsl(var(--primary))] transition-all duration-700"
                  style={{ width: `${Math.round((minutesWatched / nextVideo.duration) * 100)}%` }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => onLogVideo?.(nextVideo.id)}
                  className="flex-1 text-[10px] font-bold uppercase tracking-widest py-2 bg-[hsl(var(--primary))]/10 hover:bg-[hsl(var(--primary))] hover:text-white text-[hsl(var(--primary))] rounded-lg transition-all"
                >
                  Log Session
                </button>
                <a
                  href={nextVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-[10px] font-bold uppercase tracking-widest py-2 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] text-center rounded-lg transition-all hover:bg-[hsl(var(--bg-dark))] text-[hsl(var(--text-secondary))]"
                >
                  Watch
                </a>
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap items-center mt-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${CATEGORY_STYLES[task.category]}`}>
              {CATEGORY_ICONS[task.category]} {task.category}
            </span>
            <button
              onClick={onAddNote}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] transition-colors"
            >
              + Add Note
            </button>
            {/* Note indicator managed by NotesPanel linkage for now, could restore count if needed from db fetch but useProductivity fetches all notes so we can filter */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notes Panel
function NotesPanel({ task, onClose }: { task: Task; onClose: () => void }) {
  const { notes, loadAll } = useProductivity();
  const taskNotes = notes.filter(n => n.taskId === task.id);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this note?')) {
      await db.deleteNote(id);
      loadAll();
    }
  }

  return (
    <div className="card p-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-black tracking-tight">📝 Reflections</h3>
          <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">Context for: {task.title}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[hsl(var(--bg-dark))] transition-colors text-xl">×</button>
      </div>

      {taskNotes.length > 0 ? (
        <div className="space-y-4">
          {taskNotes.map(note => (
            <div key={note.id} className="p-4 bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] rounded-2xl group transition-all relative group">
              <button
                onClick={() => handleDelete(note.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 text-xs font-bold"
              >
                Delete
              </button>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{NOTE_TYPE_ICONS[note.type]}</span>
                  <div className="text-[10px] font-bold text-[hsl(var(--primary))] uppercase tracking-widest">{note.type.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              </div>
              <div className="text-sm font-medium leading-relaxed">{note.content}</div>
              <div className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-tighter mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--border-color))]" />
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-[hsl(var(--text-muted))] bg-[hsl(var(--bg-dark))] rounded-3xl border border-dashed border-[hsl(var(--border-color))]">
          Capture your first thought for this task.
        </div>
      )}
    </div>
  );
}

// Note Form (Unified)
function NoteForm({ task, video, onClose }: { task?: Task; video?: Video; onClose: () => void }) {
  const [content, setContent] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [type, setType] = useState<NoteType>(
    (task?.category === 'DevOps' || video) ? 'DevOps' : 'General'
  );
  const [videoName, setVideoName] = useState(video?.title || '');
  const { loadAll } = useProductivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await db.addNote({
      id: crypto.randomUUID(),
      taskId: task?.id,
      type,
      content: content.trim(),
      timestamp: timestamp || undefined,
      videoName: videoName || video?.title || undefined,
      createdAt: new Date().toISOString()
    });

    loadAll();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight">Capture Insight</h2>
        <p className="text-[hsl(var(--text-secondary))] mt-1">
          {video ? `Learning from: ${video.title}` : task ? `Context for: ${task.title}` : 'Universal Thought'}
        </p>
      </div>

      <div className="space-y-6 text-left">
        <section>
          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-4 ml-1">Taxonomy</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['General', 'DevOps', 'AiAutomation', 'AppIdea', 'Improvement', 'SocialMedia', 'Career'] as NoteType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${type === t
                  ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                  : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] text-[hsl(var(--text-secondary))] hover:border-[hsl(var(--text-muted))]'
                  }`}
              >
                <span className={type === t ? '' : 'grayscale'}>{NOTE_TYPE_ICONS[t]}</span>
                <span className="truncate">{t.replace(/([A-Z])/g, ' $1').trim()}</span>
              </button>
            ))}
          </div>
        </section>

        {(type === 'DevOps' || video) && (
          <section className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-500">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Video Source</label>
              <input
                type="text"
                className="input-field h-12 rounded-xl"
                placeholder="e.g., K8s Internals"
                value={videoName}
                onChange={e => setVideoName(e.target.value)}
                readOnly={!!video}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Marker</label>
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
          <label className="block text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2 ml-1">Articulation</label>
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea-field min-h-[250px] text-lg leading-relaxed rounded-2xl"
            placeholder="Synthesize the core insight..."
            required
          />
        </section>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <button type="button" onClick={onClose} className="btn bg-[hsl(var(--bg-dark))] h-14 rounded-2xl font-bold uppercase text-xs tracking-widest border border-[hsl(var(--border-color))] hover:bg-[hsl(var(--border-color))] transition-all">Discard</button>
        <button type="submit" className="btn btn-primary h-14 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-[hsl(var(--primary))]/20 transition-all">Commit Insight</button>
      </div>
    </form>
  );
}

// DevOps Path Panel
function DevOpsPathPanel({ onClose, refresh, openModal, videoProgress, videoStats }: any) {

  return (
    <div className="card p-10 bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] shadow-xl animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-2">
            ⚙️ Full Curriculum Progress
          </div>
          <h3 className="text-4xl font-black tracking-tighter">Infrastructure Mastery</h3>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[hsl(var(--bg-dark))] hover:bg-[hsl(var(--border-color))] transition-colors text-2xl">×</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Mastery', value: `${videoStats.percentage}%` },
          { label: 'Modules Ready', value: `${videoStats.videosCompleted}` },
          { label: 'Hours Remaining', value: `${Math.round((videoStats.totalMinutes - videoStats.minutesWatched) / 60)}h` },
          { label: 'Time Invested', value: `${Math.round(videoStats.minutesWatched / 60)}h` }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-[hsl(var(--bg-dark))] rounded-2xl border border-[hsl(var(--border-color))]">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] mb-2">{stat.label}</div>
            <div className="text-3xl font-black text-[hsl(var(--text-primary))]">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar text-left">
        {DEVOPS_LEARNING_PATH.map((video) => {
          const progress = videoProgress.find((p: any) => p.videoId === video.id) || { minutesWatched: 0, completed: false };

          // Determine if next: first incomplete
          const isNext = videoProgress.find((p: any) => p.videoId === video.id)?.completed ? false : true;
          // Needs better logic for "next", but for visual simple check:
          // A better "next" check is if all previous are done.
          // For now, simpler: just highlight if not done.

          const percent = Math.round((progress.minutesWatched / video.duration) * 100);

          return (
            <div
              key={video.id}
              className={`p-6 rounded-3xl transition-all border ${progress.completed
                ? 'bg-[hsl(var(--status-completed)/0.05)] border-[hsl(var(--status-completed)/0.1)]'
                : 'bg-[hsl(var(--bg-dark))] border-[hsl(var(--border-color))] opacity-90'
                }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] text-white flex items-center justify-center text-xs font-black">{video.order}</span>
                    <span className="text-[10px] font-bold text-[hsl(var(--primary))] uppercase tracking-[0.2em]">{video.category}</span>
                  </div>
                  <h4 className="text-lg font-bold flex items-center gap-3">
                    {video.title}
                    {progress.completed && <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">✓</span>}
                  </h4>
                </div>
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center">
                  <div className="text-xl font-black">{percent}%</div>
                  <div className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest">{progress.minutesWatched} / {video.duration} min</div>
                </div>
              </div>

              <div className="w-full h-1.5 bg-[hsl(var(--border-color))] rounded-full overflow-hidden my-6">
                <div
                  className={`h-full transition-all duration-1000 ${progress.completed ? 'bg-green-500' : 'bg-[hsl(var(--primary))]'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold bg-[hsl(var(--card-bg))] border border-[hsl(var(--border-color))] px-4 py-2.5 rounded-xl hover:bg-[hsl(var(--bg-dark))] transition-all"
                  >
                    Watch Lesson
                  </a>
                  {!progress.completed && (
                    <button
                      onClick={() => openModal(<LogMinutesForm videoId={video.id} onClose={() => { refresh(); }} currentProgress={progress} />)}
                      className="text-xs font-bold bg-[hsl(var(--primary))] text-white px-4 py-2.5 rounded-xl hover:scale-105 transition-all shadow-md shadow-[hsl(var(--primary))]/10"
                    >
                      Log Time
                    </button>
                  )}
                  <button
                    onClick={() => openModal(<NoteForm video={video} onClose={() => { refresh(); }} />)}
                    className="text-xs font-bold bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] px-4 py-2.5 rounded-xl hover:text-[hsl(var(--primary))] transition-all flex items-center gap-2"
                  >
                    📓 Add Note
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Log Minutes Form
function LogMinutesForm({ videoId, onClose, currentProgress }: { videoId: string; onClose: () => void; currentProgress?: VideoProgress }) {
  const [minutes, setMinutes] = useState('25');
  const video = DEVOPS_LEARNING_PATH.find(v => v.id === videoId);
  const { loadAll } = useProductivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseInt(minutes);
    if (isNaN(min) || min <= 0) return;
    if (!video) return;

    // Logic: fetch current, add minutes, save.
    // Or we use the passed in currentProgress.

    const currentMinutes = currentProgress?.minutesWatched || 0;
    const newMinutes = currentMinutes + min;
    const isCompleted = newMinutes >= video.duration;
    const clampedMinutes = Math.min(newMinutes, video.duration);

    await db.saveVideoProgress({
      videoId,
      minutesWatched: clampedMinutes,
      completed: isCompleted,
      lastWatched: new Date().toISOString()
    });

    loadAll();
    onClose();
  };

  if (!video) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-xs font-bold text-[hsl(var(--primary))] uppercase tracking-widest mb-1">{video.category}</div>
        <h2 className="text-2xl font-bold">{video.title}</h2>
        <div className="text-sm text-[hsl(var(--text-muted))] mt-2 text-center">
          Current Progress: <span className="font-bold text-white">{currentProgress?.minutesWatched || 0}</span> / {video.duration} minutes
        </div>
      </div>

      <div className="p-4 bg-[hsl(var(--bg-dark))] border border-[hsl(var(--border-color))] rounded-2xl">
        <label className="block text-sm font-semibold mb-3 text-center">How many minutes watched today?</label>
        <div className="flex items-center justify-center gap-4">
          {['15', '25', '45', '60'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all font-bold ${minutes === m
                ? 'bg-[hsl(var(--primary))] text-white scale-110 shadow-lg shadow-[hsl(var(--primary))]/20'
                : 'bg-white/5 hover:bg-white/10 text-[hsl(var(--text-muted))]'
                }`}
            >
              {m}
            </button>
          ))}
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-16 h-12 bg-white/5 border border-white/10 rounded-xl text-center font-bold focus:border-[hsl(var(--primary))] outline-none transition-all"
            placeholder="Min"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
        <button type="submit" className="btn btn-primary flex-1">Save Progress</button>
      </div>
    </form>
  );
}

// Sub Task Creation Form
function SubTaskForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('DevOps');
  const { loadTasks } = useProductivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await db.addTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      completed: false,
      isSubTask: true,
      priority: 'low',
      date: getTodayString()
    } as Task);

    loadTasks();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-outfit text-gradient">Add Sub To-Do</h2>
        <p className="text-[hsl(var(--text-secondary))] text-sm">Incremental improvements for today</p>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2 ml-1">
            Task Description
          </label>
          <input
            autoFocus
            type="text"
            className="input-field"
            placeholder="e.g., Polish the login animation..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="text-left">
          <label className="block text-xs font-bold uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2 ml-1">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['DevOps', 'Project', 'Freelancing', 'OnlinePresence', 'AINews', 'Lead', 'Portfolio', 'Reflection'] as TaskCategory[]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${category === cat
                  ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))]'
                  : 'bg-white/5 border-white/5 hover:border-white/10 text-[hsl(var(--text-secondary))]'
                  }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
        <button type="submit" className="btn btn-primary flex-1">Add Task</button>
      </div>
    </form>
  );
}
