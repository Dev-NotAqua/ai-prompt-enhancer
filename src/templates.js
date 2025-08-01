// Template management system for AI Prompt Enhancer
// Manages prompt templates, patterns, and reusable structures

class TemplateManager {
  constructor() {
    this.templates = new Map();
    this.categories = new Map();
    this.userTemplates = new Map();
    this.recentlyUsed = [];
    this.favorites = new Set();
    
    this.initializeDefaultTemplates();
  }

  /**
   * Initializes default template categories and templates
   */
  initializeDefaultTemplates() {
    // Define template categories
    this.categories.set('general', {
      name: 'General Purpose',
      description: 'Versatile templates for common requests',
      icon: '💬',
      templates: []
    });

    this.categories.set('technical', {
      name: 'Technical',
      description: 'Templates for coding and technical questions',
      icon: '💻',
      templates: []
    });

    this.categories.set('creative', {
      name: 'Creative',
      description: 'Templates for creative writing and brainstorming',
      icon: '🎨',
      templates: []
    });

    this.categories.set('analysis', {
      name: 'Analysis',
      description: 'Templates for data analysis and research',
      icon: '📊',
      templates: []
    });

    this.categories.set('business', {
      name: 'Business',
      description: 'Templates for business and professional use',
      icon: '💼',
      templates: []
    });

    this.categories.set('academic', {
      name: 'Academic',
      description: 'Templates for research and educational content',
      icon: '🎓',
      templates: []
    });

    // Add default templates to categories
    this.addDefaultTemplates();
  }

