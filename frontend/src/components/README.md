# UI Component Patterns and Theme Usage

This document describes how to use the shared theme for consistent UI design.

## Theme Usage
Import the theme from `src/styles/theme.ts`:

```ts
import { theme } from '../styles/theme';
```
Use theme values for colors, spacing, and typography in your components.

## Example: Button
```tsx
import { theme } from '../styles/theme';

export function Button({ children, ...props }) {
  return (
    <button
      style={{
        background: theme.colors.primary,
        color: theme.colors.background,
        padding: theme.spacing.md,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeight.bold,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Component Patterns
- Use theme for all color, spacing, and font values.
- Prefer functional components and hooks for state.
- Document props and usage in comments.

## Storybook (Optional)
To preview and document components, add Storybook:
```bash
npm install --save-dev storybook
npx storybook init
```

See each component's README or Storybook stories for usage examples.
