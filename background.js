// Background service worker for AI Prompt Enhancer
// Handles extension lifecycle, storage management, and cross-tab communication

class BackgroundService {
  constructor() {
    this.initializeExtension();
  }

  initializeExtension() {
    // Set up extension event listeners
    chrome.runtime.onInstalled.addListener(this.handleInstall.bind(this));
    chrome.runtime.onStartup.addListener(this.handleStartup.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
  }

  async handleInstall(details) {
    console.log('AI Prompt Enhancer installed:', details.reason);
    
    if (details.reason === 'install') {
      await this.setDefaultSettings();
      await this.loadDefaultTemplates();
    } else if (details.reason === 'update') {
      await this.handleUpdate(details.previousVersion);
    }
  }

  handleStartup() {
    console.log('AI Prompt Enhancer started');
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case 'updateSettings':
          await this.updateSettings(request.settings);
          sendResponse({ success: true });
          break;

        case 'getTemplates':
          const templates = await this.getTemplates();
          sendResponse({ success: true, data: templates });
          break;

        case 'saveTemplate':
          await this.saveTemplate(request.template);
          sendResponse({ success: true });
          break;

        case 'getPlatformConfig':
          const config = await this.getPlatformConfig(request.platform);
          sendResponse({ success: true, data: config });
          break;

        case 'logAnalytics':
          await this.logAnalytics(request.event, request.data);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background service error:', error);
      sendResponse({ success: false, error: error.message });
    }

    return true; // Keep message channel open for async response
  }

  handleTabActivated(activeInfo) {
    // Update extension state when user switches tabs
    this.updateExtensionState(activeInfo.tabId);
  }

  handleTabUpdated(tabId, changeInfo, tab) {
    // React to tab updates (URL changes, loading states)
    if (changeInfo.status === 'complete' && tab.url) {
      this.updateExtensionState(tabId, tab.url);
    }
  }

  async setDefaultSettings() {
    const defaultSettings = {
      enabled: true,
      enhancementMode: 'automatic', // 'automatic', 'manual', 'disabled'
      showSuggestions: true,
      autoApplyTemplates: false,
      darkMode: 'auto', // 'auto', 'light', 'dark'
      shortcutKey: 'Ctrl+Shift+E',
      platforms: {
        chatgpt: { enabled: true, customSelectors: '' },
        claude: { enabled: true, customSelectors: '' },
        gemini: { enabled: true, customSelectors: '' },
        github: { enabled: true, customSelectors: '' },
        bing: { enabled: true, customSelectors: '' },
        perplexity: { enabled: true, customSelectors: '' }
      },
      privacy: {
        localProcessingOnly: true,
        storeAnalytics: false,
        shareUsageData: false
      }
    };

    await chrome.storage.sync.set({ settings: defaultSettings });
    console.log('Default settings initialized');
  }

  async loadDefaultTemplates() {
    // Load default templates from data/templates.json
    try {
      const response = await fetch(chrome.runtime.getURL('data/templates.json'));
      const defaultTemplates = await response.json();
      await chrome.storage.local.set({ templates: defaultTemplates });
      console.log('Default templates loaded');
    } catch (error) {
      console.error('Failed to load default templates:', error);
    }
  }

  async getSettings() {
    const result = await chrome.storage.sync.get('settings');
    return result.settings || {};
  }

  async updateSettings(newSettings) {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await chrome.storage.sync.set({ settings: updatedSettings });
    
    // Notify all content scripts of settings change
    this.broadcastMessage({ action: 'settingsUpdated', settings: updatedSettings });
  }

  async getTemplates() {
    const result = await chrome.storage.local.get('templates');
    return result.templates || {};
  }

  async saveTemplate(template) {
    const templates = await this.getTemplates();
    templates[template.id] = template;
    await chrome.storage.local.set({ templates });
  }

  async getPlatformConfig(platform) {
    try {
      const response = await fetch(chrome.runtime.getURL('data/platforms.json'));
      const configs = await response.json();
      return configs[platform] || null;
    } catch (error) {
      console.error('Failed to load platform config:', error);
      return null;
    }
  }

  async logAnalytics(event, data) {
    const settings = await this.getSettings();
    if (!settings.privacy?.storeAnalytics) return;

    // Local analytics storage only
    const analytics = await chrome.storage.local.get('analytics') || { analytics: [] };
    analytics.analytics.push({
      event,
      data,
      timestamp: Date.now(),
      url: data.url ? new URL(data.url).origin : null // Store only origin for privacy
    });

    // Keep only last 1000 events
    if (analytics.analytics.length > 1000) {
      analytics.analytics = analytics.analytics.slice(-1000);
    }

    await chrome.storage.local.set(analytics);
  }

  async updateExtensionState(tabId, url = null) {
    if (!url) {
      try {
        const tab = await chrome.tabs.get(tabId);
        url = tab.url;
      } catch (error) {
        return; // Tab might be closed
      }
    }

    // Check if current tab is a supported platform
    const supportedPlatforms = [
      'chat.openai.com',
      'claude.ai',
      'gemini.google.com',
      'bard.google.com',
      'copilot.microsoft.com',
      'perplexity.ai',
      'github.com'
    ];

    const isSupported = supportedPlatforms.some(domain => url?.includes(domain));
    
    // Update extension icon based on platform support
    chrome.action.setIcon({
      path: isSupported ? {
        16: 'icons/icon16.png',
        32: 'icons/icon32.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png'
      } : {
        16: 'icons/icon16-disabled.png',
        32: 'icons/icon32-disabled.png',
        48: 'icons/icon48-disabled.png',
        128: 'icons/icon128-disabled.png'
      },
      tabId: tabId
    });
  }

  async broadcastMessage(message) {
    // Send message to all content scripts
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (error) {
        // Tab might not have content script or be inactive
      }
    }
  }

  async handleUpdate(previousVersion) {
    console.log(`Extension updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
    // Handle any migration logic here
  }
}

// Initialize the background service
new BackgroundService();