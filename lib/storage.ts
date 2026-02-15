// Enhanced Storage for Personal Productivity App
import {
    Task, Note, NoteType, PostIdea, Lead, Project, ProjectStatus, Account, Video, VideoProgress, AppDocument, JobBoardCategory,
    AITool, DiscoveryLog, CreatorRadar, WeeklyTrend, IntelligenceSource,
    WEEKLY_TEMPLATE, DEVOPS_LEARNING_PATH,
    generateId, getTodayString, getCurrentWeekday, getWeekNumber
} from './models';

const STORAGE_KEYS = {
    TASKS: 'productivity_tasks',
    NOTES: 'productivity_notes',
    POST_IDEAS: 'productivity_post_ideas',
    LEADS: 'productivity_leads',
    PROJECTS: 'productivity_projects',
    VIDEO_PROGRESS: 'productivity_video_progress',
    IS_FREELANCE_ACTIVE: 'productivity_is_freelance_active',
    ACCOUNTS: 'productivity_accounts',
    DOCUMENTS: 'productivity_documents',
    AI_TOOLS: 'productivity_ai_tools',
    AI_DISCOVERY: 'productivity_ai_discovery',
    AI_RADAR: 'productivity_ai_radar',
    AI_TRENDS: 'productivity_ai_trends'
};

export function isFreelanceClientActive(): boolean {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem(STORAGE_KEYS.IS_FREELANCE_ACTIVE);
    return data === 'true';
}

export function setFreelanceClientActive(active: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.IS_FREELANCE_ACTIVE, active.toString());
}

// ============ TASKS ============

export function getAllTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
}

function saveAllTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

export function getTodaysTasks(): Task[] {
    const today = getTodayString();
    const weekday = getCurrentWeekday();
    const allTasks = getAllTasks();

    // Check if we already have tasks for today
    let todaysTasks = allTasks.filter(t => t.date === today);

    if (todaysTasks.length > 0) {
        // Add note counts
        return todaysTasks.map(task => ({
            ...task,
            noteCount: getNotesByTaskId(task.id).length
        }));
    }

    // No tasks for today - create from template
    const template = WEEKLY_TEMPLATE[weekday] || [];
    const newTasks: Task[] = template.map(t => ({
        id: generateId('task'),
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        completed: false,
        date: today,
        linkedPostIdeas: [],
        linkedProjects: []
    }));

    // Carry over incomplete tasks from yesterday
    const yesterday = getYesterdayString();
    const yesterdaysTasks = allTasks.filter(t => t.date === yesterday && !t.completed);

    const carriedOverTasks = yesterdaysTasks
        .filter(yt => !newTasks.some(nt => nt.title === yt.title))
        .map(task => ({
            ...task,
            id: generateId('task'),
            date: today
        }));

    const combinedTasks = [...newTasks, ...carriedOverTasks];

    // Save new tasks
    const updatedAllTasks = [...allTasks, ...combinedTasks];
    saveAllTasks(updatedAllTasks);

    return combinedTasks.map(task => ({
        ...task,
        noteCount: 0
    }));
}

export function resetTodaysTasks(): void {
    const today = getTodayString();
    const allTasks = getAllTasks();
    const otherTasks = allTasks.filter(t => t.date !== today);
    saveAllTasks(otherTasks);
}

export function toggleTask(taskId: string): void {
    const allTasks = getAllTasks();
    const taskIndex = allTasks.findIndex(t => t.id === taskId);

    if (taskIndex >= 0) {
        allTasks[taskIndex].completed = !allTasks[taskIndex].completed;
        saveAllTasks(allTasks);
    }
}

export function updateTask(taskId: string, updates: Partial<Task>): void {
    const allTasks = getAllTasks();
    const taskIndex = allTasks.findIndex(t => t.id === taskId);

    if (taskIndex >= 0) {
        allTasks[taskIndex] = { ...allTasks[taskIndex], ...updates };
        saveAllTasks(allTasks);
    }
}

export function getTodayProgress(): { completed: number; total: number; percentage: number; byCategory: Record<string, { completed: number; total: number }> } {
    const tasks = getTodaysTasks();
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate by category
    const byCategory: Record<string, { completed: number; total: number }> = {};
    tasks.forEach(task => {
        if (!byCategory[task.category]) {
            byCategory[task.category] = { completed: 0, total: 0 };
        }
        byCategory[task.category].total++;
        if (task.completed) {
            byCategory[task.category].completed++;
        }
    });

    return { completed, total, percentage, byCategory };
}

// ============ NOTES ============

export function getAllNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
}

