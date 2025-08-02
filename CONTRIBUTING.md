# Contributing to AI Prompt Enhancer

Thank you for your interest in contributing to AI Prompt Enhancer! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use [GitHub Issues](https://github.com/Dev-NotAqua/ai-prompt-enhancer/issues) to report bugs
- Search existing issues before creating new ones
- Provide detailed reproduction steps
- Include browser version, OS, and extension version

### Suggesting Features
- Use [GitHub Discussions](https://github.com/Dev-NotAqua/ai-prompt-enhancer/discussions) for feature requests
- Explain the use case and expected behavior
- Consider privacy and security implications

### Code Contributions
1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## 🛠️ Development Setup

### Prerequisites
```bash
# Required
Node.js 16+ and npm 8+
Git

# Optional but recommended
Chrome/Firefox for testing
Visual Studio Code
```

### Initial Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-prompt-enhancer.git
cd ai-prompt-enhancer

# Add upstream remote
git remote add upstream https://github.com/Dev-NotAqua/ai-prompt-enhancer.git

# Install dependencies
npm install

# Start development mode
npm run dev
```

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run lint        # Check code style
npm run test        # Run tests
npm run validate    # Validate extension

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

## 📋 Code Standards

### JavaScript Style
- Use ES2021+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Prefer `const` over `let`, avoid `var`

```javascript
/**
 * Analyzes a prompt for quality and issues
 * @param {string} text - The prompt text to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} Analysis results
 */
function analyzePrompt(text, options = {}) {
  // Implementation
}
```

### CSS Style
- Follow BEM methodology for class names
- Use CSS custom properties for theming
- Mobile-first responsive design
- Consistent spacing (4px, 8px, 12px, 16px, etc.)

```css
.ai-prompt-enhancer-overlay {
  /* Component styles */
}

.ai-overlay__container {
  /* Element styles */
}

.ai-overlay__container--visible {
  /* Modifier styles */
}
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or tool changes

## 🏗️ Project Architecture

### Core Components
```
src/
├── analyzer.js      # Prompt analysis engine
├── enhancer.js      # Enhancement suggestions
├── platforms.js     # Platform detection
├── templates.js     # Template management
└── ui/             # UI components
    ├── overlay.js   # Quick suggestions overlay
    └── panel.js     # Detailed enhancement panel
```

### Key Design Principles
1. **Privacy First**: All processing must be local
2. **Platform Agnostic**: Work across all AI platforms
3. **Non-Intrusive**: Don't break existing UX
4. **Performance**: Fast analysis and rendering
5. **Extensible**: Easy to add new platforms/features

### Extension Architecture
- **Manifest V3** service worker
- **Content scripts** for page interaction
- **Local storage** for settings and templates
- **Message passing** between components

## 🧪 Testing

### Test Types
```bash
# Unit tests (Jest)
npm run test:unit

# Integration tests
npm run test:integration

# Manual testing
npm run serve  # Start test server
```

### Testing Guidelines
- Test core functionality thoroughly
- Mock browser APIs in tests
- Test error conditions
- Verify privacy requirements

### Manual Testing Checklist
- [ ] Load extension in Chrome/Firefox
- [ ] Test on all supported platforms
- [ ] Verify suggestions appear correctly
- [ ] Test template application
- [ ] Check settings persistence
- [ ] Validate privacy compliance

## 📝 Adding New Features

### Adding a New AI Platform
1. Update `data/platforms.json` with platform config
2. Add detection logic in `src/platforms.js`
3. Test selectors work correctly
4. Add platform theme in CSS files
5. Update documentation

### Adding New Templates
1. Add template to `data/templates.json`
2. Ensure proper categorization
3. Test variable substitution
4. Add usage examples
5. Update template documentation

### Adding New Analysis Rules
1. Add rule to `data/rules.json`
2. Implement detection logic in `src/analyzer.js`
3. Add corresponding enhancement in `src/enhancer.js`
4. Write tests for the new rule
5. Document the enhancement

## 🔒 Security & Privacy

### Security Requirements
- No `eval()` or dynamic code execution
- Sanitize all user inputs
- Use CSP-compliant code
- Validate all external data

### Privacy Requirements
- No external API calls for prompt analysis
- No user data collection without consent
- Local-only processing
- Optional, anonymous analytics only

### Privacy Review Checklist
- [ ] No external network requests for analysis
- [ ] User data stays local
- [ ] Clear privacy policy
- [ ] Opt-in analytics only
- [ ] Secure data storage

## 📚 Documentation

### Documentation Requirements
- Update README.md for user-facing changes
- Add JSDoc comments for all functions
- Update CHANGELOG.md
- Add examples for new features

### Documentation Style
- Clear, concise language
- Step-by-step instructions
- Code examples where helpful
- Screenshots for UI changes

## 🚀 Release Process

### Pre-release Checklist
- [ ] All tests pass
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Version bumped
- [ ] CHANGELOG.md updated

### Release Steps
1. Update version in `manifest.json` and `package.json`
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Create GitHub release
6. Submit to browser stores

## 🎯 Contribution Areas

### High Priority
- Bug fixes for existing features
- Performance improvements
- Additional AI platform support
- Mobile browser compatibility

### Medium Priority
- New template categories
- UI/UX improvements
- Accessibility enhancements
- Internationalization

### Future Considerations
- Team collaboration features
- Template sharing marketplace
- Advanced analytics
- AI model-specific optimizations

## 💬 Community

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussion and questions
- **Pull Requests**: Code contributions

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow GitHub's community guidelines

## ❓ Getting Help

### For Contributors
- Check existing documentation first
- Search GitHub issues and discussions
- Ask questions in GitHub Discussions
- Tag maintainers for urgent issues

### For Users
- Check README.md and Wiki
- Search existing issues
- Create new issue with details
- Use appropriate issue templates

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - Urgent issues
- `platform:chrome` - Chrome-specific
- `platform:firefox` - Firefox-specific

## 📋 Pull Request Template

When creating a PR, please include:
- Description of changes
- Issue number (if applicable)
- Testing performed
- Screenshots (if UI changes)
- Checklist completion

Thank you for contributing to AI Prompt Enhancer! 🙏