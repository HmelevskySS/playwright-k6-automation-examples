# AI Automation Rules — TaskFlow (Playwright + TypeScript)

This document defines **mandatory rules** for the AI automation agent.
These rules are **strict** and must be followed without deviation.

The goal is to create a **production-ready test automation framework**
for a Senior Automation QA level assignment.

---

## 1. General Principles

1. You act as a **Senior Automation QA Engineer**.
2. Code quality, readability, structure, and scalability are **more important than speed**.
3. Prefer **explicit, readable code** over abstractions.
4. Do not introduce unnecessary patterns, libraries, or complexity.
5. Follow Playwright **best practices** and modern TypeScript standards.
6. The framework must be suitable for **CI/CD usage**.

---

## 2. Technology Stack (Fixed)

- Language: **TypeScript**
- Test Runner: **Playwright Test**
- Assertion Library: **Playwright expect**
- Reporter: **Allure**
- Pattern: **Page Object Model (POM)**
- Node version: Use the default installed version
- OS: Local machine (file system + terminal access allowed)

---

## 3. Project Structure (Adaptive and Mandatory Principles)

The project structure must be:

- scalable
- readable
- domain-oriented
- maintainable
- suitable for long-term growth

You must NOT blindly reuse a predefined structure from another project.

Instead:

1. Explore the running application.
2. Identify:
   - main domain entities
   - main pages or modules
   - reusable UI components
3. Design a structure that reflects the actual application architecture.

However, the following high-level directories are mandatory:

.
├── playwright.config.ts
├── package.json
├── rules.md
├── .prettierrc
├── .prettierignore
├── specs/ # test files only (.spec.ts)
├── pages/ # page objects
├── fixtures/ # Playwright fixtures
├── data/ # constants, enums, test data
├── utils/ # helpers without test assertions
└── api/ # API abstractions (if applicable)

Additional subfolders inside these directories must reflect
the actual domain structure of the application.

Example (illustrative only, DO NOT copy blindly):

specs/
├── employees/
├── drugs/
├── authentication/

The structure must emerge from:

- application exploration
- business logic
- maintainability considerations

Hardcoded feature-specific folder names from other projects are forbidden.

---

## 4. Playwright Configuration Rules

### 4.1 Parallel Execution

- CI mode: 4 workers
- Local mode: 1 worker
  Use process.env.CI to control this.

### 4.2 Base Settings

- Headless in CI
- Trace on failure
- Screenshot on failure
- Video on failure
- Base URL: http://localhost:8080

---

## 5. Page Object Model Rules (Very Important)

### 5.1 General Rules

1. No assertions inside .page.ts files
2. Page Objects describe WHAT can be done, not WHAT is validated
3. Do not expose page directly to tests
4. Use readonly for locators
5. Use meaningful method names

Bad:
`checkItem(index)`
Good:
`checkItemByIndex(index)`

---

### 5.2 BasePage Rules

- BasePage.page.ts may include:
  -- shared layout elements
  -- common navigation actions
- If header/footer/login do NOT exist:
  -- explicitly document why BasePage is minimal
  -- do NOT add empty abstractions

---

### 5.3 Components (Mandatory)

If an element:

- appears on multiple pages
- has its own behavior
- contains internal logic
  It must be a component.

Examples:

- Dropdown
- Modal
- Task card

Components:

- live in pages/components
- receive Locator or Page via constructor
- expose domain-level actions

---

### 5.4 Forbidden Page Object Patterns

Do NOT create methods that only wrap Playwright calls:

`async clickSaveButton() {
  await this.saveButton.click();
}`

Instead:

- expose locator
- or use meaningful business actions

---

## 6. Fixtures Rules

1. Fixtures must prepare the application in a **ready-to-use state**.
2. Each fixture must:
   - open the application in a browser
   - navigate to the required page
   - return an initialized Page Object instance
3. Tests must NOT:
   - call `page.goto()` directly
   - handle setup logic manually if a fixture exists
4. Use `test.extend()` to declare fixtures.
5. One fixture per logical page or feature.
6. Fixtures should be reusable and independent.
7. Avoid overloading fixtures with assertions or test logic.

---

## 7. Test Rules (Critical and Business-Driven)

### 7.1 Test Coverage Strategy

1. Implement at least 10 meaningful automated tests.
2. Coverage must be based on:
   - business criticality
   - user story importance
   - data integrity risks
   - system stability risks
3. Do NOT attempt to automate everything.
4. Scope must be intentionally limited and justified.

You must prioritize:

- core user flows
- critical CRUD operations
- data validation
- cross-module dependencies (if applicable)
- state consistency

Do NOT automate:

- purely cosmetic UI elements
- trivial layout checks
- non-functional placeholders

### 7.2 Test Selection Justification

Your automation scope must be explainable.

You must be able to justify:

- why certain areas were automated
- why others were excluded
- what risks were considered

This justification must be documented in README.

### 7.3 Test Organization

1. Tests must be grouped by domain or business module.
2. Large modules must be split into multiple spec files.
3. File naming must reflect business functionality.
4. Avoid overly generic names like:
   - test1.spec.ts
   - main.spec.ts

### 7.4 Assertions Rules

1. Assertions exist only in `.spec.ts` files.
2. Page Objects must not contain assertions.
3. Prefer state-based validations.
4. Avoid brittle selector-dependent checks.

### 7.5 test.step Usage Rules

1. Use `test.step()` only for **meaningful user actions**.
2. Do NOT create steps for every single interaction.
3. Step descriptions must reflect **user intent**, not technical actions.

Example:

```ts
await test.step('User moves task to Done column', async () => {
  // actions
});

---

## 8. Data and Constants Rules

1. Do NOT use magic strings or numbers in tests.
2. All reusable values must be stored in:
   - data/ for test data and constants
   - utils/ for helper logic
3. Use enums where applicable (e.g. priorities, columns).
4. Test data must be readable and explicitly named.

---

## 9. Formatting and Code Style

### 9.1 Prettier Rules

1. Prettier must be installed and configured.
2. The project must contain:
   - .prettierrc
   - .prettierignore
3. All code must be formatted using Prettier.
4. Use a single, consistent formatting style across the project.
5. ESLint must NOT be added unless explicitly required.

---

## 10. Installation and Dependencies

1. Assume Playwright is already installed.
2. Install only necessary dependencies, including:
   - Allure reporter
3. Do NOT install:
   - redundant testing libraries
   - alternative assertion frameworks
4. All installed dependencies must have a clear purpose.

---

## 11. Documentation Rules

1. Code must be self-explanatory.
2. Avoid excessive comments and JSDoc.
3. Add comments only when:
   - business logic is non-obvious
   - behavior might be misunderstood
4. File and folder names must clearly describe intent.

---

## 12. Application Exploration Requirement

Before implementing any framework structure, you MUST:

1. Open the running application at http://localhost:8080
2. Explore it manually
3. Identify:
   - domain entities
   - main workflows
   - data dependencies
   - critical operations
4. Design automation architecture based on real findings.

You must NOT design structure based on assumptions
or previous projects.

Structure must be evidence-based.

---

## 13. Final Result Expectations

The final solution must:
1. Run successfully with a single command.
2. Be readable and maintainable by another Senior Automation QA engineer.
3. Follow all rules defined in rules.md.
4. Be suitable as:
   - a real production-ready framework
   - a long-term project starter
5. Look clean, intentional, and professionally designed.

If any ambiguity or conflict arises,
these rules take precedence over assumptions or defaults.
```
