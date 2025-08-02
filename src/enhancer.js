// Prompt enhancement engine for AI Prompt Enhancer
// Generates enhanced versions of prompts and applies improvement suggestions

class PromptEnhancer {
  constructor(templates = {}, settings = {}) {
    this.templates = templates;
    this.settings = settings;
    this.onSuggestionsReady = null;
    
    // Enhancement strategies
    this.strategies = {
      CONTEXT_ADDITION: 'context_addition',
      ROLE_DEFINITION: 'role_definition',
      FORMAT_SPECIFICATION: 'format_specification',
      SPECIFICITY_BOOST: 'specificity_boost',
      STRUCTURE_IMPROVEMENT: 'structure_improvement',
      TEMPLATE_APPLICATION: 'template_application'
    };

    // Template categories
    this.templateCategories = {
      GENERAL: 'general',
      TECHNICAL: 'technical',
      CREATIVE: 'creative',
      ANALYSIS: 'analysis',
      CODING: 'coding',
      BUSINESS: 'business',
      ACADEMIC: 'academic'
    };
  }

  /**
   * Generates enhancement suggestions for a prompt analysis
   * @param {Object} analysis - Analysis from PromptAnalyzer
   * @returns {Array} Array of enhancement suggestions
   */
  generateSuggestions(analysis) {
    const suggestions = [];
    
    // Process each identified issue
    analysis.issues.forEach(issue => {
      const enhancement = this.createEnhancementForIssue(issue, analysis);
      if (enhancement) {
        suggestions.push(enhancement);
      }
    });

    // Add template-based suggestions
    const templateSuggestions = this.getTemplateSuggestions(analysis);
    suggestions.push(...templateSuggestions);

    // Add strategic enhancements
    const strategicSuggestions = this.getStrategicEnhancements(analysis);
    suggestions.push(...strategicSuggestions);

    // Sort by effectiveness and priority
    const sortedSuggestions = this.prioritizeSuggestions(suggestions);

    // Call callback if provided
    if (this.onSuggestionsReady) {
      this.onSuggestionsReady(sortedSuggestions);
    }

    return sortedSuggestions;
  }

  /**
   * Enhances a prompt with specific enhancement type
   * @param {string} text - Original prompt text
   * @param {string} enhancementType - Type of enhancement to apply
   * @param {Object} options - Enhancement options
   * @returns {string} Enhanced prompt
   */
  enhance(text, enhancementType, options = {}) {
    switch (enhancementType) {
      case this.strategies.CONTEXT_ADDITION:
        return this.addContext(text, options);
      
      case this.strategies.ROLE_DEFINITION:
        return this.defineRole(text, options);
      
      case this.strategies.FORMAT_SPECIFICATION:
        return this.specifyFormat(text, options);
      
      case this.strategies.SPECIFICITY_BOOST:
        return this.boostSpecificity(text, options);
      
      case this.strategies.STRUCTURE_IMPROVEMENT:
        return this.improveStructure(text, options);
      
      case this.strategies.TEMPLATE_APPLICATION:
        return this.applyTemplate(text, options);
      
      default:
        return this.generalEnhancement(text, options);
    }
  }