export function saveAllNotes(notes: Note[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getNotesByTaskId(taskId: string): Note[] {
    return getAllNotes().filter(n => n.taskId === taskId);
}

export function addNote(content: string, type: NoteType = 'General', metadata?: { videoName?: string; timestamp?: string }, taskId?: string): Note {
    const newNote: Note = {
        id: generateId('note'),
        taskId,
        type,
        content,
        timestamp: metadata?.timestamp,
        videoName: metadata?.videoName,
        createdAt: new Date().toISOString()
    };

    const allNotes = getAllNotes();
    allNotes.push(newNote);
    saveAllNotes(allNotes);

    return newNote;
}

export function deleteNote(noteId: string): void {
    const allNotes = getAllNotes().filter(n => n.id !== noteId);
    saveAllNotes(allNotes);
}

export function searchNotes(query: string): Note[] {
    const allNotes = getAllNotes();
    const lowerQuery = query.toLowerCase();
    return allNotes.filter(n =>
        n.content.toLowerCase().includes(lowerQuery) ||
        (n.timestamp && n.timestamp.includes(query))
    );
}

// ============ POST IDEAS ============

function getAllPostIdeas(): PostIdea[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.POST_IDEAS);
    return data ? JSON.parse(data) : [];
}

function saveAllPostIdeas(ideas: PostIdea[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.POST_IDEAS, JSON.stringify(ideas));
}

export function getPostIdeas(): PostIdea[] {
    return getAllPostIdeas().sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function addPostIdea(idea: Omit<PostIdea, 'id' | 'createdAt'>): PostIdea {
    const newIdea: PostIdea = {
        ...idea,
        id: generateId('post'),
        createdAt: new Date().toISOString()
    };

    const allIdeas = getAllPostIdeas();
    allIdeas.push(newIdea);
    saveAllPostIdeas(allIdeas);

    // Link to task if provided
    if (idea.linkedTaskId) {
        const allTasks = getAllTasks();
        const taskIndex = allTasks.findIndex(t => t.id === idea.linkedTaskId);
        if (taskIndex >= 0) {
            if (!allTasks[taskIndex].linkedPostIdeas) {
                allTasks[taskIndex].linkedPostIdeas = [];
            }
            allTasks[taskIndex].linkedPostIdeas!.push(newIdea.id);
            saveAllTasks(allTasks);
        }
    }

    return newIdea;
}

export function updatePostIdea(ideaId: string, updates: Partial<PostIdea>): void {
    const allIdeas = getAllPostIdeas();
    const ideaIndex = allIdeas.findIndex(i => i.id === ideaId);

    if (ideaIndex >= 0) {
        allIdeas[ideaIndex] = { ...allIdeas[ideaIndex], ...updates };
        saveAllPostIdeas(allIdeas);
    }
}

export function deletePostIdea(ideaId: string): void {
    const allIdeas = getAllPostIdeas().filter(i => i.id !== ideaId);
    saveAllPostIdeas(allIdeas);
}

// ============ LEADS ============

function getAllLeads(): Lead[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : [];
}

function saveAllLeads(leads: Lead[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
}

export function getLeads(): Lead[] {
    return getAllLeads().sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Lead {
    const newLead: Lead = {
        ...lead,
        id: generateId('lead'),
        createdAt: new Date().toISOString()
    };

    const allLeads = getAllLeads();
    allLeads.push(newLead);
    saveAllLeads(allLeads);

    return newLead;
}

export function updateLead(leadId: string, updates: Partial<Lead>): void {
    const allLeads = getAllLeads();
    const leadIndex = allLeads.findIndex(l => l.id === leadId);

    if (leadIndex >= 0) {
        allLeads[leadIndex] = { ...allLeads[leadIndex], ...updates };
        saveAllLeads(allLeads);
    }
}

export function deleteLead(leadId: string): void {
    const allLeads = getAllLeads().filter(l => l.id !== leadId);
    saveAllLeads(allLeads);
}

export function getLeadStats(): { total: number; byStatus: Record<string, number> } {
    const leads = getAllLeads();
    const byStatus: Record<string, number> = {};

    leads.forEach(lead => {
        byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
    });

    return { total: leads.length, byStatus };
}

// ============ PROJECTS ============

function getAllProjects(): Project[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
}

function saveAllProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function getProjects(): Project[] {
    const projects = getAllProjects();
    // Initialize required fields for older projects if any
    let migrated = false;
    const migratedProjects = projects.map(p => {
        if (p.commit_streak === undefined) {
            migrated = true;
            return {
                ...p,
                commit_streak: 0,
                updatedAt: p.createdAt,
                status: (p.status as any === 'active' ? 'In Progress' : (p.status as any === 'completed' ? 'Published' : 'Idea')) as ProjectStatus
            };
        }
        return p;
    });

    if (migrated) saveAllProjects(migratedProjects);
    return migratedProjects;
}

export function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'commit_streak' | 'checklist'>): Project {
    const now = new Date().toISOString();
    const newProject: Project = {
        ...project,
        id: generateId('project'),
        commit_streak: 0,
        createdAt: now,
        updatedAt: now
    };

    const allProjects = getAllProjects();
    allProjects.push(newProject);
    saveAllProjects(allProjects);

    return newProject;
}

export function logProjectCommit(projectId: string): void {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return;

    const project = projects[index];
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (project.last_commit_date === today) return; // Already logged today

    if (project.last_commit_date === yesterday) {
        project.commit_streak += 1;
    } else {
        project.commit_streak = 1;
    }

    project.last_commit_date = today;
    project.updatedAt = new Date().toISOString();
    projects[index] = project;
    saveAllProjects(projects);
}

export function updateProjectStatus(projectId: string, newStatus: Project['status']): void {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return;

    const project = projects[index];

    // Deployment Ready Checklist Generation
    if (newStatus === 'Deployment Ready' && project.status !== 'Deployment Ready') {
        project.checklist = [
            { id: generateId('ch'), label: 'Deploy project', completed: false },
            { id: generateId('ch'), label: 'Add to portfolio', completed: false },
            { id: generateId('ch'), label: 'Post on LinkedIn', completed: false },
            { id: generateId('ch'), label: 'Post on X', completed: false },
            { id: generateId('ch'), label: 'Write blog breakdown', completed: false },
            { id: generateId('ch'), label: 'Submit to Product Hunt', completed: false }
        ];
    } else if (newStatus === 'Published') {
        const allCompleted = project.checklist?.every(item => item.completed) ?? true;
        if (!allCompleted) return; // Block publishing if checklist not empty and not done
    }

    project.status = newStatus;
    project.updatedAt = new Date().toISOString();
    projects[index] = project;
    saveAllProjects(projects);
}

export function toggleProjectChecklistItem(projectId: string, itemId: string): void {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return;

    const project = projects[index];
    if (project.checklist) {
        const itemIndex = project.checklist.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            project.checklist[itemIndex].completed = !project.checklist[itemIndex].completed;
            saveAllProjects(projects);
        }
    }
}

export function updateProject(projectId: string, updates: Partial<Project>): void {
    const allProjects = getAllProjects();
    const projectIndex = allProjects.findIndex(p => p.id === projectId);

    if (projectIndex >= 0) {
        allProjects[projectIndex] = { ...allProjects[projectIndex], ...updates };
        saveAllProjects(allProjects);
    }
}

// GitHub push recording is now handled by logProjectCommit for streaks
// But we keep this for compatibility if used elsewhere
export function recordGitHubPush(projectId: string): void {
    logProjectCommit(projectId);
}

export function getProjectsNeedingPush(): Project[] {
    const projects = getProjects();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return projects.filter(p => {
        if (!p.last_commit_date) return true;
        return new Date(p.last_commit_date) < twoDaysAgo;
    });
}

// ============ WEEKLY REFLECTION ============

export function generateWeeklyReflection(): string {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Saturday

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const allTasks = getAllTasks();
    const weekTasks = allTasks.filter(t => t.date >= weekStartStr && t.date <= weekEndStr);
    const completedTasks = weekTasks.filter(t => t.completed);

    const postIdeas = getAllPostIdeas().filter(i =>
        i.createdAt >= weekStart.toISOString() && i.createdAt <= weekEnd.toISOString()
    );

    const leads = getAllLeads().filter(l =>
        l.createdAt >= weekStart.toISOString() && l.createdAt <= weekEnd.toISOString()
    );

    const proposalsSent = leads.filter(l => l.proposalSent).length;

    let reflection = `# Weekly Reflection - Week ${getWeekNumber()}\n\n`;
    reflection += `## Tasks Completed: ${completedTasks.length}/${weekTasks.length}\n\n`;

    // Group by category
    const byCategory: Record<string, number> = {};
    completedTasks.forEach(t => {
        byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });

    reflection += `### By Category:\n`;
    Object.entries(byCategory).forEach(([cat, count]) => {
        reflection += `- ${cat}: ${count} tasks\n`;
    });

    reflection += `\n## Post Ideas Generated: ${postIdeas.length}\n\n`;
    postIdeas.slice(0, 5).forEach(idea => {
        reflection += `- [${idea.category}] ${idea.title}\n`;
    });

    reflection += `\n## Freelancing:\n`;
    reflection += `- New leads: ${leads.length}\n`;
    reflection += `- Proposals sent: ${proposalsSent}\n`;

    reflection += `\n## Projects:\n`;
    const projects = getProjects();
    projects.forEach(p => {
        reflection += `- ${p.name}: ${p.last_commit_date ? 'Last commit ' + new Date(p.last_commit_date).toLocaleDateString() : 'No recent commits'}\n`;
    });

    reflection += `\n## Notes for Next Week:\n`;
    reflection += `- [Add your insights here]\n`;

    return reflection;
}

// ============ CLEANUP ============

export function cleanupOldData(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    // Keep tasks from last 30 days
    const allTasks = getAllTasks().filter(t => t.date >= cutoffStr);
    saveAllTasks(allTasks);

    // Keep notes from last 30 days
    const allNotes = getAllNotes().filter(n => n.createdAt >= cutoffDate.toISOString());
    saveAllNotes(allNotes);
}
export function addTask(taskData: Omit<Task, 'id' | 'date'>): Task {
    const tasks = getAllTasks();
    const newTask: Task = {
        ...taskData,
        id: generateId(),
        date: getTodayString()
    };
    tasks.push(newTask);
    saveAllTasks(tasks);
    return newTask;
}

// ============ VIDEO TRACKING ============

function getAllVideoProgress(): VideoProgress[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.VIDEO_PROGRESS);
    return data ? JSON.parse(data) : [];
}

function saveAllVideoProgress(progress: VideoProgress[]): void {
    localStorage.setItem(STORAGE_KEYS.VIDEO_PROGRESS, JSON.stringify(progress));
}

export function getVideoProgress(videoId: string): VideoProgress {
    const allProgress = getAllVideoProgress();
    const progress = allProgress.find(p => p.videoId === videoId);

    if (progress) return progress;

    // Default progress if none exists
    return {
        videoId,
        minutesWatched: 0,
        completed: false,
        lastWatched: new Date().toISOString()
    };
}

export function logVideoMinutes(videoId: string, minutes: number): VideoProgress {
    const allProgress = getAllVideoProgress();
    const video = DEVOPS_LEARNING_PATH.find(v => v.id === videoId);
    if (!video) throw new Error('Video not found in learning path');

    let progressIndex = allProgress.findIndex(p => p.videoId === videoId);
    let progress: VideoProgress;

    if (progressIndex >= 0) {
        progress = allProgress[progressIndex];
        progress.minutesWatched += minutes;
        if (progress.minutesWatched >= video.duration) {
            progress.minutesWatched = video.duration;
            progress.completed = true;
        }
        progress.lastWatched = new Date().toISOString();
        allProgress[progressIndex] = progress;
    } else {
        progress = {
            videoId,
            minutesWatched: Math.min(minutes, video.duration),
            completed: minutes >= video.duration,
            lastWatched: new Date().toISOString()
        };
        allProgress.push(progress);
    }

    saveAllVideoProgress(allProgress);
    return progress;
}

export function getNextVideo(): Video | null {
    const allProgress = getAllVideoProgress();

    // Find first non-completed video in path order
    for (const video of DEVOPS_LEARNING_PATH) {
        const progress = allProgress.find(p => p.videoId === video.id);
        if (!progress || !progress.completed) {
            return video;
        }
    }

    return null; // All completed!
}

export function getVideoStats(): {
    totalMinutes: number;
    minutesWatched: number;
    totalVideos: number;
    videosCompleted: number;
    percentage: number;
} {
    const allProgress = getAllVideoProgress();
    const totalVideos = DEVOPS_LEARNING_PATH.length;
    const totalMinutes = DEVOPS_LEARNING_PATH.reduce((acc, v) => acc + v.duration, 0);

    let minutesWatched = 0;
    let videosCompleted = 0;

    DEVOPS_LEARNING_PATH.forEach(video => {
        const progress = allProgress.find(p => p.videoId === video.id);
        if (progress) {
            minutesWatched += progress.minutesWatched;
            if (progress.completed) videosCompleted++;
        }
    });

    return {
        totalMinutes,
        minutesWatched,
        totalVideos,
        videosCompleted,
        percentage: Math.round((minutesWatched / totalMinutes) * 100) || 0
    };
}

// ============ ACCOUNTS ============

export function getAllAccounts(): Account[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    let accounts: Account[] = data ? JSON.parse(data) : [];

    // Seed missing categories
    const hasSocial = accounts.some(a => a.type === 'Social');
    const hasProfessional = accounts.some(a => a.type === 'Professional');
    const hasJobBoard = accounts.some(a => a.type === 'JobBoard');

    const platformToCategory: Record<string, JobBoardCategory> = {
        'Jobbers.ma': 'Morocco', 'Dreamjob.ma': 'Morocco', 'Mawahib.ma': 'Morocco', 'Emploi-public.ma': 'Morocco',
        'Welcome to the Jungle': 'French', 'HelloWork': 'French', 'Cadremploi': 'French', 'ChooseYourBoss': 'French',
        'Bayt': 'MENA', 'GulfTalent': 'MENA', 'Naukrigulf': 'MENA'
    };

    let needsSave = false;

    // Migrate existing accounts to have categories if missing
    accounts.forEach(acc => {
        if (acc.type === 'JobBoard' && !acc.jobBoardCategory && acc.platform) {
            acc.jobBoardCategory = platformToCategory[acc.platform as string];
            if (acc.jobBoardCategory) needsSave = true;
        }
    });

    // Targeted LinkedIn injection for existing users
    const hasLinkedInSocial = accounts.some(a => a.type === 'Social' && a.platform === 'LinkedIn');
    if (!hasLinkedInSocial) {
        accounts.push({
            id: 'acc-default-linkedin-social',
            name: 'LinkedIn',
            type: 'Social',
            platform: 'LinkedIn',
            username: 'Profile Name',
            url: 'https://linkedin.com',
            postCount: 0,
            createdAt: new Date().toISOString()
        });
        needsSave = true;
    }

    // Targeted Blog injection for existing users
    const hasBlogSocial = accounts.some(a => a.type === 'Social' && a.platform === 'Blog');
    if (!hasBlogSocial) {
        accounts.push({
            id: 'acc-default-blog',
            name: 'AI Dev Daily',
            type: 'Social',
            platform: 'Blog',
            username: 'Founder',
            url: 'https://aidevdaily.com',
            postCount: 0,
            createdAt: new Date().toISOString()
        });
        needsSave = true;
    }

    // New Regional Market Injections (French & Arabic)
    const regionalPlatforms = [
        // Professional (Freelance)
        { id: 'acc-default-malt', name: 'Malt', type: 'Professional', platform: 'Malt', username: 'Profile', url: 'https://malt.fr', professionalCategory: 'French' },
        { id: 'acc-default-codeur', name: 'Codeur.com', type: 'Professional', platform: 'Codeur.com', username: 'Profile', url: 'https://codeur.com', professionalCategory: 'French' },
        { id: 'acc-default-comeup', name: 'ComeUp (5euros)', type: 'Professional', platform: 'ComeUp', username: 'Profile', url: 'https://comeup.com', professionalCategory: 'French' },
        { id: 'acc-default-mostaql', name: 'Mostaql', type: 'Professional', platform: 'Mostaql', username: 'Profile', url: 'https://mostaql.com', professionalCategory: 'Arabic' },
        { id: 'acc-default-khamsat', name: 'Khamsat', type: 'Professional', platform: 'Khamsat', username: 'Profile', url: 'https://khamsat.com', professionalCategory: 'Arabic' },
        { id: 'acc-default-ureed', name: 'Ureed', type: 'Professional', platform: 'Ureed', username: 'Profile', url: 'https://ureed.com', professionalCategory: 'Arabic' },
        // Job Boards
        { id: 'acc-default-wttj', name: 'Welcome to the Jungle', type: 'JobBoard', platform: 'Welcome to the Jungle', username: 'Profile', url: 'https://welcometothejungle.com', jobBoardCategory: 'French' },
        { id: 'acc-default-hellowork', name: 'HelloWork', type: 'JobBoard', platform: 'HelloWork', username: 'Profile', url: 'https://hellowork.com', jobBoardCategory: 'French' },
        { id: 'acc-default-cadremploi', name: 'Cadremploi', type: 'JobBoard', platform: 'Cadremploi', username: 'Profile', url: 'https://cadremploi.fr', jobBoardCategory: 'French' },
        { id: 'acc-default-chooseyourboss', name: 'ChooseYourBoss', type: 'JobBoard', platform: 'ChooseYourBoss', username: 'Profile', url: 'https://chooseyourboss.com', jobBoardCategory: 'French' },
        { id: 'acc-default-bayt', name: 'Bayt', type: 'JobBoard', platform: 'Bayt', username: 'Profile', url: 'https://bayt.com', jobBoardCategory: 'MENA' },
        { id: 'acc-default-gulftalent', name: 'GulfTalent', type: 'JobBoard', platform: 'GulfTalent', username: 'Profile', url: 'https://gulftalent.com', jobBoardCategory: 'MENA' },
        { id: 'acc-default-naukrigulf', name: 'Naukrigulf', type: 'JobBoard', platform: 'Naukrigulf', username: 'Profile', url: 'https://naukrigulf.com', jobBoardCategory: 'MENA' }
    ];

    regionalPlatforms.forEach(p => {
        if (!accounts.some(a => a.platform === p.platform)) {
            accounts.push({
                ...p,
                postCount: p.type === 'Social' ? 0 : undefined,
                proposalCount: p.type === 'Professional' ? 0 : undefined,
                applicationCount: p.type === 'JobBoard' ? 0 : undefined,
                createdAt: new Date().toISOString()
            } as Account);
            needsSave = true;
        }
    });

    if (!hasSocial || !hasProfessional || !hasJobBoard) {
        needsSave = true;
        const socialDefaults: Account[] = !hasSocial ? [
            { id: 'acc-default-x', name: 'X', type: 'Social', platform: 'X', username: '@handle', url: 'https://x.com', postCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-skool', name: 'Skool', type: 'Social', platform: 'Skool', username: 'username', url: 'https://skool.com', postCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-reddit', name: 'Reddit', type: 'Social', platform: 'Reddit', username: 'u/username', url: 'https://reddit.com', postCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-medium', name: 'Medium', type: 'Social', platform: 'Medium', username: '@username', url: 'https://medium.com', postCount: 0, createdAt: new Date().toISOString() }
        ] : [];

        const professionalDefaults: Account[] = !hasProfessional ? [
            { id: 'acc-default-upwork', name: 'Upwork', type: 'Professional', platform: 'Upwork', username: 'Profile Name', url: 'https://upwork.com', proposalCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-fiverr', name: 'Fiverr', type: 'Professional', platform: 'Fiverr', username: 'username', url: 'https://fiverr.com', proposalCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-freelancer', name: 'Freelancer', type: 'Professional', platform: 'Freelancer', username: 'username', url: 'https://freelancer.com', proposalCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-guru', name: 'Guru', type: 'Professional', platform: 'Guru', username: 'username', url: 'https://guru.com', proposalCount: 0, createdAt: new Date().toISOString() },
            { id: 'acc-default-peopleperhour', name: 'PeoplePerHour', type: 'Professional', platform: 'PeoplePerHour', username: 'username', url: 'https://peopleperhour.com', proposalCount: 0, createdAt: new Date().toISOString() }
        ] : [];

        const jobBoardDefaults: Account[] = !hasJobBoard ? [
            { id: 'acc-default-remoteok', name: 'RemoteOK', type: 'JobBoard', platform: 'RemoteOK', username: 'username', url: 'https://remoteok.com', applicationCount: 0, jobBoardCategory: 'Remote', createdAt: new Date().toISOString() },
            { id: 'acc-default-wwr', name: 'We Work Remotely', type: 'JobBoard', platform: 'We Work Remotely', username: 'username', url: 'https://weworkremotely.com', applicationCount: 0, jobBoardCategory: 'Remote', createdAt: new Date().toISOString() },
            { id: 'acc-default-flexjobs', name: 'FlexJobs', type: 'JobBoard', platform: 'FlexJobs', username: 'username', url: 'https://flexjobs.com', applicationCount: 0, jobBoardCategory: 'Remote', createdAt: new Date().toISOString() },
            { id: 'acc-default-jobspresso', name: 'Jobspresso', type: 'JobBoard', platform: 'Jobspresso', username: 'username', url: 'https://jobspresso.co', applicationCount: 0, jobBoardCategory: 'Remote', createdAt: new Date().toISOString() },
            { id: 'acc-default-remotive', name: 'Remotive', type: 'JobBoard', platform: 'Remotive', username: 'username', url: 'https://remotive.com', applicationCount: 0, jobBoardCategory: 'Remote', createdAt: new Date().toISOString() },
            { id: 'acc-default-wellfound', name: 'Wellfound', type: 'JobBoard', platform: 'Wellfound', username: 'username', url: 'https://wellfound.com', applicationCount: 0, jobBoardCategory: 'Global', createdAt: new Date().toISOString() },
            { id: 'acc-default-indeed', name: 'Indeed', type: 'JobBoard', platform: 'Indeed', username: 'username', url: 'https://indeed.com', applicationCount: 0, jobBoardCategory: 'Global', createdAt: new Date().toISOString() },
            { id: 'acc-default-glassdoor', name: 'Glassdoor', type: 'JobBoard', platform: 'Glassdoor', username: 'username', url: 'https://glassdoor.com', applicationCount: 0, jobBoardCategory: 'Global', createdAt: new Date().toISOString() },
            { id: 'acc-default-jobbers', name: 'Jobbers.ma', type: 'JobBoard', platform: 'Jobbers.ma', username: 'username', url: 'https://jobbers.ma', applicationCount: 0, jobBoardCategory: 'Morocco', createdAt: new Date().toISOString() },
            { id: 'acc-default-dreamjob', name: 'Dreamjob.ma', type: 'JobBoard', platform: 'Dreamjob.ma', username: 'username', url: 'https://dreamjob.ma', applicationCount: 0, jobBoardCategory: 'Morocco', createdAt: new Date().toISOString() },
            { id: 'acc-default-mawahib', name: 'Mawahib.ma', type: 'JobBoard', platform: 'Mawahib.ma', username: 'username', url: 'https://mawahib.ma', applicationCount: 0, jobBoardCategory: 'Morocco', createdAt: new Date().toISOString() },
            { id: 'acc-default-emploi-public', name: 'Emploi-public.ma', type: 'JobBoard', platform: 'Emploi-public.ma', username: 'username', url: 'https://emploi-public.ma', applicationCount: 0, jobBoardCategory: 'Morocco', createdAt: new Date().toISOString() },
            { id: 'acc-default-whatjobs', name: 'WhatJobs', type: 'JobBoard', platform: 'WhatJobs', username: 'username', url: 'https://whatjobs.com', applicationCount: 0, jobBoardCategory: 'Global', createdAt: new Date().toISOString() },
            { id: 'acc-default-jooble', name: 'Jooble', type: 'JobBoard', platform: 'Jooble', username: 'username', url: 'https://jooble.org', applicationCount: 0, jobBoardCategory: 'Global', createdAt: new Date().toISOString() },
            { id: 'acc-default-linkedin-jobs', name: 'LinkedIn Jobs', type: 'JobBoard', platform: 'LinkedIn Jobs', username: 'username', url: 'https://linkedin.com/jobs', applicationCount: 0, jobBoardCategory: 'Global', createdAt: new Date().toISOString() }
        ] : [];

        accounts = [...accounts, ...socialDefaults, ...professionalDefaults, ...jobBoardDefaults];
    }

    if (needsSave) {
        saveAllAccounts(accounts);
    }

    return accounts;
}

function saveAllAccounts(accounts: Account[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
}

export function addAccount(account: Omit<Account, 'id' | 'createdAt'>): Account {
    const newAccount: Account = {
        ...account,
        id: generateId('acc'),
        postCount: account.type === 'Social' ? 0 : undefined,
        createdAt: new Date().toISOString()
    };
    const accounts = getAllAccounts();
    accounts.push(newAccount);
    saveAllAccounts(accounts);
    return newAccount;
}

export function incrementAccountPostCount(accountId: string): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0 && accounts[index].type === 'Social') {
        accounts[index].postCount = (accounts[index].postCount || 0) + 1;
        saveAllAccounts(accounts);
    }
}

export function decrementAccountPostCount(accountId: string): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0 && accounts[index].type === 'Social') {
        const currentCount = accounts[index].postCount || 0;
        if (currentCount > 0) {
            accounts[index].postCount = currentCount - 1;
            saveAllAccounts(accounts);
        }
    }
}

