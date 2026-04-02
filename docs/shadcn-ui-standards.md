# shadcn/ui Standards

## Overview

This project uses **shadcn/ui** components for all UI elements. Custom components must not be created. All UI implementation must rely exclusively on shadcn/ui components.

## Required Rules

### 1. shadcn/ui-Only Implementation

- **Requirement**: All UI elements must use shadcn/ui components exclusively
- **Restriction**: Do NOT create custom components, wrappers, or custom UI solutions
- **Scope**: This applies to all user-facing UI throughout the application
- **Exception**: Only utility components for logic (non-visual) may be custom; visual components must be shadcn/ui
- **Related Docs**: See [component-patterns.md](./component-patterns.md) for component organization

### 2. Available shadcn/ui Components

Use shadcn/ui's component library for:
- Buttons
- Forms and input fields
- Dialogs and modals
- Dropdowns and select menus
- Alerts and notifications
- Cards and containers
- Tables
- Tabs
- Navigation elements
- And all other UI components provided by shadcn/ui

**Reference**: Check the shadcn/ui documentation for the complete component list and usage patterns.

### 3. Component Installation

When a new shadcn/ui component is needed:
```bash
npx shadcn-ui@latest add component-name
```

This installs the component into `components/ui/` with proper TypeScript types and styling.

### 4. Component Usage

```typescript
// ✅ Correct: Use shadcn/ui directly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

```typescript
// ❌ Incorrect: Creating custom UI components
export function CustomButton({ children }) {
  return <button className="custom-btn">{children}</button>;
}
```

## Implementation Guidelines

### Composition Over Customization
- Compose shadcn/ui components to create complex UI patterns
- Use component props for customization (variant, size, state, etc.)
- Apply Tailwind CSS classes for styling variations when needed
- Do NOT modify shadcn/ui component source files

### Styling
- Use Tailwind CSS utility classes for additional styling
- Leverage CSS variables defined in globals.css for theming
- Respect the design system established by shadcn/ui
- Do NOT create separate CSS files for UI component styling

### Accessibility
- All shadcn/ui components include accessibility features (ARIA labels, keyboard navigation)
- Use components as-is to maintain accessibility compliance
- Do NOT remove or bypass accessibility attributes

## Implementation Checklist

- [ ] All visual UI uses shadcn/ui components
- [ ] No custom button, input, card, or dialog components exist in the codebase
- [ ] Components are imported from `@/components/ui/`
- [ ] Required shadcn/ui components are installed via CLI
- [ ] Styling uses Tailwind CSS classes on top of shadcn/ui
- [ ] Component composition builds complex UI from shadcn/ui primitives
- [ ] No duplicate component implementations

## Common Patterns

### Creating a Form
```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email" />
        </div>
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  );
}
```

### Using a Dialog/Modal
```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>
        {/* Content */}
      </DialogContent>
    </Dialog>
  );
}
```

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [component-patterns.md](./component-patterns.md) - Component organization patterns
- [styling-guidelines.md](./styling-guidelines.md) - Styling practices
- [AGENTS.md](../AGENTS.md) - General project guidelines

## Summary

- ✅ Use shadcn/ui components exclusively
- ✅ Compose components to build complex UI
- ✅ Apply Tailwind CSS for additional styling
- ✅ Install new components via `npx shadcn-ui@latest add`
- ❌ Never create custom UI components
- ❌ Never duplicate shadcn/ui component functionality
- ❌ Never create component wrappers that duplicate shadcn/ui
