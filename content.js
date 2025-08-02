// Content script for AI Prompt Enhancer
// Main entry point for page interaction and enhancement features

class AIPromptEnhancer {
  constructor() {
    this.isInitialized = false;
    this.currentPlatform = null;
    this.settings = {};
    this.templates = {};
    this.platformConfig = null;
    this.analyzer = null;
    this.enhancer = null;
    this.overlay = null;
    this.panel = null;
    this.observers = [];

    this.initialize();
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('AI Prompt Enhancer: Initializing content script');
      
      // Wait for page to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }

      // Detect current platform
      this.currentPlatform = PlatformDetector.detectPlatform();
      if (!this.currentPlatform) {
        console.log('AI Prompt Enhancer: Platform not supported');
        return;
      }

      console.log(`AI Prompt Enhancer: Detected platform: ${this.currentPlatform}`);

      // Load settings and configuration
      await this.loadConfiguration();

      // Check if extension is enabled for this platform
      if (!this.isPlatformEnabled()) {
        console.log(`AI Prompt Enhancer: Disabled for platform: ${this.currentPlatform}`);
        return;
      }

      // Initialize core components
      this.initializeComponents();

      // Set up page monitoring
      this.setupPageMonitoring();

      // Listen for messages from background script
      this.setupMessageListener();

      // Set up keyboard shortcuts
      this.setupKeyboardShortcuts();

      this.isInitialized = true;
      console.log('AI Prompt Enhancer: Successfully initialized');

      // Log initialization analytics
      this.logEvent('extension_initialized', {
        platform: this.currentPlatform,
        url: window.location.origin
      });

    } catch (error) {
      console.error('AI Prompt Enhancer: Initialization failed:', error);
    }
  }

  async loadConfiguration() {
    try {
      // Load settings from background
      const settingsResponse = await this.sendMessage({ action: 'getSettings' });
      this.settings = settingsResponse.success ? settingsResponse.data : {};

      // Load templates
      const templatesResponse = await this.sendMessage({ action: 'getTemplates' });
      this.templates = templatesResponse.success ? templatesResponse.data : {};

      // Load platform-specific configuration
      const configResponse = await this.sendMessage({ 
        action: 'getPlatformConfig', 
        platform: this.currentPlatform 
      });
      this.platformConfig = configResponse.success ? configResponse.data : null;

    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  }

  isPlatformEnabled() {
    return this.settings.enabled && 
           this.settings.platforms?.[this.currentPlatform]?.enabled !== false;
  }

  initializeComponents() {
    // Initialize analyzer
    this.analyzer = new PromptAnalyzer(this.settings);

    // Initialize enhancer
    this.enhancer = new PromptEnhancer(this.templates, this.settings);

    // Initialize UI components
    this.overlay = new EnhancementOverlay(this.settings);
    this.panel = new SuggestionPanel(this.settings);

    // Connect components
    this.analyzer.onAnalysisComplete = (analysis) => {
      this.handleAnalysisComplete(analysis);
    };

    this.enhancer.onSuggestionsReady = (suggestions) => {
      this.handleSuggestionsReady(suggestions);
    };

    this.overlay.onEnhancementRequested = (text, type) => {
      this.handleEnhancementRequest(text, type);
    };

    this.panel.onSuggestionApplied = (suggestion, inputElement) => {
      this.applySuggestion(suggestion, inputElement);
    };
  }

  setupPageMonitoring() {
    // Find and monitor input fields based on platform configuration
    this.monitorInputFields();

    // Watch for dynamic content changes
    this.setupMutationObserver();

    // Monitor for navigation changes (SPA routing)
    this.setupNavigationMonitoring();
  }

  monitorInputFields() {
    if (!this.platformConfig?.selectors) return;

    const selectors = [
      ...this.platformConfig.selectors.input,
      ...this.platformConfig.selectors.textarea,
      ...(this.settings.platforms?.[this.currentPlatform]?.customSelectors?.split(',') || [])
    ].filter(Boolean);

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector.trim());
      elements.forEach(element => this.attachToInputField(element));
    });
  }

  attachToInputField(inputElement) {
    if (inputElement.dataset.aiPromptEnhancerAttached) return;
    inputElement.dataset.aiPromptEnhancerAttached = 'true';

    // Add event listeners
    let debounceTimer;
    const handleInput = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.analyzeInput(inputElement);
      }, 300); // Debounce analysis
    };

    inputElement.addEventListener('input', handleInput);
    inputElement.addEventListener('focus', () => this.handleInputFocus(inputElement));
    inputElement.addEventListener('blur', () => this.handleInputBlur(inputElement));

    // Show overlay for this input
    this.overlay.attachToInput(inputElement);

    console.log('AI Prompt Enhancer: Attached to input field');
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if new input fields were added
            this.monitorInputFields();
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  setupNavigationMonitoring() {
    // Monitor for SPA navigation
    let currentUrl = window.location.href;
    
    const checkUrlChange = () => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        this.handleNavigationChange();
      }
    };

    // Use multiple methods to detect navigation
    window.addEventListener('popstate', checkUrlChange);
    
    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkUrlChange, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkUrlChange, 0);
    };

    // Periodic check as fallback
    setInterval(checkUrlChange, 1000);
  }

  handleNavigationChange() {
    console.log('AI Prompt Enhancer: Navigation detected, re-initializing');
    
    // Clean up existing attachments
    this.cleanup();
    
    // Re-initialize after a short delay
    setTimeout(() => {
      this.monitorInputFields();
    }, 500);
  }

  analyzeInput(inputElement) {
    if (!this.analyzer || this.settings.enhancementMode === 'disabled') return;

    const text = inputElement.value || inputElement.textContent || '';
    if (text.trim().length < 10) return; // Skip very short inputs

    this.analyzer.analyze(text, {
      element: inputElement,
      platform: this.currentPlatform,
      context: this.getInputContext(inputElement)
    });
  }

  getInputContext(inputElement) {
    // Extract context from surrounding elements
    const context = {
      placeholder: inputElement.placeholder || '',
      label: this.findInputLabel(inputElement),
      previousMessages: this.getPreviousMessages(inputElement),
      pageTitle: document.title
    };

    return context;
  }

  findInputLabel(inputElement) {
    // Try to find associated label
    const id = inputElement.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent.trim();
    }

    // Look for parent/sibling labels
    const parent = inputElement.closest('div, fieldset, form');
    if (parent) {
      const label = parent.querySelector('label');
      if (label) return label.textContent.trim();
    }

    return '';
  }

  getPreviousMessages(inputElement) {
    // Platform-specific logic to extract conversation context
    if (!this.platformConfig?.selectors?.messages) return [];

    const messageElements = document.querySelectorAll(this.platformConfig.selectors.messages);
    const messages = Array.from(messageElements)
      .slice(-5) // Get last 5 messages for context
      .map(el => ({
        text: el.textContent.trim(),
        isUser: el.matches(this.platformConfig.selectors.userMessage || '')
      }));

    return messages;
  }

  handleAnalysisComplete(analysis) {
    if (analysis.suggestions.length > 0) {
      this.enhancer.generateSuggestions(analysis);
    }
  }

  handleSuggestionsReady(suggestions) {
    if (this.settings.showSuggestions && suggestions.length > 0) {
      this.overlay.showSuggestions(suggestions);
      
      if (this.settings.enhancementMode === 'automatic') {
        this.panel.show(suggestions);
      }
    }
  }

  handleEnhancementRequest(text, type) {
    this.enhancer.enhance(text, type);
  }

  applySuggestion(suggestion, inputElement) {
    if (!inputElement || !suggestion) return;

    const currentValue = inputElement.value || inputElement.textContent || '';
    let newValue;

    switch (suggestion.type) {
      case 'replacement':
        newValue = suggestion.text;
        break;
      case 'prefix':
        newValue = suggestion.text + ' ' + currentValue;
        break;
      case 'suffix':
        newValue = currentValue + ' ' + suggestion.text;
        break;
      case 'template':
        newValue = suggestion.text.replace('{prompt}', currentValue);
        break;
      default:
        newValue = suggestion.text;
    }

    // Apply the suggestion
    if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      inputElement.textContent = newValue;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Focus and position cursor at end
    inputElement.focus();
    if (inputElement.setSelectionRange) {
      inputElement.setSelectionRange(newValue.length, newValue.length);
    }

    // Log suggestion application
    this.logEvent('suggestion_applied', {
      type: suggestion.type,
      category: suggestion.category,
      platform: this.currentPlatform
    });

    // Hide suggestions after application
    this.overlay.hide();
    this.panel.hide();
  }

  handleInputFocus(inputElement) {
    if (this.settings.enhancementMode !== 'disabled') {
      this.overlay.show();
    }
  }

  handleInputBlur(inputElement) {
    // Hide suggestions after a delay to allow clicking
    setTimeout(() => {
      if (!this.overlay.isHovered() && !this.panel.isHovered()) {
        this.overlay.hide();
        this.panel.hide();
      }
    }, 200);
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep channel open for async response
    });
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'settingsUpdated':
          this.settings = message.settings;
          await this.handleSettingsUpdate();
          sendResponse({ success: true });
          break;

        case 'toggleExtension':
          await this.toggleExtension();
          sendResponse({ success: true });
          break;

        case 'getPageInfo':
          const info = this.getPageInfo();
          sendResponse({ success: true, data: info });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Content script message handling error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleSettingsUpdate() {
    // Reload configuration
    await this.loadConfiguration();

    // Update components with new settings
    if (this.analyzer) this.analyzer.updateSettings(this.settings);
    if (this.enhancer) this.enhancer.updateSettings(this.settings);
    if (this.overlay) this.overlay.updateSettings(this.settings);
    if (this.panel) this.panel.updateSettings(this.settings);

    // Re-evaluate platform enablement
    if (!this.isPlatformEnabled()) {
      this.cleanup();
    } else if (!this.isInitialized) {
      this.initialize();
    }
  }

  async toggleExtension() {
    const newEnabled = !this.settings.enabled;
    await this.sendMessage({
      action: 'updateSettings',
      settings: { enabled: newEnabled }
    });
  }

  getPageInfo() {
    return {
      platform: this.currentPlatform,
      url: window.location.href,
      title: document.title,
      inputFields: document.querySelectorAll('input, textarea, [contenteditable]').length,
      isEnabled: this.isPlatformEnabled()
    };
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Check for enhancement shortcut (default: Ctrl+Shift+E)
      if (this.isShortcutPressed(event, this.settings.shortcutKey)) {
        event.preventDefault();
        this.handleShortcutPressed();
      }
    });
  }

  isShortcutPressed(event, shortcut) {
    if (!shortcut) return false;

    const parts = shortcut.toLowerCase().split('+');
    const key = parts.pop();
    
    const ctrlPressed = parts.includes('ctrl') ? event.ctrlKey : !event.ctrlKey;
    const shiftPressed = parts.includes('shift') ? event.shiftKey : !event.shiftKey;
    const altPressed = parts.includes('alt') ? event.altKey : !event.altKey;
    const metaPressed = parts.includes('meta') ? event.metaKey : !event.metaKey;

    return ctrlPressed && shiftPressed && altPressed && metaPressed && 
           event.key.toLowerCase() === key;
  }

  handleShortcutPressed() {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || 
                         activeElement.tagName === 'INPUT' || 
                         activeElement.contentEditable === 'true')) {
      this.analyzeInput(activeElement);
      this.overlay.toggle();
    }
  }

  async sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }

  logEvent(event, data) {
    this.sendMessage({
      action: 'logAnalytics',
      event,
      data: { ...data, timestamp: Date.now() }
    });
  }

  cleanup() {
    // Remove observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Clean up UI components
    if (this.overlay) this.overlay.cleanup();
    if (this.panel) this.panel.cleanup();

    // Remove event listeners from input fields
    document.querySelectorAll('[data-ai-prompt-enhancer-attached]').forEach(element => {
      element.removeAttribute('data-ai-prompt-enhancer-attached');
    });

    this.isInitialized = false;
  }
}

// Initialize the extension when script loads
let aiPromptEnhancer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    aiPromptEnhancer = new AIPromptEnhancer();
  });
} else {
  aiPromptEnhancer = new AIPromptEnhancer();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (aiPromptEnhancer) {
    aiPromptEnhancer.cleanup();
  }
});