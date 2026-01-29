# Agent Guidelines for Tamenchan Bootcamp

This document provides coding guidelines and commands for AI agents working on this codebase.

## Project Overview

A web application for training Mahjong "Tamenchan" (multiple wait) pattern recognition. Built with React + TypeScript + Vite, focusing on Chinitsu (one suit) hands with a playful "Gal" aesthetic.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Type-check and build for production
npm run preview          # Preview production build locally
```

### Linting
```bash
npm run lint             # Lint entire codebase with ESLint
npm run lint -- --fix    # Auto-fix linting issues
```

### Testing
```bash
npm run test             # Run all tests in watch mode
npm run test:run         # Run all tests once
npm run test:ui          # Run tests with interactive UI
npm run test:coverage    # Run tests with coverage report
npx vitest run src/logic/mahjong.test.ts  # Run single test file
npx vitest run -t "Chuuren"              # Run tests matching pattern
```

## Code Style Guidelines

### File Organization

**Directory Structure:**
- `/src/components/` - React UI components (PascalCase files)
- `/src/logic/` - Business logic and utilities (camelCase files)
- `/src/assets/` - Static assets (images, etc.)
- Co-locate CSS with components: `Tile.tsx` + `Tile.css`

**File Naming:**
- Components: `PascalCase.tsx` (e.g., `Tile.tsx`, `Quiz.tsx`)
- Logic/Utils: `camelCase.ts` (e.g., `mahjong.ts`, `generator.ts`)
- Tests: `*.test.ts` suffix (e.g., `mahjong.test.ts`)
- Styles: Match component name (e.g., `Tile.css` for `Tile.tsx`)

### TypeScript

**Configuration:**
- Strict mode enabled (`"strict": true` in tsconfig.json)
- Target: ES2022 for app code
- No unused locals or parameters allowed
- Use `type` imports for type-only imports

**Type Patterns:**
```typescript
// Export types explicitly
export type Hand = number[];
export interface Problem {
    hand: Hand;
    waits: number[];
}

// Type-only imports
import { type Hand } from './mahjong';

// Mixed imports
import { getWaits, type Hand } from './mahjong';
```

**Type Safety:**
- Always provide explicit types for function parameters and return values
- Use union types for variants: `size?: 'sm' | 'md' | 'lg'`
- Prefer interfaces for object shapes, type aliases for unions/primitives
- No `any` types unless absolutely necessary

### React Components

**Component Pattern:**
```typescript
interface ComponentProps {
    value: number;
    onClick?: () => void;
    selected?: boolean;
}

export const Component: React.FC<ComponentProps> = ({ value, onClick, selected }) => {
    const [state, setState] = useState<StateType>(initialValue);
    
    return (
        <div className="component">
            {/* JSX */}
        </div>
    );
};
```

**Conventions:**
- Use named exports with `React.FC` for components (except App.tsx uses default export)
- Define props interfaces inline above component
- Use functional components with hooks (no class components)
- Destructure props in function signature
- Use `useState` with explicit type parameter when type cannot be inferred

### Naming Conventions

**Variables and Functions:**
- camelCase: `loadProblem`, `toggleWait`, `gameState`
- Descriptive names: `getWinningDecomposition`, `generateRandomHand`
- Boolean variables: prefix with `is`, `has`, or `should`

**Constants:**
- UPPER_SNAKE_CASE for constant objects/arrays: `GAL_MESSAGES`, `TILE_MAP`

**CSS Classes:**
- kebab-case: `.glass-panel`, `.quiz-container`
- BEM-like modifiers: `.tile-sm`, `.tile-md`, `.tile-lg`

### Imports

**Order:**
1. React/library imports
2. Component imports
3. Logic/utility imports
4. Type imports
5. CSS imports (last)

**Example:**
```typescript
import { useState, useEffect } from 'react';
import { Tile } from './components/Tile';
import { getWaits, type Hand } from './logic/mahjong';
import './App.css';
```

### Formatting

**Indentation and Spacing:**
- 4 spaces for indentation (no tabs)
- Semicolons required at end of statements
- Single quotes preferred for strings (though codebase has some inconsistency)
- Trailing commas in multi-line arrays/objects

**Line Length:**
- No strict limit, but keep readable (aim for ~100-120 chars)

**Braces:**
- Always use braces for conditionals, even single-line
- Opening brace on same line (K&R style)

### Error Handling

**Validation:**
- Validate inputs at function boundaries
- Use TypeScript's type system to prevent invalid states
- Throw descriptive errors for invalid inputs

**Example:**
```typescript
export function getWaits(hand: number[]): number[] {
    if (hand.length !== 13 && hand.length !== 10 && hand.length !== 7) {
        throw new Error(`Invalid hand length: ${hand.length}`);
    }
    // ...
}
```

### Testing

**Test Structure:**
```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './module';

