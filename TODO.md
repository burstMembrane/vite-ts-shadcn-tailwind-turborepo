# Production Readiness TODO

Items missing for a production-ready monorepo template:

## Testing

- [ ] Add Vitest for unit/integration tests
- [ ] Add Playwright or Cypress for E2E tests
- [ ] Configure test scripts in turbo.json pipeline

## CI/CD

- [ ] Add CI workflow for automated testing
- [ ] Add lint and typecheck to CI pipeline
- [ ] Configure build verification on PRs

## Environment Management

- [ ] Create strategy for handling secrets and environment variables
- [ ] Add Zod schema validation for env vars
- [ ] Add .env.example template

## Containerization

- [ ] Add Dockerfile for web app
- [ ] Add docker-compose.yml for local development
- [ ] Configure multi-stage builds for production

## Versioning

- [ ] Add changesets for package versioning
- [ ] Configure changelog generation
- [ ] Set up automated publishing workflow
