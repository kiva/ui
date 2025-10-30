# Component Testing Best Practices

This guide explains how to write better component tests by avoiding excessive use of `vi.mock()` and leveraging Vue Test Utils features more effectively.

## Key Principles

### ❌ Avoid: Overusing vi.mock()

**Bad Pattern #1: Mocking components**
```javascript
// DON'T: Mock every child component with vi.mock()
vi.mock('#src/components/Kv/KvButton', () => ({
	default: { name: 'KvButton', template: '<button><slot /></button>' }
}));
vi.mock('#src/components/Kv/KvIcon', () => ({
	default: { name: 'KvIcon', template: '<svg />' }
}));
```

**Why it's bad:**
- Mocks are applied globally across ALL tests in the file and potentially other files
- Harder to customize behavior per test
- Creates tight coupling to implementation details
- Makes tests harder to maintain

**Bad Pattern #2: Mocking utility modules**
```javascript
// DON'T: Re-implement module logic in mocks
vi.mock('numeral', () => ({
	default: value => ({
		format: format => {
			const num = parseFloat(value);
			if (format === '0,0.00') {
				return num.toLocaleString('en-US', { minimumFractionDigits: 2 });
			}
			return num.toString();
		}
	})
}));

vi.mock('lodash/forEach', () => ({
	default: (collection, iteratee) => {
		if (Array.isArray(collection)) {
			collection.forEach(iteratee);
		}
	}
}));

vi.mock('#src/util/loanUtils', () => ({
	getDropdownPriceArray: vi.fn(() => [25, 50, 75, 100]),
	isMatchAtRisk: vi.fn(() => false),
	isLessThan25: vi.fn(amount => parseFloat(amount) < 25),
	// ... re-implementing 10 more functions!
}));
```

**Why it's bad:**
- Wastes developer time re-implementing existing logic
- Mock implementation can drift from real code
- Tests pass but real code might be broken
- Coverage metrics become meaningless (testing mocks, not real code)
- Maintenance burden: must update mocks when modules change

### ✅ Prefer: Use stubs and real implementations

**Good Pattern #1: Stub components**
```javascript
import { commonStubs } from '#test/unit/helpers/componentTestHelpers';

const global = {
	stubs: {
		KvButton: commonStubs.KvButton,
		KvIcon: commonStubs.KvIcon,
	}
};

render(MyComponent, { global });
```

**Why it's better:**
- Stubs are scoped to individual tests
- Straightforward to override per test case
- No side effects on other tests
- Clearer test setup

**Good Pattern #2: Use real utility implementations**
```javascript
// Use the real implementation!
import numeral from 'numeral';
import forEach from 'lodash/forEach';
import { getDropdownPriceArray, isMatchAtRisk } from '#src/util/loanUtils';

// No mocking needed - these are fast, tested, and reliable
describe('MyComponent', () => {
	it('formats numbers correctly', () => {
		const result = numeral(1234.56).format('0,0.00');
		expect(result).toBe('1,234.56'); // Testing real behavior!
	});
});
```

**Why it's better:**
- Tests validate real behavior, catch real bugs
- No maintenance burden keeping mocks in sync
- Accurate code coverage metrics
- Faster to write (no mock re-implementation needed)
- Tests run fast - utilities are already optimized

## When to Stub Components

**Important:** Don't stub components by default! Only stub when there's a specific need.

### ✅ Stub When:
1. **Component requires router** - Uses `router-link` or `$router` (e.g., `KvButton` with `to` prop)
2. **Component has external deps** - Needs Apollo, Auth0, or other services that are hard to set up
3. **Component is slow** - Complex rendering logic that significantly slows tests
4. **Testing isolation** - You specifically want to test the parent without child behavior

### ❌ Don't Stub When:
1. **Component is pure presentation** - No side effects, only renders props/slots
2. **Setup is straightforward** - Dependencies can be provided without complexity
3. **Testing integration** - You want to test how components work together

**Example:**
```javascript
// ❌ BAD: Stubbing everything unnecessarily
stubs: {
	KvButton: commonStubs.KvButton,
	KvIcon: commonStubs.KvIcon,
	SomeSimpleComponent: { template: '<div />' }, // Unnecessary!
	AnotherSimpleComponent: { template: '<span />' }, // Unnecessary!
}

// ✅ GOOD: Only stub what genuinely needs it
stubs: {
	KvButton: commonStubs.KvButton, // Uses router-link - needs stub
	ComplexChild: commonStubs.ComplexChild, // 500+ lines, not testing this
	// Let basic presentational components render naturally
}

// ⚠️ CAUTION: Sometimes basic components still need stubs to avoid test conflicts
stubs: {
	KvSettingsCard: commonStubs.KvSettingsCard, // Basic wrapper, but avoids CSS selector conflicts
}
```

