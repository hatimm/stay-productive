// VibeCode - Storage Layer
// Manages localStorage operations for all data

class Storage {
    constructor() {
        this.KEYS = {
            GOALS: 'vibecode_goals',
            ACTIONS: 'vibecode_actions',
            DAILY_FOCUS: 'vibecode_daily_focus',
            DAILY_LOGS: 'vibecode_daily_logs',
            PROJECTS: 'vibecode_projects',
            INITIALIZED: 'vibecode_initialized'
        };
        this.initialize();
    }

    // Initialize storage with default data if first time
    initialize() {
        const initialized = localStorage.getItem(this.KEYS.INITIALIZED);

        if (!initialized) {
            // First time setup - create default goals
            const goals = DEFAULT_GOALS.map(g => new Goal(g.title, g.category));
            this.saveGoals(goals);

            // Initialize empty arrays for other data
            localStorage.setItem(this.KEYS.ACTIONS, JSON.stringify([]));
            localStorage.setItem(this.KEYS.DAILY_FOCUS, JSON.stringify([]));
            localStorage.setItem(this.KEYS.DAILY_LOGS, JSON.stringify([]));
            localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify([]));

            localStorage.setItem(this.KEYS.INITIALIZED, 'true');
            console.log('VibeCode initialized with default goals');
        }
    }

    // Generic save/load methods
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Goals CRUD
    getGoals() {
        return this.load(this.KEYS.GOALS) || [];
    }

    saveGoals(goals) {
        return this.save(this.KEYS.GOALS, goals);
    }

    getGoalById(id) {
        const goals = this.getGoals();
        return goals.find(g => g.id === id);
    }

    addGoal(goal) {
        const goals = this.getGoals();
        goals.push(goal);
        return this.saveGoals(goals);
    }

    updateGoal(id, data) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === id);
        if (goal) {
            Object.assign(goal, data);
            goal.updatedAt = new Date().toISOString();
            return this.saveGoals(goals);
        }
        return false;
    }

    deleteGoal(id) {
        let goals = this.getGoals();
        goals = goals.filter(g => g.id !== id);

        // Also delete associated actions
        let actions = this.getActions();
        actions = actions.filter(a => a.goalId !== id);
        this.saveActions(actions);

        return this.saveGoals(goals);
    }

    // Actions CRUD
    getActions() {
        return this.load(this.KEYS.ACTIONS) || [];
    }

    saveActions(actions) {
        return this.save(this.KEYS.ACTIONS, actions);
    }

    getActionById(id) {
        const actions = this.getActions();
        return actions.find(a => a.id === id);
    }

    getActionsByGoalId(goalId) {
        const actions = this.getActions();
        return actions.filter(a => a.goalId === goalId);
    }

    addAction(action) {
        const actions = this.getActions();
        actions.push(action);
        return this.saveActions(actions);
    }

    updateAction(id, data) {
        const actions = this.getActions();
        const action = actions.find(a => a.id === id);
        if (action) {
            Object.assign(action, data);

            // Handle completion timestamp
            if (data.status === 'Completed' && !action.completedAt) {
                action.completedAt = new Date().toISOString();

                // Add to today's daily log
                this.addCompletedActionToLog(id);
            } else if (data.status !== 'Completed') {
                action.completedAt = null;
            }

            return this.saveActions(actions);
        }
        return false;
    }

    deleteAction(id) {
        let actions = this.getActions();
        actions = actions.filter(a => a.id !== id);
        return this.saveActions(actions);
    }

    toggleActionComplete(id) {
        const action = this.getActionById(id);
        if (action) {
            const newStatus = action.status === 'Completed' ? 'In Progress' : 'Completed';
            return this.updateAction(id, { status: newStatus });
        }
        return false;
    }

    // Daily Focus
    getDailyFocus(date = null) {
        const dateStr = date || new Date().toISOString().split('T')[0];
        const allFocus = this.load(this.KEYS.DAILY_FOCUS) || [];
        return allFocus.find(f => f.date === dateStr) || new DailyFocus(dateStr);
    }

    saveDailyFocus(dailyFocus) {
        let allFocus = this.load(this.KEYS.DAILY_FOCUS) || [];
        const index = allFocus.findIndex(f => f.date === dailyFocus.date);

        if (index >= 0) {
            allFocus[index] = dailyFocus;
        } else {
            allFocus.push(dailyFocus);
        }

        return this.save(this.KEYS.DAILY_FOCUS, allFocus);
    }

    getTodaysFocusGoals() {
        const focus = this.getDailyFocus();
        const goals = this.getGoals();
        return goals.filter(g => focus.goalIds.includes(g.id));
    }

    // Daily Logs
    getDailyLogs() {
        return this.load(this.KEYS.DAILY_LOGS) || [];
    }

    getDailyLog(date = null) {
        const dateStr = date || new Date().toISOString().split('T')[0];
        const logs = this.getDailyLogs();
        return logs.find(l => l.date === dateStr) || new DailyLog(dateStr);
    }

    saveDailyLog(log) {
        let logs = this.getDailyLogs();
        const index = logs.findIndex(l => l.date === log.date);

        if (index >= 0) {
            logs[index] = log;
        } else {
            logs.push(log);
        }

        // Keep only last 90 days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        logs = logs.filter(l => new Date(l.date) >= cutoffDate);

        return this.save(this.KEYS.DAILY_LOGS, logs);
    }

    addCompletedActionToLog(actionId) {
        const log = this.getDailyLog();
        if (!log.completedActionIds.includes(actionId)) {
            log.completedActionIds.push(actionId);
            this.saveDailyLog(log);
        }
    }

    // Projects CRUD
    getProjects() {
        return this.load(this.KEYS.PROJECTS) || [];
    }

    saveProjects(projects) {
        return this.save(this.KEYS.PROJECTS, projects);
    }

    getProjectById(id) {
        const projects = this.getProjects();
        return projects.find(p => p.id === id);
    }

    addProject(project) {
        const projects = this.getProjects();
        projects.push(project);
        return this.saveProjects(projects);
    }

    updateProject(id, data) {
        const projects = this.getProjects();
        const project = projects.find(p => p.id === id);
        if (project) {
            Object.assign(project, data);
            project.updatedAt = new Date().toISOString();
            return this.saveProjects(projects);
        }
        return false;
    }

    deleteProject(id) {
        let projects = this.getProjects();
        projects = projects.filter(p => p.id !== id);
        return this.saveProjects(projects);
    }

    // Statistics
    getGoalStats(goalId) {
        const actions = this.getActionsByGoalId(goalId);
        const total = actions.length;
        const completed = actions.filter(a => a.status === 'Completed').length;
        const inProgress = actions.filter(a => a.status === 'In Progress').length;
        const notStarted = actions.filter(a => a.status === 'Not Started').length;

        return {
            total,
            completed,
            inProgress,
            notStarted,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    getWeeklyProgress() {
        const logs = this.getDailyLogs();
        const today = new Date();
        const weekData = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const log = logs.find(l => l.date === dateStr);
            const count = log ? log.completedActionIds.length : 0;

            weekData.push({
                date: dateStr,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count
            });
        }

        return weekData;
    }

    // Export/Import
    exportData() {
        return {
            goals: this.getGoals(),
            actions: this.getActions(),
            dailyFocus: this.load(this.KEYS.DAILY_FOCUS),
            dailyLogs: this.getDailyLogs(),
            projects: this.getProjects(),
            exportedAt: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.goals) this.saveGoals(data.goals);
            if (data.actions) this.saveActions(data.actions);
            if (data.dailyFocus) this.save(this.KEYS.DAILY_FOCUS, data.dailyFocus);
            if (data.dailyLogs) this.save(this.KEYS.DAILY_LOGS, data.dailyLogs);
            if (data.projects) this.saveProjects(data.projects);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data (use with caution)
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initialize();
    }
}

// Create global storage instance
const storage = new Storage();