  /**
   * Adds default templates to the system
   */
  addDefaultTemplates() {
    // General purpose templates
    this.addTemplate({
      id: 'general_detailed_request',
      category: 'general',
      name: 'Detailed Request',
      description: 'Comprehensive template for detailed information requests',
      priority: 90,
      addresses: ['vagueness', 'context', 'specificity'],
      variables: ['topic', 'context', 'requirements'],
      content: `**Context:** {context}

**Request:** Please provide comprehensive information about {topic}.

**Requirements:**
- {requirements}
- Include practical examples
- Explain step-by-step if applicable
- Provide relevant background information

**Format:** Please organize your response with clear headings and bullet points for easy reading.`
    });

    this.addTemplate({
      id: 'general_problem_solving',
      category: 'general',
      name: 'Problem Solving',
      description: 'Template for solving specific problems',
      priority: 85,
      addresses: ['context', 'specificity'],
      variables: ['problem', 'context', 'constraints'],
      content: `**Problem:** {problem}

**Context:** {context}

**Constraints:** {constraints}

**Request:** Please help me solve this problem by:
1. Analyzing the situation
2. Identifying possible solutions
3. Recommending the best approach
4. Providing step-by-step implementation guidance

**Expected Outcome:** A practical solution that I can implement immediately.`
    });

    // Technical templates
    this.addTemplate({
      id: 'tech_code_help',
      category: 'technical',
      name: 'Code Help',
      description: 'Template for programming assistance',
      priority: 95,
      addresses: ['context', 'specificity', 'format'],
      variables: ['language', 'problem', 'environment', 'constraints'],
      content: `**Programming Language:** {language}

**Environment:** {environment}

**Problem:** {problem}

**Constraints:** {constraints}

**Request:** Please help me with this coding challenge by providing:
1. Clear explanation of the approach
2. Well-commented code example
3. Alternative solutions if applicable
4. Best practices and potential pitfalls
5. Testing suggestions

**Code Quality Requirements:**
- Follow language best practices
- Include error handling
- Add meaningful comments
- Optimize for readability and performance`
    });

    this.addTemplate({
      id: 'tech_debugging',
      category: 'technical',
      name: 'Debugging Help',
      description: 'Template for debugging assistance',
      priority: 90,
      addresses: ['context', 'specificity'],
      variables: ['issue', 'environment', 'code', 'error'],
      content: `**Issue Description:** {issue}

**Environment:**
- {environment}

**Error Message:** {error}

**Relevant Code:**
\`\`\`
{code}
\`\`\`

**Request:** Please help me debug this issue by:
1. Identifying the root cause
2. Explaining why this error occurs
3. Providing the corrected code
4. Suggesting prevention strategies

**Additional Context:** [Any recent changes, expected behavior, or additional details]`
    });

    // Creative templates
    this.addTemplate({
      id: 'creative_brainstorming',
      category: 'creative',
      name: 'Creative Brainstorming',
      description: 'Template for generating creative ideas',
      priority: 80,
      addresses: ['context', 'format'],
      variables: ['topic', 'audience', 'constraints', 'goals'],
      content: `**Creative Brief:**
- **Topic:** {topic}
- **Target Audience:** {audience}
- **Goals:** {goals}
- **Constraints:** {constraints}

**Request:** Please help me brainstorm creative ideas by:
1. Generating diverse, innovative concepts
2. Explaining the rationale behind each idea
3. Considering different perspectives and approaches
4. Providing implementation suggestions

**Desired Output:**
- 5-10 unique ideas
- Brief explanation for each
- Pros and cons analysis
- Next steps for development`
    });

    // Analysis templates
    this.addTemplate({
      id: 'analysis_data_review',
      category: 'analysis',
      name: 'Data Analysis',
      description: 'Template for data analysis requests',
      priority: 85,
      addresses: ['context', 'specificity', 'format'],
      variables: ['dataset', 'objective', 'methodology', 'constraints'],
      content: `**Analysis Objective:** {objective}

**Dataset Description:** {dataset}

**Methodology Preferences:** {methodology}

**Constraints:** {constraints}

**Request:** Please analyze this data and provide:

**1. Initial Assessment:**
- Data quality evaluation
- Key patterns and trends
- Potential issues or limitations

**2. Detailed Analysis:**
- Statistical summaries
- Correlation analysis
- Trend identification
- Anomaly detection

**3. Insights and Recommendations:**
- Key findings
- Business implications
- Recommended actions
- Areas for further investigation

**Deliverables:** Clear visualizations, statistical results, and actionable insights.`
    });

    // Business templates
    this.addTemplate({
      id: 'business_strategy',
      category: 'business',
      name: 'Business Strategy',
      description: 'Template for business strategy discussions',
      priority: 85,
      addresses: ['context', 'specificity'],
      variables: ['situation', 'objectives', 'constraints', 'timeline'],
      content: `**Business Situation:** {situation}

**Objectives:** {objectives}

**Constraints:** {constraints}

**Timeline:** {timeline}

**Strategic Request:** Please help me develop a business strategy by addressing:

**1. Situation Analysis:**
- Current state assessment
- Market opportunities and threats
- Internal strengths and weaknesses

**2. Strategic Options:**
- Multiple strategic approaches
- Risk assessment for each option
- Resource requirements

**3. Implementation Plan:**
- Prioritized action items
- Timeline and milestones
- Success metrics
- Risk mitigation strategies

**Expected Outcome:** A practical, actionable strategy that aligns with our objectives and constraints.`
    });

    // Academic templates
    this.addTemplate({
      id: 'academic_research',
      category: 'academic',
      name: 'Research Assistance',
      description: 'Template for academic research help',
      priority: 85,
      addresses: ['context', 'specificity', 'format'],
      variables: ['topic', 'scope', 'methodology', 'sources'],
      content: `**Research Topic:** {topic}

**Scope:** {scope}

**Methodology:** {methodology}

**Source Requirements:** {sources}

**Research Request:** Please assist with this research by providing:

**1. Literature Review:**
- Key theories and concepts
- Recent developments in the field
- Gaps in current research

**2. Research Framework:**
- Suggested methodology
- Data collection approaches
- Analysis techniques

**3. Academic Resources:**
- Relevant academic papers
- Key authors and experts
- Important databases and sources

**4. Structure Guidance:**
- Outline suggestions
- Key arguments to address
- Potential counterarguments

**Academic Standards:** Please ensure all suggestions meet academic rigor and citation requirements.`
    });

    // Role-based templates
    this.addTemplate({
      id: 'role_expert_consultant',
      category: 'general',
      name: 'Expert Consultant',
      description: 'Template with expert role definition',
      priority: 75,
      addresses: ['role', 'context'],
      variables: ['expertise', 'problem', 'context'],
      content: `Act as an expert consultant with deep expertise in {expertise}.

**Context:** {context}

**Challenge:** {problem}

**Your Mission:** Provide expert-level guidance that demonstrates:
- Deep understanding of the subject matter
- Practical, actionable recommendations
- Industry best practices and standards
- Potential risks and mitigation strategies
- Implementation considerations

**Deliverable Style:**
- Professional and authoritative tone
- Evidence-based recommendations
- Clear explanation of reasoning
- Structured, easy-to-follow format

Please draw upon your expertise to provide comprehensive guidance that a senior consultant would deliver to an important client.`
    });

    // Quick enhancement templates
    this.addTemplate({
      id: 'quick_context_boost',
      category: 'general',
      name: 'Context Booster',
      description: 'Quick template to add context',
      priority: 60,
      addresses: ['context'],
      variables: ['original_prompt'],
      content: `**Background Context:** I'm working on a project where [describe your situation, role, and goals].

**Specific Challenge:** {original_prompt}

**Additional Context:** 
- My experience level: [beginner/intermediate/advanced]
- Timeline: [immediate/this week/flexible]
- Resources available: [time, tools, budget constraints]

Please provide guidance that takes this context into account.`
    });

    this.addTemplate({
      id: 'quick_format_specifier',
      category: 'general',
      name: 'Format Specifier',
      description: 'Quick template to specify output format',
      priority: 55,
      addresses: ['format'],
      variables: ['original_prompt'],
      content: `{original_prompt}

**Please format your response as:**
- Clear headings for main sections
- Bullet points for key information
- Numbered steps for processes
- Examples where applicable
- Summary of key takeaways

**Structure:** Introduction → Main Content → Practical Examples → Summary/Next Steps`
    });
  }

