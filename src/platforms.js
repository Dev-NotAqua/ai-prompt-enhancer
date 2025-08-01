// Platform detection system for AI Prompt Enhancer
// Identifies which AI platform the user is currently on and provides platform-specific configurations

class PlatformDetector {
  static PLATFORMS = {
    CHATGPT: 'chatgpt',
    CLAUDE: 'claude',
    GEMINI: 'gemini',
    GITHUB: 'github',
    BING: 'bing',
    PERPLEXITY: 'perplexity'
  };

  static PLATFORM_CONFIGS = {
    [this.PLATFORMS.CHATGPT]: {
      domains: ['chat.openai.com'],
      name: 'ChatGPT',
      selectors: {
        input: ['textarea[data-id]', '#prompt-textarea', 'textarea[placeholder*="message"]'],
        textarea: ['textarea'],
        messages: ['[data-message-author-role]', '.group'],
        userMessage: '[data-message-author-role="user"]',
        assistantMessage: '[data-message-author-role="assistant"]',
        sendButton: ['[data-testid="send-button"]', 'button[aria-label*="Send"]'],
        chatContainer: ['main', '[role="main"]']
      },
      features: {
        supportsMarkdown: true,
        supportsCodeBlocks: true,
        supportsFileUpload: true,
        maxPromptLength: 32000
      }
    },

    [this.PLATFORMS.CLAUDE]: {
      domains: ['claude.ai'],
      name: 'Claude',
      selectors: {
        input: ['[contenteditable="true"]', 'textarea'],
        textarea: ['textarea'],
        messages: ['[data-testid*="message"]', '.message'],
        userMessage: '[data-is-from-user="true"]',
        assistantMessage: '[data-is-from-user="false"]',
        sendButton: ['button[aria-label*="Send"]', '[data-testid="send-button"]'],
        chatContainer: ['main', '.chat-container']
      },
      features: {
        supportsMarkdown: true,
        supportsCodeBlocks: true,
        supportsFileUpload: true,
        maxPromptLength: 100000
      }
    },

    [this.PLATFORMS.GEMINI]: {
      domains: ['gemini.google.com', 'bard.google.com'],
      name: 'Gemini',
      selectors: {
        input: ['[contenteditable="true"]', 'textarea', '.ql-editor'],
        textarea: ['textarea'],
        messages: ['message-content', '.model-response-text'],
        userMessage: '.user-message',
        assistantMessage: '.model-response',
        sendButton: ['button[aria-label*="Send"]', '[jsname="GgV0Hd"]'],
        chatContainer: ['main', '.conversation-container']
      },
      features: {
        supportsMarkdown: true,
        supportsCodeBlocks: true,
        supportsFileUpload: true,
        maxPromptLength: 30000
      }
    },

    [this.PLATFORMS.GITHUB]: {
      domains: ['github.com'],
      name: 'GitHub Copilot',
      selectors: {
        input: ['textarea[placeholder*="Ask Copilot"]', '[data-testid="copilot-chat-input"]'],
        textarea: ['textarea'],
        messages: ['.copilot-chat-message', '[data-testid*="message"]'],
        userMessage: '.user-message',
        assistantMessage: '.assistant-message',
        sendButton: ['button[type="submit"]', '[aria-label*="Send"]'],
        chatContainer: ['.copilot-chat-container', '#copilot-chat']
      },
      features: {
        supportsMarkdown: true,
        supportsCodeBlocks: true,
        supportsFileUpload: false,
        maxPromptLength: 8000
      }
    },

    [this.PLATFORMS.BING]: {
      domains: ['copilot.microsoft.com', 'bing.com'],
      name: 'Copilot (Bing)',
      selectors: {
        input: ['textarea[placeholder*="Ask me anything"]', '#searchbox'],
        textarea: ['textarea'],
        messages: ['.ac-textBlock', '.b_msg'],
        userMessage: '.user',
        assistantMessage: '.bot',
        sendButton: ['#submit-button', '[aria-label*="Submit"]'],
        chatContainer: ['#b_sydConvCont', '.conversation-main']
      },
      features: {
        supportsMarkdown: true,
        supportsCodeBlocks: true,
        supportsFileUpload: true,
        maxPromptLength: 4000
      }
    },

    [this.PLATFORMS.PERPLEXITY]: {
      domains: ['perplexity.ai'],
      name: 'Perplexity',
      selectors: {
        input: ['textarea[placeholder*="Ask anything"]', '[contenteditable="true"]'],
        textarea: ['textarea'],
        messages: ['.prose', '.answer'],
        userMessage: '.user-query',
        assistantMessage: '.answer-content',
        sendButton: ['button[aria-label*="Submit"]', '.submit-button'],
        chatContainer: ['.conversation', 'main']
      },
      features: {
        supportsMarkdown: true,
        supportsCodeBlocks: true,
        supportsFileUpload: false,
        maxPromptLength: 2000
      }
    }
  };

