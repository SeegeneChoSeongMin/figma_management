---
trigger: always_on
glob: *.scss, *.css
description: Styling guidelines and best practices
---

# Styling Guidelines

This document covers styling guidelines for OneSystem Portal Web.

## SASS Module Patterns

All styles should be defined using SASS modules with the `.module.scss` extension.
- Use BEM (Block, Element, Modifier) naming convention.
- Use the `classNames` utility from `@seegene/ui/utils`.

## Design System Integration

- Colors: Use the `color()` function (e.g., `color(typo, 900)`).
- Typography: Use design system mixins (e.g., `@include title1;`).

## BEM Naming Convention

```scss
.card {
  &__header {
    &--highlighted { /* ... */ }
  }
}
```

## Layout Patterns

- Use CSS Flexbox and Grid for layouts.
- Prefer semantic HTML elements.
