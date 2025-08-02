// Suggestion panel component for AI Prompt Enhancer
// Provides detailed suggestions, templates, and settings in a side panel

class SuggestionPanel {
  constructor(settings = {}) {
    this.settings = settings;
    this.isVisible = false;
    this.isHovered = false;
    this.currentTab = 'suggestions';
    this.suggestions = [];
    this.templates = [];
    this.templateManager = null;
    this.panel = null;
    this.onSuggestionApplied = null;
    
    this.createPanel();
    this.setupEventListeners();
    this.loadTemplates();
  }

  /**
   * Creates the panel DOM structure
   */
  createPanel() {
    this.panel = document.createElement('div');
    this.panel.className = 'ai-prompt-enhancer-panel';
    this.panel.innerHTML = this.getPanelHTML();
    
    document.body.appendChild(this.panel);
    
    // Get references to key elements
    this.header = this.panel.querySelector('.ai-panel-header');
    this.content = this.panel.querySelector('.ai-panel-content');
    this.footer = this.panel.querySelector('.ai-panel-footer');
    this.closeButton = this.panel.querySelector('.ai-panel-close');
    this.tabs = this.panel.querySelectorAll('.ai-panel-tab');
    this.tabContents = this.panel.querySelectorAll('.ai-panel-tab-content');
    
    // Apply platform theme
    this.applyPlatformTheme();
  }

  /**
   * Returns the HTML structure for the panel
   */
  getPanelHTML() {
    return `
      <div class="ai-panel-header">
        <div class="ai-panel-icon">✨</div>
        <div class="ai-panel-title">AI Prompt Enhancer</div>
        <button class="ai-panel-close" aria-label="Close panel">×</button>
      </div>
      
      <div class="ai-panel-tabs">
        <button class="ai-panel-tab active" data-tab="suggestions">
          Suggestions
        </button>
        <button class="ai-panel-tab" data-tab="templates">
          Templates
        </button>
        <button class="ai-panel-tab" data-tab="settings">
          Settings
        </button>
      </div>
      
      <div class="ai-panel-content">
        <div class="ai-panel-tab-content active" data-content="suggestions">
          <div class="ai-suggestions-list">
            <!-- Suggestions will be populated here -->
          </div>
        </div>
        
        <div class="ai-panel-tab-content" data-content="templates">
          <div class="ai-templates-section">
            <div class="ai-templates-header">
              <div class="ai-templates-title">Prompt Templates</div>
              <select class="ai-templates-filter">
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
                <option value="analysis">Analysis</option>
                <option value="business">Business</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <div class="ai-templates-grid">
              <!-- Templates will be populated here -->
            </div>
          </div>
        </div>
        
        <div class="ai-panel-tab-content" data-content="settings">
          <div class="ai-settings-group">
            <label class="ai-settings-label">Enhancement Mode</label>
            <div class="ai-settings-description">
              Control how suggestions are displayed and applied
            </div>
            <div class="ai-settings-control">
              <select class="ai-settings-select" data-setting="enhancementMode">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          
          <div class="ai-settings-group">
            <label class="ai-settings-label">Show Suggestions</label>
            <div class="ai-settings-description">
              Display enhancement suggestions while typing
            </div>
            <div class="ai-settings-control">
              <div class="ai-settings-toggle" data-setting="showSuggestions">
              </div>
            </div>
          </div>
          
          <div class="ai-settings-group">
            <label class="ai-settings-label">Auto-apply Templates</label>
            <div class="ai-settings-description">
              Automatically apply template suggestions
            </div>
            <div class="ai-settings-control">
              <div class="ai-settings-toggle" data-setting="autoApplyTemplates">
              </div>
            </div>
          </div>
          
          <div class="ai-settings-group">
            <label class="ai-settings-label">Keyboard Shortcut</label>
            <div class="ai-settings-description">
              Shortcut to trigger enhancement (e.g., Ctrl+Shift+E)
            </div>
            <div class="ai-settings-control">
              <input type="text" class="ai-settings-input" data-setting="shortcutKey" 
                     placeholder="Ctrl+Shift+E">
            </div>
          </div>
        </div>
      </div>
      
      <div class="ai-panel-footer">
        <button class="ai-panel-button secondary" data-action="export">
          Export Settings
        </button>
        <button class="ai-panel-button primary" data-action="save">
          Save Changes
        </button>
      </div>
    `;
  }

