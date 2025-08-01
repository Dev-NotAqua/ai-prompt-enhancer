// Prompt analyzer for AI Prompt Enhancer
// Analyzes user prompts in real-time and identifies areas for improvement

class PromptAnalyzer {
  constructor(settings = {}) {
    this.settings = settings;
    this.onAnalysisComplete = null;
    
    // Analysis patterns and rules
    this.patterns = {
      // Quality indicators
      tooShort: /^.{1,10}$/,
      tooVague: /(what|how|why|tell me about|explain)\s*$/i,
      noContext: /^(?!.*\b(context|background|scenario|situation)\b).+$/i,
      
      // Enhancement opportunities
      needsSpecificity: /(general|basic|simple|quick|brief)\s+(help|info|explanation)/i,
      needsRole: /^(?!.*(act as|you are|assume you|pretend|role of)).+$/i,
      needsFormat: /^(?!.*(format|structure|organize|list|table|bullet)).+$/i,
      needsExamples: /(example|sample|instance|demonstrate)/i,
      
      // Prompt types
      question: /^(what|how|why|when|where|who|which|can you|could you|would you)/i,
      instruction: /^(write|create|generate|make|build|design|develop)/i,
      analysis: /^(analyze|compare|evaluate|assess|review|examine)/i,
      explanation: /^(explain|describe|tell me|clarify)/i,
      
      // Technical content
      hasCode: /```[\s\S]*```|`[^`]+`/,
      hasData: /\b\d+%|\$\d+|\d+\s*(users|customers|records|items)/i,
      hasUrls: /https?:\/\/[^\s]+/g,
      
      // Emotional tone
      urgent: /\b(urgent|asap|quickly|immediately|rush|deadline)\b/i,
      polite: /\b(please|thank you|thanks|appreciate|kindly)\b/i,
      frustrated: /\b(can't|won't|doesn't work|broken|frustrated|annoying)\b/i
    };

    // Enhancement rules
    this.rules = {
      minLength: 15,
      maxLength: 2000,
      optimalLength: [50, 500],
      contextWords: ['context', 'background', 'scenario', 'situation', 'given that', 'assume'],
      roleWords: ['act as', 'you are', 'assume you', 'pretend', 'role of', 'expert in'],
      formatWords: ['format', 'structure', 'organize', 'list', 'table', 'bullet points', 'numbered'],
      specificityWords: ['specific', 'detailed', 'comprehensive', 'thorough', 'in-depth']
    };
  }

  /**
   * Analyzes a prompt and returns suggestions for improvement
   * @param {string} text - The prompt text to analyze
   * @param {Object} context - Additional context about the prompt
   * @returns {Object} Analysis results with suggestions
   */
  analyze(text, context = {}) {
    if (!text || typeof text !== 'string') {
      return this.createEmptyAnalysis();
    }

    const analysis = {
      originalText: text,
      context,
      timestamp: Date.now(),
      metrics: this.calculateMetrics(text),
      issues: this.identifyIssues(text),
      suggestions: this.generateSuggestions(text, context),
      score: 0,
      category: this.categorizePrompt(text)
    };

    analysis.score = this.calculateScore(analysis);

    // Call callback if provided
    if (this.onAnalysisComplete) {
      this.onAnalysisComplete(analysis);
    }

    return analysis;
  }

  /**
   * Calculates various metrics for the prompt
   * @param {string} text - Prompt text
   * @returns {Object} Metrics object
   */
  calculateMetrics(text) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    return {
      characterCount: text.length,
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
      readabilityScore: this.calculateReadability(text),
      complexityScore: this.calculateComplexity(text),
      specificityScore: this.calculateSpecificity(text)
    };
  }

  /**
   * Identifies potential issues with the prompt
   * @param {string} text - Prompt text
   * @returns {Array} Array of issue objects
   */
  identifyIssues(text) {
    const issues = [];

    // Length issues
    if (text.length < this.rules.minLength) {
      issues.push({
        type: 'length',
        severity: 'high',
        message: 'Prompt is too short and may lack necessary detail',
        suggestion: 'Add more context and specific requirements'
      });
    } else if (text.length > this.rules.maxLength) {
      issues.push({
        type: 'length',
        severity: 'medium',
        message: 'Prompt is very long and may be overwhelming',
        suggestion: 'Consider breaking into smaller, focused requests'
      });
    }

    // Vagueness issues
    if (this.patterns.tooVague.test(text)) {
      issues.push({
        type: 'vagueness',
        severity: 'high',
        message: 'Prompt is too vague and generic',
        suggestion: 'Be more specific about what you want to achieve'
      });
    }

    // Context issues
    if (this.patterns.noContext.test(text) && text.length > 30) {
      issues.push({
        type: 'context',
        severity: 'medium',
        message: 'Prompt lacks background context',
        suggestion: 'Provide relevant background information or constraints'
      });
    }

    // Role clarity
    if (this.patterns.needsRole.test(text) && text.length > 50) {
      issues.push({
        type: 'role',
        severity: 'low',
        message: 'Could benefit from defining AI role or expertise',
        suggestion: 'Start with "Act as a [role]" or "You are an expert in [field]"'
      });
    }

    // Format specification
    if (this.patterns.needsFormat.test(text) && text.length > 40) {
      issues.push({
        type: 'format',
        severity: 'low',
        message: 'Output format not specified',
        suggestion: 'Specify desired format (list, table, paragraphs, etc.)'
      });
    }

    // Specificity issues
    if (this.patterns.needsSpecificity.test(text)) {
      issues.push({
        type: 'specificity',
        severity: 'medium',
        message: 'Request is too general',
        suggestion: 'Replace general terms with specific requirements'
      });
    }

    return issues;
  }

  /**
   * Generates improvement suggestions based on analysis
   * @param {string} text - Prompt text
   * @param {Object} context - Additional context
   * @returns {Array} Array of suggestion objects
   */
  generateSuggestions(text, context) {
    const suggestions = [];
    const issues = this.identifyIssues(text);
    const category = this.categorizePrompt(text);

    // Add suggestions based on identified issues
    issues.forEach(issue => {
      suggestions.push({
        id: `fix_${issue.type}`,
        type: 'improvement',
        category: issue.type,
        priority: this.getSeverityPriority(issue.severity),
        title: issue.message,
        description: issue.suggestion,
        example: this.getExampleForIssue(issue.type, text)
      });
    });

    // Add category-specific suggestions
    const categorySpecific = this.getCategorySpecificSuggestions(category, text);
    suggestions.push(...categorySpecific);

    // Add template suggestions
    const templateSuggestions = this.getTemplateSuggestions(category, text);
    suggestions.push(...templateSuggestions);

    // Sort by priority
    return suggestions.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Categorizes the prompt type
   * @param {string} text - Prompt text
   * @returns {string} Prompt category
   */
  categorizePrompt(text) {
    if (this.patterns.question.test(text)) return 'question';
    if (this.patterns.instruction.test(text)) return 'instruction';
    if (this.patterns.analysis.test(text)) return 'analysis';
    if (this.patterns.explanation.test(text)) return 'explanation';
    
    // Check for specific domains
    if (this.patterns.hasCode.test(text)) return 'technical';
    if (this.patterns.hasData.test(text)) return 'data';
    
    return 'general';
  }

  /**
   * Calculates readability score (simplified Flesch Reading Ease)
   * @param {string} text - Text to analyze
   * @returns {number} Readability score (0-100)
   */
  calculateReadability(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const syllables = this.countSyllables(text);

    if (words === 0 || sentences === 0) return 0;

    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculates complexity score based on various factors
   * @param {string} text - Text to analyze
   * @returns {number} Complexity score (0-100)
   */
  calculateComplexity(text) {
    let score = 0;

    // Technical terms
    const technicalWords = (text.match(/\b(algorithm|implement|optimize|analyze|framework|architecture)\b/gi) || []).length;
    score += technicalWords * 10;

    // Code presence
    if (this.patterns.hasCode.test(text)) score += 20;

    // Multiple requirements
    const requirements = (text.match(/\b(and|also|additionally|furthermore|moreover)\b/gi) || []).length;
    score += requirements * 5;

    // Conditional statements
    const conditionals = (text.match(/\b(if|when|unless|provided|given)\b/gi) || []).length;
    score += conditionals * 3;

    return Math.min(100, score);
  }

  /**
   * Calculates specificity score
   * @param {string} text - Text to analyze
   * @returns {number} Specificity score (0-100)
   */
  calculateSpecificity(text) {
    let score = 0;

    // Specific numbers
    const numbers = (text.match(/\b\d+\b/g) || []).length;
    score += numbers * 5;

    // Specific terms
    const specificTerms = (text.match(/\b(exactly|precisely|specifically|particular|detailed)\b/gi) || []).length;
    score += specificTerms * 10;

    // Examples mentioned
    if (this.patterns.needsExamples.test(text)) score += 15;

    // Role definition
    if (!this.patterns.needsRole.test(text)) score += 10;

    // Format specification
    if (!this.patterns.needsFormat.test(text)) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculates overall prompt quality score
   * @param {Object} analysis - Analysis object
   * @returns {number} Quality score (0-100)
   */
  calculateScore(analysis) {
    let score = 50; // Base score

    // Length scoring
    const wordCount = analysis.metrics.wordCount;
    if (wordCount >= this.rules.optimalLength[0] && wordCount <= this.rules.optimalLength[1]) {
      score += 20;
    } else if (wordCount < this.rules.optimalLength[0]) {
      score -= 15;
    } else {
      score -= 10;
    }

    // Issue penalties
    analysis.issues.forEach(issue => {
      switch (issue.severity) {
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });

    // Metric bonuses
    score += (analysis.metrics.specificityScore * 0.3);
    score += (analysis.metrics.readabilityScore * 0.1);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Counts syllables in text (simplified)
   * @param {string} text - Text to analyze
   * @returns {number} Syllable count
   */
  countSyllables(text) {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    let syllables = 0;

    words.forEach(word => {
      // Simple syllable counting heuristic
      const vowelGroups = word.match(/[aeiouy]+/g);
      syllables += vowelGroups ? vowelGroups.length : 1;
      
      // Adjust for silent 'e'
      if (word.endsWith('e')) syllables--;
      
      // Minimum one syllable per word
      if (syllables < 1) syllables = 1;
    });

    return syllables;
  }

  /**
   * Gets priority value for severity level
   * @param {string} severity - Severity level
   * @returns {number} Priority value
   */
  getSeverityPriority(severity) {
    switch (severity) {
      case 'high': return 90;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 10;
    }
  }

  /**
   * Gets example improvement for specific issue type
   * @param {string} issueType - Type of issue
   * @param {string} originalText - Original prompt text
   * @returns {string} Example improvement
   */
  getExampleForIssue(issueType, originalText) {
    const examples = {
      length: `Instead of: "${originalText.substring(0, 30)}..."\nTry: "I'm working on [context]. Please help me [specific request] by [method]. I need this for [purpose].`,
      vagueness: `Instead of: "How do I do X?"\nTry: "How do I implement X in [technology] for [use case] considering [constraints]?"`,
      context: `Add context like: "I'm a [role] working on [project]. Given that [situation], I need to [goal]."`,
      role: `Start with: "Act as a [expert type] with experience in [field]."`,
      format: `Specify format: "Please provide your response as [format: bullet points/table/numbered list/etc.]"`
    };

