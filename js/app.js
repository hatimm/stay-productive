// VibeCode - Main Application
// Handles routing, state management, and page rendering

class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.handleRouting();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
      ${Components.renderNavigation(this.currentPage)}
      <main class="main-content" id="main-content">
        ${this.renderPage()}
      </main>
    `;
        this.attachPageEventListeners();
    }

    renderPage() {
        switch (this.currentPage) {
            case 'dashboard':
                return this.renderDashboard();
            case 'goals':
                return this.renderGoals();
            case 'actions':
                return this.renderActions();
            case 'focus':
                return this.renderDailyFocus();
            case 'log':
                return this.renderDailyLog();
            case 'projects':
                return this.renderProjects();
            default:
                return this.renderDashboard();
        }
    }

    // Dashboard Page
    renderDashboard() {
        const goals = storage.getGoals();
        const focusGoals = storage.getTodaysFocusGoals();
        const todayLog = storage.getDailyLog();
        const todayActions = todayLog.completedActionIds.map(id => storage.getActionById(id)).filter(a => a);

        const statusCounts = {
            total: goals.length,
            notStarted: goals.filter(g => g.status === 'Not Started').length,
            inProgress: goals.filter(g => g.status === 'In Progress').length,
            completed: goals.filter(g => g.status === 'Completed').length
        };

        return `
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Your productivity overview</p>
      </div>

      <div class="grid grid-2 mb-md">
        <div class="card">
          <h3 class="card-title">Goal Overview</h3>
          <div class="goal-stats">
            <div class="stat">
              <span class="stat-label">Total Goals</span>
              <span class="stat-value">${statusCounts.total}</span>
            </div>
            <div class="stat">
              <span class="stat-label">In Progress</span>
              <span class="stat-value">${statusCounts.inProgress}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Completed</span>
              <span class="stat-value">${statusCounts.completed}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">Today's Progress</h3>
          <div class="goal-stats">
            <div class="stat">
              <span class="stat-label">Focus Goals</span>
              <span class="stat-value">${focusGoals.length}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Actions Done</span>
              <span class="stat-value">${todayActions.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-md">
        <h3 class="card-title">Weekly Progress</h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Actions completed per day</p>
        ${Components.renderProgressChart()}
      </div>

      ${focusGoals.length > 0 ? `
        <div class="card mb-md">
          <div class="flex-between mb-md">
            <h3 class="card-title">Today's Focus Goals</h3>
            <a href="#focus" class="btn btn-small btn-secondary">Manage Focus</a>
          </div>
          <div class="grid grid-2">
            ${focusGoals.map(goal => {
            const actions = storage.getActionsByGoalId(goal.id).filter(a => a.status !== 'Completed');
            return `
                <div class="card" style="margin: 0;">
                  <h4 style="margin-bottom: 12px;">${goal.title}</h4>
                  ${actions.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      ${actions.slice(0, 3).map(a => Components.renderActionItem(a)).join('')}
                    </div>
                  ` : '<p style="color: var(--text-muted);">No pending actions</p>'}
                </div>
              `;
        }).join('')}
          </div>
        </div>
      ` : `
        <div class="card">
          ${Components.renderEmptyState('🔥', 'No focus goals set for today', '<a href="#focus" class="btn btn-primary">Set Focus Goals</a>')}
        </div>
      `}
    `;
    }

    // Goals Page
    renderGoals() {
        const goals = storage.getGoals();

        return `
      <div class="page-header">
        <div class="flex-between">
          <div>
            <h1 class="page-title">Goals</h1>
            <p class="page-subtitle">Manage your personal goals</p>
          </div>
          <button class="btn btn-primary" id="add-goal">+ New Goal</button>
        </div>
      </div>

      ${goals.length > 0 ? `
        <div class="grid grid-2">
          ${goals.map(goal => Components.renderGoalCard(goal)).join('')}
        </div>
      ` : `
        <div class="card">
          ${Components.renderEmptyState('🎯', 'No goals yet', '<button class="btn btn-primary" id="add-goal">Create Your First Goal</button>')}
        </div>
      `}
    `;
    }

    // Actions Page
    renderActions() {
        const goals = storage.getGoals();
        const allActions = storage.getActions();

        return `
      <div class="page-header">
        <div class="flex-between">
          <div>
            <h1 class="page-title">Actions</h1>
            <p class="page-subtitle">All actions across your goals</p>
          </div>
          <button class="btn btn-primary" id="add-action">+ New Action</button>
        </div>
      </div>

      ${goals.length > 0 ? goals.map(goal => {
            const actions = storage.getActionsByGoalId(goal.id);
            if (actions.length === 0) return '';

            return `
          <div class="card mb-md">
            <div class="flex-between mb-md">
              <h3 class="card-title">${goal.title}</h3>
              <button class="btn btn-small btn-secondary add-action-to-goal" data-goal-id="${goal.id}">+ Add Action</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${actions.map(a => Components.renderActionItem(a, goal)).join('')}
            </div>
          </div>
        `;
        }).join('') : `
        <div class="card">
          ${Components.renderEmptyState('✅', 'No actions yet', '<a href="#goals" class="btn btn-primary">Create a Goal First</a>')}
        </div>
      `}
    `;
    }

    // Daily Focus Page
    renderDailyFocus() {
        const goals = storage.getGoals();
        const focus = storage.getDailyFocus();
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        return `
      <div class="page-header">
        <h1 class="page-title">Daily Focus</h1>
        <p class="page-subtitle">${today}</p>
      </div>

      <div class="card mb-md">
        <h3 class="card-title">Select 2-3 Goals to Focus On Today</h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">Choose the goals you want to make progress on today</p>
        <div class="focus-goals" id="focus-goals">
          ${goals.map(goal => Components.renderFocusGoalItem(goal, focus.hasGoal(goal.id))).join('')}
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" id="save-focus">Save Focus Goals</button>
        </div>
      </div>

      ${focus.goalIds.length > 0 ? `
        <h2 style="margin-bottom: 16px; color: var(--text-primary);">Today's Actions</h2>
        ${focus.goalIds.map(goalId => {
            const goal = storage.getGoalById(goalId);
            const actions = storage.getActionsByGoalId(goalId);

            return `
            <div class="card mb-md">
              <h3 class="card-title">${goal.title}</h3>
              ${actions.length > 0 ? `
                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
                  ${actions.map(a => Components.renderActionItem(a, goal)).join('')}
                </div>
              ` : '<p style="color: var(--text-muted); margin-top: 12px;">No actions for this goal yet</p>'}
            </div>
          `;
        }).join('')}
      ` : ''}
    `;
    }

    // Daily Log Page
    renderDailyLog() {
        const todayLog = storage.getDailyLog();
        const logs = storage.getDailyLogs().sort((a, b) => new Date(b.date) - new Date(a.date));
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        return `
      <div class="page-header">
        <h1 class="page-title">Daily Log</h1>
        <p class="page-subtitle">Reflect on your progress</p>
      </div>

      <div class="card mb-md">
        <h3 class="card-title">Today's Reflection - ${today}</h3>
        <form id="log-form">
          <div class="form-group">
            <label class="form-label">Notes & Reflections</label>
            <textarea class="form-textarea" id="log-notes" name="notes" placeholder="What did you accomplish today? What challenges did you face? What will you do tomorrow?">${todayLog.notes}</textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Log</button>
          </div>
        </form>
      </div>

      ${logs.length > 0 ? `
        <h2 style="margin-bottom: 16px; color: var(--text-primary);">Past Logs</h2>
        ${logs.map(log => Components.renderLogEntry(log)).join('')}
      ` : ''}
    `;
    }

    // Projects Page
    renderProjects() {
        const projects = storage.getProjects();

        return `
      <div class="page-header">
        <div class="flex-between">
          <div>
            <h1 class="page-title">Portfolio</h1>
            <p class="page-subtitle">Your projects and achievements</p>
          </div>
          <button class="btn btn-primary" id="add-project">+ New Project</button>
        </div>
      </div>

      ${projects.length > 0 ? `
        <div class="grid grid-3">
          ${projects.map(project => Components.renderProjectCard(project)).join('')}
        </div>
      ` : `
        <div class="card">
          ${Components.renderEmptyState('💼', 'No projects yet', '<button class="btn btn-primary" id="add-project">Add Your First Project</button>')}
        </div>
      `}
    `;
    }

    // Event Listeners
    attachEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const page = navLink.dataset.page;
                this.navigateTo(page);
            }
        });

        // Hash change for browser back/forward
        window.addEventListener('hashchange', () => {
            this.handleRouting();
        });
    }

    attachPageEventListeners() {
        const content = document.getElementById('main-content');

        // Delegate all events to main content
        content.addEventListener('click', (e) => {
            // Goal actions
            if (e.target.closest('#add-goal')) {
                this.showGoalModal();
            } else if (e.target.closest('.edit-goal')) {
                const goalId = e.target.closest('.edit-goal').dataset.goalId;
                this.showGoalModal(goalId);
            } else if (e.target.closest('.delete-goal')) {
                const goalId = e.target.closest('.delete-goal').dataset.goalId;
                this.deleteGoal(goalId);
            }

            // Action actions
            else if (e.target.closest('#add-action')) {
                this.showActionModal();
            } else if (e.target.closest('.add-action-to-goal')) {
                const goalId = e.target.closest('.add-action-to-goal').dataset.goalId;
                this.showActionModal(null, goalId);
            } else if (e.target.closest('.edit-action')) {
                const actionId = e.target.closest('.edit-action').dataset.actionId;
                this.showActionModal(actionId);
            } else if (e.target.closest('.delete-action')) {
                const actionId = e.target.closest('.delete-action').dataset.actionId;
                this.deleteAction(actionId);
            } else if (e.target.closest('.action-checkbox')) {
                const actionId = e.target.closest('.action-checkbox').dataset.actionId;
                this.toggleAction(actionId);
            }

            // Project actions
            else if (e.target.closest('#add-project')) {
                this.showProjectModal();
            } else if (e.target.closest('.edit-project')) {
                const projectId = e.target.closest('.edit-project').dataset.projectId;
                this.showProjectModal(projectId);
            } else if (e.target.closest('.delete-project')) {
                const projectId = e.target.closest('.delete-project').dataset.projectId;
                this.deleteProject(projectId);
            }

            // Focus goals
            else if (e.target.closest('.focus-goal-item')) {
                const item = e.target.closest('.focus-goal-item');
                item.classList.toggle('selected');
            } else if (e.target.closest('#save-focus')) {
                this.saveFocusGoals();
            }
        });

        // Form submissions
        content.addEventListener('submit', (e) => {
            if (e.target.id === 'log-form') {
                e.preventDefault();
                this.saveLog();
            }
        });
    }

    // Navigation
    navigateTo(page) {
        this.currentPage = page;
        window.location.hash = page;
        this.render();
    }

    handleRouting() {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== this.currentPage) {
            this.currentPage = hash || 'dashboard';
            this.render();
        }
    }

    // Modal Management
    showModal(title, content) {
        const existingModal = document.getElementById('modal');
        if (existingModal) existingModal.remove();

        const modalHTML = Components.renderModal(title, content);
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('modal');
        setTimeout(() => modal.classList.add('active'), 10);

        // Close handlers
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal' || e.target.id === 'modal-close' || e.target.closest('#modal-close')) {
                closeModal();
            }
        });

        return modal;
    }

    // Goal Management
    showGoalModal(goalId = null) {
        const goal = goalId ? storage.getGoalById(goalId) : null;
        const title = goal ? 'Edit Goal' : 'New Goal';
        const modal = this.showModal(title, Components.renderGoalForm(goal));

        modal.querySelector('#goal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            if (data.id) {
                storage.updateGoal(data.id, data);
                Components.showToast('Goal updated successfully');
            } else {
                const newGoal = new Goal(data.title, data.category, data.status);
                storage.addGoal(newGoal);
                Components.showToast('Goal created successfully');
            }

            modal.querySelector('#modal-close').click();
            this.render();
        });
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal? All associated actions will also be deleted.')) {
            storage.deleteGoal(goalId);
            Components.showToast('Goal deleted');
            this.render();
        }
    }

    // Action Management
    showActionModal(actionId = null, goalId = null) {
        const action = actionId ? storage.getActionById(actionId) : null;
        const title = action ? 'Edit Action' : 'New Action';
        const modal = this.showModal(title, Components.renderActionForm(action, goalId));

        modal.querySelector('#action-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            if (data.id) {
                storage.updateAction(data.id, data);
                Components.showToast('Action updated successfully');
            } else {
                const newAction = new Action(data.goalId, data.title, data.how, data.status);
                storage.addAction(newAction);
                Components.showToast('Action created successfully');
            }

            modal.querySelector('#modal-close').click();
            this.render();
        });
    }

    deleteAction(actionId) {
        if (confirm('Are you sure you want to delete this action?')) {
            storage.deleteAction(actionId);
            Components.showToast('Action deleted');
            this.render();
        }
    }

    toggleAction(actionId) {
        storage.toggleActionComplete(actionId);
        this.render();
    }

    // Focus Management
    saveFocusGoals() {
        const selected = document.querySelectorAll('.focus-goal-item.selected');

        if (selected.length > 3) {
            Components.showToast('You can only select up to 3 goals', 'error');
            return;
        }

        const goalIds = Array.from(selected).map(el => el.dataset.goalId);
        const focus = storage.getDailyFocus();
        focus.setGoals(goalIds);
        storage.saveDailyFocus(focus);

        Components.showToast('Focus goals saved');
        this.render();
    }

    // Log Management
    saveLog() {
        const notes = document.getElementById('log-notes').value;
        const log = storage.getDailyLog();
        log.update({ notes });
        storage.saveDailyLog(log);

        Components.showToast('Daily log saved');
    }

    // Project Management
    showProjectModal(projectId = null) {
        const project = projectId ? storage.getProjectById(projectId) : null;
        const title = project ? 'Edit Project' : 'New Project';
        const modal = this.showModal(title, Components.renderProjectForm(project));

        modal.querySelector('#project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            if (data.id) {
                storage.updateProject(data.id, data);
                Components.showToast('Project updated successfully');
            } else {
                const newProject = new Project(data.title, data.description, data.category, data.links, data.notes);
                storage.addProject(newProject);
                Components.showToast('Project created successfully');
            }

            modal.querySelector('#modal-close').click();
            this.render();
        });
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            storage.deleteProject(projectId);
            Components.showToast('Project deleted');
            this.render();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
