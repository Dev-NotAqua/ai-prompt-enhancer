# AI Prompt Enhancer ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Dev-NotAqua/ai-prompt-enhancer)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-brightgreen.svg)](https://chrome.google.com/webstore)

Universal browser extension that intelligently enhances prompts for AI chatbot platforms (ChatGPT, Claude, Gemini, etc.) to improve response quality and user productivity.

## 🚀 Features

### 🎯 **Smart Prompt Analysis**
- **Real-time Analysis**: Analyzes your prompts as you type
- **Quality Scoring**: Provides instant feedback on prompt quality (0-100 scale)
- **Issue Detection**: Identifies vagueness, missing context, and other problems
- **Enhancement Suggestions**: Offers specific improvements for better results

### 🌐 **Universal Platform Support**
- **ChatGPT** (chat.openai.com)
- **Claude** (claude.ai)
- **Gemini** (gemini.google.com)
- **GitHub Copilot Chat**
- **Bing Copilot** (copilot.microsoft.com)
- **Perplexity AI** (perplexity.ai)

### 📝 **Advanced Template System**
- **17+ Built-in Templates** across 6 categories:
  - General Purpose (5 templates)
  - Technical/Coding (3 templates)
  - Creative Writing (2 templates)
  - Data Analysis (2 templates)
  - Business Strategy (2 templates)
  - Academic Research (2 templates)
- **Custom Templates**: Create and share your own templates
- **Template Variables**: Dynamic placeholders for flexible templates
- **Category Filtering**: Organize templates by use case

### 🎨 **Non-Intrusive UI**
- **Smart Overlay**: Contextual suggestions that don't interrupt workflow
- **Detailed Panel**: Comprehensive enhancement options and template browser
- **Platform Theming**: Automatically adapts to each AI platform's design
- **Dark/Light Mode**: Follows system preferences or manual selection

### 🔒 **Privacy-First Design**
- **100% Local Processing**: All analysis happens in your browser
- **No External APIs**: No data sent to third-party servers
- **Optional Analytics**: Anonymous usage statistics (opt-in only)
- **Secure by Design**: Minimal permissions, maximum privacy

## 📦 Installation

