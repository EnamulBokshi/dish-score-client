# Dish Score - Restaurant & Dish Discovery Platform

A comprehensive Next.js-based platform for discovering restaurants, exploring dishes, and sharing authentic reviews with intelligent search, role-based dashboards, and a beautiful user interface.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Key Features](#key-features)
- [Architecture & Patterns](#architecture--patterns)
- [Component System](#component-system)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Styling Conventions](#styling-conventions)
- [Development Workflow](#development-workflow)
- [Best Practices](#best-practices)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Contributing](#contributing)

## 🎯 Project Overview

**Dish Score** is a full-stack platform that enables users to:
- Discover restaurants and dishes through intelligent global search
- Browse and filter reviews with advanced filtering options
- Create and manage reviews with rich content
- Switch between multiple roles (Consumer, Owner, Admin)
- Access role-specific dashboards with analytics and management tools

**Target Users:**
- Consumers: Browse restaurants, dishes, read/write reviews
- Restaurant Owners: Manage menu items, view review analytics
- Admins: System-wide management and moderation

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16.1.7** with Turbopack for optimized builds
- **React 19** for UI components and state management
- **TypeScript** with strict mode for type safety

### Styling & UI
- **Tailwind CSS v4** with canonical spacing system
- **Shadcn/UI** component library (pre-configured)
- **Framer Motion** for scroll-reactive animations
- **CSS Grid & Flexbox** for responsive layouts

### Data Fetching & State
- **TanStack Query (React Query)** for server state management and caching
- **Axios** via custom `httpClient` for API requests
- **Debounced search patterns** (600-700ms) for UX optimization

### Routing & Navigation
- **Next.js App Router** with hybrid layouts
- **Path-based authentication** with protected routes
- **Segment-based layouts** for shared UI composition

### Utilities & Libraries
- **Zod** for schema validation and form data parsing
- **JWT utilities** for token management
- **Cookie utilities** for client-side persistence

## 📁 Project Structure

```
dish-score/
├── app/                              # Next.js App Router
│   ├── (commonLayout)/               # Public pages layout group
│   │   ├── layout.tsx                # Shared layout (Navbar, Footer)
│   │   ├── page.tsx                  # Landing/Home page
│   │   ├── about/                    # About page
│   │   ├── contact/                  # Contact form
│   │   ├── dishes/                   # Browse dishes
│   │   ├── restaurants/              # Browse restaurants
│   │   ├── reviews/                  # Reviews listing & filtering
│   │   └── (authGroup)/              # Login/signup routes
│   │
│   ├── (dashboardLayout)/            # Protected routes layout
│   │   ├── layout.tsx                # Dashboard shell
│   │   ├── admin/                    # Admin dashboard
│   │   ├── owner/                    # Owner dashboard
│   │   └── (consumerProtectedLayoutGroup)/ # Consumer dashboard
│   │
│   ├── api/                          # API routes (if backend proxy)
│   └── error.tsx, layout.tsx         # Root error & layout
│
├── components/                       # Reusable React components
│   ├── ui/                           # Shadcn/UI primitives
│   │   ├── button.tsx, card.tsx, dialog.tsx, etc.
│   │
│   ├── common/                       # Common UI patterns
│   │   ├── Container.tsx             # App container wrapper
│   │   ├── EmptyState.tsx            # Empty state display
│   │   ├── ErrorState.tsx            # Error state display
│   │   ├── Loading.tsx               # Loading spinner
│   │   ├── PageSkeleton.tsx          # Page loading skeleton
│   │   └── Skeleton.tsx              # Generic skeleton loader
│   │
│   ├── layout/                       # Layout components
│   │   ├── Navbar.tsx                # Top navigation bar
│   │   ├── DashboardNavbar.tsx       # Dashboard header
│   │   ├── DashboardSidebar.tsx      # Dashboard side menu
│   │   ├── Footer.tsx                # Site footer
│   │   ├── GlobalSearchModal.tsx     # Global search modal (⭐ Key)
│   │   ├── DashboardMobileSidebar.tsx
│   │   ├── UserDropdown.tsx          # User profile menu
│   │   ├── forms/                    # Common form components
│   │   └── data-table/               # Data table layouts
│   │
│   ├── modules/                      # Feature-specific components
│   │   ├── auth/                     # Authentication flows
│   │   ├── home/                     # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx (⭐ Server wrapper)
│   │   │   ├── HowItWorksTimeline.tsx (⭐ Scroll animation)
│   │   │   ├── CtaSection.tsx        (⭐ Conversion)
│   │   │   └── ScrollAnimationWrapper.tsx (⭐ Reusable)
│   │   │
│   │   ├── consumer/                 # Consumer features
│   │   ├── dish/                     # Dish components
│   │   ├── restaurant/               # Restaurant components
│   │   ├── review/                   # Review components
│   │   │   ├── UnifiedCreateReviewDialog.tsx (⭐ Floating button)
│   │   │   └── ReviewSearchFilterBar.tsx (⭐ Debounced filters)
│   │   │
│   │   ├── owner/                    # Owner dashboard
│   │   ├── admin/                    # Admin dashboard
│   │   ├── contact/                  # Contact form
│   │   └── stats/                    # Analytics & stats
│   │
│   └── theme-provider.tsx            # Provider wrapper
│
├── services/                         # API client services
│   ├── auth.client.ts                # Auth API calls
│   ├── auth.services.ts              # Auth business logic
│   ├── search.client.ts              # Global search API (⭐ Key)
│   ├── dish.services.ts              # Dish API
│   ├── restaurant.services.ts        # Restaurant API
│   ├── review.services.ts            # Review API
│   ├── user.services.ts              # User API
│   ├── contact-us.services.ts        # Contact API
│   ├── notification.client.ts        # Notifications
│   ├── like.client.ts                # Likes/favorites
│   └── unified.client.ts             # Combined endpoints
│
├── types/                            # TypeScript type definitions
│   ├── api.types.ts                  # General API types
│   ├── search.types.ts               # Search types (⭐ Key)
│   ├── auth.types.ts                 # Auth types
│   ├── dish.types.ts                 # Dish types
│   ├── restaurant.types.ts           # Restaurant types
│   ├── review.types.ts               # Review types
│   ├── user.types.ts                 # User types
│   └── enums.ts                      # Shared enums
│
├── zod/                              # Zod schemas for validation
│   ├── auth.schema.ts                # Auth form schemas
│   ├── contact.schema.ts             # Contact form schema
│   └── ...others                     # Feature schemas
│
├── lib/                              # Utility functions
│   ├── httpClient.ts                 # Axios instance config
│   ├── jwtUtils.ts                   # JWT token handling
│   ├── cookieUtils.ts                # Cookie management
│   ├── routeUtils.ts                 # Route generation helpers
│   ├── tokenUtils.ts                 # Token utilities
│   ├── rateLimit.ts                  # Rate limiting
│   ├── formFieldStyles.ts            # Shared form styles
│   ├── iconsMapper.ts                # Icon mapping utility
│   └── utils.ts                      # General utilities
│
├── hooks/                            # Custom React hooks
│   └── ...custom hooks
│
├── providers/                        # React context providers
│   └── QueryProvider.tsx             # React Query provider setup
│
├── public/                           # Static assets
│   └── images/
│
├── routes/                           # Route configuration
│   └── index.ts                      # Centralized route definitions
│
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS config
├── next.config.mjs                   # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
└── eslint.config.mjs                 # ESLint rules
```

## 💻 Installation & Setup

### Prerequisites
- **Node.js**: v18+ or higher
- **pnpm**: v8+ (package manager)
- **Backend API**: Running and accessible at configured URL

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Environment Configuration

Create a `.env.local` file in the project root:

```env
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# or for production
NEXT_PUBLIC_API_BASE_URL=https://api.dish-score.com

# Authentication
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3001/auth/callback

# Optional: Analytics, monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Step 3: Verify Configuration

```bash
# Check TypeScript compilation
pnpm run check

# Run ESLint
pnpm run lint
```

## 🚀 Running the Application

### Development Server

```bash
pnpm dev
```

Opens at `http://localhost:3001` with fast refresh and HMR enabled.

### Production Build

```bash
pnpm build
```

Compiles with Turbopack optimization, generates static routes, and validates TypeScript.

### Start Production Server

```bash
pnpm start
```

Runs the compiled production build.

### Linting & Formatting

```bash
# Run ESLint
pnpm lint

# Type checking
pnpm check

# Build preview
pnpm run build && pnpm start
```

## ⭐ Key Features

### 1. **Global Search** 
- Unified search modal with `Ctrl/Cmd + K` keyboard shortcut
- Scope filtering: All / Restaurants / Dishes / Reviews
- Debounced search (700ms) for optimized API calls
- Real-time result highlighting with scroll animations
- **Files**: `GlobalSearchModal.tsx`, `search.client.ts`, `search.types.ts`

### 2. **Smart Reviews Filtering**
- Auto-apply filters as user types (debounced 600ms)
- Filter by: Sort (Recent/Rating), Rating (1-5), Date range, Results per page
- Removed ID-based filters for cleaner UX
- Persistent query parameters for bookmarkable filters
- **Files**: `ReviewSearchFilterBar.tsx`, `reviews/page.tsx`

### 3. **Enhanced Homepage**
- **Hero Section**: Trending dishes with hover animations
- **How It Works Section**: Scroll-linked timeline animation with visual progress line
- **CTA Section**: Conversion-focused call-to-actions with neon styling
- **Scroll Animations**: Fade-in effects triggered by viewport intersection
- **Files**: `HeroSection.tsx`, `HowItWorksSection.tsx`, `HowItWorksTimeline.tsx`, `CtaSection.tsx`

### 4. **Role-Based Dashboards**
- **Consumer**: View profile, manage reviews, see interaction stats
- **Owner**: Manage restaurants, view menu analytics, track review responses
- **Admin**: System moderation, user management, platform analytics

### 5. **Review Management**
- Create reviews with rich text, ratings, images
- Floating action button for quick review creation
- Edit/delete reviews with confirmation
- Pin/unpin favorite reviews

### 6. **Responsive Design**
- Mobile-first approach with Tailwind breakpoints
- Desktop sidebar navigation with mobile drawer
- Touch-optimized interactions
- Adaptive layouts for all screen sizes

## 🏗️ Architecture & Patterns

### Client vs. Server Components

**Server Components (Default):**
```tsx
// Components that render on server
// Used for: Data fetching, sensitive operations, layout wrappers
export default async function Page() {
  const data = await fetch(...)
  return <Layout>{...}</Layout>
}
```

**Client Components:**
```tsx
// Marked with 'use client' for interactivity
// Used for: Event handlers, hooks, forms, animations
'use client'
export function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={() => setState(...)} />
}
```

**Pattern**: Wrap server sections in client animation components for scroll effects:
```tsx
// app/(commonLayout)/page.tsx
<ScrollAnimationWrapper>
  <HowItWorksSection /> {/* Server component */}
</ScrollAnimationWrapper>
```

### Debounced Search Pattern

Used consistently across the app (600-700ms):

```tsx
'use client'
import { useEffect, useCallback } from 'react'

// Debounce implementation
useEffect(() => {
  const timer = setTimeout(() => {
    applyFilters() // Trigger API call
  }, 600)
  
  return () => clearTimeout(timer)
}, [searchTerm]) // Re-run on input change
```

### Query Parameter Management

Filters are stored in URL for bookmarking & sharing:

```tsx
const applyFilters = () => {
  const params = new URLSearchParams({
    search: searchTerm,
    sort: selectedSort,
    rating: selectedRating,
  })
  router.replace(`?${params.toString()}`)
}
```

### Scroll-Reactive Animation

Used in How It Works timeline:

```tsx
'use client'
import { useScroll, useTransform } from 'framer-motion'

const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start 75%', 'end 30%'], // Trigger range
})

const scale = useTransform(scrollYProgress, [0, 1], [0, 1])
```

## 🧩 Component System

### UI Components (Shadcn/UI)

Pre-configured Radix-based components in `components/ui/`:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
```

### Common Patterns

**Container Wrapper:**
```tsx
import { Container } from '@/components/common'
export default function Page() {
  return <Container>{/* Content */}</Container>
}
```

**Loading States:**
```tsx
import { Loading, PageSkeleton } from '@/components/common'
export function Page() {
  if (isLoading) return <PageSkeleton />
  return <div>{/* Content */}</div>
}
```

**Empty & Error States:**
```tsx
import { EmptyState, ErrorState } from '@/components/common'
```

## 🔌 API Integration

### HTTP Client Setup

Custom Axios instance in `lib/httpClient.ts`:

```tsx
import { httpClient } from '@/lib/httpClient'

// All requests include auth token via interceptor
const response = await httpClient.get('/restaurants')
```

### Service Pattern

Feature-specific service files:

```tsx
// services/search.client.ts
import { httpClient } from '@/lib/httpClient'
import { SearchResult } from '@/types/search.types'

export const searchAPI = async (
  searchTerm: string,
  scope: 'all' | 'restaurants' | 'dishes' | 'reviews'
): Promise<SearchResult> => {
  const params = new URLSearchParams({
    searchTerm,
    scope,
  })
  return (await httpClient.get(`/search?${params}`)).data
}
```

### Keyboard Shortcuts

Global shortcut for search modal:

```tsx
// On primary navbar instance only
<GlobalSearchModal enableShortcut={true} />

// Listen for Ctrl/Cmd + K
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    openModal()
  }
}
```

## 🗂️ State Management

**TanStack Query** handles server state:

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { searchAPI } from '@/services/search.client'

export function SearchResults() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchAPI(searchTerm, 'all'),
    enabled: searchTerm.length > 2, // Only fetch if >2 chars
  })
  
  return isLoading ? <Loading /> : <Results data={data} />
}
```

**Local State** via `useState`:

```tsx
'use client'
export function FilterBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSort, setSelectedSort] = useState('recent')
  
  return (
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  )
}
```

## 🎨 Styling Conventions

### Tailwind CSS v4 Rules

**✅ DO: Use canonical spacing**
```tsx
<div className="-left-8.5 top-7 w-152 bg-white/3" />
```

**❌ DON'T: Use arbitrary pixel values**
```tsx
{/* BAD - Rejected by linter */}
<div className="-left-[34px] w-[152px]" />
```

### Button Variants

**Primary CTA (Neon Style):**
```tsx
<Button className="btn-neon-primary">Create Account</Button>
// Applies: gradient background + neon shadow + color shift on hover
```

**Secondary Actions:**
```tsx
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Learn More</Button>
```

### Responsive Classes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" />
<navbar className="hidden md:flex sticky top-0" />
<Sidebar className="hidden lg:block fixed left-0 top-0" />
```

### Opacity & Colors

```tsx
<div className="bg-white/3 hover:bg-white/5 border border-white/10" />
<div className="bg-gradient-to-r from-primary to-purple" />
```

## 📝 Development Workflow

### Creating a New Feature

1. **Define Types** in `types/feature.types.ts`
2. **Create API Service** in `services/feature.client.ts`
3. **Build Components** in `components/modules/feature/`
4. **Add Routes** in `routes/index.ts` and update app router
5. **Test** with `pnpm run check && pnpm lint`
6. **Validate** with `pnpm run build`

### Adding a UI Component

```bash
# Use Shadcn CLI
pnpm dlx shadcn@latest add [component-name]

# Then import and use
import { ComponentName } from '@/components/ui/component-name'
```

### Form Validation

Use Zod schemas:

```tsx
// zod/contact.schema.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
})

// In component
'use client'
import { contactFormSchema } from '@/zod/contact.schema'

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
  })
}
```

## ✅ Best Practices

### 1. **Type Safety**
- Always define types for API responses
- Use `Variants` type annotation for Framer Motion objects
- Utilize TypeScript strict mode for compile-time safety

```tsx
// ✅ Good
import type { Variants } from 'framer-motion'
const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

