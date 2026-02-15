# Playwright automation & K6 Performance project

This repository is a production-style solution for the web application.
It includes:

- UI automation on Saucedemo with Playwright + TypeScript
- API performance testing with k6
- CI-ready setup
- test and performance reporting

## What Was Implemented

### UI automation coverage (Saucedemo)

Implemented deterministic tests for the critical user flows:

- successful login (`standard_user`)
- failed login (`locked_out_user`)
- adding product(s) to cart
- starting checkout
- completing checkout

In addition to the required scenarios, I added a small set of negative and state-consistency checks (13 tests total) to make the suite meaningful for regression usage, not just demo coverage.

### Performance coverage (ReqRes)

Implemented k6 scenario for:

- 100 concurrent users
- each user sends 1 request/second (`sleep(1)` pacing)
- meaningful duration for stable percentile observation

Artifacts:

- script: `api/performance/reqres-users.k6.js`
- report: `PERFORMANCE_REPORT.md`
- run summary: `reports/k6-summary.json`

## Stack

- TypeScript
- Playwright Test
- Allure + HTML report
- k6
- GitHub Actions

## Project Structure

```text
.
├── playwright.config.ts
├── package.json
├── specs/                 # test files only
├── pages/                 # POM + reusable UI components
├── fixtures/              # reusable setup via test.extend()
├── data/                  # constants and test data
├── utils/                 # shared helpers
├── api/                   # API/performance scripts
├── PERFORMANCE_REPORT.md
└── .github/workflows/ci.yml
```

## Architecture And Design Decisions

- POM boundary is strict: page objects expose actions and locators, but no assertions.
- Assertions live only in spec files.
- Tests use stable `data-test` locators.
- Fixtures prepare ready-to-test state; tests do not call `page.goto()` directly.
- No hard sleeps and no `waitForTimeout`; synchronization is done through Playwright auto-waiting, locators, and assertions.
- Base abstractions are intentionally minimal to avoid unnecessary framework weight.

## Trade-offs

- I chose broader business-critical coverage (13 tests) over only 4 “minimum” scenarios, because this gives better signal in CI.
- For k6, I used user-concurrency modeling (`vus + sleep(1)`) to match the assignment’s “100 concurrent users, 1 req/sec per user” intent.
- ReqRes now requires API key auth for success-path responses. The suite still measures latency/throughput without a key, but success/error interpretation must account for auth status.

## Setup

### Prerequisites

- Node.js (LTS)
- npm
- k6 installed locally and available in PATH

Example on macOS:

```bash
brew install k6
k6 version
```

### Install project dependencies

```bash
npm install
```

### Environment (optional)

```bash
cp .env.example .env
```

## How To Run UI Tests

Main command:

```bash
npx playwright test
```

Additional:

```bash
npm run test:headed
npm run test:ui
npm run test:report
npm run allure:generate
npm run allure:open
```

## How To Run Performance Test

Main command:

```bash
npm run perf:test
```

Quick local check:

```bash
npm run perf:test:quick
```

Optional success-path run (if you have ReqRes API key):

```bash
REQRES_API_KEY=<your_key> ENFORCE_THRESHOLDS=true npm run perf:test
```

## Tooling Notes

- Playwright config includes:
  - HTML reporter
  - Allure reporter
  - trace/screenshot/video retention on failure
  - CI/local worker strategy (`CI ? 4 : 1`)
  - environment-based base URL and headless behavior
- k6 output is exported to JSON for repeatable analysis and CI artifacts.

## CI/CD Readiness

Workflow file: `.github/workflows/ci.yml`

Pipeline jobs:

- Playwright UI tests with report artifacts
- k6 smoke performance execution with exported summary artifact

## Reflection

### 1) How to integrate Playwright into CI/CD?

Run smoke tests on every PR, full regression on merge to main and nightly. Keep tests isolated, deterministic, and fail-fast on critical flows.

### 2) How to notify team about failures/regressions?

Send Slack/Teams notification with build link, failed tests, commit SHA, and owner. Separate flaky alerts from release-blocking regressions.

### 3) What to include in an E2E quality dashboard?

Pass rate trend, flake rate, average test duration, failure clustering by feature, MTTR for broken suites, and defect leakage after “green” pipelines.

### 4) How to decide what to automate and what not?

Automate stable, high-risk, business-critical paths with clear assertions and repeatability.
Do not automate low-value cosmetic checks or highly volatile UI details with poor ROI.
Functional testing validates correctness; performance testing validates latency, throughput, and behavior under load.
