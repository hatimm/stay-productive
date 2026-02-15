// VibeCode - Data Models
// Defines the structure for Goals, Actions, Daily Focus, Daily Logs, and Projects

class Goal {
  constructor(title, category, status = 'Not Started') {
    this.id = this.generateId();
    this.title = title;
    this.category = category;
    this.status = status; // 'Not Started', 'In Progress', 'Completed'
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  generateId() {
    return 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.category !== undefined) this.category = data.category;
    if (data.status !== undefined) this.status = data.status;
    this.updatedAt = new Date().toISOString();
  }
}

class Action {
  constructor(goalId, title, how = '', status = 'Not Started') {
    this.id = this.generateId();
    this.goalId = goalId;
    this.title = title;
    this.how = how; // Real-life example/instruction
    this.status = status; // 'Not Started', 'In Progress', 'Completed'
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
  }

  generateId() {
    return 'action_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.how !== undefined) this.how = data.how;
    if (data.status !== undefined) {
      this.status = data.status;
      if (data.status === 'Completed' && !this.completedAt) {
        this.completedAt = new Date().toISOString();
      } else if (data.status !== 'Completed') {
        this.completedAt = null;
      }
    }
  }

  markCompleted() {
    this.status = 'Completed';
    this.completedAt = new Date().toISOString();
  }

  markIncomplete() {
    this.status = 'In Progress';
    this.completedAt = null;
  }
}

class DailyFocus {
  constructor(date = null) {
    this.date = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.goalIds = []; // Array of 2-3 goal IDs
  }

  setGoals(goalIds) {
    if (goalIds.length > 3) {
      throw new Error('Daily focus can only have up to 3 goals');
    }
    this.goalIds = goalIds;
  }

  addGoal(goalId) {
    if (this.goalIds.length >= 3) {
      throw new Error('Daily focus already has 3 goals');
    }
    if (!this.goalIds.includes(goalId)) {
      this.goalIds.push(goalId);
    }
  }

  removeGoal(goalId) {
    this.goalIds = this.goalIds.filter(id => id !== goalId);
  }

  hasGoal(goalId) {
    return this.goalIds.includes(goalId);
  }
}

class DailyLog {
  constructor(date = null) {
    this.date = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.notes = '';
    this.completedActionIds = []; // Array of action IDs completed on this day
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update(data) {
    if (data.notes !== undefined) this.notes = data.notes;
    if (data.completedActionIds !== undefined) this.completedActionIds = data.completedActionIds;
    this.updatedAt = new Date().toISOString();
  }

  addCompletedAction(actionId) {
    if (!this.completedActionIds.includes(actionId)) {
      this.completedActionIds.push(actionId);
      this.updatedAt = new Date().toISOString();
    }
  }
}

class Project {
  constructor(title, description = '', category = '', links = '', notes = '') {
    this.id = this.generateId();
    this.title = title;
    this.description = description;
    this.category = category;
    this.links = links; // Can be comma-separated URLs
    this.notes = notes;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  generateId() {
    return 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.category !== undefined) this.category = data.category;
    if (data.links !== undefined) this.links = data.links;
    if (data.notes !== undefined) this.notes = data.notes;
    this.updatedAt = new Date().toISOString();
  }
}

// Category constants
const CATEGORIES = {
  DEVOPS: 'DevOps',
  FREELANCING: 'Freelancing',
  AI: 'AI',
  SIDE_PROJECTS: 'Side Projects',
  PORTFOLIO: 'Portfolio',
  MARKETING: 'Marketing',
  AUTOMATION: 'Automation',
  CAREER: 'Career'
};

// Status constants
const STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

// Default goals data
const DEFAULT_GOALS = [
  { title: 'Create an online presence to share projects, thoughts, knowledge (without showing face)', category: CATEGORIES.PORTFOLIO },
  { title: 'Become a DevOps professional', category: CATEGORIES.DEVOPS },
  { title: 'Make money online through freelancing', category: CATEGORIES.FREELANCING },
  { title: 'Keep creating n8n automations and share them online', category: CATEGORIES.AUTOMATION },
  { title: 'Learn agentic workflows (Claude skills)', category: CATEGORIES.AI },
  { title: 'Find a remote job or job abroad', category: CATEGORIES.CAREER },
  { title: 'Create and publish a SaaS', category: CATEGORIES.SIDE_PROJECTS },
  { title: 'Create an evergreen website', category: CATEGORIES.SIDE_PROJECTS },
  { title: 'Build a niche directory', category: CATEGORIES.SIDE_PROJECTS },
  { title: 'Develop mobile apps, Chrome extensions, WordPress plugins', category: CATEGORIES.SIDE_PROJECTS },
  { title: 'Keep portfolio up-to-date', category: CATEGORIES.PORTFOLIO },
  { title: 'Stay up-to-date with AI news / become an AI consultant', category: CATEGORIES.AI },
  { title: 'Create affiliate marketing website / sell digital products', category: CATEGORIES.MARKETING },
  { title: 'Buy and resell domains', category: CATEGORIES.MARKETING },
  { title: 'Collect leads every day', category: CATEGORIES.MARKETING }
];