  /**
   * Creates enhancement suggestion for a specific issue
   * @param {Object} issue - Issue identified by analyzer
   * @param {Object} analysis - Full analysis object
   * @returns {Object} Enhancement suggestion
   */
  createEnhancementForIssue(issue, analysis) {
    const baseEnhancement = {
      id: `enhance_${issue.type}_${Date.now()}`,
      type: 'issue_fix',
      category: issue.type,
      priority: this.getIssuePriority(issue),
      title: `Fix: ${issue.message}`,
      description: issue.suggestion,
      originalIssue: issue
    };

    switch (issue.type) {
      case 'length':
        return {
          ...baseEnhancement,
          enhancementType: this.strategies.STRUCTURE_IMPROVEMENT,
          previewText: this.generateLengthFix(analysis.originalText, issue),
          action: 'replace'
        };

      case 'vagueness':
        return {
          ...baseEnhancement,
          enhancementType: this.strategies.SPECIFICITY_BOOST,
          previewText: this.generateSpecificityFix(analysis.originalText),
          action: 'replace'
        };

      case 'context':
        return {
          ...baseEnhancement,
          enhancementType: this.strategies.CONTEXT_ADDITION,
          previewText: this.generateContextAddition(analysis.originalText),
          action: 'prefix'
        };

      case 'role':
        return {
          ...baseEnhancement,
          enhancementType: this.strategies.ROLE_DEFINITION,
          previewText: this.generateRoleDefinition(analysis),
          action: 'prefix'
        };

      case 'format':
        return {
          ...baseEnhancement,
          enhancementType: this.strategies.FORMAT_SPECIFICATION,
          previewText: this.generateFormatSpecification(analysis.originalText),
          action: 'suffix'
        };

      default:
        return baseEnhancement;
    }
  }

  /**
   * Gets template-based suggestions
   * @param {Object} analysis - Prompt analysis
   * @returns {Array} Template suggestions
   */
  getTemplateSuggestions(analysis) {
    const suggestions = [];
    const category = this.mapCategoryToTemplate(analysis.category);
    
    // Get relevant templates
    const relevantTemplates = this.getTemplatesForCategory(category);
    
    relevantTemplates.forEach(template => {
      suggestions.push({
        id: `template_${template.id}`,
        type: 'template',
        category: 'template',
        priority: this.calculateTemplatePriority(template, analysis),
        title: `Apply ${template.name} Template`,
        description: template.description,
        template: template,
        previewText: this.applyTemplateToText(analysis.originalText, template),
        action: 'replace',
        enhancementType: this.strategies.TEMPLATE_APPLICATION
      });
    });

    return suggestions;
  }

  /**
   * Gets strategic enhancement suggestions
   * @param {Object} analysis - Prompt analysis
   * @returns {Array} Strategic suggestions
   */
  getStrategicEnhancements(analysis) {
    const suggestions = [];
    const text = analysis.originalText;
    const metrics = analysis.metrics;

    // Suggest context addition if score is low
    if (analysis.score < 60 && metrics.wordCount > 10) {
      suggestions.push({
        id: 'strategic_context',
        type: 'strategic',
        category: 'context',
        priority: 70,
        title: 'Add Strategic Context',
        description: 'Provide background information to improve response quality',
        previewText: this.addStrategicContext(text, analysis),
        action: 'prefix',
        enhancementType: this.strategies.CONTEXT_ADDITION
      });
    }

    // Suggest structure improvement for long prompts
    if (metrics.wordCount > 100 && metrics.sentenceCount > 5) {
      suggestions.push({
        id: 'strategic_structure',
        type: 'strategic',
        category: 'structure',
        priority: 60,
        title: 'Improve Structure',
        description: 'Organize prompt with clear sections and bullet points',
        previewText: this.restructurePrompt(text),
        action: 'replace',
        enhancementType: this.strategies.STRUCTURE_IMPROVEMENT
      });
    }

    // Suggest role definition for complex requests
    if (metrics.complexityScore > 50 && !text.toLowerCase().includes('act as')) {
      suggestions.push({
        id: 'strategic_role',
        type: 'strategic',
        category: 'role',
        priority: 65,
        title: 'Define Expert Role',
        description: 'Specify what type of expert should respond',
        previewText: this.addExpertRole(text, analysis),
        action: 'prefix',
        enhancementType: this.strategies.ROLE_DEFINITION
      });
    }

    return suggestions;
  }

  /**
   * Adds context to a prompt
   * @param {string} text - Original text
   * @param {Object} options - Context options
   * @returns {string} Text with added context
   */
  addContext(text, options = {}) {
    const contextPrefixes = [
      "Given the context of",
      "In the situation where",
      "Considering that",
      "With the background that"
    ];

    const context = options.context || "a typical use case";
    const prefix = contextPrefixes[Math.floor(Math.random() * contextPrefixes.length)];
    
    return `${prefix} ${context}, ${text}`;
  }

