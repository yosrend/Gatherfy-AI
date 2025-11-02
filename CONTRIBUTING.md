# Contributing to Gatherfy AI

Thank you for your interest in contributing to Gatherfy AI! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/yosrend/Gatherfy-AI/issues) page
- Provide a clear and descriptive title
- Include detailed steps to reproduce the issue
- Add screenshots if applicable
- Specify your environment (OS, browser, Node.js version)

### Suggesting Features

- Open an issue with the "enhancement" label
- Provide a clear description of the feature
- Explain why this feature would be valuable
- Consider including mockups or examples

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/Gatherfy-AI.git
   cd Gatherfy-AI
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Follow the development setup** (see below)

4. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup Steps

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/your-username/Gatherfy-AI.git
   cd Gatherfy-AI
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── [feature]/      # Feature-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles
│   └── supabase/           # Supabase configuration
├── docs/                   # Documentation
├── public/                 # Static assets
└── tests/                  # Test files
```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Provide explicit type annotations
- Prefer interfaces over types for object shapes
- Use proper generic types

### React

- Use functional components with hooks
- Follow React best practices
- Use descriptive component and prop names
- Implement proper error boundaries

### CSS/Tailwind

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic HTML elements

### Naming Conventions

- **Components**: PascalCase (`EventCard.tsx`)
- **Files**: kebab-case (`event-service.ts`)
- **Variables**: camelCase (`eventList`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add AI event generation
fix: resolve guest RSVP issue
docs: update API documentation
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Test both happy path and error cases
- Use descriptive test names
- Mock external dependencies

### Test Structure

```
src/
├── components/
│   └── EventCard.tsx
└── __tests__/
    └── components/
        └── EventCard.test.tsx
```

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of the code
- [ ] Code is properly commented
- [ ] Tests are added or updated
- [ ] Documentation is updated
- [ ] No console.log statements left
- [ ] No TODO comments without issues

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Approval** from at least one maintainer

## 🚀 Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create Git tag
4. Deploy to production

## 📚 Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tools

- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks

## 🤓 Getting Help

- **Discord**: [Join our community](https://discord.gg/gatherfy)
- **GitHub Discussions**: [Ask questions](https://github.com/yosrend/Gatherfy-AI/discussions)
- **Email**: dev@gatherfy.ai

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Gatherfy AI! 🎉