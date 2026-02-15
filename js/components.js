// VibeCode - UI Components
// Reusable component rendering functions

const Components = {
    // Navigation
    renderNavigation(currentPage) {
        const pages = [
            { id: 'dashboard', name: 'Dashboard', icon: '📊' },
            { id: 'goals', name: 'Goals', icon: '🎯' },
            { id: 'actions', name: 'Actions', icon: '✅' },
            { id: 'focus', name: 'Daily Focus', icon: '🔥' },
            { id: 'log', name: 'Daily Log', icon: '📝' },
            { id: 'projects', name: 'Portfolio', icon: '💼' }
        ];

        return `
      <nav class="sidebar">
        <div class="logo">VibeCode</div>
        <ul class="nav-menu">
          ${pages.map(page => `
            <li class="nav-item">
              <a href="#${page.id}" class="nav-link ${currentPage === page.id ? 'active' : ''}" data-page="${page.id}">
                <span class="nav-icon">${page.icon}</span>
                <span>${page.name}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>
    `;
    },

    // Goal Card
    renderGoalCard(goal) {
        const stats = storage.getGoalStats(goal.id);
        const categoryClass = goal.category.toLowerCase().replace(/\s+/g, '-');
        const statusClass = goal.status.toLowerCase().replace(/\s+/g, '-');

        return `
      <div class="card goal-card" data-goal-id="${goal.id}">
        <div class="card-header">
          <div>
            <h3 class="card-title">${goal.title}</h3>
            <div class="goal-meta">
              <span class="badge badge-category cat-${categoryClass}">${goal.category}</span>
              <span class="badge badge-status status-${statusClass}">${goal.status}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="icon-btn edit-goal" data-goal-id="${goal.id}" title="Edit">✏️</button>
            <button class="icon-btn delete-goal" data-goal-id="${goal.id}" title="Delete">🗑️</button>
          </div>
        </div>
        <div class="goal-stats">
          <div class="stat">
            <span class="stat-label">Total Actions</span>
            <span class="stat-value">${stats.total}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Completed</span>
            <span class="stat-value">${stats.completed}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Progress</span>
            <span class="stat-value">${stats.completionRate}%</span>
          </div>
        </div>
      </div>
    `;
    },

    // Action Item
    renderActionItem(action, goal = null) {
        const isCompleted = action.status === 'Completed';
        const goalInfo = goal || storage.getGoalById(action.goalId);

        return `
      <div class="action-item ${isCompleted ? 'completed' : ''}" data-action-id="${action.id}">
        <div class="action-checkbox ${isCompleted ? 'checked' : ''}" data-action-id="${action.id}"></div>
        <div class="action-content">
          <div class="action-title">${action.title}</div>
          ${action.how ? `<div class="action-how">${action.how}</div>` : ''}
          ${goalInfo ? `<div class="mt-md"><span class="badge badge-category cat-${goalInfo.category.toLowerCase().replace(/\s+/g, '-')}">${goalInfo.title}</span></div>` : ''}
        </div>
        <div class="card-actions">
          <button class="icon-btn edit-action" data-action-id="${action.id}" title="Edit">✏️</button>
          <button class="icon-btn delete-action" data-action-id="${action.id}" title="Delete">🗑️</button>
        </div>
      </div>
    `;
    },

    // Progress Chart
    renderProgressChart() {
        const weekData = storage.getWeeklyProgress();
        const maxCount = Math.max(...weekData.map(d => d.count), 1);

        return `
      <div class="progress-chart">
        ${weekData.map(day => {
            const height = (day.count / maxCount) * 100;
            return `
            <div class="progress-bar" style="height: ${height}%" title="${day.day}: ${day.count} actions">
              <span class="progress-bar-label">${day.day}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
    },

    // Focus Goal Selector
    renderFocusGoalItem(goal, isSelected) {
        const categoryClass = goal.category.toLowerCase().replace(/\s+/g, '-');

        return `
      <div class="focus-goal-item ${isSelected ? 'selected' : ''}" data-goal-id="${goal.id}">
        <div class="focus-checkbox"></div>
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">${goal.title}</div>
          <span class="badge badge-category cat-${categoryClass}">${goal.category}</span>
        </div>
      </div>
    `;
    },

    // Project Card
    renderProjectCard(project) {
        const categoryClass = project.category.toLowerCase().replace(/\s+/g, '-');

        return `
      <div class="card" data-project-id="${project.id}">
        <div class="card-header">
          <div>
            <h3 class="card-title">${project.title}</h3>
            ${project.category ? `<span class="badge badge-category cat-${categoryClass}">${project.category}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="icon-btn edit-project" data-project-id="${project.id}" title="Edit">✏️</button>
            <button class="icon-btn delete-project" data-project-id="${project.id}" title="Delete">🗑️</button>
          </div>
        </div>
        <div class="card-body">
          ${project.description ? `<p>${project.description}</p>` : ''}
          ${project.links ? `<p style="margin-top: 8px;"><strong>Links:</strong> ${project.links}</p>` : ''}
        </div>
      </div>
    `;
    },

    // Daily Log Entry
    renderLogEntry(log) {
        const actions = log.completedActionIds.map(id => storage.getActionById(id)).filter(a => a);
        const date = new Date(log.date);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        return `
      <div class="log-entry">
        <div class="log-date">${formattedDate}</div>
        ${log.notes ? `<div class="log-notes">${log.notes}</div>` : ''}
        ${actions.length > 0 ? `
          <div>
            <strong>Completed Actions (${actions.length}):</strong>
            <ul class="log-actions-list">
              ${actions.map(a => `<li>${a.title}</li>`).join('')}
            </ul>
          </div>
        ` : '<p style="color: var(--text-muted);">No actions completed</p>'}
      </div>
    `;
    },

    // Modal
    renderModal(title, content, actions = '') {
        return `
      <div class="modal-overlay" id="modal">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" id="modal-close">×</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${actions ? `<div class="form-actions">${actions}</div>` : ''}
        </div>
      </div>
    `;
    },

    // Goal Form
    renderGoalForm(goal = null) {
        const isEdit = !!goal;
        const categories = Object.values(CATEGORIES);

        return `
      <form id="goal-form">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-input" name="title" value="${goal ? goal.title : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" name="category" required>
            ${categories.map(cat => `
              <option value="${cat}" ${goal && goal.category === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" name="status">
            <option value="Not Started" ${goal && goal.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
            <option value="In Progress" ${goal && goal.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${goal && goal.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <input type="hidden" name="id" value="${goal ? goal.id : ''}">
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="modal-close">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Goal</button>
        </div>
      </form>
    `;
    },

    // Action Form
    renderActionForm(action = null, goalId = null) {
        const isEdit = !!action;
        const goals = storage.getGoals();
        const selectedGoalId = action ? action.goalId : goalId;

        return `
      <form id="action-form">
        <div class="form-group">
          <label class="form-label">Goal</label>
          <select class="form-select" name="goalId" required>
            ${goals.map(g => `
              <option value="${g.id}" ${selectedGoalId === g.id ? 'selected' : ''}>${g.title}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Action Title</label>
          <input type="text" class="form-input" name="title" value="${action ? action.title : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">How (Real-life example/instruction)</label>
          <textarea class="form-textarea" name="how">${action ? action.how : ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" name="status">
            <option value="Not Started" ${action && action.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
            <option value="In Progress" ${action && action.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${action && action.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <input type="hidden" name="id" value="${action ? action.id : ''}">
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="modal-close">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Action</button>
        </div>
      </form>
    `;
    },

    // Project Form
    renderProjectForm(project = null) {
        const isEdit = !!project;
        const categories = Object.values(CATEGORIES);

        return `
      <form id="project-form">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-input" name="title" value="${project ? project.title : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" name="description">${project ? project.description : ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" name="category">
            <option value="">Select category</option>
            ${categories.map(cat => `
              <option value="${cat}" ${project && project.category === cat ? 'selected' : ''}>${cat}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Links (comma-separated)</label>
          <input type="text" class="form-input" name="links" value="${project ? project.links : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-textarea" name="notes">${project ? project.notes : ''}</textarea>
        </div>
        <input type="hidden" name="id" value="${project ? project.id : ''}">
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="modal-close">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Project</button>
        </div>
      </form>
    `;
    },

    // Toast Notification
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container') || (() => {
            const div = document.createElement('div');
            div.id = 'toast-container';
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '⚠'}</span>
      <span>${message}</span>
    `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // Empty State
    renderEmptyState(icon, text, action = null) {
        return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <div class="empty-state-text">${text}</div>
        ${action ? action : ''}
      </div>
    `;
    }
};
