// Popup script for AI Prompt Enhancer
// Handles the extension popup interface and user interactions

class PopupController {
  constructor() {
    this.currentTab = null;
    this.settings = {};
    this.platformInfo = {};
    this.stats = {
      suggestionsCount: 0,
      enhancementsCount: 0,
      templatesCount: 0
    };
    this.recentActivity = [];
    
    this.initialize();
  }

  /**
   * Initializes the popup controller
   */
  async initialize() {
    try {
      // Load current state
      await this.loadCurrentState();
      
      // Update UI elements
      this.updateUI();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Load recent activity
      await this.loadRecentActivity();
      
      console.log('Popup initialized successfully');
    } catch (error) {
      console.error('Failed to initialize popup:', error);
      this.showError('Failed to initialize extension popup');
    }
  }

  /**
   * Loads the current state from background script and active tab
   */
  async loadCurrentState() {
    try {
      // Get current tab info
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tabs[0];

      // Get extension settings
      const settingsResponse = await this.sendMessage({ action: 'getSettings' });
      this.settings = settingsResponse.success ? settingsResponse.data : {};

      // Get platform info from content script
      if (this.currentTab?.id) {
        try {
          const platformResponse = await chrome.tabs.sendMessage(this.currentTab.id, {
            action: 'getPageInfo'
          });
          this.platformInfo = platformResponse.success ? platformResponse.data : {};
        } catch (error) {
          // Content script might not be loaded yet
          this.platformInfo = { platform: null, isEnabled: false };
        }
      }

      // Get templates count
      const templatesResponse = await this.sendMessage({ action: 'getTemplates' });
      if (templatesResponse.success) {
        this.stats.templatesCount = Object.keys(templatesResponse.data).length;
      }

      // Load analytics data
      await this.loadAnalytics();

    } catch (error) {
      console.error('Error loading current state:', error);
    }
  }

