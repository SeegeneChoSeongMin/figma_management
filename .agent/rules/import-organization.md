---
trigger: always_on
glob: *.ts, *.tsx
description: Import organization and conventions for OneSystem Portal Web
---

# Import Organization

This document covers import organization and conventions for OneSystem Portal Web.

## Import Order

Follow VS Code's default import ordering (Alt + Shift + O):

1. **Node.js built-ins**: `fs`, `path`, etc.
2. **React imports**: Core React functionality from 'react'
3. **External packages**: Third-party libraries and frameworks
4. **Absolute imports**: Imports using the `@` prefix and path aliases
5. **Parent directory imports**: `../`
6. **Current/sibling directory imports**: `./`
7. **Style imports**: CSS/SCSS module imports

### Example:

```typescript
// Node.js builtins
import fs from 'fs'

// React imports
import { useState, useEffect } from 'react'

// External packages
import { useQuery } from '@tanstack/react-query'

// Absolute imports starting with @
import { useFeatureStore } from '@store/client/feature'
import { useCustomHook } from '@hook/useCustomHook'
import { someUtil } from '@fn/someUtil'

// Parent directory imports
import { parentUtil } from '../utils'

// Current/sibling directory imports
import { siblingUtil } from './utils'

// Style imports
import styles from './Component.module.scss'
```

## Path Aliases

The project uses TypeScript path aliases:
- `@components/*`: UI components
- `@type/*`: `lib/type/*`
- `@hook/*`: `lib/hook/*`
- `@store/*`: `lib/store/*`
- `@constant/*`: `lib/constant/*`
- `@api/*`: `lib/api/*`
- `@fn/*`: `lib/fn/*`
- `@schemas/*`: `lib/schemas/lib/*`

## Best Practices

1. Use the appropriate path alias.
2. Use named imports rather than default imports where possible.
3. Use type imports for types: `import type { User } from '@type/user'`.
4. Remove unused imports and combine multiple imports from the same module.
