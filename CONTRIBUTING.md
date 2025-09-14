# Contributing to Handcrafted Haven

Thank you for your interest in contributing to Handcrafted Haven! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/handcrafted-haven.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `npm test`
7. Run linting: `npm run lint`
8. Commit your changes: `git commit -m "Add your feature"`
9. Push to your fork: `git push origin feature/your-feature-name`
10. Create a Pull Request

## Development Guidelines

### Code Style
- Follow the existing code style and conventions
- Use TypeScript for type safety
- Follow the design system defined in `DESIGN.md`
- Ensure all components are accessible (WCAG 2.1 Level AA)

### Commit Messages
Use clear, descriptive commit messages:
- `feat: add user authentication`
- `fix: resolve navigation issue on mobile`
- `docs: update README with new features`
- `style: update button hover states`

### Pull Request Process
1. Ensure your code follows the project's coding standards
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass
5. Request review from team members

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable React components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── ui/             # UI components (Button, Card, etc.)
│   └── features/       # Feature-specific components
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles and CSS
```

## Design System

Please refer to `DESIGN.md` for:
- Color palette and usage
- Typography guidelines
- Component design principles
- Accessibility requirements

## Testing

- Write unit tests for utility functions
- Write integration tests for components
- Test accessibility with screen readers
- Test responsive design on different devices

## Questions?

If you have questions about contributing, please:
1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Contact the development team

Thank you for contributing to Handcrafted Haven! 🎨
