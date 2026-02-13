---
trigger: always_on
---

# AI Agent Instructions – Vue 3 + TypeScript Application

This repository is a Vue 3 frontend application written in TypeScript using the Composition API.

The AI agent must follow all architectural, structural, and coding constraints defined below.

---

# 1. Architecture Overview

Architecture Style:
- Feature-based modular frontend
- Composition API only
- Strict TypeScript
- Separation of UI, state, and API layers

Core Stack:
- Vue 3
- TypeScript (strict mode enabled)
- Vite
- Pinia for state management
- Vue Router
- Axios 

---

# 2. Architectural Rules (MANDATORY)

## 2.1 Component Structure

Components must follow:

- Presentational components:
  - No API calls
  - No direct state mutations
  - Receive props and emit events only

- Container (smart) components:
  - May access Pinia stores
  - May trigger actions
  - No business logic beyond orchestration

## 2.2 State Management

- All shared state must live in Pinia stores.
- Components must not share state directly.
- Stores must not directly access DOM APIs.
- Business logic belongs in stores or composables, not components.

## 2.3 API Layer

- All HTTP calls must go through a centralized `/api` service layer.
- No direct Axios/fetch usage inside components.
- API responses must be typed with TypeScript interfaces.
- No `any` allowed.

## 2.4 TypeScript Rules

- Strict mode must be respected.
- No `any`.
- No `@ts-ignore`.
- All props must be typed.
- All emits must be typed.
- All API responses must use defined DTO interfaces.

---

# 3. Composition API Rules

- Use `<script setup>` syntax.
- Prefer `ref` and `computed` appropriately.
- Avoid excessive `watch` usage.
- Extract reusable logic into composables.
- Composables must be pure and reusable.

---

# 4. Design Patterns

Use:
- Composition pattern
- Store pattern (Pinia)
- Dependency injection via composables
- DTO pattern for API responses
- Feature module pattern

Avoid:
- Global mutable state
- God components
- Massive single-file components (>300 lines)
- Mixing API logic into UI
- Direct DOM manipulation unless necessary

---

# 5. Styling Rules

- Use scoped styles.
- Prefer utility-based styling (if Tailwind exists).
- No inline styles unless dynamic.
- No global CSS pollution.

---

# 6. Testing Requirements

- Unit tests required for:
  - Stores
  - Composables
  - Utility functions

- Components must be tested if:
  - They contain conditional logic
  - They emit events
  - They render dynamic content

- Mock API calls in tests.
- No real network calls in test environment.

---

# 7. Performance Constraints

- Avoid unnecessary re-renders.
- Use `computed` over `watch` when possible.
- Lazy-load route components.
- Avoid large reactive objects.

---

# 8. Anti-Patterns (STRICTLY FORBIDDEN)

- Direct API calls inside components
- Mutating props
- Using `any`
- Circular imports
- Business logic inside templates
- Direct store mutation outside actions
- Creating tightly coupled components
- Introducing new libraries without approval

---

# 9. Definition of Done

A task is complete only if:

- Code compiles without TypeScript errors
- Lint passes
- Tests pass
- New logic includes tests
- No architectural rules are violated
- No `any` introduced
- No unused imports

---

# 10. Change Policy

- Do not refactor unrelated files.
- Keep PR scope minimal.
- Do not restructure folders without explicit requirement.
- Do not introduce new dependencies without justification.

---

Failure to comply with these rules is considered an architectural violation.