export function incrementAccountProposalCount(accountId: string): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0 && accounts[index].type === 'Professional') {
        accounts[index].proposalCount = (accounts[index].proposalCount || 0) + 1;
        saveAllAccounts(accounts);
    }
}

export function decrementAccountProposalCount(accountId: string): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0 && accounts[index].type === 'Professional') {
        const currentCount = accounts[index].proposalCount || 0;
        if (currentCount > 0) {
            accounts[index].proposalCount = currentCount - 1;
            saveAllAccounts(accounts);
        }
    }
}

export function incrementAccountApplicationCount(accountId: string): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0 && accounts[index].type === 'JobBoard') {
        accounts[index].applicationCount = (accounts[index].applicationCount || 0) + 1;
        saveAllAccounts(accounts);
    }
}

export function decrementAccountApplicationCount(accountId: string): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0 && accounts[index].type === 'JobBoard') {
        const currentCount = accounts[index].applicationCount || 0;
        if (currentCount > 0) {
            accounts[index].applicationCount = currentCount - 1;
            saveAllAccounts(accounts);
        }
    }
}

export function updateAccount(accountId: string, updates: Partial<Account>): void {
    const accounts = getAllAccounts();
    const index = accounts.findIndex(a => a.id === accountId);
    if (index >= 0) {
        accounts[index] = { ...accounts[index], ...updates };
        saveAllAccounts(accounts);
    }
}