  /**
   * Adds a template to the system
   * @param {Object} template - Template object
   */
  addTemplate(template) {
    // Validate template
    if (!this.validateTemplate(template)) {
      throw new Error('Invalid template format');
    }

    // Generate ID if not provided
    if (!template.id) {
      template.id = this.generateTemplateId(template.name);
    }

    // Add timestamps
    template.createdAt = template.createdAt || Date.now();
    template.updatedAt = Date.now();

    // Store template
    this.templates.set(template.id, template);

    // Add to category
    if (this.categories.has(template.category)) {
      const category = this.categories.get(template.category);
      if (!category.templates.includes(template.id)) {
        category.templates.push(template.id);
      }
    }

    return template.id;
  }

  /**
   * Gets a template by ID
   * @param {string} templateId - Template ID
   * @returns {Object|null} Template object or null
   */
  getTemplate(templateId) {
    return this.templates.get(templateId) || null;
  }

  /**
   * Gets all templates in a category
   * @param {string} categoryId - Category ID
   * @returns {Array} Array of template objects
   */
  getTemplatesByCategory(categoryId) {
    const category = this.categories.get(categoryId);
    if (!category) return [];

    return category.templates
      .map(id => this.templates.get(id))
      .filter(template => template !== undefined);
  }

  /**
   * Searches templates by query
   * @param {string} query - Search query
   * @param {Object} filters - Search filters
   * @returns {Array} Array of matching templates
   */
  searchTemplates(query, filters = {}) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    for (const template of this.templates.values()) {
      let matches = false;

      // Text search
      if (template.name.toLowerCase().includes(lowerQuery) ||
          template.description.toLowerCase().includes(lowerQuery) ||
          template.content.toLowerCase().includes(lowerQuery)) {
        matches = true;
      }

      // Tag search
      if (template.tags && template.tags.some(tag => 
          tag.toLowerCase().includes(lowerQuery))) {
        matches = true;
      }

      // Apply filters
      if (matches && filters.category && template.category !== filters.category) {
        matches = false;
      }

      if (matches && filters.addresses && !template.addresses?.some(addr => 
          filters.addresses.includes(addr))) {
        matches = false;
      }

      if (matches) {
        results.push({
          ...template,
          relevanceScore: this.calculateRelevance(template, query)
        });
      }
    }