  /**
   * Detects the current platform based on the URL and page elements
   * @returns {string|null} Platform identifier or null if not supported
   */
  static detectPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    
    // Check each platform's domains
    for (const [platformId, config] of Object.entries(this.PLATFORM_CONFIGS)) {
      if (config.domains.some(domain => hostname.includes(domain))) {
        // Additional validation for specific platforms
        if (this.validatePlatform(platformId, hostname, pathname)) {
          return platformId;
        }
      }
    }

    return null;
  }

  /**
   * Validates that we're on the correct page for the detected platform
   * @param {string} platformId - The detected platform
   * @param {string} hostname - Current hostname
   * @param {string} pathname - Current pathname
   * @returns {boolean} True if platform is valid
   */
  static validatePlatform(platformId, hostname, pathname) {
    switch (platformId) {
      case this.PLATFORMS.CHATGPT:
        return hostname === 'chat.openai.com';
        
      case this.PLATFORMS.CLAUDE:
        return hostname === 'claude.ai' && !pathname.includes('/login');
        
      case this.PLATFORMS.GEMINI:
        return (hostname.includes('gemini.google.com') || hostname.includes('bard.google.com')) 
               && !pathname.includes('/auth');
               
      case this.PLATFORMS.GITHUB:
        return hostname === 'github.com' && 
               (pathname.includes('/copilot') || 
                document.querySelector('[data-testid="copilot-chat-input"]') !== null);
                
      case this.PLATFORMS.BING:
        return (hostname.includes('copilot.microsoft.com') || hostname.includes('bing.com')) 
               && !pathname.includes('/auth');
               
      case this.PLATFORMS.PERPLEXITY:
        return hostname === 'www.perplexity.ai' || hostname === 'perplexity.ai';
        
      default:
        return false;
    }
  }

  /**
   * Gets the configuration for a specific platform
   * @param {string} platformId - Platform identifier
   * @returns {Object|null} Platform configuration or null
   */
  static getPlatformConfig(platformId) {
    return this.PLATFORM_CONFIGS[platformId] || null;
  }

  /**
   * Gets all supported platforms
   * @returns {Object} All platform configurations
   */
  static getAllPlatforms() {
    return this.PLATFORM_CONFIGS;
  }

  /**
   * Checks if a platform supports a specific feature
   * @param {string} platformId - Platform identifier
   * @param {string} feature - Feature name
   * @returns {boolean} True if feature is supported
   */
  static supportsFeature(platformId, feature) {
    const config = this.getPlatformConfig(platformId);
    return config?.features?.[feature] || false;
  }

  /**
   * Gets the maximum prompt length for a platform
   * @param {string} platformId - Platform identifier
   * @returns {number} Maximum prompt length
   */
  static getMaxPromptLength(platformId) {
    const config = this.getPlatformConfig(platformId);
    return config?.features?.maxPromptLength || 1000;
  }

  /**
   * Finds input elements on the current platform
   * @param {string} platformId - Platform identifier
   * @returns {NodeList} Found input elements
   */
  static findInputElements(platformId) {
    const config = this.getPlatformConfig(platformId);
    if (!config) return [];

    const selectors = [
      ...config.selectors.input,
      ...config.selectors.textarea
    ];

    const elements = [];
    selectors.forEach(selector => {
      try {
        const found = document.querySelectorAll(selector);
        elements.push(...Array.from(found));
      } catch (error) {
        console.warn(`Invalid selector "${selector}" for platform ${platformId}:`, error);
      }
    });

    return elements;
  }

  /**
   * Finds the send button for the current platform
   * @param {string} platformId - Platform identifier
   * @returns {Element|null} Send button element or null
   */
  static findSendButton(platformId) {
    const config = this.getPlatformConfig(platformId);
    if (!config) return null;

    for (const selector of config.selectors.sendButton) {
      try {
        const button = document.querySelector(selector);
        if (button) return button;
      } catch (error) {
        console.warn(`Invalid selector "${selector}" for platform ${platformId}:`, error);
      }
    }

    return null;
  }

  /**
   * Gets conversation messages from the current platform
   * @param {string} platformId - Platform identifier
   * @param {number} limit - Maximum number of messages to return
   * @returns {Array} Array of message objects
   */
  static getConversationMessages(platformId, limit = 10) {
    const config = this.getPlatformConfig(platformId);
    if (!config) return [];

    const messages = [];
    
    try {
      const messageElements = document.querySelectorAll(config.selectors.messages);
      const recentMessages = Array.from(messageElements).slice(-limit);
      
      recentMessages.forEach(element => {
        const isUser = element.matches(config.selectors.userMessage);
        const text = element.textContent.trim();
        
        if (text) {
          messages.push({
            text,
            isUser,
            element,
            timestamp: Date.now()
          });
        }
      });
    } catch (error) {
      console.warn(`Error getting messages for platform ${platformId}:`, error);
    }

    return messages;
  }

  /**
   * Waits for input elements to appear on the page
   * @param {string} platformId - Platform identifier
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<NodeList>} Promise that resolves with input elements
   */
  static waitForInputElements(platformId, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkForElements = () => {
        const elements = this.findInputElements(platformId);
        
        if (elements.length > 0) {
          resolve(elements);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout waiting for input elements on platform ${platformId}`));
        } else {
          setTimeout(checkForElements, 100);
        }
      };
      
      checkForElements();
    });
  }

  /**
   * Gets platform-specific CSS classes for styling
   * @param {string} platformId - Platform identifier
   * @returns {Object} CSS class mappings
   */
  static getPlatformClasses(platformId) {
    const baseClasses = {
      overlay: 'ai-prompt-enhancer-overlay',
      panel: 'ai-prompt-enhancer-panel',
      suggestion: 'ai-prompt-enhancer-suggestion',
      button: 'ai-prompt-enhancer-button'
    };

    const platformSpecific = {
      [this.PLATFORMS.CHATGPT]: {
        theme: 'chatgpt-theme',
        darkMode: 'dark'
      },
      [this.PLATFORMS.CLAUDE]: {
        theme: 'claude-theme',
        darkMode: 'dark'
      },
      [this.PLATFORMS.GEMINI]: {
        theme: 'gemini-theme',
        darkMode: 'dark'
      },
      [this.PLATFORMS.GITHUB]: {
        theme: 'github-theme',
        darkMode: 'dark'
      },
      [this.PLATFORMS.BING]: {
        theme: 'bing-theme',
        darkMode: 'dark'
      },
      [this.PLATFORMS.PERPLEXITY]: {
        theme: 'perplexity-theme',
        darkMode: 'dark'
      }
    };

    return {
      ...baseClasses,
      ...(platformSpecific[platformId] || {})
    };
  }

  /**
   * Detects if the platform is in dark mode
   * @param {string} platformId - Platform identifier
   * @returns {boolean} True if dark mode is active
   */
  static isDarkMode(platformId) {
    // Check for common dark mode indicators
    const darkModeSelectors = [
      '[data-theme="dark"]',
      '.dark',
      '.dark-theme',
      '[data-color-mode="dark"]'
    ];

    // Platform-specific dark mode detection
    switch (platformId) {
      case this.PLATFORMS.CHATGPT:
        return document.documentElement.classList.contains('dark') ||
               document.querySelector('.dark') !== null;
               
      case this.PLATFORMS.CLAUDE:
        return document.documentElement.dataset.theme === 'dark';
        
      case this.PLATFORMS.GEMINI:
        return document.documentElement.dataset.darkTheme === 'true';
        
      case this.PLATFORMS.GITHUB:
        return document.documentElement.dataset.colorMode === 'dark';
        
      default:
        // Fallback: check general dark mode indicators
        return darkModeSelectors.some(selector => 
          document.querySelector(selector) !== null
        ) || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }
}

// Make PlatformDetector available globally
window.PlatformDetector = PlatformDetector;