export function deleteAccount(accountId: string): void {
    const accounts = getAllAccounts();
    const filtered = accounts.filter(a => a.id !== accountId);
    saveAllAccounts(filtered);
}

// ============ AI TOOLBOX ============

export function getAITools(): AITool[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.AI_TOOLS);
    return data ? JSON.parse(data) : [];
}

function saveAITools(tools: AITool[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AI_TOOLS, JSON.stringify(tools));
}

export function addAITool(tool: Omit<AITool, 'id' | 'createdAt'>): AITool {
    const newTool: AITool = {
        ...tool,
        id: generateId('tool'),
        createdAt: new Date().toISOString()
    };
    const tools = getAITools();
    tools.push(newTool);
    saveAITools(tools);
    return newTool;
}

export function updateAITool(toolId: string, updates: Partial<AITool>): void {
    const tools = getAITools();
    const index = tools.findIndex(t => t.id === toolId);
    if (index !== -1) {
        const oldTool = tools[index];
        const newTool = { ...oldTool, ...updates };

        // Lifecycle auto-tasks
        if (updates.tested && !oldTool.tested) {
            addTask({
                title: `Write Review for ${newTool.name}`,
                description: `Tool tested. Now write a high-fidelity review for the authority engine.`,
                category: 'OnlinePresence',
                priority: 'medium',
                completed: false
            });
            addTask({
                title: `Create Social Post for ${newTool.name}`,
                description: `Share initial testing results on LinkedIn/X.`,
                category: 'OnlinePresence',
                priority: 'medium',
                completed: false
            });
        }

        tools[index] = newTool;
        saveAITools(tools);
    }
}