  /**
   * Defines a role for the AI
   * @param {string} text - Original text
   * @param {Object} options - Role options
   * @returns {string} Text with role definition
   */
  defineRole(text, options = {}) {
    const role = options.role || this.inferRole(text);
    return `Act as ${role}. ${text}`;
  }

  /**
   * Specifies output format
   * @param {string} text - Original text
   * @param {Object} options - Format options
   * @returns {string} Text with format specification
   */
  specifyFormat(text, options = {}) {
    const format = options.format || "a clear, well-structured response";
    return `${text}\n\nPlease provide your response as ${format}.`;
  }

  /**
   * Boosts specificity of a prompt
   * @param {string} text - Original text
   * @param {Object} options - Specificity options
   * @returns {string} More specific text
   */
  boostSpecificity(text, options = {}) {
    let enhanced = text;

    // Replace general terms with more specific ones
    const replacements = {
      'help': 'provide detailed guidance on',
      'info': 'comprehensive information about',
      'explain': 'explain in detail with examples',
      'how': 'what are the step-by-step instructions for',
      'what': 'what specifically',
      'general': 'specific and detailed',
      'basic': 'comprehensive',
      'simple': 'detailed yet clear'
    };

    Object.entries(replacements).forEach(([general, specific]) => {
      const regex = new RegExp(`\\b${general}\\b`, 'gi');
      enhanced = enhanced.replace(regex, specific);
    });

    return enhanced;
  }