  /**
   * Sets up event listeners for the panel
   */
  setupEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', () => {
      this.hide();
    });

    // Panel hover tracking
    this.panel.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.panel.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });

    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    // Template filter
    const templateFilter = this.panel.querySelector('.ai-templates-filter');
    templateFilter.addEventListener('change', (e) => {
      this.filterTemplates(e.target.value);
    });

    // Settings controls
    this.setupSettingsListeners();

    // Footer buttons
    this.footer.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action]');
      if (button) {
        this.handleAction(button.dataset.action);
      }
    });

    // Keyboard navigation
    this.panel.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Document click to hide
    document.addEventListener('click', (e) => {
      if (this.isVisible && !this.panel.contains(e.target)) {
        setTimeout(() => {
          if (!this.isHovered) {
            this.hide();
          }
        }, 100);
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  /**
   * Sets up settings control listeners
   */
  setupSettingsListeners() {
    // Toggle switches
    const toggles = this.panel.querySelectorAll('.ai-settings-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const setting = toggle.dataset.setting;
        const isActive = toggle.classList.contains('active');
        this.updateSetting(setting, !isActive);
        toggle.classList.toggle('active', !isActive);
      });
    });

    // Select dropdowns
    const selects = this.panel.querySelectorAll('.ai-settings-select');
    selects.forEach(select => {
      select.addEventListener('change', (e) => {
        this.updateSetting(select.dataset.setting, e.target.value);
      });
    });

    // Input fields
    const inputs = this.panel.querySelectorAll('.ai-settings-input');
    inputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateSetting(input.dataset.setting, e.target.value);
      });
    });
  }

  /**
   * Shows the panel with suggestions
   * @param {Array} suggestions - Array of suggestion objects
   * @param {string} defaultTab - Default tab to show
   */
  show(suggestions = [], defaultTab = 'suggestions') {
    this.suggestions = suggestions;
    this.isVisible = true;
    
    // Update content
    this.updateSuggestions();
    this.updateTemplates();
    this.updateSettings();
    
    // Switch to requested tab
    this.switchTab(defaultTab);
    
    // Show panel
    this.panel.classList.add('visible');
    
    this.logEvent('panel_shown', { tab: defaultTab });
  }

  /**
   * Hides the panel
   */
  hide() {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    this.panel.classList.remove('visible');
    
    this.logEvent('panel_hidden');
  }

  /**
   * Toggles panel visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(this.suggestions);
    }
  }

  /**
   * Switches to a different tab
   * @param {string} tabName - Tab name to switch to
   */
  switchTab(tabName) {
    this.currentTab = tabName;
    
    // Update tab buttons
    this.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab content
    this.tabContents.forEach(content => {
      content.classList.toggle('active', content.dataset.content === tabName);
    });
    
    // Load content if needed
    if (tabName === 'templates' && this.templates.length === 0) {
      this.loadTemplates();
    }
    
    this.logEvent('tab_switched', { tab: tabName });
  }

  /**
   * Updates the suggestions display
   */
  updateSuggestions() {
    const container = this.panel.querySelector('.ai-suggestions-list');
    
    if (this.suggestions.length === 0) {
      container.innerHTML = this.getEmptyStateHTML('suggestions');
      return;
    }
    
    container.innerHTML = '';
    
    this.suggestions.forEach((suggestion, index) => {
      const suggestionElement = this.createSuggestionCard(suggestion, index);
      container.appendChild(suggestionElement);
    });
  }

  /**
   * Creates a suggestion card element
   * @param {Object} suggestion - Suggestion object
   * @param {number} index - Suggestion index
   * @returns {HTMLElement} Suggestion card element
   */
  createSuggestionCard(suggestion, index) {
    const card = document.createElement('div');
    card.className = 'ai-suggestion-card';
    card.dataset.suggestionId = suggestion.id;
    card.dataset.index = index;
    
    const priorityClass = this.getPriorityClass(suggestion.priority);
    const previewText = suggestion.previewText || suggestion.description;
    
    card.innerHTML = `
      <div class="ai-suggestion-header">
        <div class="ai-suggestion-priority ${priorityClass}"></div>
        <div class="ai-suggestion-info">
          <div class="ai-suggestion-title">${this.escapeHtml(suggestion.title)}</div>
          <div class="ai-suggestion-type">${suggestion.type || 'Enhancement'}</div>
        </div>
      </div>
      <div class="ai-suggestion-description">
        ${this.escapeHtml(suggestion.description)}
      </div>
      ${previewText ? `
        <div class="ai-suggestion-preview">
          ${this.escapeHtml(previewText)}
        </div>
      ` : ''}
      <div class="ai-suggestion-actions">
        <button class="ai-suggestion-btn primary" data-action="apply">
          Apply
        </button>
        <button class="ai-suggestion-btn secondary" data-action="preview">
          Preview
        </button>
      </div>
    `;
    
    // Add event listeners
    const applyBtn = card.querySelector('[data-action="apply"]');
    const previewBtn = card.querySelector('[data-action="preview"]');
    
    applyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.applySuggestion(suggestion, index);
    });
    
    previewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.previewSuggestion(suggestion, index);
    });
    
    return card;
  }

  /**
   * Updates the templates display
   */
  updateTemplates() {
    const container = this.panel.querySelector('.ai-templates-grid');
    
    if (this.templates.length === 0) {
      container.innerHTML = this.getEmptyStateHTML('templates');
      return;
    }
    
    container.innerHTML = '';
    
    this.templates.forEach(template => {
      const templateElement = this.createTemplateCard(template);
      container.appendChild(templateElement);
    });
  }

  /**
   * Creates a template card element
   * @param {Object} template - Template object
   * @returns {HTMLElement} Template card element
   */
  createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'ai-template-card';
    card.dataset.templateId = template.id;
    
    card.innerHTML = `
      <div class="ai-template-header">
        <div class="ai-template-icon">${this.getCategoryIcon(template.category)}</div>
        <div class="ai-template-name">${this.escapeHtml(template.name)}</div>
        <div class="ai-template-category">${template.category}</div>
      </div>
      <div class="ai-template-description">
        ${this.escapeHtml(template.description)}
      </div>
    `;
    
    card.addEventListener('click', () => {
      this.applyTemplate(template);
    });
    
    return card;
  }

  /**
   * Updates the settings display
   */
  updateSettings() {
    // Update toggle states
    const toggles = this.panel.querySelectorAll('.ai-settings-toggle');
    toggles.forEach(toggle => {
      const setting = toggle.dataset.setting;
      const value = this.settings[setting];
      toggle.classList.toggle('active', !!value);
    });
    
    // Update select values
    const selects = this.panel.querySelectorAll('.ai-settings-select');
    selects.forEach(select => {
      const setting = select.dataset.setting;
      const value = this.settings[setting];
      if (value !== undefined) {
        select.value = value;
      }
    });
    
    // Update input values
    const inputs = this.panel.querySelectorAll('.ai-settings-input');
    inputs.forEach(input => {
      const setting = input.dataset.setting;
      const value = this.settings[setting];
      if (value !== undefined) {
        input.value = value;
      }
    });
  }

  /**
   * Loads templates from the template manager
   */
  async loadTemplates() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getTemplates' });
      if (response.success) {
        this.processTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  }

  /**
   * Processes and organizes templates
   * @param {Object} templatesData - Templates data from storage
   */
  processTemplates(templatesData) {
    this.templates = [];
    
    // Convert templates object to array
    Object.values(templatesData).forEach(template => {
      if (template.name && template.content) {
        this.templates.push(template);
      }
    });
    
    // Sort by priority and name
    this.templates.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return a.name.localeCompare(b.name);
    });
    
    this.updateTemplates();
  }

  /**
   * Filters templates by category
   * @param {string} category - Category to filter by
   */
  filterTemplates(category) {
    const cards = this.panel.querySelectorAll('.ai-template-card');
    
    cards.forEach(card => {
      const templateId = card.dataset.templateId;
      const template = this.templates.find(t => t.id === templateId);
      
      if (category === 'all' || !template || template.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /**
   * Applies a suggestion
   * @param {Object} suggestion - Suggestion to apply
   * @param {number} index - Suggestion index
   */
  applySuggestion(suggestion, index) {
    if (this.onSuggestionApplied) {
      // Find the current input element
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'TEXTAREA' || 
                           activeElement.tagName === 'INPUT' || 
                           activeElement.contentEditable === 'true')) {
        this.onSuggestionApplied(suggestion, activeElement);
        
        // Mark as applied
        const card = this.panel.querySelector(`[data-index="${index}"]`);
        if (card) {
          card.classList.add('applied');
        }
        
        this.logEvent('suggestion_applied', {
          suggestionId: suggestion.id,
          type: suggestion.type,
          index
        });
      }
    }
  }

  /**
   * Previews a suggestion
   * @param {Object} suggestion - Suggestion to preview
   * @param {number} index - Suggestion index
   */
  previewSuggestion(suggestion, index) {
    // Show preview in the suggestion card
    const card = this.panel.querySelector(`[data-index="${index}"]`);
    if (card) {
      const previewElement = card.querySelector('.ai-suggestion-preview');
      if (previewElement) {
        previewElement.style.maxHeight = 'none';
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    
    this.logEvent('suggestion_previewed', {
      suggestionId: suggestion.id,
      type: suggestion.type,
      index
    });
  }

  /**
   * Applies a template
   * @param {Object} template - Template to apply
   */
  applyTemplate(template) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || 
                         activeElement.tagName === 'INPUT' || 
                         activeElement.contentEditable === 'true')) {
      
      const currentText = activeElement.value || activeElement.textContent || '';
      
      // Create a template suggestion object
      const templateSuggestion = {
        id: `template_${template.id}`,
        type: 'template',
        title: `Apply ${template.name} Template`,
        description: template.description,
        previewText: template.content.replace(/\{prompt\}/g, currentText),
        action: 'replace',
        template: template
      };
      
      if (this.onSuggestionApplied) {
        this.onSuggestionApplied(templateSuggestion, activeElement);
      }
      
      this.logEvent('template_applied', {
        templateId: template.id,
        category: template.category
      });
    }
  }

  /**
   * Updates a setting value
   * @param {string} setting - Setting name
   * @param {*} value - Setting value
   */
  updateSetting(setting, value) {
    this.settings[setting] = value;
    
    // Send to background script
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: { [setting]: value }
    });
    
    this.logEvent('setting_changed', { setting, value });
  }

  /**
   * Handles action button clicks
   * @param {string} action - Action type
   */
  handleAction(action) {
    switch (action) {
      case 'save':
        this.saveSettings();
        break;
      case 'export':
        this.exportSettings();
        break;
      case 'import':
        this.importSettings();
        break;
    }
  }

  /**
   * Saves current settings
   */
  saveSettings() {
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: this.settings
    }).then(() => {
      this.showNotification('Settings saved successfully');
    });
  }

  /**
   * Exports settings to file
   */
  exportSettings() {
    const data = {
      settings: this.settings,
      templates: this.templates.filter(t => t.isUserCreated),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-prompt-enhancer-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    this.logEvent('settings_exported');
  }

  /**
   * Handles keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboardNavigation(event) {
    if (event.key === 'Escape') {
      this.hide();
      event.preventDefault();
    } else if (event.key === 'Tab' && event.ctrlKey) {
      // Cycle through tabs
      const currentIndex = Array.from(this.tabs).findIndex(tab => 
        tab.classList.contains('active'));
      const nextIndex = (currentIndex + 1) % this.tabs.length;
      this.switchTab(this.tabs[nextIndex].dataset.tab);
      event.preventDefault();
    }
  }

  /**
   * Handles window resize
   */
  handleResize() {
    // Adjust panel width on mobile
    if (window.innerWidth < 768) {
      this.panel.style.width = '100vw';
    } else {
      this.panel.style.width = '380px';
    }
  }

  /**
   * Applies platform-specific theme
   */
  applyPlatformTheme() {
    const platform = window.PlatformDetector?.detectPlatform();
    if (platform) {
      this.panel.className = `ai-prompt-enhancer-panel ${platform}-theme`;
    }
  }

  /**
   * Gets CSS class for priority level
   * @param {number} priority - Priority value
   * @returns {string} CSS class
   */
  getPriorityClass(priority) {
    if (priority >= 80) return 'high';
    if (priority >= 50) return 'medium';
    return 'low';
  }

  /**
   * Gets icon for template category
   * @param {string} category - Template category
   * @returns {string} Icon character
   */
  getCategoryIcon(category) {
    const icons = {
      general: '💬',
      technical: '💻',
      creative: '🎨',
      analysis: '📊',
      business: '💼',
      academic: '🎓'
    };
    return icons[category] || '📝';
  }

  /**
   * Returns empty state HTML
   * @param {string} type - Type of empty state
   * @returns {string} Empty state HTML
   */
  getEmptyStateHTML(type) {
    const states = {
      suggestions: `
        <div class="ai-panel-empty">
          <div class="ai-panel-empty-icon">💡</div>
          <div class="ai-panel-empty-title">No Suggestions Available</div>
          <div class="ai-panel-empty-description">
            Start typing in an input field to see enhancement suggestions.
          </div>
        </div>
      `,
      templates: `
        <div class="ai-panel-empty">
          <div class="ai-panel-empty-icon">📝</div>
          <div class="ai-panel-empty-title">Loading Templates</div>
          <div class="ai-panel-empty-description">
            Templates are being loaded from storage.
          </div>
        </div>
      `
    };
    
    return states[type] || states.suggestions;
  }

  /**
   * Shows a notification message
   * @param {string} message - Notification message
   */
  showNotification(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'ai-panel-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 2147483647;
      font-size: 14px;
      font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Checks if panel is currently hovered
   * @returns {boolean} True if hovered
   */
  isHovered() {
    return this.isHovered;
  }

  /**
   * Updates panel settings
   * @param {Object} newSettings - New settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.updateSettings();
    this.applyPlatformTheme();
  }

  /**
   * Logs analytics events
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  logEvent(event, data = {}) {
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        action: 'logAnalytics',
        event: `panel_${event}`,
        data: {
          ...data,
          platform: window.PlatformDetector?.detectPlatform(),
          timestamp: Date.now()
        }
      });
    }
  }

  /**
   * Escapes HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Cleans up the panel
   */
  cleanup() {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
    
    this.panel = null;
    this.suggestions = [];
    this.templates = [];
    this.isVisible = false;
  }
}

// Make SuggestionPanel available globally
window.SuggestionPanel = SuggestionPanel;