  /**
   * Loads analytics data for stats display
   */
  async loadAnalytics() {
    try {
      const analytics = await chrome.storage.local.get('analytics');
      if (analytics.analytics) {
        const events = analytics.analytics;
        
        // Count suggestions shown
        this.stats.suggestionsCount = events.filter(e => 
          e.event.includes('suggestion') || e.event.includes('overlay_shown')
        ).length;
        
        // Count enhancements applied
        this.stats.enhancementsCount = events.filter(e => 
          e.event.includes('applied') || e.event.includes('template_applied')
        ).length;
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  /**
   * Updates all UI elements with current state
   */
  updateUI() {
    this.updateStatus();
    this.updatePlatformInfo();
    this.updateStats();
    this.updateSettings();
  }

  /**
   * Updates the extension status display
   */
  updateStatus() {
    const statusIcon = document.getElementById('status-icon');
    const statusValue = document.getElementById('status-value');
    const extensionToggle = document.getElementById('extension-toggle');

    if (this.settings.enabled) {
      if (this.platformInfo.isEnabled) {
        statusIcon.className = 'status-icon';
        statusValue.textContent = 'Active';
        statusValue.className = 'status-value success';
      } else if (this.platformInfo.platform) {
        statusIcon.className = 'status-icon warning';
        statusValue.textContent = 'Disabled for this platform';
        statusValue.className = 'status-value';
      } else {
        statusIcon.className = 'status-icon warning';
        statusValue.textContent = 'Platform not supported';
        statusValue.className = 'status-value';
      }
    } else {
      statusIcon.className = 'status-icon disabled';
      statusValue.textContent = 'Disabled';
      statusValue.className = 'status-value error';
    }

    extensionToggle.checked = this.settings.enabled || false;
  }

  /**
   * Updates the platform information display
   */
  updatePlatformInfo() {
    const platformIcon = document.getElementById('platform-icon');
    const platformValue = document.getElementById('platform-value');

    if (this.platformInfo.platform) {
      const platformNames = {
        chatgpt: 'ChatGPT',
        claude: 'Claude',
        gemini: 'Gemini',
        github: 'GitHub Copilot',
        bing: 'Bing Copilot',
        perplexity: 'Perplexity'
      };

      const platformIcons = {
        chatgpt: '🤖',
        claude: '🤖',
        gemini: '🤖',
        github: '🐙',
        bing: '🔍',
        perplexity: '🔍'
      };

      platformIcon.textContent = platformIcons[this.platformInfo.platform] || '🌐';
      platformValue.textContent = platformNames[this.platformInfo.platform] || 'Unknown Platform';
    } else {
      platformIcon.textContent = '🌐';
      platformValue.textContent = 'No supported platform detected';
    }
  }

  /**
   * Updates the statistics display
   */
  updateStats() {
    document.getElementById('suggestions-count').textContent = this.stats.suggestionsCount;
    document.getElementById('enhancements-count').textContent = this.stats.enhancementsCount;
    document.getElementById('templates-count').textContent = this.stats.templatesCount;
  }

  /**
   * Updates the settings controls
   */
  updateSettings() {
    const showSuggestions = document.getElementById('show-suggestions');
    const autoEnhance = document.getElementById('auto-enhance');

    showSuggestions.checked = this.settings.showSuggestions !== false;
    autoEnhance.checked = this.settings.autoApplyTemplates === true;
  }

  /**
   * Sets up all event listeners
   */
  setupEventListeners() {
    // Extension toggle
    document.getElementById('extension-toggle').addEventListener('change', (e) => {
      this.toggleExtension(e.target.checked);
    });

    // Quick action buttons
    document.getElementById('enhance-current').addEventListener('click', () => {
      this.enhanceCurrentPrompt();
    });

    document.getElementById('open-templates').addEventListener('click', () => {
      this.openTemplates();
    });

    document.getElementById('open-panel').addEventListener('click', () => {
      this.openPanel();
    });

    // Settings checkboxes
    document.getElementById('show-suggestions').addEventListener('change', (e) => {
      this.updateSetting('showSuggestions', e.target.checked);
    });

    document.getElementById('auto-enhance').addEventListener('change', (e) => {
      this.updateSetting('autoApplyTemplates', e.target.checked);
    });

    // Footer buttons
    document.getElementById('open-options').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
      window.close();
    });

    document.getElementById('view-help').addEventListener('click', () => {
      this.openHelp();
    });

    document.getElementById('report-issue').addEventListener('click', () => {
      this.reportIssue();
    });

    // Recent activity
    document.getElementById('clear-recent').addEventListener('click', () => {
      this.clearRecentActivity();
    });
  }

  /**
   * Toggles the extension on/off
   * @param {boolean} enabled - Whether to enable the extension
   */
  async toggleExtension(enabled) {
    try {
      await this.sendMessage({
        action: 'updateSettings',
        settings: { enabled }
      });

      this.settings.enabled = enabled;
      this.updateStatus();

      // Send message to content script
      if (this.currentTab?.id) {
        try {
          await chrome.tabs.sendMessage(this.currentTab.id, {
            action: 'toggleExtension'
          });
        } catch (error) {
          // Content script might not be loaded
        }
      }

      this.addRecentActivity(enabled ? 'Extension enabled' : 'Extension disabled');
    } catch (error) {
      console.error('Failed to toggle extension:', error);
      this.showError('Failed to update extension status');
    }
  }

  /**
   * Enhances the current prompt
   */
  async enhanceCurrentPrompt() {
    if (!this.currentTab?.id) {
      this.showError('No active tab found');
      return;
    }

    try {
      // Send message to content script to trigger enhancement
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'enhanceCurrentPrompt'
      });

      this.addRecentActivity('Enhanced current prompt');
      window.close();
    } catch (error) {
      console.error('Failed to enhance current prompt:', error);
      this.showError('Failed to enhance prompt. Make sure you\'re on a supported platform.');
    }
  }

  /**
   * Opens the templates panel
   */
  async openTemplates() {
    if (!this.currentTab?.id) {
      this.showError('No active tab found');
      return;
    }

    try {
      // Send message to content script to open templates
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'openTemplates'
      });

      this.addRecentActivity('Opened templates panel');
      window.close();
    } catch (error) {
      console.error('Failed to open templates:', error);
      this.showError('Failed to open templates. Make sure you\'re on a supported platform.');
    }
  }

  /**
   * Opens the enhancement panel
   */
  async openPanel() {
    if (!this.currentTab?.id) {
      this.showError('No active tab found');
      return;
    }

    try {
      // Send message to content script to open panel
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'openPanel'
      });

      this.addRecentActivity('Opened enhancement panel');
      window.close();
    } catch (error) {
      console.error('Failed to open panel:', error);
      this.showError('Failed to open panel. Make sure you\'re on a supported platform.');
    }
  }

  /**
   * Updates a setting value
   * @param {string} setting - Setting name
   * @param {*} value - Setting value
   */
  async updateSetting(setting, value) {
    try {
      await this.sendMessage({
        action: 'updateSettings',
        settings: { [setting]: value }
      });

      this.settings[setting] = value;
      this.addRecentActivity(`Updated ${setting} setting`);
    } catch (error) {
      console.error(`Failed to update ${setting}:`, error);
      this.showError(`Failed to update ${setting} setting`);
    }
  }

  /**
   * Opens the help documentation
   */
  openHelp() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('help.html')
    });
    window.close();
  }

  /**
   * Opens the issue reporting page
   */
  reportIssue() {
    chrome.tabs.create({
      url: 'https://github.com/Dev-NotAqua/ai-prompt-enhancer/issues/new'
    });
    window.close();
  }

  /**
   * Loads recent activity from storage
   */
  async loadRecentActivity() {
    try {
      const result = await chrome.storage.local.get('recentActivity');
      this.recentActivity = result.recentActivity || [];
      this.updateRecentActivityDisplay();
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  }

  /**
   * Adds a new recent activity item
   * @param {string} activity - Activity description
   */
  async addRecentActivity(activity) {
    const item = {
      text: activity,
      timestamp: Date.now()
    };

    this.recentActivity.unshift(item);
    
    // Keep only last 10 items
    this.recentActivity = this.recentActivity.slice(0, 10);

    try {
      await chrome.storage.local.set({ recentActivity: this.recentActivity });
      this.updateRecentActivityDisplay();
    } catch (error) {
      console.error('Failed to save recent activity:', error);
    }
  }

  /**
   * Updates the recent activity display
   */
  updateRecentActivityDisplay() {
    const recentList = document.getElementById('recent-list');
    
    if (this.recentActivity.length === 0) {
      recentList.innerHTML = `
        <div class="recent-empty">
          No recent activity
        </div>
      `;
      return;
    }

    recentList.innerHTML = '';
    
    this.recentActivity.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'recent-item';
      
      const timeAgo = this.getTimeAgo(item.timestamp);
      
      itemElement.innerHTML = `
        <div class="recent-icon">•</div>
        <div class="recent-text">${this.escapeHtml(item.text)}</div>
        <div class="recent-time">${timeAgo}</div>
      `;
      
      recentList.appendChild(itemElement);
    });
  }

  /**
   * Clears recent activity
   */
  async clearRecentActivity() {
    try {
      this.recentActivity = [];
      await chrome.storage.local.set({ recentActivity: [] });
      this.updateRecentActivityDisplay();
    } catch (error) {
      console.error('Failed to clear recent activity:', error);
    }
  }

  /**
   * Gets a human-readable time ago string
   * @param {number} timestamp - Timestamp in milliseconds
   * @returns {string} Time ago string
   */
  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  }

  /**
   * Shows an error message
   * @param {string} message - Error message
   */
  showError(message) {
    // Create temporary error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid #dc2626;
      font-size: 13px;
      z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  }

  /**
   * Sends a message to the background script
   * @param {Object} message - Message to send
   * @returns {Promise} Promise that resolves with the response
   */
  sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve);
    });
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
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});