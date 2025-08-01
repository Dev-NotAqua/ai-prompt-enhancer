// Enhancement overlay component for AI Prompt Enhancer
// Provides non-intrusive suggestions and quick access to enhancement features

class EnhancementOverlay {
  constructor(settings = {}) {
    this.settings = settings;
    this.isVisible = false;
    this.isHovered = false;
    this.isMinimized = false;
    this.currentInputElement = null;
    this.currentAnalysis = null;
    this.suggestions = [];
    this.overlay = null;
    this.onEnhancementRequested = null;
    
    this.createOverlay();
    this.setupEventListeners();
  }

  /**
   * Creates the overlay DOM structure
   */
  createOverlay() {
    // Create main overlay container
    this.overlay = document.createElement('div');
    this.overlay.className = 'ai-prompt-enhancer-overlay';
    this.overlay.innerHTML = this.getOverlayHTML();
    
    // Add to page
    document.body.appendChild(this.overlay);
    
    // Get references to key elements
    this.container = this.overlay.querySelector('.ai-overlay-container');
    this.header = this.overlay.querySelector('.ai-overlay-header');
    this.scoreSection = this.overlay.querySelector('.ai-overlay-score');
    this.suggestionsSection = this.overlay.querySelector('.ai-overlay-suggestions');
    this.actionsSection = this.overlay.querySelector('.ai-overlay-actions');
    this.closeButton = this.overlay.querySelector('.ai-overlay-close');
    this.titleElement = this.overlay.querySelector('.ai-overlay-title');
    
    // Apply platform theme
    this.applyPlatformTheme();
  }

