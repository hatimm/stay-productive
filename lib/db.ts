
import { supabase } from './supabase';
import { Task, Project, AITool, Note, VideoProgress, IntelligenceSource, DiscoveryLog, CreatorRadar, WeeklyTrend, PostIdea, Lead, AppDocument, Account } from './models';

// --- TASKS ---
export async function fetchTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data || [];
}

export async function addTask(task: Task): Promise<void> {
    const { error } = await supabase.from('tasks').insert(task);
    if (error) console.error('Error adding task:', error);
}

export async function updateTask(task: Task): Promise<void> {
    const { error } = await supabase.from('tasks').update(task).eq('id', task.id);
    if (error) console.error('Error updating task:', error);
}

export async function deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) console.error('Error deleting task:', error);
}

// --- PROJECTS ---
export async function fetchProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data || [];
}

export async function addProject(project: Project): Promise<void> {
    const { error } = await supabase.from('projects').insert(project);
    if (error) console.error('Error adding project:', error);
}

export async function updateProject(project: Project): Promise<void> {
    const { error } = await supabase.from('projects').update(project).eq('id', project.id);
    if (error) console.error('Error updating project:', error);
}

// --- AI TOOLS ---
export async function fetchAITools(): Promise<AITool[]> {
    const { data, error } = await supabase.from('ai_tools').select('*');
    if (error) {
        console.error('Error fetching AI tools:', error);
        return [];
    }
    return data || [];
}

export async function addAITool(tool: AITool): Promise<void> {
    const { error } = await supabase.from('ai_tools').insert(tool);
    if (error) console.error('Error adding AI tool:', error);
}

export async function updateAITool(tool: AITool): Promise<void> {
    const { error } = await supabase.from('ai_tools').update(tool).eq('id', tool.id);
    if (error) console.error('Error updating AI tool:', error);
}

// --- INTELLIGENCE ---
export async function fetchIntelligenceSources(): Promise<IntelligenceSource[]> {
    const { data, error } = await supabase.from('intelligence_sources').select('*');
    if (error) return [];
    return data || [];
}

export async function addIntelligenceSource(source: IntelligenceSource): Promise<void> {
    await supabase.from('intelligence_sources').insert(source);
}

export async function updateIntelligenceSource(source: IntelligenceSource): Promise<void> {
    await supabase.from('intelligence_sources').update(source).eq('id', source.id);
}

export async function fetchDiscoveryLogs(): Promise<DiscoveryLog[]> {
    const { data, error } = await supabase.from('discovery_logs').select('*');
    if (error) return [];
    return data || [];
}

export async function addDiscoveryLog(log: DiscoveryLog): Promise<void> {
    await supabase.from('discovery_logs').insert(log);
}

// --- DELETES ---
// deleteTask was duplicated, removing one instance if present.
// Keeping this clean section.

// --- ACCOUNTS & LEADS & OTHERS ---
export async function fetchAccounts(): Promise<Account[]> {
    const { data, error } = await supabase.from('accounts').select('*');
    if (error) return [];
    return data || [];
}

export async function addAccount(account: Account): Promise<void> {
    const { error } = await supabase.from('accounts').insert(account);
    if (error) console.error('Error adding account:', error);
}

export async function updateAccount(account: Partial<Account> & { id: string }): Promise<void> {
    const { error } = await supabase.from('accounts').update(account).eq('id', account.id);
    if (error) console.error('Error updating account:', error);
}

export async function deleteAccount(id: string): Promise<void> {
    await supabase.from('accounts').delete().eq('id', id);
}

export async function fetchLeads(): Promise<Lead[]> {
    const { data, error } = await supabase.from('leads').select('*');
    if (error) return [];
    return data || [];
}

export async function fetchPostIdeas(): Promise<PostIdea[]> {
    const { data, error } = await supabase.from('post_ideas').select('*');
    if (error) return [];
    return data || [];
}

export async function fetchDocuments(): Promise<AppDocument[]> {
    const { data, error } = await supabase.from('documents').select('*');
    if (error) return [];
    return data || [];
}

export async function addDocument(doc: AppDocument): Promise<void> {
    const { error } = await supabase.from('documents').insert(doc);
    if (error) console.error('Error adding document:', error);
}

export async function deleteDocument(id: string): Promise<void> {
    await supabase.from('documents').delete().eq('id', id);
}

// --- VIDEO PROGRESS ---
export async function fetchVideoProgress(): Promise<VideoProgress[]> {
    const { data, error } = await supabase.from('video_progress').select('*');
    if (error) return [];
    return data || [];
}

export async function saveVideoProgress(progress: VideoProgress): Promise<void> {
    const { error } = await supabase.from('video_progress').upsert(progress, { onConflict: 'videoId' });
    if (error) console.error('Error saving video progress:', error);
}

