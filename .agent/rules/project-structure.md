---
trigger: always_on
glob: *.ts, *.tsx, *.scss
description: Project structure and architecture for OneSystem Portal Web
---

# Project Structure

This document covers the project structure and architecture for OneSystem Portal Web.

## Next.js App Directory Structure

The project follows the Next.js 13+ App Directory structure with route groups:
- `(isp)`: ISP-specific routes
- `(manager)`: Manager-specific routes

### Best Practices

- Add 'use client' directive at the top of client components only when needed.
- Group related routes with route groups `(groupName)`.

## Component Organization

Each component must follow this structure:

```
components/
  FeatureName/
    ComponentName/
      index.tsx                  # Main component file
      ComponentName.module.scss  # Styles (required)
      ComponentName.test.tsx     # Tests (required)
      types.ts                   # Type definitions (if needed)
```

## Templates Pattern

When multiple pages share similar structure, use a template component under `templates/featureName/TemplateName/`.

- Reduces code duplication.
- Enforces consistent structure and behavior.
- Type-safe configuration through props.