## When to Use vi.mock()

Use `vi.mock()` **ONLY** for these cases:

### ✅ Mock These:

1. **GraphQL query/mutation files** - These are not executable JavaScript
   ```javascript
   vi.mock('#src/graphql/mutation/updateBasket.graphql', () => ({
     default: 'updateBasketMutation'
   }));
   ```

2. **External libraries with side effects**
   ```javascript
   vi.mock('store2', () => ({ default: vi.fn() }));
   vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
   ```

3. **Browser APIs and timers** - When testing time-dependent or environment-specific code
   ```javascript
   vi.mock('lodash/throttle', () => ({ default: vi.fn(fn => fn) }));
   vi.useFakeTimers(); // For setTimeout/setInterval
   ```

4. **Asset imports** - Images, SVGs that can't load in test environment
   ```javascript
   vi.mock('#src/assets/images/logo.svg?url', () => ({ default: '/mock-logo.svg' }));
   ```

5. **Analytics/tracking** - Prevent external calls during tests
   ```javascript
   vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }));
   ```

### ❌ Don't Mock These:

1. **Utility libraries** - lodash, numeral, date-fns, etc.
   ```javascript
   // ❌ DON'T: vi.mock('lodash/forEach', ...)
   // ✅ DO: import forEach from 'lodash/forEach'; // Use it directly!
   ```

2. **Business logic utilities** - loanUtils, basketUtils, etc.
   ```javascript
   // ❌ DON'T: vi.mock('#src/util/loanUtils', ...)
   // ✅ DO: import { calculateLoanAmount } from '#src/util/loanUtils'; // Test real behavior!
   ```

3. **Helper functions** - These should be fast and testable as-is
   ```javascript
   // ❌ DON'T: Mock every util function
   // ✅ DO: Test with real implementations - they're already optimized!
   ```

4. **Internal components** - Use stubs instead
   ```javascript
   // ❌ DON'T: vi.mock('#src/components/MyComponent', ...)
   // ✅ DO: Use stubs in global config (see above)
   ```

### Why This Matters:

**Real Example:** We found tests with 70+ lines of mock implementations for `numeral`, `lodash`, and `loanUtils`. After removing these mocks:
- Tests still passed ✅
- Code coverage became meaningful (33% real coverage vs fake 99%)
- Developers save hours not re-implementing module logic
- Tests now catch real bugs in actual code being used

## Using Test Helpers

### 1. Create Stub Components

Instead of `vi.mock()`, use the helper:

```javascript
import { createStubComponent, commonStubs } from '#test/unit/helpers/componentTestHelpers';

const global = {
	stubs: {
		// Use pre-built common stubs
		KvButton: commonStubs.KvButton,
		KvIcon: commonStubs.KvIcon,

		// Or create custom stubs
		MyCustomComponent: createStubComponent('MyCustomComponent', {
			template: '<div class="custom"><slot /></div>',
			props: ['title', 'value']
		})
	}
};
```

### 2. Test Component Structure

Replace repetitive structure tests:

**Before:**
```javascript
it('has name property', () => {
	expect(MyComponent.name).toBe('MyComponent');
});

it('has title prop', () => {
	expect(MyComponent.props.title).toBeDefined();
});

it('has value prop', () => {
	expect(MyComponent.props.value).toBeDefined();
});

it('has displayValue computed property', () => {
	expect(MyComponent.computed.displayValue).toBeDefined();
});

it('has isValid computed property', () => {
	expect(MyComponent.computed.isValid).toBeDefined();
});
```

**After:**
```javascript
import { testComponentStructure } from '#test/unit/helpers/componentTestHelpers';

testComponentStructure(MyComponent, {
	name: 'MyComponent',
	props: ['title', 'value'],
	computed: ['displayValue', 'isValid'],
	methods: ['handleSubmit'],
	data: { isLoading: false, error: null }
});
```

### 3. Use Mock Factories

Replace inline mock creation:

**Before:**
```javascript
const mockApollo = {
	query: vi.fn(() => Promise.resolve({ data: {} })),
	mutate: vi.fn(() => Promise.resolve({ data: {} })),
	watchQuery: vi.fn(() => ({
		subscribe: vi.fn()
	}))
};
```

