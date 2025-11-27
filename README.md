# Vite + TypeScript + Shadcn + Tailwind 4 + React 19 Template

This is a [kickstart](https://github.com/Keats/kickstart) template for modern React applications with a powerful tech stack and sensible defaults.

## Features

- **React 19** - Latest React with concurrent features
- **React Compiler** - Automatic memoization and optimization
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast HMR and builds
- **Tailwind CSS v4** - Latest Tailwind with CSS-first configuration
- **shadcn/ui** - Beautiful, accessible component library
- **Bun** - Fast package management and scripts
- **Path Aliases** - `@/` alias configured for clean imports

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- [kickstart](https://github.com/Keats/kickstart) installed (`cargo install kickstart`)

## Usage

Create a new project using this template:

```bash
kickstart https://github.com/burstMembrane/vite-ts-shadcn-tailwind -p my-project-name
cd my-project-name
```

Or if running locally:

```bash
kickstart /path/to/this/template -o my-project-name
cd my-project-name
```

## Getting Started

Install dependencies:

```bash
make install
# or
bun install
```

Start the development server:

```bash
make dev
# or
bun run dev
```

Build for production:

```bash
make build
# or
bun run build
```

## Project Structure

```bash
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts     # Utility functions (cn helper)
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── components.json      # shadcn/ui configuration
└── package.json
```

## Adding shadcn/ui Components

This template comes with the Button component pre-installed. Add more components using:

```bash
bunx shadcn@latest add [component-name]
```

Example:

```bash
bunx shadcn@latest add card
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
```

Browse available components at [ui.shadcn.com](https://ui.shadcn.com).

## Configuration

### Path Aliases

The `@/` alias is configured to point to `./src`:

```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### React Compiler

The React Compiler is enabled via Babel plugin, providing automatic optimization. No configuration needed!

### Tailwind CSS v4

Tailwind v4 uses CSS-first configuration. Customize in `src/index.css`:

```css
@theme {
  /* Your custom theme configuration */
}
```

## Scripts

- `make install` / `bun install` - Install dependencies
- `make dev` / `bun run dev` - Start development server
- `make build` / `bun run build` - Build for production
- `make preview` / `bun run preview` - Preview production build

## What's Included

The template comes with:

- Pre-configured Vite setup with React Compiler
- Tailwind CSS v4 with Vite plugin
- shadcn/ui Button component example
- TypeScript strict mode enabled
- Path alias configuration
- Development/production build optimization
- Bun-optimized scripts

## License

MIT
