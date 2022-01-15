# orangehrm-jira-framework

Example automation project that separates OrangeHRM page objects, Jira payload builders, API helpers, and failure evidence handling.

## Highlights

- Node.js
- HTTP-based Jira integration
- Page object inspired UI layer
- Artifact upload helpers

## Getting Started

```bash
npm install
npm test
npm run test:ui
```

## Project Structure

- `tests/`
- `pages/`
- `jira/`
- `api/`
- `utils/`
- `reports/`

## Reporting

- HTML, JSON, and screenshot/video friendly output paths are pre-created.
- CI examples publish artifacts and preserve failure diagnostics.

## Contribution Guide

1. Create a branch from `develop`.
2. Keep helpers reusable and environment-driven.
3. Add or update validation tests with every framework change.
4. Document any new test data, report artifacts, and CI behavior.

## Notes

- Jira examples included:
- sample workflow 1
- sample workflow 2
- sample workflow 3
- sample workflow 4
- sample workflow 5
- sample workflow 6
- sample workflow 7
- sample workflow 8
- sample workflow 9
- sample workflow 10
- sample workflow 11
- sample workflow 12
- sample workflow 13
- - 2023: created focused repository split for OrangeHRM workflow coverage with Jira-ready defect helper utilities.

## Career Evolution & Historical Tests
The `original-tests` directory contains historical test suites and experiments from earlier stages of this project's lifecycle (2023-2025). This folder is preserved to demonstrate the evolution from initial test scripts to the modern, scalable framework architecture seen in the current `tests/` and `src/` directories.