// ============ AI INTELLIGENCE ============

export function getIntelligenceSources(): IntelligenceSource[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('productivity_ai_sources');
    let sources: IntelligenceSource[] = data ? JSON.parse(data) : [];

    // Weekly Reset Logic
    const currentWeek = getWeekNumber();
    let updated = false;
    sources = sources.map(s => {
        const lastReset = new Date(s.lastResetDate);
        const lastResetWeek = getWeekNumber(lastReset);
        // If last reset was in a different week (and not just earlier in same week), reset checks
        if (lastResetWeek !== currentWeek) {
            updated = true;
            return { ...s, checkedThisWeek: false, lastResetDate: new Date().toISOString() };
        }
        return s;
    });

    if (updated) saveIntelligenceSources(sources);
    return sources;
}

export function saveIntelligenceSources(sources: IntelligenceSource[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('productivity_ai_sources', JSON.stringify(sources));
}

export function addIntelligenceSource(source: Omit<IntelligenceSource, 'id' | 'lastResetDate' | 'checkedThisWeek'>): IntelligenceSource {
    const newSource: IntelligenceSource = {
        ...source,
        id: generateId('src'),
        checkedThisWeek: false,
        lastResetDate: new Date().toISOString()
    };
    const sources = getIntelligenceSources();
    sources.push(newSource);
    saveIntelligenceSources(sources);
    return newSource;
}

export function toggleSourceChecked(id: string): void {
    const sources = getIntelligenceSources();
    const index = sources.findIndex(s => s.id === id);
    if (index !== -1) {
        sources[index].checkedThisWeek = !sources[index].checkedThisWeek;
        saveIntelligenceSources(sources);
    }
}

export function getDiscoveryLogs(): DiscoveryLog[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.AI_DISCOVERY);
    return data ? JSON.parse(data) : [];
}

