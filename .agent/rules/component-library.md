---
trigger: always_on
glob: *.ts, *.tsx
description: Component library usage and migration guides for OneSystem Portal Web
---

# Component Library

This document covers the usage of the component library and migration guides for OneSystem Portal Web.

## @seegene/ui Component Library

The `@seegene/ui` library provides a set of reusable UI components following our design system.

### Importing Components

Components should be imported directly from `@seegene/ui`:

```typescript
import { Button, Typography } from '@seegene/ui'
// ... other components
```

### Available Components

The library includes various components that follow our design system:

- Button variants
- Typography components
- Form controls
- Layout components
- Data display components
- Navigation components

## Button Component

The Button component is one of our core components with the following variants and sizes.

### Variants

- `primary` - Default primary button
- `secondary` - Secondary action button
- `tertiary` - Tertiary action button
- `line` - Outlined button
- `filled` - Filled button
- `text` - Text-only button
- `design-type` - Design system specific button
- `classify` - Classification button
- `round` - Rounded button
- `icon` - Icon-only button
- `icon-borderless` - Borderless icon button
- `change-history` - History-related button

### Sizes

- `small`
- `medium`
- `large`
- `x-large`

### Example Usage

```typescript
// Primary button
<Button
  variant="primary"
  size="large"
  onClick={handleClick}
>
  Submit
</Button>

// Icon button
<Button
  variant="icon"
  size="small"
  icon={IconHistory}
  iconStyle={{ width: 20, height: 20 }}
  onClick={handleClick}
/>

// Secondary button with icon
<Button
  variant="secondary"
  size="large"
  icon={IconParameter}
  onClick={handleClick}
>
  Parameter
</Button>
```

### Icons

Icons should be imported from the `@seegene/icons` package:

```typescript
import { IconHistory, IconParameter, IconEditor } from '@seegene/icons'
```

### Best Practices

1. Always specify a `variant` prop to make the button's purpose clear
2. Use semantic variants that match the button's function (e.g., `primary` for main actions)
3. Keep icon buttons small and use the `icon` variant
4. Provide proper `iconStyle` when using icons
5. Use consistent sizing throughout your application
6. Import icons directly from `@seegene/icons`
7. Use `badge` prop instead of `onBullet` for notification indicators

### Accessibility

- Ensure buttons have meaningful text content for screen readers
- Use appropriate color contrast ratios
- Maintain proper focus states
- Include proper ARIA labels when needed

## RoundButton Component

The RoundButton component is designed for actions that require a rounded appearance with optional icons. It's commonly used for reset, filter, and utility actions.

### Import

```typescript
import { Button, RoundButton } from '@seegene/ui'
```

### Props

- `className?: string` - Additional CSS classes
- `color?: 'secondary' | 'default'` - Button color variant
- `disabled?: boolean` - Disabled state
- `icon?: (props: IconProps) => ReactNode` - Icon component from @seegene/icons
- `iconStyle?: IconProps` - Style properties for the icon
- `iconPosition?: 'left' | 'right'` - Icon placement
- `onClick?: () => void` - Click handler

### Example Usage

```typescript
import { Button, RoundButton } from '@seegene/ui'
import { IconReset } from '@seegene/icons'

// Basic usage with icon
<RoundButton
  icon={IconReset}
  iconStyle={{ fill: 'var(--navy400)', width: 16, height: 16 }}
  onClick={handleReset}
>
  Reset
</RoundButton>

// Secondary color variant
<RoundButton
  color="secondary"
  icon={IconFilter}
  iconPosition="right"
>
  Filter
</RoundButton>
```

## Migration Guides

### Migrating from ButtonMui

When migrating from the old `ButtonMui` component to the new `Button` component, use the following mapping:

| ButtonMui Prop     | Button Prop            | Notes                                         |
| ------------------ | ---------------------- | --------------------------------------------- |
| `type="contained"` | `variant="primary"`    | Default button style                          |
| `type="outlined"`  | `variant="line"`       | Outlined button style                         |
| `color="black"`    | `variant="filled"`     | Black button style                            |
| `size="xsmall"`    | `size="small"`         | Use small for the smallest button size        |
| `size="xlarge"`    | `size="x-large"`       | Keep x-large for bigger buttons (50px height) |
| `uiType="icon"`    | `variant="icon"`       | For icon-only buttons                         |
| `icon="IconName"`  | `icon={IconComponent}` | Import icon component directly                |
| `onBullet`         | `badge`                | For showing notification badges               |

#### Example Migration

```typescript
// Before
;<ButtonMui type="contained" size="xlarge" icon="IconName" onBullet={true} onClick={handleClick}>
  Submit
</ButtonMui>

// After
import { IconName } from '@seegene/icons'
;<Button variant="primary" size="x-large" icon={IconName} badge={true} onClick={handleClick}>
  Submit
</Button>
```

### Migrating from RoundBtn

When migrating from the old `RoundBtn` component to `RoundButton`, use this mapping:

| RoundBtn Prop     | RoundButton Prop       | Notes                                              |
| ----------------- | ---------------------- | -------------------------------------------------- |
| `icon="IconName"` | `icon={IconComponent}` | Import icon component directly from @seegene/icons |
| `iconStyle`       | `iconStyle`            | Props remain the same                              |
| `className`       | `className`            | Props remain the same                              |
| `disabled`        | `disabled`             | Props remain the same                              |
| `onClick`         | `onClick`              | Props remain the same                              |

#### Example Migration

```typescript
// Before
;<RoundBtn icon="IconReset" iconStyle={{ fill: '#123456', width: 16, height: 16 }} onClick={handleReset}>
  Reset
</RoundBtn>

// After
import { IconReset } from '@seegene/icons'
;<RoundButton icon={IconReset} iconStyle={{ fill: 'var(--navy400)', width: 16, height: 16 }} onClick={handleReset}>
  Reset
</RoundButton>
```

### Best Practices for Migration

1. Update all imports to use the new component from `@seegene/ui`
2. Import icons directly from `@seegene/icons`
3. Replace string icon names with imported components
4. Update prop names according to the mapping tables
5. Use semantic color variables instead of hex codes
6. Test components after migration to ensure proper styling and behavior
