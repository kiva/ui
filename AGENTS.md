# Kiva UI - AI Agent Instructions

## Project Overview
Kiva UI is a Vue 3 SSR (Server-Side Rendering) application for Kiva.org's lending platform. It uses Vite for builds, Apollo Client for GraphQL, and Tailwind CSS for styling.

## Vue 3 Best Practices

### Prefer Composition API
- **Use composables over mixins** for new code. Composables live in `src/composables/`
- Mixins (`src/plugins/*-mixin.js`) exist for legacy code but should not be used for new features
- When refactoring, migrate mixins to composables where practical

### ⚠️ Options API + Composition API Nesting Warning
Deeply nested component chains can have issues when parent components use Options API and children use Composition API (or vice versa). When working with nested components:
1. Verify `inject`/`provide` chains work correctly across API boundaries
2. Test the full component hierarchy, not just the component you're editing
3. Watch for `undefined` injection values in deeply nested Composition API components

## Architecture

### Rendering Modes
- **SSR Pages**: Most pages render server-side with data prefetching via `src/server-app-render.js`
- **CDN-Cached Pages**: Routes with `meta: { useCDNCaching: true }` skip user-specific data on SSR for caching
- **ESI Fragments**: Edge-side includes for cached page components via `src/server-esi-render.js`

### Key Directories
- `src/pages/` - Route page components (one folder per feature)
- `src/components/` - Reusable components organized by feature (e.g., `WwwFrame/`, `LoanCards/`, `Checkout/`)
- `src/components/Kv/` - Internal UI primitives (prefix: `Kv`)
- `src/graphql/` - GraphQL queries/mutations organized by type
- `src/composables/` - Vue 3 composition API utilities
- `src/plugins/` - Vue plugins and mixins
- `server/` - Express server, auth routers, and SSR middleware

## GraphQL Data Fetching Pattern

### Component Apollo Block (Options API)
Components use an `apollo` block with `inject: ['apollo', 'cookieStore']`:

```javascript
export default {
  inject: ['apollo', 'cookieStore'],
  apollo: {
    preFetch: true,  // Enable SSR prefetch
    query: myQuery,
    preFetchVariables({ route }) {
      return { id: route.query.id };  // SSR variables (no `this`)
    },
    variables() {
      return { id: this.$route.query.id };  // Client variables
    },
    result({ data }) {
      this.myData = data?.someProperty;
    },
  }
}
```

For multiple queries, use an array of operation objects. See `src/graphql/README.md` for advanced patterns.

## Styling Conventions

### Tailwind CSS
- All Tailwind classes require `tw-` prefix (e.g., `tw-flex`, `tw-mb-4`)
- Tokens come from `@kiva/kv-tokens` via `tailwind.config.js`
- Grid system: `KvGrid`, `KvPageContainer` from `@kiva/kv-components`

### Component Library
> **Directive**: Always check `@kiva/kv-components` first before creating custom UI elements.

- **Prefer `@kiva/kv-components`** for buttons, forms, modals, layout, and common UI patterns
- Available components: `KvButton`, `KvSelect`, `KvTextInput`, `KvGrid`, `KvPageContainer`, `KvMaterialIcon`, `KvThemeProvider`, etc.
- Internal `Kv*` components in `src/components/Kv/` are either project-specific or deprecated and supplement the shared library

## Route Definitions
Routes live in `src/router/routes.js` with lazy loading:
```javascript
{
  path: '/my-page',
  component: () => import('#src/pages/MyFeature/MyPage'),
  meta: {
    authenticationRequired: true,
    excludeFromStaticSitemap: true,
  }
}
```

## Authentication
- Route meta `authenticationRequired: true` enforces login
- Route meta `activeLoginRequired: true` requires recent login
- Auth handled via `src/util/authenticationGuard.js`

## Analytics Tracking
Use the directive for click tracking:
```html
<button v-kv-track-event="['Category', 'action-name', 'Label']">
```
Or inject `$kvTrackEvent` for programmatic tracking.

## Development Commands
```bash
nvm use                         # Use required Node version
npm ci                          # Install dependencies
npm run dev -- --config=local   # Dev server at localhost:8888
npm run dev -- --config=dev-custom-host  # With Caddy at https://kiva-ui.local
npm run unit                    # Vitest unit tests
npm run lint                    # ESLint + Stylelint + GraphQL lint
npm run build                   # Production build
```

## Testing
- **Unit tests**: Vitest + Testing Library in `test/unit/specs/`
- Use `globalOptions` from `test/unit/specUtils.js` for mock apollo/cookieStore
- **E2E tests**: Cypress in `cypress/` against real environments
- Test user-centric behavior, not implementation details

## Import Aliases
Use `#src/` alias for imports from the src directory:
```javascript
import WwwPage from '#src/components/WwwFrame/WwwPage';
import myQuery from '#src/graphql/query/myQuery.graphql';
```

## Code Style & Linting

### Editor Configuration
- **Indentation**: Tabs (size 4)
- **Line length**: Max 120 characters
- **Line endings**: LF only
- **Charset**: UTF-8
- **YAML files**: Exception—use spaces (2-space indent)

### ESLint Key Rules
- **Vue components must have explicit `name` property** (`vue/require-name-property`)
- **Component file names must match component name** case-sensitively (`vue/match-component-file-name`)
- **Import extensions**: Omit `.js`/`.vue`/`.mjs` extensions in imports; ESLint enforces this
- **GraphQL operations must be named** (`graphql/named-operations`)—anonymous operations will fail
- **All GraphQL types must include `id` and `key` fields** (`graphql/required-fields`)
- **Vue templates**: No self-closing normal HTML elements; use paired tags
- **Debugging**: `debugger` statements error in production, allowed in development
- **Console statements**: Only `console.error()` allowed in production; others cause warnings

### Pre-commit Hooks
Husky is configured to run linting on commit:
```bash
npm run lint  # Run before committing
```
This runs ESLint, Stylelint, and GraphQL linting. Fix violations before committing.