function saveDiscoveryLogs(logs: DiscoveryLog[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AI_DISCOVERY, JSON.stringify(logs));
}

export function addDiscoveryLog(log: Omit<DiscoveryLog, 'id' | 'createdAt'>): DiscoveryLog {
    const newLog: DiscoveryLog = {
        ...log,
        id: generateId('disc'),
        createdAt: new Date().toISOString()
    };
    const logs = getDiscoveryLogs();
    logs.push(newLog);
    saveDiscoveryLogs(logs);

    // Automation logic
    if (log.actionRequired === 'Test Tool') {
        addAITool({
            name: log.title,
            official_url: log.link,
            category: 'Other',
            pricing: 'Freemium',
            rating: 0,
            status: 'Discovered',
            tested: false,
            review_written: false,
            blog_published: false,
            social_post_published: false,
            notes: log.summary
        });
    } else if (log.actionRequired === 'Write Blog' || log.actionRequired === 'Make Post') {
        addTask({
            title: `${log.actionRequired}: ${log.title}`,
            description: `Discovery from Intelligence Center. Summary: ${log.summary}`,
            category: 'OnlinePresence',
            priority: 'medium',
            completed: false
        });
    }

    return newLog;
}

export function getCreatorRadar(): CreatorRadar[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.AI_RADAR);
    return data ? JSON.parse(data) : [];
}