**After:**
```javascript
import { createMockApollo } from '#test/unit/helpers/componentTestHelpers';

const mockApollo = createMockApollo({
	// Only override what you need
	query: vi.fn(() => Promise.resolve({ data: { user: { id: 1 } } }))
});
```

## Complete Example

### Before (Bad Pattern)

```javascript
import { render } from '@testing-library/vue';
import MyComponent from '#src/components/MyComponent';

// ❌ Too many vi.mock() calls
vi.mock('#src/components/Kv/KvButton', () => ({
	default: { name: 'KvButton', template: '<button><slot /></button>' }
}));
vi.mock('#src/components/Kv/KvIcon', () => ({
	default: { name: 'KvIcon', template: '<svg />' }
}));
vi.mock('#src/components/Kv/KvLightbox', () => ({
	default: { name: 'KvLightbox', template: '<div><slot /></div>' }
}));

describe('MyComponent', () => {
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn(() => Promise.resolve({ data: {} })),
			mutate: vi.fn(() => Promise.resolve({ data: {} }))
		};
	});

	// ❌ Repetitive structure tests
	it('has name property', () => {
		expect(MyComponent.name).toBe('MyComponent');
	});

	it('has title prop', () => {
		expect(MyComponent.props.title).toBeDefined();
	});

	it('has displayValue computed', () => {
		expect(MyComponent.computed.displayValue).toBeDefined();
	});

	it('renders correctly', () => {
		const { getByText } = render(MyComponent, {
			props: { title: 'Hello' },
			global: {
				provide: { apollo: mockApollo }
			}
		});
		expect(getByText('Hello')).toBeTruthy();
	});
});
```

### After (Good Pattern)

```javascript
import { render } from '@testing-library/vue';
import MyComponent from '#src/components/MyComponent';
import {
	commonStubs,
	testComponentStructure,
	createMockApollo
} from '#test/unit/helpers/componentTestHelpers';

describe('MyComponent', () => {
	// ✅ Use helper for structure tests
	testComponentStructure(MyComponent, {
		name: 'MyComponent',
		props: ['title', 'value'],
		computed: ['displayValue', 'isValid']
	});

	// ✅ Use mock factories
	const mockApollo = createMockApollo();

	// ✅ Use common stubs
	const global = {
		stubs: {
			KvButton: commonStubs.KvButton,
			KvIcon: commonStubs.KvIcon,
			KvLightbox: commonStubs.KvLightbox
		},
		provide: { apollo: mockApollo }
	};

	it('renders correctly', () => {
		const { getByText } = render(MyComponent, {
			props: { title: 'Hello' },
			global
		});
		expect(getByText('Hello')).toBeTruthy();
	});
});
```

## Additional Best Practices

### 1. Vitest Globals - No Need to Import

Vitest functions are available globally - you don't need to import them!

❌ **Don't:**
```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('MyComponent', () => {
	it('works', () => {
		expect(true).toBe(true);
	});
});
```

✅ **Do:**
```javascript
// No imports needed! describe, it, expect, vi are all global

describe('MyComponent', () => {
	it('works', () => {
		expect(true).toBe(true);
	});
});
```

**Why:** Vitest is configured to provide these globally. Importing them is redundant and adds noise to your test files.

### 2. Avoid beforeEach/afterEach - Use Test Runner Methods

Instead of using `beforeEach`/`afterEach` hooks, create test runner functions that handle setup, execution, and teardown in one place.

❌ **Don't: Scattered setup logic**
```javascript
describe('MyComponent', () => {
	let wrapper;
	let mockApollo;
	let mockStore;

	beforeEach(() => {
		mockApollo = { query: vi.fn() };
		mockStore = { get: vi.fn() };
	});

	afterEach(() => {
		wrapper?.unmount();
		vi.clearAllMocks();
	});

	it('renders with title', () => {
		wrapper = render(MyComponent, {
			props: { title: 'Hello' },
			global: { provide: { apollo: mockApollo, store: mockStore } }
		});
		expect(wrapper.getByText('Hello')).toBeTruthy();
	});

	it('renders with subtitle', () => {
		wrapper = render(MyComponent, {
			props: { title: 'Hello', subtitle: 'World' },
			global: { provide: { apollo: mockApollo, store: mockStore } }
		});
		expect(wrapper.getByText('World')).toBeTruthy();
	});
});
```