    // Sort by relevance
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Gets template suggestions for a prompt analysis
   * @param {Object} analysis - Prompt analysis
   * @returns {Array} Array of suggested templates
   */
  getTemplateSuggestions(analysis) {
    const suggestions = [];

    for (const template of this.templates.values()) {
      let score = 0;

      // Score based on issues addressed
      if (template.addresses) {
        analysis.issues.forEach(issue => {
          if (template.addresses.includes(issue.type)) {
            score += issue.severity === 'high' ? 30 : 
                   issue.severity === 'medium' ? 20 : 10;
          }
        });
      }

      // Score based on category match
      if (template.category === analysis.category) {
        score += 25;
      }

      // Score based on template priority
      score += template.priority || 0;

      // Score based on recent usage
      if (this.recentlyUsed.includes(template.id)) {
        score += 10;
      }

      // Score based on favorites
      if (this.favorites.has(template.id)) {
        score += 15;
      }

      if (score > 20) { // Minimum threshold
        suggestions.push({
          template,
          score,
          relevanceReasons: this.getRelevanceReasons(template, analysis)
        });
      }
    }

    return suggestions.sort((a, b) => b.score - a.score);
  }

  /**
   * Applies a template to a prompt
   * @param {string} templateId - Template ID
   * @param {string} originalPrompt - Original prompt text
   * @param {Object} variables - Variable values
   * @returns {string} Enhanced prompt
   */
  applyTemplate(templateId, originalPrompt, variables = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let content = template.content;

    // Replace variables
    const allVariables = {
      prompt: originalPrompt,
      original_prompt: originalPrompt,
      ...variables
    };

    Object.entries(allVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      content = content.replace(regex, value || `[${key}]`);
    });

    // Track usage
    this.trackTemplateUsage(templateId);