  /**
   * Returns the HTML structure for the overlay
   */
  getOverlayHTML() {
    return `
      <div class="ai-overlay-container hidden">
        <div class="ai-overlay-header">
          <div class="ai-overlay-icon">✨</div>
          <div class="ai-overlay-title">AI Prompt Enhancer</div>
          <button class="ai-overlay-close" aria-label="Close overlay">×</button>
        </div>
        
        <div class="ai-overlay-score">
          <div class="ai-score-circle needs-improvement">
            <span class="ai-score-number">--</span>
          </div>
          <div class="ai-score-text">
            <div class="ai-score-label">Prompt Quality</div>
            <div class="ai-score-value">Analyzing...</div>
          </div>
        </div>
        
        <div class="ai-overlay-suggestions">
          <!-- Suggestions will be inserted here -->
        </div>
        
        <div class="ai-overlay-actions">
          <button class="ai-overlay-button primary" data-action="enhance">
            Enhance
          </button>
          <button class="ai-overlay-button" data-action="templates">
            Templates
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Sets up event listeners for the overlay
   */
  setupEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    });

    // Container hover tracking
    this.container.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.container.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });

    // Action buttons
    this.actionsSection.addEventListener('click', (e) => {
      const button = e.target.closest('.ai-overlay-button');
      if (button) {
        this.handleActionClick(button.dataset.action);
      }
    });

    // Suggestion clicks
    this.suggestionsSection.addEventListener('click', (e) => {
      const suggestion = e.target.closest('.ai-overlay-suggestion');
      if (suggestion) {
        this.handleSuggestionClick(suggestion);
      }
    });

    // Title click to minimize/expand
    this.titleElement.addEventListener('click', () => {
      this.toggleMinimized();
    });

    // Keyboard navigation
    this.overlay.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.repositionOverlay();
    });

    // Document click to hide
    document.addEventListener('click', (e) => {
      if (this.isVisible && !this.overlay.contains(e.target) && 
          !this.currentInputElement?.contains(e.target)) {
        setTimeout(() => {
          if (!this.isHovered) {
            this.hide();
          }
        }, 100);
      }
    });
  }

  /**
   * Attaches the overlay to an input element
   * @param {HTMLElement} inputElement - The input element to attach to
   */
  attachToInput(inputElement) {
    this.currentInputElement = inputElement;
    this.repositionOverlay();
  }

  /**
   * Shows the overlay with analysis results
   * @param {Object} analysis - Analysis results from PromptAnalyzer
   */
  showWithAnalysis(analysis) {
    this.currentAnalysis = analysis;
    this.updateScore(analysis.score);
    this.updateSuggestions(analysis.suggestions || []);
    this.show();
  }

  /**
   * Shows suggestions in the overlay
   * @param {Array} suggestions - Array of suggestion objects
   */
  showSuggestions(suggestions) {
    this.suggestions = suggestions;
    this.updateSuggestions(suggestions);
    
    if (!this.isVisible) {
      this.show();
    }
  }

  /**
   * Shows the overlay
   */
  show() {
    if (this.isVisible || !this.settings.showSuggestions) return;

    this.isVisible = true;
    this.repositionOverlay();
    
    // Remove hidden class and add visible class
    this.container.classList.remove('hidden');
    this.container.classList.add('visible');
    
    // Update title based on state
    this.updateTitle();
    
    // Log analytics
    this.logEvent('overlay_shown');
  }

  /**
   * Hides the overlay
   */
  hide() {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.container.classList.remove('visible');
    this.container.classList.add('hidden');
    
    // Log analytics
    this.logEvent('overlay_hidden');
  }

  /**
   * Toggles overlay visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Toggles minimized state
   */
  toggleMinimized() {
    this.isMinimized = !this.isMinimized;
    this.container.classList.toggle('minimized', this.isMinimized);
    
    // Update title
    this.updateTitle();
    
    // Reposition
    this.repositionOverlay();
  }

  /**
   * Updates the prompt quality score display
   * @param {number} score - Quality score (0-100)
   */
  updateScore(score) {
    const scoreCircle = this.overlay.querySelector('.ai-score-circle');
    const scoreNumber = this.overlay.querySelector('.ai-score-number');
    const scoreValue = this.overlay.querySelector('.ai-score-value');
    
    // Update number
    scoreNumber.textContent = Math.round(score);
    
    // Update circle color based on score
    scoreCircle.className = 'ai-score-circle';
    if (score >= 80) {
      scoreCircle.classList.add('excellent');
      scoreValue.textContent = 'Excellent';
    } else if (score >= 60) {
      scoreCircle.classList.add('good');
      scoreValue.textContent = 'Good';
    } else {
      scoreCircle.classList.add('needs-improvement');
      scoreValue.textContent = 'Needs Improvement';
    }
  }

  /**
   * Updates the suggestions display
   * @param {Array} suggestions - Array of suggestion objects
   */
  updateSuggestions(suggestions) {
    // Clear existing suggestions
    this.suggestionsSection.innerHTML = '';
    
    // Show top 3 suggestions in overlay
    const topSuggestions = suggestions.slice(0, 3);
    
    if (topSuggestions.length === 0) {
      this.suggestionsSection.innerHTML = `
        <div class="ai-overlay-suggestion">
          <div class="ai-suggestion-title">
            <div class="ai-suggestion-icon low-priority">✓</div>
            Great prompt!
          </div>
          <div class="ai-suggestion-description">
            Your prompt looks good. Click "Templates" to explore advanced options.
          </div>
        </div>
      `;
      return;
    }
    
    topSuggestions.forEach((suggestion, index) => {
      const suggestionElement = this.createSuggestionElement(suggestion, index);
      this.suggestionsSection.appendChild(suggestionElement);
    });
  }

  /**
   * Creates a suggestion element
   * @param {Object} suggestion - Suggestion object
   * @param {number} index - Suggestion index
   * @returns {HTMLElement} Suggestion element
   */
  createSuggestionElement(suggestion, index) {
    const element = document.createElement('div');
    element.className = 'ai-overlay-suggestion';
    element.dataset.suggestionId = suggestion.id;
    element.dataset.index = index;
    
    const priorityClass = this.getPriorityClass(suggestion.priority);
    const icon = this.getPriorityIcon(suggestion.priority);
    
    element.innerHTML = `
      <div class="ai-suggestion-title">
        <div class="ai-suggestion-icon ${priorityClass}">${icon}</div>
        ${this.escapeHtml(suggestion.title)}
      </div>
      <div class="ai-suggestion-description">
        ${this.escapeHtml(suggestion.description)}
      </div>
    `;
    
    return element;
  }

  /**
   * Gets CSS class for priority level
   * @param {number} priority - Priority value
   * @returns {string} CSS class
   */
  getPriorityClass(priority) {
    if (priority >= 80) return 'high-priority';
    if (priority >= 50) return 'medium-priority';
    return 'low-priority';
  }

  /**
   * Gets icon for priority level
   * @param {number} priority - Priority value
   * @returns {string} Icon character
   */
  getPriorityIcon(priority) {
    if (priority >= 80) return '!';
    if (priority >= 50) return '⚠';
    return '💡';
  }

  /**
   * Updates the overlay title
   */
  updateTitle() {
    if (this.isMinimized) {
      this.titleElement.textContent = '✨ AI Enhancer';
    } else if (this.suggestions.length > 0) {
      this.titleElement.textContent = `${this.suggestions.length} Suggestions`;
    } else {
      this.titleElement.textContent = 'AI Prompt Enhancer';
    }
  }

  /**
   * Repositions the overlay relative to the current input
   */
  repositionOverlay() {
    if (!this.currentInputElement || !this.isVisible) return;

    const inputRect = this.currentInputElement.getBoundingClientRect();
    const overlayRect = this.container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = inputRect.right + 10; // Default: to the right of input
    let top = inputRect.top;
    
    // Adjust if overlay would go off-screen horizontally
    if (left + overlayRect.width > viewportWidth - 10) {
      left = inputRect.left - overlayRect.width - 10; // Move to left side
    }
    
    // Ensure minimum distance from left edge
    if (left < 10) {
      left = 10;
    }
    
    // Adjust if overlay would go off-screen vertically
    if (top + overlayRect.height > viewportHeight - 10) {
      top = viewportHeight - overlayRect.height - 10;
    }
    
    // Ensure minimum distance from top
    if (top < 10) {
      top = 10;
    }
    
    // Apply position
    this.overlay.style.left = `${left}px`;
    this.overlay.style.top = `${top}px`;
  }

  /**
   * Applies platform-specific theme
   */
  applyPlatformTheme() {
    const platform = window.PlatformDetector?.detectPlatform();
    if (platform) {
      this.overlay.className = `ai-prompt-enhancer-overlay ${platform}-theme`;
    }
    
    // Apply dark mode if detected
    if (this.isDarkMode()) {
      this.overlay.classList.add('dark-mode');
    }
  }

  /**
   * Detects if the current platform is in dark mode
   * @returns {boolean} True if dark mode is active
   */
  isDarkMode() {
    const platform = window.PlatformDetector?.detectPlatform();
    
    if (platform && window.PlatformDetector?.isDarkMode) {
      return window.PlatformDetector.isDarkMode(platform);
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Handles action button clicks
   * @param {string} action - Action type
   */
  handleActionClick(action) {
    switch (action) {
      case 'enhance':
        this.requestEnhancement();
        break;
      case 'templates':
        this.showTemplates();
        break;
      case 'settings':
        this.openSettings();
        break;
    }
    
    this.logEvent('action_clicked', { action });
  }

  /**
   * Handles suggestion clicks
   * @param {HTMLElement} suggestionElement - Clicked suggestion element
   */
  handleSuggestionClick(suggestionElement) {
    const suggestionId = suggestionElement.dataset.suggestionId;
    const index = parseInt(suggestionElement.dataset.index);
    const suggestion = this.suggestions[index];
    
    if (suggestion && this.onEnhancementRequested) {
      this.onEnhancementRequested(suggestion, this.currentInputElement);
    }
    
    // Add click feedback
    suggestionElement.style.transform = 'scale(0.98)';
    setTimeout(() => {
      suggestionElement.style.transform = '';
    }, 150);
    
    this.logEvent('suggestion_clicked', { 
      suggestionId, 
      index, 
      type: suggestion?.type 
    });
  }

  /**
   * Requests enhancement for current prompt
   */
  requestEnhancement() {
    if (!this.currentInputElement) return;
    
    const text = this.getCurrentPromptText();
    if (this.onEnhancementRequested) {
      this.onEnhancementRequested(text, 'general');
    }
  }

  /**
   * Shows template suggestions panel
   */
  showTemplates() {
    // This would trigger showing the detailed suggestion panel
    if (window.aiPromptEnhancer?.panel) {
      window.aiPromptEnhancer.panel.show(this.suggestions, 'templates');
    }
  }

  /**
   * Opens extension settings
   */
  openSettings() {
    chrome.runtime.openOptionsPage();
  }

  /**
   * Gets current prompt text from input element
   * @returns {string} Current prompt text
   */
  getCurrentPromptText() {
    if (!this.currentInputElement) return '';
    
    return this.currentInputElement.value || 
           this.currentInputElement.textContent || 
           this.currentInputElement.innerText || '';
  }

  /**
   * Handles keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboardNavigation(event) {
    if (event.key === 'Escape') {
      this.hide();
      event.preventDefault();
    } else if (event.key === 'Enter' && event.ctrlKey) {
      this.requestEnhancement();
      event.preventDefault();
    }
  }

  /**
   * Checks if overlay is currently hovered
   * @returns {boolean} True if hovered
   */
  isHovered() {
    return this.isHovered;
  }

  /**
   * Shows loading state
   */
  showLoading() {
    this.suggestionsSection.innerHTML = `
      <div class="ai-overlay-loading">
        <div class="ai-overlay-spinner"></div>
        <span>Analyzing prompt...</span>
      </div>
    `;
  }

  /**
   * Shows error state
   * @param {string} message - Error message
   */
  showError(message) {
    this.suggestionsSection.innerHTML = `
      <div class="ai-overlay-error">
        <div class="ai-error-title">Analysis Error</div>
        <div class="ai-error-message">${this.escapeHtml(message)}</div>
      </div>
    `;
  }

  /**
   * Updates settings
   * @param {Object} newSettings - New settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Apply theme updates
    this.applyPlatformTheme();
    
    // Hide if disabled
    if (!newSettings.showSuggestions) {
      this.hide();
    }
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
        event: `overlay_${event}`,
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
   * Cleans up the overlay
   */
  cleanup() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    this.overlay = null;
    this.currentInputElement = null;
    this.suggestions = [];
    this.isVisible = false;
  }
}

// Make EnhancementOverlay available globally
window.EnhancementOverlay = EnhancementOverlay;