// ❌ Bad - avoid generic objects
const variants = { /* no type */ }
```

### 2. **Performance Optimization**
- Use debounced search (600-700ms standard)
- Leverage TanStack Query for automatic caching
- Apply `enableShortcut` prop carefully to avoid duplicate listeners

```tsx
// Only enable on primary instance
<GlobalSearchModal enableShortcut={true} /> {/* navbar */}
<GlobalSearchModal enableShortcut={false} /> {/* other instances */}
```

### 3. **Responsive Design**
- Mobile-first approach
- Test at breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`

### 4. **Code Organization**
- One feature per folder in `components/modules/`
- Keep API calls in `services/`
- Store types in `types/`
- Centralize routes in `routes/index.ts`

### 5. **Error Handling**
```tsx
// Catch and display errors gracefully
export function Page() {
  const { data, error, isLoading } = useQuery(...)
  
  if (error) return <ErrorState message={error.message} />
  if (isLoading) return <PageSkeleton />
  return <Content data={data} />
}
```

## 🐛 Debugging & Troubleshooting

### Build Fails with TypeScript Error
**Issue**: `ease: 'easeOut'` not assignable to `Easing` type in Framer Motion
**Solution**: Add explicit `Variants` type annotation

```tsx
import type { Variants } from 'framer-motion'
const myVariants: Variants = { /* ... */ }
```