    return examples[issueType] || 'Consider being more specific and providing additional context.';
  }

  /**
   * Gets category-specific suggestions
   * @param {string} category - Prompt category
   * @param {string} text - Original text
   * @returns {Array} Category-specific suggestions
   */
  getCategorySpecificSuggestions(category, text) {
    const suggestions = [];

    switch (category) {
      case 'question':
        suggestions.push({
          id: 'question_context',
          type: 'enhancement',
          category: 'context',
          priority: 70,
          title: 'Add background context',
          description: 'Provide relevant background information to get better answers',
          example: 'Include your experience level, current situation, or specific constraints'
        });
        break;

      case 'instruction':
        suggestions.push({
          id: 'instruction_requirements',
          type: 'enhancement',
          category: 'requirements',
          priority: 80,
          title: 'Specify detailed requirements',
          description: 'Include specific requirements, constraints, and success criteria',
          example: 'Add target audience, length requirements, style preferences, or technical constraints'
        });
        break;

      case 'technical':
        suggestions.push({
          id: 'technical_environment',
          type: 'enhancement',
          category: 'technical',
          priority: 75,
          title: 'Specify technical environment',
          description: 'Include programming language, framework, or platform details',
          example: 'Mention: language version, dependencies, deployment environment, or performance requirements'
        });
        break;
    }

    return suggestions;
  }

  /**
   * Gets template suggestions based on prompt analysis
   * @param {string} category - Prompt category
   * @param {string} text - Original text
   * @returns {Array} Template suggestions
   */
  getTemplateSuggestions(category, text) {
    // This will be populated with actual templates from the template manager
    // For now, return placeholder suggestions
    return [
      {
        id: 'template_structured',
        type: 'template',
        category: 'structure',
        priority: 50,
        title: 'Use structured prompt template',
        description: 'Apply a proven template structure for better results',
        template: true
      }
    ];
  }

  /**
   * Creates empty analysis object
   * @returns {Object} Empty analysis
   */
  createEmptyAnalysis() {
    return {
      originalText: '',
      context: {},
      timestamp: Date.now(),
      metrics: {},
      issues: [],
      suggestions: [],
      score: 0,
      category: 'general'
    };
  }

  /**
   * Updates analyzer settings
   * @param {Object} newSettings - New settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }
}

// Make PromptAnalyzer available globally
window.PromptAnalyzer = PromptAnalyzer;