✅ **Do: Self-contained test runner**
```javascript
describe('MyComponent', () => {
	// Test runner handles setup, execution, and teardown
	const testRender = (props = {}, globalOverrides = {}) => {
		const mockApollo = { query: vi.fn() };
		const mockStore = { get: vi.fn() };

		const result = render(MyComponent, {
			props: {
				title: 'Default Title',
				...props
			},
			global: {
				provide: { apollo: mockApollo, store: mockStore },
				...globalOverrides
			}
		});

		// Return everything the test needs
		return { ...result, mockApollo, mockStore };
	};

	it('renders with title', () => {
		const { getByText } = testRender({ title: 'Hello' });
		expect(getByText('Hello')).toBeTruthy();
	});

	it('renders with subtitle', () => {
		const { getByText } = testRender({ title: 'Hello', subtitle: 'World' });
		expect(getByText('World')).toBeTruthy();
	});

	it('calls Apollo query on mount', () => {
		const { mockApollo } = testRender();
		expect(mockApollo.query).toHaveBeenCalled();
	});
});
```

**Why this is better:**
- ✅ **Clear flow** - Setup, execution, and expectations are visible in each test
- ✅ **Flexible** - Override any prop or config for specific tests
- ✅ **Self-documenting** - Test runner shows what's needed for component to work
- ✅ **No hidden state** - No wondering what `beforeEach` set up
- ✅ **Simpler debugging** - All context is in the test itself
- ✅ **Better isolation** - Each test is truly independent

### 3. Don't Test Pure Display Components

Some components are purely presentational with no logic - they only arrange other components. These don't need unit tests.

**When to skip tests:**
- Component has no computed properties, methods, or watchers
- Component only renders child components with props passed through
- Component is a layout wrapper (CSS/HTML arrangement)
- Component has no conditional rendering logic
- Component has no event handlers or user interactions

**Example - Don't test this:**
```vue
<!-- Categories/MonthlyGoodModule.vue -->
<template>
	<div class="monthly-good-module">
		<KvGrid>
			<template #area1>
				<img :src="heroImage" :alt="altText">
			</template>
			<template #area2>
				<h2>{{ title }}</h2>
				<p>{{ description }}</p>
				<KvButton :to="ctaLink">{{ ctaText }}</KvButton>
			</template>
		</KvGrid>
	</div>
</template>

<script>
export default {
	name: 'MonthlyGoodModule',
	props: ['title', 'description', 'heroImage', 'altText', 'ctaLink', 'ctaText']
	// No logic - only displays props
};
</script>
```

**Why skip tests:**
- No business logic to validate
- Visual testing (Chromatic/Storybook) is more effective
- Integration tests cover this when used in parent components
- Unit tests would only verify Vue's prop passing (already tested by Vue)

**Test these with:**
- ✅ Visual regression testing (Chromatic)
- ✅ Storybook stories for different states
- ✅ Integration tests where component is used
- ✅ E2E tests for full user flows

**Do test when component has:**
- ❌ Computed properties that transform data
- ❌ Methods that handle user interactions
- ❌ Watchers that react to prop changes
- ❌ Conditional rendering logic
- ❌ API calls or side effects
- ❌ Form validation or data transformation

## Available Helpers

### Component Stubs
- `createStubComponent(name, options)` - Create custom stubs
- `commonStubs` - Pre-built stubs for common components (KvButton, KvIcon, etc.)

### Test Structure
- `testComponentStructure(component, expectations)` - Test name, props, computed, methods, data
- `testPropValidation(component, propName, validValues, invalidValues)` - Test prop validators
- `testRendersText(renderFn, texts)` - Test text content
- `testCssClasses(renderFn, expectations)` - Test CSS classes

### Mock Factories
- `createMockApollo(overrides)` - Create Apollo client mock
- `createMockRouter(overrides)` - Create router mock
- `createMockKvAuth0(overrides)` - Create kvAuth0 mock
- `createGlobalConfig(overrides)` - Create global config with defaults

## Migration Checklist

When refactoring tests:

- [ ] Remove unnecessary vitest imports (use globals)
- [ ] Replace `beforeEach`/`afterEach` with test runner functions
- [ ] Replace `vi.mock()` calls with `stubs` in global config
- [ ] Use `commonStubs` for standard Kiva components
- [ ] Consolidate structure tests with `testComponentStructure()`
- [ ] Use mock factories instead of inline mock objects
- [ ] Ensure stubs are scoped to tests, not global
- [ ] Skip tests for pure display components (use visual testing instead)
- [ ] Verify tests still pass and provide good coverage

## Questions?

See `/test/unit/helpers/componentTestHelpers.js` for full API documentation and examples.