  /**
   * Improves prompt structure
   * @param {string} text - Original text
   * @param {Object} options - Structure options
   * @returns {string} Better structured text
   */
  improveStructure(text, options = {}) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length <= 2) {
      return text; // Too short to restructure
    }

    // Group sentences into logical sections
    const sections = this.groupSentencesIntoSections(sentences);
    
    let structured = '';
    sections.forEach((section, index) => {
      if (section.type === 'context') {
        structured += `**Context:**\n${section.content}\n\n`;
      } else if (section.type === 'request') {
        structured += `**Request:**\n${section.content}\n\n`;
      } else if (section.type === 'requirements') {
        structured += `**Requirements:**\n${section.content}\n\n`;
      } else {
        structured += `${section.content}\n\n`;
      }
    });

    return structured.trim();
  }

  /**
   * Applies a template to text
   * @param {string} text - Original text
   * @param {Object} options - Template options
   * @returns {string} Text with template applied
   */
  applyTemplate(text, options = {}) {
    const template = options.template;
    if (!template) return text;

    return template.content.replace(/\{prompt\}/g, text);
  }

  /**
   * General enhancement method
   * @param {string} text - Original text
   * @param {Object} options - Enhancement options
   * @returns {string} Enhanced text
   */
  generalEnhancement(text, options = {}) {
    let enhanced = text;

    // Add politeness if not present
    if (!text.toLowerCase().includes('please') && !text.toLowerCase().includes('thank')) {
      enhanced = `Please ${enhanced.toLowerCase()}`;
    }

    // Add specificity request
    if (!text.toLowerCase().includes('specific') && !text.toLowerCase().includes('detail')) {
      enhanced += ' Please be specific and provide detailed information.';
    }

    return enhanced;
  }

  /**
   * Generates a fix for length issues
   * @param {string} text - Original text
   * @param {Object} issue - Length issue
   * @returns {string} Length-fixed text
   */
  generateLengthFix(text, issue) {
    if (text.length < 15) {
      // Expand short prompts
      return `I need help with ${text}. Could you please provide detailed guidance including background information, step-by-step instructions, and practical examples?`;
    } else if (text.length > 2000) {
      // Condense long prompts
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      const key_sentences = sentences.slice(0, 3); // Keep first 3 sentences
      return key_sentences.join('. ') + '. Please provide a comprehensive response.';
    }
    return text;
  }

  /**
   * Generates specificity improvements
   * @param {string} text - Original text
   * @returns {string} More specific text
   */
  generateSpecificityFix(text) {
    // Add specific context and requirements
    const enhanced = text.replace(/\b(help|explain|tell me)\b/gi, 'provide detailed guidance on');
    return `${enhanced} Please include specific examples, step-by-step instructions, and practical applications.`;
  }

  /**
   * Generates context addition
   * @param {string} text - Original text
   * @returns {string} Context to add
   */
  generateContextAddition(text) {
    return "Background: I'm working on a project where [provide your specific situation]. ";
  }

  /**
   * Generates role definition
   * @param {Object} analysis - Analysis object
   * @returns {string} Role definition
   */
  generateRoleDefinition(analysis) {
    const role = this.inferRole(analysis.originalText);
    return `Act as ${role}. `;
  }

  /**
   * Generates format specification
   * @param {string} text - Original text
   * @returns {string} Format specification
   */
  generateFormatSpecification(text) {
    return "\n\nPlease format your response with clear headings, bullet points for key information, and practical examples.";
  }

  /**
   * Infers appropriate role from prompt content
   * @param {string} text - Prompt text
   * @returns {string} Suggested role
   */
  inferRole(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('code') || lowerText.includes('program') || lowerText.includes('develop')) {
      return 'an experienced software developer';
    } else if (lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('ux')) {
      return 'a professional designer';
    } else if (lowerText.includes('business') || lowerText.includes('strategy') || lowerText.includes('market')) {
      return 'a business consultant';
    } else if (lowerText.includes('write') || lowerText.includes('content') || lowerText.includes('blog')) {
      return 'a professional writer';
    } else if (lowerText.includes('analyze') || lowerText.includes('data') || lowerText.includes('research')) {
      return 'a data analyst';
    } else {
      return 'an expert in the relevant field';
    }
  }

  /**
   * Maps analysis category to template category
   * @param {string} category - Analysis category
   * @returns {string} Template category
   */
  mapCategoryToTemplate(category) {
    const mapping = {
      'question': this.templateCategories.GENERAL,
      'instruction': this.templateCategories.GENERAL,
      'analysis': this.templateCategories.ANALYSIS,
      'explanation': this.templateCategories.ACADEMIC,
      'technical': this.templateCategories.TECHNICAL,
      'data': this.templateCategories.ANALYSIS
    };

    return mapping[category] || this.templateCategories.GENERAL;
  }

  /**
   * Gets templates for a specific category
   * @param {string} category - Template category
   * @returns {Array} Array of templates
   */
  getTemplatesForCategory(category) {
    if (!this.templates || !this.templates.categories) return [];
    
    return this.templates.categories[category] || [];
  }

  /**
   * Calculates priority for a template suggestion
   * @param {Object} template - Template object
   * @param {Object} analysis - Analysis object
   * @returns {number} Priority score
   */
  calculateTemplatePriority(template, analysis) {
    let priority = template.priority || 50;
    
    // Boost priority for low-scoring prompts
    if (analysis.score < 50) {
      priority += 20;
    }

    // Boost for templates that match issues
    analysis.issues.forEach(issue => {
      if (template.addresses && template.addresses.includes(issue.type)) {
        priority += 15;
      }
    });

    return Math.min(100, priority);
  }

  /**
   * Applies template to text
   * @param {string} text - Original text
   * @param {Object} template - Template object
   * @returns {string} Text with template applied
   */
  applyTemplateToText(text, template) {
    if (!template.content) return text;
    
    return template.content
      .replace(/\{prompt\}/g, text)
      .replace(/\{context\}/g, '[Your specific context here]')
      .replace(/\{requirements\}/g, '[Your specific requirements here]');
  }

  /**
   * Prioritizes suggestions array
   * @param {Array} suggestions - Array of suggestions
   * @returns {Array} Sorted suggestions
   */
  prioritizeSuggestions(suggestions) {
    return suggestions.sort((a, b) => {
      // Sort by priority first
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      
      // Then by type (issue fixes first)
      const typeOrder = { 'issue_fix': 3, 'strategic': 2, 'template': 1 };
      return (typeOrder[b.type] || 0) - (typeOrder[a.type] || 0);
    });
  }

  /**
   * Gets priority for an issue
   * @param {Object} issue - Issue object
   * @returns {number} Priority value
   */
  getIssuePriority(issue) {
    const severityMap = {
      'high': 90,
      'medium': 60,
      'low': 30
    };
    
    return severityMap[issue.severity] || 30;
  }

  /**
   * Adds strategic context to prompt
   * @param {string} text - Original text
   * @param {Object} analysis - Analysis object
   * @returns {string} Text with strategic context
   */
  addStrategicContext(text, analysis) {
    const contextTemplates = [
      "Context: I'm working on {domain} and need {objective}. ",
      "Background: This is for {purpose} in the context of {domain}. ",
      "Situation: I'm a {role} working on {project}. "
    ];
    
    const domain = this.inferDomain(text);
    const template = contextTemplates[0];
    
    return template
      .replace('{domain}', domain)
      .replace('{objective}', 'detailed guidance')
      .replace('{purpose}', 'a project')
      .replace('{role}', 'professional')
      .replace('{project}', 'an important task');
  }

  /**
   * Restructures a prompt for better organization
   * @param {string} text - Original text
   * @returns {string} Restructured text
   */
  restructurePrompt(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    // Simple restructuring: context, request, requirements
    const context = sentences.slice(0, Math.ceil(sentences.length / 3));
    const request = sentences.slice(Math.ceil(sentences.length / 3), Math.ceil(2 * sentences.length / 3));
    const requirements = sentences.slice(Math.ceil(2 * sentences.length / 3));
    
    let structured = '';
    
    if (context.length > 0) {
      structured += `**Context:**\n${context.join('. ')}.\n\n`;
    }
    
    if (request.length > 0) {
      structured += `**Request:**\n${request.join('. ')}.\n\n`;
    }
    
    if (requirements.length > 0) {
      structured += `**Requirements:**\n${requirements.join('. ')}.`;
    }
    
    return structured;
  }

  /**
   * Adds expert role to prompt
   * @param {string} text - Original text
   * @param {Object} analysis - Analysis object
   * @returns {string} Role prefix
   */
  addExpertRole(text, analysis) {
    const role = this.inferRole(text);
    return `Act as ${role}. `;
  }

  /**
   * Groups sentences into logical sections
   * @param {Array} sentences - Array of sentences
   * @returns {Array} Array of section objects
   */
  groupSentencesIntoSections(sentences) {
    // Simple heuristic grouping
    return [
      {
        type: 'context',
        content: sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.'
      },
      {
        type: 'request',
        content: sentences.slice(Math.ceil(sentences.length / 2)).join('. ') + '.'
      }
    ];
  }

  /**
   * Infers domain from prompt content
   * @param {string} text - Prompt text
   * @returns {string} Inferred domain
   */
  inferDomain(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('code') || lowerText.includes('programming')) return 'software development';
    if (lowerText.includes('design') || lowerText.includes('ui')) return 'design';
    if (lowerText.includes('business') || lowerText.includes('marketing')) return 'business';
    if (lowerText.includes('data') || lowerText.includes('analysis')) return 'data analysis';
    if (lowerText.includes('writing') || lowerText.includes('content')) return 'content creation';
    
    return 'general problem-solving';
  }

  /**
   * Updates enhancer settings and templates
   * @param {Object} newSettings - New settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Updates templates
   * @param {Object} newTemplates - New templates
   */
  updateTemplates(newTemplates) {
    this.templates = { ...this.templates, ...newTemplates };
  }
}

// Make PromptEnhancer available globally
window.PromptEnhancer = PromptEnhancer;