---
trigger: always_on
glob: *.ts, *.tsx, *.scss
description: Code style and naming conventions for OneSystem Portal Web
---

# Code Style

This document covers code style and naming conventions for OneSystem Portal Web.

## Naming Conventions

Consistent naming is crucial for maintainability and readability.

### Component & Class Naming:

- **Components**: PascalCase

  ```typescript
  // Good
  function UserProfile() {
    /* ... */
  }
  const Button = () => {
    /* ... */
  }

  // Bad
  function userProfile() {
    /* ... */
  }
  const button = () => {
    /* ... */
  }
  ```

- **Functions**: camelCase

  ```typescript
  // Good
  function getUserData() {
    /* ... */
  }
  const calculateTotal = () => {
    /* ... */
  }

  // Bad
  function GetUserData() {
    /* ... */
  }
  const Calculate_total = () => {
    /* ... */
  }
  ```

- **Variables**: camelCase

  ```typescript
  // Good
  const userName = 'John'
  let itemCount = 0

  // Bad
  const UserName = 'John'
  let item_count = 0
  ```

- **Constants**: UPPER_CASE

  ```typescript
  // Good
  const MAX_ITEMS = 100
  const API_URL = 'https://api.example.com'

  // Bad
  const maxItems = 100
  const apiUrl = 'https://api.example.com'
  ```

- **SCSS Modules**: kebab-case

  ```scss
  // Good
  .user-profile {
    /* ... */
  }
  .nav-item {
    /* ... */
  }

  // Bad
  .userProfile {
    /* ... */
  }
  .NavItem {
    /* ... */
  }
  ```

- **Enums**: PascalCase

  ```typescript
  // Good
  enum StatusCode {
    Active = 'A',
    Inactive = 'I',
  }

  // Bad
  enum statusCode {
    active = 'A',
    inactive = 'I',
  }
  ```

- **Interfaces & Types**: PascalCase

  ```typescript
  // Good
  interface UserState {
    id: string
    name: string
  }

  type ApiResponse = {
    data: User[]
    total: number
  }

  // Bad
  interface userState {
    id: string
    name: string
  }

  type apiResponse = {
    data: User[]
    total: number
  }
  ```

- **Abbreviations**: All caps when used within identifiers

  ```typescript
  // Good
  function usePCRHook() {
    /* ... */
  }
  const handleHTTPRequest = () => {
    /* ... */
  }
  const parseJSONResponse = () => {
    /* ... */
  }

  // Bad
  function usePcrHook() {
    /* ... */
  }
  const handleHttpRequest = () => {
    /* ... */
  }
  const parseJsonResponse = () => {
    /* ... */
  }
  ```

### File Naming:

- Component files: PascalCase

  ```
  Button.tsx
  UserProfile.tsx
  ```

- Utility/hook files: camelCase

  ```
  useAuth.ts
  formatDate.ts
  ```

- Test files: Match the file they test

  ```
  Button.test.tsx
  useAuth.test.ts
  ```

- SCSS module files: Match component name + .module.scss
  ```
  Button.module.scss
  UserProfile.module.scss
  ```

## Formatting Rules

### Line Length:

- Keep lines under 100 characters for better readability
- Split long lines at logical points (commas, operators, etc.)

### Whitespace:

- Use 2 spaces for indentation
- Limit consecutive empty lines to 2
- Add spaces around operators

### Comments:

- Avoid using console.log in production code
- Add meaningful comments for complex logic
- Use JSDoc for function documentation

### Return Statements:

- Use consistent return statements
- Always include a return type for functions
- Prefer early returns for guard clauses

### Variable Declarations:

- Use 'const' for variables that are never reassigned
- Group related variable declarations
- Initialize variables at declaration when possible

### Example:

```typescript
/**
 * Fetches user data and formats it for display
 * @param userId - The ID of the user to fetch
 * @returns Formatted user data or null if not found
 */
async function fetchUserData(userId: string): FormattedUser | null {
  // Early return for invalid input
  if (!userId) {
    return null
  }

  // Constants for request configuration
  const API_ENDPOINT = '/api/users'
  const MAX_RETRIES = 3

  // Fetch and format logic
  try {
    const response = await fetch(`${API_ENDPOINT}/${userId}`)
    const userData = await response.json()

    return {
      id: userData.id,
      displayName: `${userData.firstName} ${userData.lastName}`,
      joinDate: formatDate(userData.createdAt),
    }
  } catch (error) {
    // Avoid console.log in production
    logError('Failed to fetch user data', error)
    return null
  }
}
```

## Documentation Maintenance

Documentation should be maintained alongside code to ensure it remains accurate and useful.

### When to Update Documentation:

- When introducing new patterns that could be reused
- When modifying existing documented patterns
- When adding new technologies or libraries that require specific usage patterns
- When discovering common issues or edge cases that should be documented

### Documentation Best Practices:

1. **Be concise**: Keep documentation clear and to the point
2. **Be example-driven**: Include practical code examples
3. **Organize by topic**: Group related information together
4. **Update or delete**: Don't leave outdated documentation in place
5. **Link to resources**: Provide links to external documentation when relevant

### How to Document New Patterns:

1. Add the pattern to the appropriate section of the documentation
2. Include a brief explanation of the pattern's purpose
3. Provide a code example showing the pattern in use
4. Explain when and why to use the pattern
5. Highlight any potential issues or limitations

### Documentation Check Process:

Before marking work as complete, check if:

- You've introduced a new pattern or approach
- You've modified an existing pattern
- You've added a new library or technology
- You've found a non-obvious solution to a problem

If any of these apply, take the time to update the relevant documentation.
