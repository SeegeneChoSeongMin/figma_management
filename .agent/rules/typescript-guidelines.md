---
trigger: always_on
glob: *.ts, *.tsx
description: TypeScript best practices and guidelines
---

# TypeScript Guidelines

This document covers TypeScript best practices for OneSystem Portal Web.

## Type Safety

- Avoid `any`.
- Define explicit return types for functions.
- Prefer interfaces over type aliases for objects.
- Use type-only imports: `import type { ... }`.

## Generic Type Naming

Use descriptive names instead of T/K/V:
- `ArrayItem`, `State`, `Props`, `FieldKey`.

## Data Validation

- Use Zod for runtime validation and schema inference.
- Use `PseudoBoolean` ('Y'/'N') from `@constant/common` for API flags.

## Error Handling

- Use the `to()` utility from `library/util` for Go-style error handling with Axios.
- Use specific API instances: `apiIsc`, `apiPortal`, etc.
