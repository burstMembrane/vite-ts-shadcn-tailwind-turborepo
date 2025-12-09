# Vite + TypeScript + Shadcn + Tailwind 4 + React 19 Turborepo

A modern **pnpm workspace + Turborepo monorepo** template for building React applications with shared component libraries and utilities. Features strict type safety, automated code quality, and lightning-fast builds via [turbo](https://turborepo.com/).

## Features

### Core Stack

- **React 19.2** - Latest React with concurrent features
- **React Compiler 1.0** - Automatic memoization and optimization
- **TypeScript 5.7** - Strict mode type safety
- **Vite 7.2** - Lightning-fast HMR and builds
- **Tailwind CSS 4.1** - CSS-first configuration with `@theme`
- **shadcn/ui** - Beautiful, accessible component library (New York style)

### Monorepo Architecture

- **pnpm 10.22** - Fast, efficient package management
- **Turborepo 2.3** - Smart build orchestration with caching
- **Workspace Packages** - Shared UI components, utilities, and configs
- **Scoped Imports** - Clean `@repo/*` aliases for cross-package imports

### Code Quality

- **ESLint 9.18** - Flat config with strict rules
- **Prettier 3.7** - Consistent code formatting
- **TypeScript Strict Mode** - `noImplicitAny`, `exactOptionalPropertyTypes`, etc.
- **No `any` Types** - Enforced by ESLint
- **No Default Exports** - Named exports only (except config files)

## Prerequisites

- **Node.js** 24.11.1+ (recommended)
- **pnpm** 10.22.0+ - Install via `npm install -g pnpm` or [standalone installers](https://pnpm.io/installation)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
# Start all apps in development mode
pnpm dev

# Or start a specific app
pnpm --filter web dev
```

### Build for Production

```bash
# Build all packages and apps (with Turborepo caching)
pnpm build

# Or build a specific package
pnpm --filter @repo/ui build
```

### Code Quality Checks

```bash
# Lint entire monorepo
pnpm lint

# Type check all packages
pnpm type-check

# Format code
pnpm format
```

## Monorepo Structure

```bash
vite-ts-shadcn-tailwind-turborepo/
├── apps/
│   └── web/                      # Main React application
│       ├── src/
│       │   ├── components/       # App-specific components
│       │   ├── App.tsx           # Main app component
│       │   ├── main.tsx          # Entry point
│       │   └── index.css         # Global styles with @theme
│       ├── index.html
│       ├── vite.config.ts        # Vite + path aliases
│       ├── package.json          # App dependencies
│       └── tsconfig.json         # Extends @repo/typescript-config
│
├── packages/
│   ├── ui/                       # Shared shadcn/ui component library
│   │   ├── button.tsx            # Example: Button component with CVA
│   │   ├── card.tsx              # Example: Card component
│   │   ├── index.css             # Tailwind component styles
│   │   ├── package.json          # @repo/ui
│   │   └── tsconfig.json
│   │
│   ├── lib/                      # Shared utilities
│   │   ├── utils.ts              # cn() helper, formatDate, etc.
│   │   ├── schemas.ts            # Zod validation schemas
│   │   ├── package.json          # @repo/lib
│   │   └── tsconfig.json
│   │
│   ├── eslint-config/            # Shared ESLint configuration
│   │   ├── base.ts               # Base ESLint rules
│   │   ├── react.ts              # React-specific rules
│   │   └── package.json          # @repo/eslint-config
│   │
│   └── typescript-config/        # Shared TypeScript configs
│       ├── base.json             # Base tsconfig with strict mode
│       ├── react-library.json    # For React packages
│       └── package.json          # @repo/typescript-config
│
├── pnpm-workspace.yaml           # Workspace definition
├── turbo.json                    # Build pipeline configuration
├── .prettierrc                   # Prettier config
├── package.json                  # Root scripts
└── README.md
```

## Package System

### Scoped Imports

All packages use scoped aliases for clean cross-package imports:

```typescript
//  CORRECT - Use scoped aliases
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { cn } from "@repo/lib/utils";
import { userSchema } from "@repo/lib/schemas";

//  WRONG - No relative cross-package imports
import { Button } from "../../../packages/ui/button";
import { cn } from "packages/lib/utils";
```

### Workspace Packages

- **`@repo/ui`** - Shared shadcn/ui component library with CVA variants
- **`@repo/lib`** - Utilities, helpers, Zod schemas
- **`@repo/eslint-config`** - Shared ESLint rules (base + react)
- **`@repo/typescript-config`** - Shared TypeScript configurations

### Adding Dependencies

```bash
# Add to root workspace
pnpm add -D [package]

# Add to specific package
pnpm --filter web add [package]
pnpm --filter @repo/ui add [package]

# Add workspace dependency
pnpm --filter web add @repo/ui
```

## Adding shadcn/ui Components

Components are added to the shared `packages/ui/` library and available to all apps:

```bash
# Navigate to UI package
cd packages/ui

# Add components
bunx shadcn@latest add card
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
```

Then import in any app:

```typescript
import { Card } from "@repo/ui/card";
import { Dialog } from "@repo/ui/dialog";
```

Browse available components at [ui.shadcn.com](https://ui.shadcn.com).

## Turborepo Pipeline

Turborepo orchestrates tasks with intelligent caching and parallelization:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

**Key Features:**

- **Parallel Execution** - Runs independent tasks concurrently
- **Smart Caching** - Skips unchanged packages
- **Dependency Awareness** - `^build` ensures package deps build first
- **Remote Caching** - Share cache across team (optional)

## Configuration

### TypeScript

All packages extend `@repo/typescript-config/base.json` with strict mode:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "paths": {
      "@repo/ui/*": ["../../packages/ui/*"],
      "@repo/lib/*": ["../../packages/lib/*"]
    }
  }
}
```

**Strict Mode Features:**

- `noImplicitAny: true` - No implicit `any` types
- `exactOptionalPropertyTypes: true` - Optional props are exact
- `verbatimModuleSyntax: true` - Modern ESM imports
- `moduleResolution: "bundler"` - Vite-compatible resolution

### ESLint

Shared configuration in `@repo/eslint-config`:

```typescript
import baseConfig from "@repo/eslint-config/base";
import reactConfig from "@repo/eslint-config/react";

export default [
  ...baseConfig,
  ...reactConfig,
];
```

**Enforced Rules:**

- `@typescript-eslint/no-explicit-any: error` - No `any` types
- `@typescript-eslint/consistent-type-imports: error` - Inline type imports
- `import/no-default-export: error` - Named exports only
- `import/newline-after-import: error` - Blank line after imports
- `unicorn/filename-case: error` - Consistent file naming

### Tailwind CSS v4

CSS-first configuration in `packages/ui/index.css` and `apps/web/src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Custom design tokens */
  --color-primary: #3b82f6;
  --font-sans: "Inter", sans-serif;
}
```

### React Compiler

Enabled via Babel plugin in Vite config - automatic optimization without manual memoization:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
```

## Development Workflow

### Monorepo Commands

```bash
# Start all development servers
pnpm dev

# Build all packages and apps
pnpm build

# Lint entire monorepo
pnpm lint

# Type check all packages
pnpm type-check

# Format all code
pnpm format

# Clean all build artifacts and caches
pnpm clean
```

### Filtered Commands

Run commands on specific packages:

```bash
# Start only the web app
pnpm --filter web dev

# Build only the UI package
pnpm --filter @repo/ui build

# Type check only lib package
pnpm --filter @repo/lib type-check

# Add dependency to web app
pnpm --filter web add zod
```

### Turborepo TUI

Use the Turborepo terminal UI for visual build progress:

```bash
pnpm dev --ui
pnpm build --ui
```

## Code Quality Standards

### TypeScript Standards

- Strict mode enabled
- No `any` types without justification
- Named exports only (no default exports)
- Inline type imports: `import { type Foo }`
- All packages must typecheck independently

### ESLint Standards

- Zero warnings policy (`max-warnings: 0`)
- Automatic import sorting
- Consistent naming conventions
- Accessibility rules enforced (`eslint-plugin-jsx-a11y`)

### Component Standards

- Use CVA for variants (class-variance-authority)
- Use `cn()` utility from `@repo/lib/utils`
- Use Tailwind tokens (no arbitrary values without justification)
- Components in `packages/ui/` are framework-agnostic

## Technology Versions

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 24.11.1+ | Runtime |
| pnpm | 10.22.0 | Package manager |
| Turborepo | 2.3.3 | Build orchestration |
| TypeScript | 5.7.2 | Type safety |
| React | 19.2.0 | UI framework |
| Vite | 7.2.4 | Build tool |
| Tailwind CSS | 4.1.17 | Styling |
| ESLint | 9.18.0 | Linting |
| Prettier | 3.7.4 | Formatting |

## What's Included

### Pre-configured Features

- Vite 7 with React Compiler plugin
- Tailwind CSS v4 with CSS-first `@theme`
- shadcn/ui component library in `packages/ui/`
- ️ TypeScript strict mode across all packages
- pnpm workspaces with scoped imports (`@repo/*`)
- Turborepo with parallel builds and caching
- ESLint flat config with strict rules
- Prettier with auto-formatting
- Type-safe imports with path aliases
- Accessibility rules enforced
- CVA for component variants
- Vitest ready (tests optional)

### Example Components

- **Button** (`packages/ui/button.tsx`) - With CVA variants
- **Card** (`packages/ui/card.tsx`) - Container component
- Utilities (`packages/lib/utils.ts`) - `cn()` helper, formatDate, etc.

## Architecture Philosophy

This monorepo follows strict architectural principles:

1. **Package Isolation** - Each package must typecheck independently
2. **No Circular Deps** - Packages form a directed acyclic graph (DAG)
3. **Scoped Imports** - Always use `@repo/*` aliases, never relative cross-package imports
4. **Apps vs Packages** - Apps consume packages, packages never import from apps
5. **Type Safety First** - Strict TypeScript mode, no `any` types
6. **Performance by Default** - React Compiler, Turborepo caching, tree shaking
