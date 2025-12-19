# Contributing to Cover Letter Maker

Thank you for your interest in contributing to Cover Letter Maker! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Node.js version, browser)
- Screenshots if applicable

### Suggesting Features

We love feature suggestions! Please create an issue with:

- A clear description of the feature
- Why this feature would be useful
- Any examples or mockups if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clear, concise commit messages
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

3. **Ensure your code works**
   - Test with different LLM providers
   - Test with different languages
   - Verify the UI works on mobile and desktop

4. **Update documentation** if needed
   - Update README.md if you've added features
   - Add comments to complex code

5. **Submit your pull request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Be responsive to feedback

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/coverlettermaker.git

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Code Style

- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Follow the existing code structure

## Testing

Before submitting a PR, please test:

- ✅ Resume upload and parsing
- ✅ Cover letter generation with different LLMs
- ✅ All supported languages
- ✅ Copy to clipboard functionality
- ✅ Settings persistence
- ✅ Mobile responsiveness

## License

By contributing, you agree that your contributions will be licensed under the Sustainable Use License.

## Questions?

Feel free to open an issue or discussion if you have any questions!

---

Thank you for contributing! 🎉