    return content;
  }

  /**
   * Creates a custom user template
   * @param {Object} templateData - Template data
   * @returns {string} Template ID
   */
  createUserTemplate(templateData) {
    const template = {
      ...templateData,
      id: this.generateTemplateId(templateData.name),
      isUserCreated: true,
      category: templateData.category || 'general'
    };

    const templateId = this.addTemplate(template);
    this.userTemplates.set(templateId, template);

    return templateId;
  }

  /**
   * Updates an existing template
   * @param {string} templateId - Template ID
   * @param {Object} updates - Updates to apply
   */
  updateTemplate(templateId, updates) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Only allow updates to user-created templates
    if (!template.isUserCreated) {
      throw new Error('Cannot modify system templates');
    }

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: Date.now()
    };

    this.templates.set(templateId, updatedTemplate);
    this.userTemplates.set(templateId, updatedTemplate);
  }

  /**
   * Deletes a user template
   * @param {string} templateId - Template ID
   */
  deleteTemplate(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return;

    if (!template.isUserCreated) {
      throw new Error('Cannot delete system templates');
    }

    this.templates.delete(templateId);
    this.userTemplates.delete(templateId);
    this.favorites.delete(templateId);

    // Remove from category
    const category = this.categories.get(template.category);
    if (category) {
      category.templates = category.templates.filter(id => id !== templateId);
    }

    // Remove from recent usage
    this.recentlyUsed = this.recentlyUsed.filter(id => id !== templateId);
  }

  /**
   * Toggles template favorite status
   * @param {string} templateId - Template ID
   */
  toggleFavorite(templateId) {
    if (this.favorites.has(templateId)) {
      this.favorites.delete(templateId);
    } else {
      this.favorites.add(templateId);
    }
  }

  /**
   * Gets favorite templates
   * @returns {Array} Array of favorite templates
   */
  getFavoriteTemplates() {
    return Array.from(this.favorites)
      .map(id => this.getTemplate(id))
      .filter(template => template !== null);
  }

  /**
   * Gets recently used templates
   * @param {number} limit - Maximum number of templates to return
   * @returns {Array} Array of recently used templates
   */
  getRecentlyUsedTemplates(limit = 10) {
    return this.recentlyUsed
      .slice(0, limit)
      .map(id => this.getTemplate(id))
      .filter(template => template !== null);
  }

  /**
   * Gets all categories
   * @returns {Array} Array of category objects
   */
  getCategories() {
    return Array.from(this.categories.entries()).map(([id, category]) => ({
      id,
      ...category
    }));
  }

  /**
   * Validates template format
   * @param {Object} template - Template to validate
   * @returns {boolean} True if valid
   */
  validateTemplate(template) {
    return !!(template.name && 
             template.content && 
             template.category &&
             template.description);
  }

  /**
   * Generates a unique template ID
   * @param {string} name - Template name
   * @returns {string} Generated ID
   */
  generateTemplateId(name) {
    const base = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    let id = base;
    let counter = 1;
    
    while (this.templates.has(id)) {
      id = `${base}_${counter}`;
      counter++;
    }
    
    return id;
  }

  /**
   * Calculates relevance score for search
   * @param {Object} template - Template object
   * @param {string} query - Search query
   * @returns {number} Relevance score
   */
  calculateRelevance(template, query) {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Name match (highest weight)
    if (template.name.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }

    // Description match
    if (template.description.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }

    // Content match
    if (template.content.toLowerCase().includes(lowerQuery)) {
      score += 20;
    }

    // Tag match
    if (template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
      score += 40;
    }

    // Recent usage boost
    if (this.recentlyUsed.includes(template.id)) {
      score += 10;
    }

    // Favorite boost
    if (this.favorites.has(template.id)) {
      score += 15;
    }

    return score;
  }

  /**
   * Gets relevance reasons for template suggestion
   * @param {Object} template - Template object
   * @param {Object} analysis - Prompt analysis
   * @returns {Array} Array of relevance reasons
   */
  getRelevanceReasons(template, analysis) {
    const reasons = [];

    if (template.addresses) {
      analysis.issues.forEach(issue => {
        if (template.addresses.includes(issue.type)) {
          reasons.push(`Addresses ${issue.type} issue`);
        }
      });
    }

    if (template.category === analysis.category) {
      reasons.push(`Matches ${analysis.category} category`);
    }

    if (this.recentlyUsed.includes(template.id)) {
      reasons.push('Recently used');
    }

    if (this.favorites.has(template.id)) {
      reasons.push('Favorite template');
    }

    return reasons;
  }

  /**
   * Tracks template usage for analytics
   * @param {string} templateId - Template ID
   */
  trackTemplateUsage(templateId) {
    // Add to recent usage (move to front)
    this.recentlyUsed = [templateId, ...this.recentlyUsed.filter(id => id !== templateId)];
    
    // Keep only last 20 recent items
    this.recentlyUsed = this.recentlyUsed.slice(0, 20);

    // Update usage count
    const template = this.getTemplate(templateId);
    if (template) {
      template.usageCount = (template.usageCount || 0) + 1;
      template.lastUsed = Date.now();
    }
  }

  /**
   * Exports templates for backup
   * @param {boolean} includeUserOnly - Export only user templates
   * @returns {Object} Export data
   */
  exportTemplates(includeUserOnly = false) {
    const templates = includeUserOnly 
      ? Array.from(this.userTemplates.values())
      : Array.from(this.templates.values());

    return {
      templates,
      categories: Array.from(this.categories.entries()),
      favorites: Array.from(this.favorites),
      exportDate: Date.now(),
      version: '1.0'
    };
  }

  /**
   * Imports templates from backup
   * @param {Object} data - Import data
   */
  importTemplates(data) {
    if (!data.templates || !Array.isArray(data.templates)) {
      throw new Error('Invalid import data format');
    }

    data.templates.forEach(template => {
      if (this.validateTemplate(template)) {
        this.addTemplate(template);
        if (template.isUserCreated) {
          this.userTemplates.set(template.id, template);
        }
      }
    });

    // Import favorites
    if (data.favorites) {
      data.favorites.forEach(id => {
        if (this.templates.has(id)) {
          this.favorites.add(id);
        }
      });
    }
  }
}

// Make TemplateManager available globally
window.TemplateManager = TemplateManager;