---
description: TDD Cycle (Red-Green-Refactor) Follow this workflow for every feature or bug fix. Do not skip steps.
---

# AGENT TDD WORKFLOW

Follow this workflow for every feature or bug fix. Do not skip steps.

## PHASE 1: SETUP & STRATEGY

1.  **Understand the Goal:** Briefly restate the requirement or user story.
2.  **Identify the Test Subject:** Determine exactly which function, component, or class is being tested.
3.  **Check Environment:** Ensure `vitest` is configured (via `pnpm test:run`).

## PHASE 2: THE LOOP (Repeat until feature is complete)

### Step A: The Failing Test (Red)

1.  Create a new test file **in the same directory as the source file** (colocation).
2.  Write **one** Vitest test case describing the immediate next behavior.
    - _Reminder:_ Import from `vitest`.
3.  **STOP & RUN:** Execute the test (e.g., `pnpm test:run path/to/file`).
    - _Critical:_ Do NOT use `pnpm test path/to/file` directly as it may fail to pass arguments correctly. Always use `pnpm test:run`.
4.  **Output Analysis:**
    - If it passes: _ERROR_. The test is invalid. Rewrite it.
    - If it fails: Verify the error message matches expectations.

### Step B: The Implementation (Green)

1.  Write the implementation code in the co-located source file.
    - _Rule:_ Use the simplest logic possible (hardcoding values is acceptable if it satisfies the test).
2.  **STOP & RUN:** Execute the test (e.g., `pnpm test:run path/to/file`).
    - _Critical:_ Do NOT use `pnpm test path/to/file` directly. Use `pnpm test:run`.
3.  **Output Analysis:**
    - If it fails: Read the error, adjust code, retry.
    - If it passes: Move to Refactor.

### Step C: The Refactor (Refactor)

1.  Critique the code:
    - Are there magic numbers?
    - Is the naming clear?
    - Is there duplication?
2.  Apply improvements.
3.  **STOP & RUN:** Execute _all_ related tests using `pnpm test:run path/to/file`.
    - _Critical:_ Do NOT use `pnpm test` directly.

## TEST PERFORMANCE & OPTIMIZATION

Unit tests must be fast. If a test takes >20s to collect or run, it MUST be optimized:

1.  **Mock Heavy Stores:** Always prefer mocking heavy Zustand stores using a `__mocks__/store.ts` sibling. Vitest will automatically pick this up when you call `vi.mock('./store')`.
2.  **Mock Heavy Hooks:** Mock hooks that introduce heavy module dependencies (e.g., `useOligoData`) to keep test collection fast.
3.  **Target:** Individual unit tests should ideally collect and run in under 5-10 seconds.

## PHASE 3: COMPLETION

1.  Review the full suite of tests created.
2.  Confirm all requirements are met.
3.  Ask the user for the next task.