### Search Not Debouncing
**Issue**: API calls fire too frequently
**Solution**: Check debounce timing in effect cleanup

```tsx
useEffect(() => {
  const timer = setTimeout(() => applyFilters(), 600) // Must be 600+ms
  return () => clearTimeout(timer)
}, [searchTerm])
```

### Styles Not Applying
**Issue**: Tailwind classes not working
**Solution**: 
- Check if using arbitrary pixel values (❌ not allowed)
- Use canonical spacing from config
- Rebuild CSS: `pnpm dev`

### Keyboard Shortcut Triggers Multiple Times
**Issue**: `Ctrl/Cmd + K` opens search twice
**Solution**: Only enable on one instance

```tsx
<GlobalSearchModal enableShortcut={true} />  {/* Only here */}
<GlobalSearchModal enableShortcut={false} /> {/* Not here */}
```

### Components Not Re-rendering
**Issue**: State updates not visible
**Solution**: Ensure component is marked `'use client'`

```tsx
'use client' // Required for useState, useEffect
export function MyComponent() {
  const [state, setState] = useState()
}
```

## 👥 Contributing

### Code Style

- Use TypeScript for all components
- Follow Tailwind CSS v4 conventions (canonical spacing)
- Add `'use client'` only when needed for interactivity
- Comment complex logic and Framer Motion animations

### Commit Messages

```
feat: add global search modal with keyboard shortcut
fix: resolve hero card hover effect on 4th item
docs: update README with new features
refactor: simplify review filter bar logic
```

### Testing

```bash
# Type check
pnpm run check

# Lint code
pnpm lint

# Build for production
pnpm run build

# Preview build
pnpm start
```

### Pull Request Checklist

- [ ] Code passes TypeScript checks (`pnpm check`)
- [ ] ESLint has no errors (`pnpm lint`)
- [ ] Production build succeeds (`pnpm build`)
- [ ] New types are documented
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] UI components use canonical Tailwind classes (no arbitrary values)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev)

## 📄 License

This project is proprietary software developed for the Restaurant Profile Assignment.

---

**Last Updated**: March 31, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
