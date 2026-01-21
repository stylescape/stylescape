# Development Guide

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/stylescape/stylescape.git
cd stylescape

# Install dependencies
npm install
```

### Development Workflow

```bash
# Start development server with hot reload
npm run dev

# Watch mode for continuous builds
npm run watch

# Build for production
npm run build

# Preview production build
npm run preview
```

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Check code formatting
npm run format:check

# Auto-format code
npm run format
```

### Type Checking

```bash
# Run TypeScript type checking
npm run typecheck
```

## Project Structure

```
stylescape/
├── src/
│   ├── scss/          # SCSS source files
│   ├── ts/            # TypeScript source files
│   ├── html/          # HTML templates
│   └── jinja/         # Jinja templates
├── dist/              # Built files (generated)
│   ├── css/           # Compiled CSS
│   ├── js/            # Compiled JavaScript
│   └── types/         # TypeScript declarations
├── doc/               # Documentation
├── .github/           # GitHub configuration
│   └── workflows/     # CI/CD workflows
└── tmp/               # Temporary files (not committed)
```

## Build System

The project uses **Kist** as the build system. Configuration files:

- `kist.dev.yml` - Development build configuration
- `kist.pro.yml` - Production build configuration

## Scripts Reference

| Script                 | Description                   |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start Vite development server |
| `npm run build`        | Production build using Kist   |
| `npm run watch`        | Watch mode with live reload   |
| `npm run preview`      | Preview production build      |
| `npm run lint`         | Lint JavaScript/TypeScript    |
| `npm run lint:fix`     | Fix linting issues            |
| `npm run format`       | Format all code files         |
| `npm run format:check` | Check code formatting         |
| `npm run typecheck`    | TypeScript type checking      |

## Code Style

### SCSS

- Use 2 spaces for indentation
- Follow BEM naming conventions
- Use mixins for reusable styles
- Keep nesting depth <= 4 levels
- Use meaningful variable names with prefixes

### TypeScript

- Use 2 spaces for indentation
- Enable strict mode
- Add JSDoc comments for public APIs
- Use explicit types where beneficial
- Follow functional programming patterns

### Formatting

The project uses:

- **Prettier** for code formatting
- **ESLint** for JavaScript/TypeScript linting
- **Stylelint** for SCSS linting
- **EditorConfig** for consistent editor settings

## Git Workflow

1. Create a feature branch from `dev`
2. Make your changes
3. Run linting and type checking
4. Commit with meaningful messages
5. Push and create a pull request
6. Wait for CI checks to pass

## Continuous Integration

GitHub Actions workflows:

- **CI** - Runs on every push/PR (lint, typecheck, build, test)
- **CodeQL** - Security analysis
- **Deploy Docs** - Deploys documentation
- **Publish Package** - Publishes to npm on version tags

## Testing

```bash
# Run tests (when available)
npm test
```

## Troubleshooting

### Build Issues

```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Type Errors

```bash
# Regenerate type declarations
npm run typecheck
```

## Contributing

Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on our code
of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE)
file for details.
