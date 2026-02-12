# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### `ci.yml` - Continuous Integration

**Triggers:**
- Push to `master`, `main`, or `testing-infrastructure` branches
- Pull requests to `master` or `main`

**Jobs:**

#### 1. Test & Build
- Runs on: Ubuntu Latest with Node.js 20.x
- Steps:
  1. **Checkout** - Clones the repository
  2. **Setup Node.js** - Configures Node.js 20.x with npm caching
  3. **Install dependencies** - Runs `npm ci` for clean install
  4. **Linter** - Runs ESLint (continues on error)
  5. **Unit tests** - Runs full test suite (256 tests)
  6. **Registry validation** - Validates A2UI component registry (19 tests)
  7. **Build** - Compiles TypeScript and builds Next.js production bundle
  8. **Upload artifacts** - Saves build output for 7 days

#### 2. Test Coverage
- Runs on: Ubuntu Latest
- Depends on: Test & Build job
- Steps:
  1. **Checkout** - Clones the repository
  2. **Setup Node.js** - Configures Node.js 20.x
  3. **Install dependencies** - Runs `npm ci`
  4. **Coverage tests** - Generates coverage report
  5. **Upload coverage** - Saves coverage reports for 30 days

## Test Scripts

The following npm scripts are used in CI:

```bash
# Run all tests
npm run test:run

# Run registry validation tests only
npm run test:registry

# Run tests with coverage report
npm run test:coverage

# Run interactive test UI (local development)
npm run test:ui
```

## Expected Results

**Passing CI requires:**
- ✅ All 256 unit tests passing (88.3%+ pass rate)
- ✅ All 19 registry validation tests passing
- ✅ TypeScript compilation successful
- ✅ Next.js build successful

## Local Testing

Test the CI pipeline locally before pushing:

```bash
# Run linter
npm run lint

# Run all tests
npm run test:run

# Validate registry
npm run test:registry

# Build project
npm run build
```

## Artifacts

**Build Artifacts** (retention: 7 days)
- Path: `.next/`
- Contains: Production build output
- Use: Deploy to hosting platforms

**Coverage Reports** (retention: 30 days)
- Path: `coverage/`
- Contains: Test coverage analysis
- Use: Review code coverage metrics

## Troubleshooting

### Tests Failing
- Check test output for specific failures
- Run `npm run test:ui` locally for interactive debugging
- Verify all dependencies are installed with `npm ci`

### Build Failing
- Check TypeScript errors
- Verify all imports resolve correctly
- Run `npm run build` locally to reproduce

### Registry Validation Failing
- Ensure all components are properly registered
- Check schema definitions are valid
- Verify catalog entries are complete
- Run `npm run test:registry` locally

## Maintenance

- Review workflow runs regularly
- Update Node.js version as needed
- Adjust test timeouts if necessary
- Keep dependencies up to date

---

**Last Updated:** 2026-02-12
**Owner:** Development Team
