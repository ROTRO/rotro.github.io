# Nova Vespera Portfolio

A modern, animated personal portfolio website built with React.js.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Key Technologies](#key-technologies)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)

---

## Quick Start

### Prerequisites

- Node.js 18.0+
- npm or yarn
- Modern web browser with JavaScript enabled

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm start
```

The development server will start at `http://localhost:3000/` and open in your default browser.

---

## Project Structure

```
rotro.github.io/
├── build/                    # Production build output
│   ├── static/
│   │   └── js/, css/
│   ├── asset-manifest.json   # Asset mapping
│   ├── favicon.ico
│   ├── index.html           # Main HTML entry point
│   ├── logo192.png         
│   ├── logo512.png
│   ├── manifest.json       # PWA configuration
│   └── robots.txt
├── new template/             # Alternative page templates
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   └── ...
│   ├── about.html
│   ├── contact.html
│   ├── experience.html
│   ├── Nova Vespera - Logo.html
│   └── projects.html
├── public/                   # Public assets
│   ├── favicon.ico
│   ├── images/
│   │   └── logo/
│   │       ├── logo.svg
│   │       └── ...
│   ├── index.html          
│   └── manifest.json
├── src/                     # Source code
│   ├── components/         # Reusable UI components
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ...
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Experience.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── config/             # Configuration files
│   │   └── theme.ts        
│   ├── context/           # Global state management
│   │   └── ThemeContext.tsx
│   ├── data/              # Static content
│   │   ├── experienceData.ts
│   │   ├── projectsData.ts
│   │   └── ...
│   ├── helper/            # Utility functions
│   │   └── utils.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useScrollPosition.tsx
│   ├── pages/             # Page components (routes)
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   └── styles/            # Global SCSS styles
│       └── theme.scss
├── documentation.md      # This file
└── package.json
```

---

## Architecture Overview

### Component Hierarchy

The application follows a layered architecture:

```
┌─────────────────────────────
│     Pages (Routes)
│   Home, About,
│   Experience,
│   Projects, Contact
├───────────────────────────
│    Components
│  UI Components      Section Components
│  Button, Card       Hero, Services,
│  Header, Footer     Portfolio, ...
├───────────────────────────
│     Contexts
│   ThemeContext
├───────────────────────────
│     Data Layer
│   experienceData,
│   projectsData
└─────────────────────────
```

### Key Architectural Decisions

1. **Separation of Concerns**: Pages handle routing and page-level logic, while components are reusable UI building blocks.

2. **Theme-First Styling**: CSS variables defined in `theme.ts` allow consistent theming across the application with easy color customization.

3. **Data-Driven Content**: Static data files (`experienceData`, `projectsData`) separate content from presentation, making updates easier without touching component code.

4. **Progressive Web App (PWA)**: Service workers enable offline functionality and app-like experience on mobile devices.

---

## Key Technologies

| Technology | Version | Purpose |
|------------|--------|--------|
| React | 18.2.0 | UI Framework |
| react-router-dom | 6.4.3 | Client-side routing |
| framer-motion | 11.11.17 | Animation & gestures |
| GSAP | 3.15.0 | Advanced animations |
| lucide-react | 0.460.0 | Icon library |
| react-helmet-async | 2.0.5 | Document metadata |
| @testing-library/react | 13.4.0 | Component testing |
| sass | 1.77.6 | CSS Preprocessor |

---

## Features

### Core Pages

#### Home Page
- Hero section with animated entrance animations
- Services overview with icon cards
- Featured portfolio highlights
- Smooth scroll animations using GSAP

#### About Page
- Personal introduction
- Professional bio
- Skills visualization
- Team members (if applicable)

#### Experience Page
- Timeline view of work history
- Project details with descriptions
- Tech stack visualization
- Achievement badges

#### Projects Page
- Portfolio grid layout
- Filterable project categories
- Live project previews
- External links to repositories and demos

#### Contact Page
- Contact form with validation
- Social media links
- Location map integration

---

## Getting Started

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ROTRO/rotro.github.io.git
   cd rotro.github.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure development server** (optional):
   - Update `homepage` in `package.json` to your domain
   - Configure proxy for API calls in `src/setupProxy.js`

### Running the Application

```bash
# Development mode with hot-reload
npm start

# Production build
npm run build

# Run tests
npm test
```

### Building for Production

```bash
npm run build
```

The production files will be generated in the `build/` directory. These can be served via:
- GitHub Pages (automatically deploys to your username.github.io)
- Any static hosting service (Netlify, Vercel, etc.)

---

## Development Guide

### Adding New Components

1. Create component file in `src/components/ui/` for UI components or `src/components/sections/` for page-specific sections.

2. Follow the established component structure:
   ```typescript
   // Example: Button.tsx
   import { cn } from '../helper/utils';
   import { buttonVariants } from '../styles/theme';
   
   interface ButtonProps {
     variant?: 'primary' | 'secondary' | 'outline';
     size?: 'sm' | 'md' | 'lg';
     disabled?: boolean;
     onClick?: () => void;
   }

   export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant, size, children, ...props }, ref) => {
       return (
         <button
           className={cn(buttonVariants({ variant, size }), className)}
           ref={ref}
           {...props}
         >
           {children}
         </button>
       );
     }
   );
   ```

### Theming System

The theme system uses CSS custom properties:

```typescript
// src/config/theme.ts
export const theme = {
  colors: {
    primary: {
      DEFAULT: '#6366f1',
      // ... variations
    },
    secondary: {
      DEFAULT: '#8b5cf6',
      // ... variations
    },
  },
  typography: {
    fontFamily: { sans: '"Inter', 'system-ui' }
  },
  spacing: {
    section: 10,
    container: '1200px'
  }
}
```

Usage:
```scss
// src/styles/theme.scss
$theme: $primary, $secondary;

.button-primary {
  @include theme-variant($theme.primary);
}
```

### Animation Patterns

#### Framer Motion
```typescript
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.2 }
  }
};

<motion.div
  variants={container}
  initial="hidden"
  animate="visible"
>
```

#### GSAP Scroll Triggers
```javascript
import { ScrollTrigger } from 'gsap';

const tl = gsap.timeline();
tl.from('.hero-title', {
  y: 100,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out'
});
```

---

## Configuration Reference

### Theme Customization

Edit `src/config/theme.ts` to customize:

```typescript
export const theme = {
  colors: {
    primary: {
      DEFAULT: '#6366f1',     // Change this color
      hover: '#818cf5',
      pressed: '#7c3aed'
    }
  },
  fonts: {
    heading: '"Inter Tight", sans-serif'  // Update font families
  }
}
```

### Routing Configuration

Routes are defined in `src/pages/Home.tsx` (or respective page files):

```typescript
const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/experience', element: <Experience /> },
  { path: '/projects', element: <Projects /> },
  { path: '/contact', element: <Contact /> }
];
```

---

## Testing

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    const { container } = render(<Button>Click Me</Button>);
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    const { user } = userSetup();
    await user.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode with live reload
npm run test:watch

# Run specific test file
npm test -- src/components/Button.test.tsx
```

---

## Performance Optimization

1. **Code Splitting**: Routes are lazy-loaded using `React.lazy()`
2. **Memoization**: Use `React.memo()`, `useMemo()`, and `useCallback()` for expensive components/hooks
3. **CSS Modules**: Scoped styles prevent CSS leakage
4. **Image Optimization**: WebP format with fallbacks, lazy loading
5. **Animation Budget**: Throttle scroll animations to maintain 60fps

---

## Troubleshooting

| Issue | Solution |
|------|---------|
| Styles not applying | Check theme import in component file header |
| Icons not rendering | Verify icon name matches lucide-react export |
| Scroll animations glitching | Ensure ScrollTrigger targets are unique |
| PWA not working | Clear browser cache, check service worker registration |

---

## License

MIT - Feel free to use this project for personal or commercial purposes.

---

*Generated from Nova Vespera Portfolio Project*
