# SafeLink Component

## Overview
The `SafeLink` component is a wrapper around Next.js `Link` that prevents the "Multiple children were passed to <Link>" error by properly wrapping all children in a React Fragment.

## The Problem
Next.js Link components can only have a single child element. When you try to pass multiple children like this:

```jsx
// ❌ This causes the error
<Link href="/dashboard">
  <i className="icon" />
  <span>Dashboard</span>
</Link>
```

You get: `Error: Multiple children were passed to <Link> with 'href' of '/dashboard' but only one child is supported`

## The Solution
Use the `SafeLink` component which automatically wraps multiple children in a React Fragment:

```jsx
// ✅ This works correctly
<SafeLink href="/dashboard">
  <i className="icon" />
  <span>Dashboard</span>
</SafeLink>
```

## Usage Examples

### Basic Navigation
```jsx
import { SafeLink } from '../ui/SafeLink';

<SafeLink href="/dashboard" className="nav-item">
  <i className="fas fa-home" />
  <span>Dashboard</span>
</SafeLink>
```

### With Theme Integration
```jsx
<SafeLink 
  href="/profile"
  className="flex items-center p-4 theme-hover transition-colors"
  style={{ color: 'var(--color-text-primary)' }}
>
  <div className="avatar">U</div>
  <div className="user-info">
    <div>John Doe</div>
    <div>View Profile</div>
  </div>
</SafeLink>
```

### With Event Handlers
```jsx
<SafeLink 
  href="/settings"
  className="menu-item"
  onClick={(e) => {
    e.preventDefault();
    handleCustomNavigation('/settings');
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--color-hover)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
  <i className="fas fa-cog" />
  <span>Settings</span>
</SafeLink>
```

### Single Child (No Fragment Needed)
```jsx
// When you only have one child, SafeLink works the same as regular Link
<SafeLink href="/about" className="link">
  About Us
</SafeLink>
```

## API

### Props
All props are passed through to the underlying Next.js Link component:

- `href: string` - The destination URL (required)
- `children: ReactNode` - The content to render (required)
- `className?: string` - CSS classes
- `style?: React.CSSProperties` - Inline styles
- `onClick?: (e: MouseEvent<HTMLAnchorElement>) => void` - Click handler
- `onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void` - Mouse enter handler
- `onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void` - Mouse leave handler
- `target?: string` - Link target
- `rel?: string` - Link relationship
- `aria-label?: string` - Accessibility label
- `title?: string` - Tooltip text

## Migration Guide

### From Old Link Pattern
```jsx
// ❌ Old deprecated pattern
<Link href="/dashboard">
  <a className="nav-item">
    <i className="icon" />
    <span>Dashboard</span>
  </a>
</Link>

// ✅ New SafeLink pattern
<SafeLink href="/dashboard" className="nav-item">
  <i className="icon" />
  <span>Dashboard</span>
</SafeLink>
```

### From Modern Link with Multiple Children
```jsx
// ❌ This breaks with multiple children
<Link href="/dashboard" className="nav-item">
  <i className="icon" />
  <span>Dashboard</span>
</Link>

// ✅ This works with multiple children
<SafeLink href="/dashboard" className="nav-item">
  <i className="icon" />
  <span>Dashboard</span>
</SafeLink>
```

## Best Practices

1. **Always use SafeLink** when you have multiple child elements
2. **Maintain semantic HTML** - use appropriate ARIA labels and roles
3. **Preserve theme integration** - continue using CSS variables
4. **Handle accessibility** - include proper focus states and keyboard navigation
5. **Use TypeScript** - leverage the provided interfaces for type safety

## Common Patterns

### Navigation Menu Item
```jsx
<SafeLink 
  href={item.href}
  className={`flex items-center px-4 py-3 text-sm transition-colors ${
    isActive ? 'text-white shadow-md' : 'theme-text-primary theme-hover'
  }`}
  style={isActive ? { backgroundColor: 'var(--color-primary)' } : {}}
>
  <i className={`${item.icon} mr-4`} />
  <span>{item.name}</span>
</SafeLink>
```

### User Profile Link
```jsx
<SafeLink 
  href="/profile"
  className="flex items-center p-4 theme-hover"
>
  <div className="avatar">{user.initials}</div>
  <div className="user-details">
    <div className="name">{user.name}</div>
    <div className="subtitle">View Profile</div>
  </div>
</SafeLink>
```

This component ensures your Next.js navigation works reliably across all browsers and Next.js versions while maintaining clean, readable code.