// --- MIGRATION HELPERS ---
export async function fetchCreatorRadar(): Promise<CreatorRadar[]> {
    const { data, error } = await supabase.from('creator_radar').select('*');
    if (error) return [];
    return data || [];
}

export async function addCreatorRadar(radar: CreatorRadar): Promise<void> {
    await supabase.from('creator_radar').insert(radar);
}

export async function fetchWeeklyTrend(week: number, year: number): Promise<WeeklyTrend | null> {
    const { data, error } = await supabase.from('weekly_trends')
        .select('*')
        .eq('weekNumber', week)
        .eq('year', year)
        .single();
    if (error) return null;
    return data;
}

export async function saveWeeklyTrend(trend: WeeklyTrend): Promise<void> {
    const { error } = await supabase.from('weekly_trends').upsert(trend, { onConflict: 'weekNumber,year' });
    if (error) console.error('Error saving trend:', error);
}

// --- NOTES ---
export async function fetchNotes(): Promise<Note[]> {
    const { data, error } = await supabase.from('notes').select('*');
    if (error) return [];
    return data || [];
}

export async function addNote(note: Note): Promise<void> {
    await supabase.from('notes').insert(note);
}

export async function deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) console.error('Error deleting note:', error);
}

// --- MIGRATION HELPER ---
// --- MIGRATION HELPER ---
export async function migrateData(
    tasks: Task[],
    projects: Project[],
    aiTools: AITool[],
    sources: IntelligenceSource[],
    logs: DiscoveryLog[],
    radar: CreatorRadar[],
    trends: WeeklyTrend[],
    notes: Note[],
    videoProgress: VideoProgress[],
    accounts: Account[],
    leads: Lead[],
    postIdeas: PostIdea[],
    documents: AppDocument[]
) {
    console.log('--- Starting Migration ---');

    if (tasks.length > 0) {
        console.log(`Migrating ${tasks.length} tasks...`);
        const { error } = await supabase.from('tasks').upsert(tasks);
        if (error) console.error('Task Migration Error:', error);
    }

    if (projects.length > 0) {
        console.log(`Migrating ${projects.length} projects...`);
        const { error } = await supabase.from('projects').upsert(projects);
        if (error) console.error('Project Migration Error:', error);
    }

    if (aiTools.length > 0) {
        console.log(`Migrating ${aiTools.length} AI tools...`);
        const { error } = await supabase.from('ai_tools').upsert(aiTools);
        if (error) console.error('AI Tool Migration Error:', error);
    }

    if (sources.length > 0) {
        console.log(`Migrating ${sources.length} intelligence sources...`);
        const { error } = await supabase.from('intelligence_sources').upsert(sources);
        if (error) console.error('Sources Migration Error:', error);
    }

    if (logs.length > 0) {
        console.log(`Migrating ${logs.length} discovery logs...`);
        const { error } = await supabase.from('discovery_logs').upsert(logs);
        if (error) console.error('Logs Migration Error:', error);
    }

    if (radar.length > 0) {
        console.log(`Migrating ${radar.length} creator radar nodes...`);
        const { error } = await supabase.from('creator_radar').upsert(radar);
        if (error) console.error('Radar Migration Error:', error);
    }

    if (trends.length > 0) {
        console.log(`Migrating ${trends.length} weekly trends...`);
        const { error } = await supabase.from('weekly_trends').upsert(trends);
        if (error) console.error('Trends Migration Error:', error);
    }

    if (notes.length > 0) {
        console.log(`Migrating ${notes.length} notes...`);
        const { error } = await supabase.from('notes').upsert(notes);
        if (error) console.error('Notes Migration Error:', error);
    }

    if (videoProgress.length > 0) {
        console.log(`Migrating ${videoProgress.length} video progress records...`);
        const { error } = await supabase.from('video_progress').upsert(videoProgress);
        if (error) console.error('Video Progress Migration Error:', error);
    }

    if (accounts.length > 0) {
        console.log(`Migrating ${accounts.length} accounts... Preview:`, accounts[0]);
        const { data, error } = await supabase.from('accounts').upsert(accounts).select();
        if (error) {
            console.error('Account Migration Error:', error);
        } else {
            console.log('Account Migration Success. Records in DB:', data?.length);
        }
    }

    if (leads.length > 0) {
        console.log(`Migrating ${leads.length} leads...`);
        const { error } = await supabase.from('leads').upsert(leads);
        if (error) console.error('Leads Migration Error:', error);
    }

    if (postIdeas.length > 0) {
        console.log(`Migrating ${postIdeas.length} post ideas...`);
        const { error } = await supabase.from('post_ideas').upsert(postIdeas);
        if (error) console.error('Post Ideas Migration Error:', error);
    }

    if (documents.length > 0) {
        console.log(`Migrating ${documents.length} documents...`);
        const { error } = await supabase.from('documents').upsert(documents);
        if (error) console.error('Documents Migration Error:', error);
    }

    console.log('--- Migration process finished ---');
}