export function saveCreatorRadar(radar: CreatorRadar[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AI_RADAR, JSON.stringify(radar));
}

export function getWeeklyTrend(week: number, year: number): WeeklyTrend | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.AI_TRENDS);
    const all: WeeklyTrend[] = data ? JSON.parse(data) : [];
    return all.find(t => t.weekNumber === week && t.year === year) || null;
}

export function getAllWeeklyTrends(): WeeklyTrend[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.AI_TRENDS);
    return data ? JSON.parse(data) : [];
}

export function saveWeeklyTrend(trend: WeeklyTrend): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(STORAGE_KEYS.AI_TRENDS);
    let all: WeeklyTrend[] = data ? JSON.parse(data) : [];
    const index = all.findIndex(t => t.weekNumber === trend.weekNumber && t.year === trend.year);
    if (index !== -1) all[index] = trend;
    else all.push(trend);
    localStorage.setItem(STORAGE_KEYS.AI_TRENDS, JSON.stringify(all));
}

// ============ DOCUMENTS ============

export function getAllDocuments(): AppDocument[] {
    if (typeof window === 'undefined') return [];
    const docs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return docs ? JSON.parse(docs) : [];
}

export function saveAllDocuments(docs: AppDocument[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
}

export function uploadDocument(doc: Omit<AppDocument, 'id' | 'updatedAt'>): AppDocument {
    const docs = getAllDocuments();
    const newDoc: AppDocument = {
        ...doc,
        id: generateId('doc'),
        updatedAt: new Date().toISOString()
    };
    docs.push(newDoc);
    saveAllDocuments(docs);
    return newDoc;
}

export function deleteDocument(docId: string): void {
    const docs = getAllDocuments();
    const filtered = docs.filter(d => d.id !== docId);
    saveAllDocuments(filtered);
}
