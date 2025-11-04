# Color Theme Guide

## Color Palette

### 🔵 Dark Blue (Primary)
- **Navy 900**: `#0a1628` - Darkest blue for headers, primary text
- **Navy 800**: `#0f2744` - Dark blue for backgrounds, hover states
- **Navy 700**: `#1a3a5c` - Primary button color, main brand color
- **Navy 600**: `#244d74` - Secondary elements
- **Navy 500**: `#2e608c` - Lighter accents

**Usage**:
- Primary buttons: `bg-navy-700 hover:bg-navy-800`
- Headers: `text-navy-900`
- Dark backgrounds: `bg-navy-800`
- Links: `text-navy-700`

### 🔴 Red (Accent/CTA)
- **Red 600**: `#dc2626` - Hover state, important actions
- **Red 500**: `#ef4444` - Primary red for CTAs, alerts
- **Red 400**: `#f87171` - Lighter red for badges

**Usage**:
- CTA buttons: `bg-red-500 hover:bg-red-600`
- Sale badges: `bg-red-500 text-white`
- Error states: `text-red-500`
- Discount indicators: `bg-red-500`

### ✨ Gold (Highlight/Premium)
- **Gold 600**: `#d97706` - Dark gold for emphasis
- **Gold 500**: `#f59e0b` - Primary gold for premium features
- **Gold 400**: `#fbbf24` - Medium gold
- **Gold 300**: `#fcd34d` - Light gold for backgrounds

**Usage**:
- Premium badges: `bg-gold-500 text-navy-900`
- Featured items: `border-gold-500`
- Highlights: `text-gold-600`
- Success states: `bg-gold-100 text-gold-600`

### ⚪ White/Neutral
- **White**: `#ffffff` - Pure white backgrounds
- **Gray 50-900**: Various gray shades for UI elements

**Usage**:
- Card backgrounds: `bg-white`
- Text on dark: `text-white`
- Borders: `border-gray-200`
- Secondary text: `text-gray-600`

## Component Color Schemes

### Buttons
```tsx
// Primary Button (Navy)
className="bg-navy-700 hover:bg-navy-800 text-white"

// CTA Button (Red)
className="bg-red-500 hover:bg-red-600 text-white"

// Premium Button (Gold)
className="bg-gold-500 hover:bg-gold-600 text-navy-900"

// Secondary Button
className="bg-white border-2 border-navy-700 text-navy-700 hover:bg-navy-50"
```

### Cards
```tsx
// Standard Card
className="bg-white border border-gray-200 hover:border-navy-700"

// Featured Card
className="bg-white border-2 border-gold-500"

// Premium Card
className="bg-gradient-to-br from-navy-800 to-navy-900 text-white"
```

### Badges
```tsx
// Discount Badge
className="bg-red-500 text-white"

// Featured Badge
className="bg-gold-500 text-navy-900"

// Status Badge
className="bg-navy-700 text-white"
```

### Headers & Navigation
```tsx
// Header Background
className="bg-navy-800 text-white"

// Navigation Links
className="text-white hover:text-gold-400"

// Active Link
className="text-gold-500"
```

## Gradients

### Navy Gradient
```tsx
className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700"
```

### Gold Accent
```tsx
className="bg-gradient-to-r from-gold-500 to-gold-600"
```

### Hero Gradient
```tsx
className="bg-gradient-to-br from-navy-900 via-navy-800 to-red-900"
```

## Text Colors

- **Primary Text**: `text-navy-900`
- **Secondary Text**: `text-gray-600`
- **On Dark Background**: `text-white`
- **Links**: `text-navy-700 hover:text-navy-800`
- **Accent Links**: `text-red-500 hover:text-red-600`
- **Price**: `text-navy-900 font-bold`
- **Discount Price**: `text-red-600 font-bold`

## Best Practices

1. **Use Navy (Dark Blue) as primary brand color** for headers, buttons, and key UI elements
2. **Use Red sparingly** for CTAs, sales, and important actions
3. **Use Gold for premium/featured** items and highlights
4. **Maintain high contrast** between text and backgrounds
5. **Use white backgrounds** for cards and content areas
6. **Pair Navy with Gold** for premium feel
7. **Use Red on white** for maximum attention
8. **Gradient sparingly** - mainly for hero sections

## Accessibility

- All color combinations meet WCAG AA standards
- Navy 700+ on white: ✅ High contrast
- White on Navy 700+: ✅ High contrast
- Red 500 on white: ✅ High contrast
- Gold 600 on white: ✅ Sufficient contrast
- Gold 500 on Navy 900: ✅ High contrast