describe('Module Name', () => {
    it('describes what the test does in plain English', () => {
        const input = [1, 2, 3];
        const result = functionToTest(input);
        expect(result).toEqual(expectedValue);
    });
});
```

**Conventions:**
- Use `describe` for grouping related tests
- Use `it` for individual test cases
- Test names should be descriptive sentences
- Focus on testing business logic (pure functions)
- Test edge cases and error conditions

### CSS

**Design System:**
- CSS variables defined in `:root` (see `index.css`)
- Glassmorphism effect: `.glass-panel` utility class
- Neon/gradient effects: `.text-gradient`, `.neon-text`

**Component Styles:**
- Vanilla CSS (no preprocessors or CSS-in-JS)
- Scoped to component files
- Use flexbox for layouts
- Mobile-first with media queries
- Transitions for interactive elements

### Comments and Documentation

**JSDoc for Functions:**
```typescript
/**
 * Returns an array of tiles that complete the hand.
 * @param hand 13 tiles (or 10, 7)
 * @returns Array of winning tile values (1-9)
 */
export function getWaits(hand: number[]): number[] {
    // Implementation
}
```

**When to Comment:**
- Complex algorithms or business logic
- Non-obvious workarounds
- Domain-specific Mahjong rules
- Mix of English and Japanese is acceptable for domain terms

### Project-Specific Patterns

**Mahjong Logic:**
- Tiles represented as numbers 1-9
- Hands are number arrays
- Use pure functions for game logic
- Recursive backtracking for set decomposition

**UI Theme:**
- "Gal" (Gyaru) aesthetic with neon colors
- Emoji usage encouraged in UI strings
- Japanese text in UI, English in code/comments

**Data Flow:**
- Business logic (pure functions) → Generator → Components
- No state management library (use React local state)

## Git Workflow

**Branch Creation:**

Before creating a new branch, **always** update your local main branch:

```bash
# Switch to main branch
git checkout main

# Pull latest changes from remote
git pull origin main

# Now create your feature branch
git checkout -b feat/your-feature-name
```

**Branch Naming Convention:**
- `feat/` - New features (e.g., `feat/add-scoring-system`)
- `fix/` - Bug fixes (e.g., `fix/quiz-useeffect-dependencies`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-mahjong-logic`)
- `test/` - Test additions/updates (e.g., `test/add-generator-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

**Why Update Main First?**
- Prevents merge conflicts later
- Ensures you're working with the latest code
- Makes PR reviews easier
- Reduces integration issues

**Commit Messages:**
- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Concise messages in English
- Example: `feat: add scoring system for quiz`

## Additional Notes

- Separation of concerns: Keep business logic separate from UI components
- TypeScript strict mode is enforced - no bypassing with `@ts-ignore` without good reason
- ESLint rules are enforced - fix linting errors before committing
- Prefer minimal dependencies (vanilla CSS over frameworks)
- Focus on clean, readable code over clever optimizations