### Chrome/Edge/Brave
1. Download the latest release from [GitHub Releases](https://github.com/Dev-NotAqua/ai-prompt-enhancer/releases)
2. Extract the ZIP file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

### Firefox
1. Download the latest `.xpi` file from [GitHub Releases](https://github.com/Dev-NotAqua/ai-prompt-enhancer/releases)
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded `.xpi` file

### From Chrome Web Store
*Coming soon - extension under review*

## 🎮 Usage

### Quick Start
1. **Install the extension** using the instructions above
2. **Visit any supported platform** (ChatGPT, Claude, etc.)
3. **Start typing** in the prompt input field
4. **See suggestions appear** in the enhancement overlay
5. **Click suggestions** to apply improvements instantly

### Enhancement Overlay
The overlay appears when you focus on a prompt input field and provides:
- **Quality Score**: Real-time assessment of your prompt (0-100)
- **Top Suggestions**: 3 most important improvements
- **Quick Actions**: One-click enhancements and template access

### Enhancement Panel
Access the detailed panel by:
- Clicking "Templates" in the overlay
- Using the keyboard shortcut (default: `Ctrl+Shift+E`)
- Clicking the extension icon and selecting "Open Panel"

The panel includes:
- **Suggestions Tab**: Detailed enhancement recommendations
- **Templates Tab**: Browse and apply templates by category
- **Settings Tab**: Configure extension behavior

### Popup Interface
Click the extension icon to access:
- **Extension Status**: Current platform and activity
- **Quick Stats**: Suggestions count, enhancements applied
- **Quick Actions**: Enhance current prompt, browse templates
- **Settings**: Toggle features and access advanced options

## 🛠️ Development

### Prerequisites
- Node.js 16+ and npm 8+
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/Dev-NotAqua/ai-prompt-enhancer.git
cd ai-prompt-enhancer

# Install dependencies
npm install

# Start development mode
npm run dev
```

### Development Scripts
```bash
# Watch for changes and rebuild
npm run watch

# Lint code
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Validate extension
npm run validate

# Format code
npm run format

# Start local server for testing
npm run serve
```

### Project Structure
```
ai-prompt-enhancer/
├── manifest.json              # Extension manifest (Manifest V3)
├── background.js              # Service worker
├── content.js                 # Content script entry point
├── popup.html/js/css         # Extension popup interface
├── options.html/js/css       # Settings page
├── src/                      # Source code
│   ├── analyzer.js           # Prompt analysis engine
│   ├── enhancer.js           # Enhancement suggestions
│   ├── platforms.js          # Platform detection & config
│   ├── templates.js          # Template management
│   └── ui/                   # UI components
│       ├── overlay.js/css    # Enhancement overlay
│       └── panel.js/css      # Detailed suggestion panel
├── data/                     # Configuration files
│   ├── templates.json        # Default templates
│   ├── platforms.json        # Platform configurations
│   └── rules.json            # Analysis rules
├── icons/                    # Extension icons
├── scripts/                  # Build and utility scripts
└── tests/                    # Test files
```

### Testing
Run the test suite:
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# All tests with coverage
npm test
```

Load the extension in Chrome for testing:
1. Run `npm run build` to create the distribution files
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory

## 📊 Template Categories

### General Purpose Templates
- **Detailed Request**: Comprehensive information requests
- **Problem Solving**: Structured problem-solving approach
- **Expert Consultant**: Role-based expert guidance
- **Context Booster**: Quick context addition
- **Format Specifier**: Output format specification

### Technical Templates
- **Code Help**: Programming assistance with best practices
- **Debugging Help**: Systematic debugging approach
- **Architecture Review**: System design evaluation

### Creative Templates
- **Creative Brainstorming**: Idea generation and evaluation
- **Story Development**: Narrative and character creation

### Analysis Templates
- **Data Analysis**: Comprehensive data review
- **Comparative Analysis**: Option comparison and evaluation

### Business Templates
- **Business Strategy**: Strategic planning and implementation
- **Market Analysis**: Market research and competitive landscape

### Academic Templates
- **Research Assistance**: Academic research methodology
- **Essay Structure**: Academic writing organization

## 🔧 Configuration

### Extension Settings
Access via the extension popup or options page:

#### General Settings
- **Enhancement Mode**: Automatic, Manual, or Disabled
- **Show Suggestions**: Toggle real-time suggestions
- **Auto-apply Templates**: Automatic template application
- **Theme**: Light, Dark, or Auto
- **Keyboard Shortcut**: Customize the enhancement hotkey

#### Platform Settings
Configure per-platform:
- **Enable/Disable**: Toggle extension for specific platforms
- **Custom Selectors**: Override default input field detection
- **Platform-specific Features**: Customize behavior per platform

#### Privacy Settings
- **Local Processing**: Always enabled (cannot be disabled)
- **Store Analytics**: Optional local usage statistics
- **Share Usage Data**: Optional anonymous data sharing

#### Advanced Settings
- **Analysis Delay**: Timing for real-time analysis
- **Minimum Prompt Length**: Threshold for analysis
- **Debug Mode**: Detailed logging for troubleshooting

### Template Customization
Create custom templates with:
- **Variables**: Dynamic placeholders (`{variable}`)
- **Categories**: Organize by use case
- **Priorities**: Control suggestion order
- **Addressing**: Specify which issues the template solves

Example custom template:
```json
{
  "name": "Custom Code Review",
  "category": "technical",
  "variables": ["language", "code", "concerns"],
  "content": "Please review this {language} code:\n\n```{language}\n{code}\n```\n\nSpecific concerns: {concerns}\n\nProvide feedback on:\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance optimizations\n4. Security considerations"
}
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contributing Guide
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (ESLint + Prettier)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and the [Wiki](https://github.com/Dev-NotAqua/ai-prompt-enhancer/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/Dev-NotAqua/ai-prompt-enhancer/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/Dev-NotAqua/ai-prompt-enhancer/discussions)

### Common Issues
1. **Extension not working**: Check if you're on a supported platform
2. **Suggestions not appearing**: Verify the extension is enabled in settings
3. **Performance issues**: Adjust the analysis delay in advanced settings

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Firefox Add-ons store release
- [ ] Safari extension support
- [ ] More AI platforms (Poe, Character.AI)
- [ ] Template sharing community
- [ ] Advanced prompt analytics

### Version 1.2 (Future)
- [ ] Team collaboration features
- [ ] Template marketplace
- [ ] AI model-specific optimizations
- [ ] Prompt history and favorites
- [ ] Export/import functionality

## 📈 Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Support for 6 major AI platforms
- 17 built-in templates across 6 categories
- Real-time prompt analysis and enhancement
- Privacy-first local processing
- Comprehensive settings and customization

## 🙏 Acknowledgments

- Thanks to all the AI platforms for creating amazing tools
- Inspired by the need for better human-AI interaction
- Built with modern web extension standards (Manifest V3)
- Special thanks to the open-source community

---

**Made with ❤️ for better AI interactions**

*If you find this extension helpful, please consider giving it a ⭐ on GitHub!*
