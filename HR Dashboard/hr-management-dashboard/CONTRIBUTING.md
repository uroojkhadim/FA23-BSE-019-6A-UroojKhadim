# Contributing to HR Management Dashboard

Thank you for considering contributing to this project! 

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Why it would be useful
   - Potential implementation ideas

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Guidelines

### Code Style

- Use ESLint configuration provided
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Test all new features
- Ensure existing tests pass
- Add tests for bug fixes

### Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
- `feat: add candidate export to CSV`
- `fix: resolve authentication redirect issue`
- `docs: update API documentation`

## Project Structure

```
frontend/src/
├── components/    # Reusable UI components
├── pages/        # Page components
├── contexts/     # React contexts
├── services/     # API services
└── lib/          # Utilities

backend/src/
├── routes/       # API routes
├── middleware/   # Express middleware
└── config/       # Configuration
```

## Questions?

Feel free to reach out by creating an issue or discussion.

Thank you for contributing! 🙌
