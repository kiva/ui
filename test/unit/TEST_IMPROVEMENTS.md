# Test Improvements Summary

This directory contains improved testing patterns and utilities to help you write better, more maintainable tests.

## 📚 Documentation

- **[TESTING_BEST_PRACTICES.md](./TESTING_BEST_PRACTICES.md)** - Comprehensive guide for writing maintainable tests

## 🛠 New Test Helpers

**Location:** `test/unit/helpers/componentTestHelpers.js`

### Key Features

1. **Component Stubs** - Pre-built stubs for common Kiva components (KvButton, KvIcon, etc.)
2. **Structure Testing** - Consolidate repetitive "has X property" tests into one call
3. **Mock Factories** - Reusable factories for Apollo, Router, kvAuth0
4. **Prop Validation Testing** - Helper for testing prop validators

### Quick Example

```javascript
import {
	commonStubs,
	testComponentStructure,
	createMockApollo
} from '../../../helpers/componentTestHelpers';

describe('MyComponent', () => {
	// Consolidated structure test
	testComponentStructure(MyComponent, {
		name: 'MyComponent',
		props: ['title', 'value'],
		computed: ['displayValue']
	});

	// Use pre-built stubs
	const global = {
		stubs: {
			KvButton: commonStubs.KvButton,
			KvIcon: commonStubs.KvIcon
		},
		provide: {
			apollo: createMockApollo()
		}
	};

	it('renders correctly', () => {
		const { getByText } = render(MyComponent, { global });
		expect(getByText('Hello')).toBeTruthy();
	});
});
```

## ✅ Refactored Example Files

The following test files have been refactored to demonstrate the new patterns:

- `test/unit/specs/components/Settings/TwoStepVerification.spec.js`
- `test/unit/specs/components/Checkout/OrderTotals.spec.js`
- `test/unit/specs/components/Settings/AppAuthentication.spec.js`
- `test/unit/specs/components/Categories/MainCategoryTile.spec.js`

These serve as reference implementations showing:
- How to replace `vi.mock()` with stubs
- How to consolidate structure tests
- How to use mock factories
- How to test prop validation

## 🎯 Key Principles

### 1. Avoid Excessive vi.mock()

❌ **Don't** mock components or utilities with `vi.mock()`
```javascript
// DON'T: Mock components
vi.mock('#src/components/Kv/KvButton', () => ({
	default: { template: '<button><slot /></button>' }
}));

// DON'T: Re-implement utility logic
vi.mock('numeral', () => ({
	default: value => ({ format: () => value.toString() })
}));
```

✅ **Do** use stubs for components and real implementations for utilities
```javascript
// Stub components
const global = {
	stubs: {
		KvButton: commonStubs.KvButton
	}
};

// Use real utilities
import numeral from 'numeral';
const formatted = numeral(1234.56).format('0,0.00'); // Real behavior!
```

### 2. Consolidate Structure Tests

❌ **Don't** write 15+ individual structure tests
```javascript
it('has name property', () => { /* ... */ });
it('has title prop', () => { /* ... */ });
it('has displayValue computed', () => { /* ... */ });
// ... 12 more similar tests
```

✅ **Do** use testComponentStructure()
```javascript
testComponentStructure(MyComponent, {
	name: 'MyComponent',
	props: ['title'],
	computed: ['displayValue']
});
```

### 3. Use Mock Factories

❌ **Don't** create inline mocks repeatedly
```javascript
const mockApollo = {
	query: vi.fn(() => Promise.resolve({ data: {} })),
	mutate: vi.fn(() => Promise.resolve({ data: {} })),
	// ... 5 more methods
};
```

✅ **Do** use mock factories
```javascript
const mockApollo = createMockApollo({
	// Only override what you need
	query: vi.fn(() => Promise.resolve({ data: { user: { id: 1 } } }))
});
```

## 📊 Benefits

- **Less code** - Reduce test boilerplate by 40-60%
- **Better isolation** - Stubs are scoped to tests, not global
- **Easier maintenance** - Change stub behavior in one place
- **Clearer tests** - Focus on behavior, not structure
- **Faster to write** - Reuse common patterns and utilities
- **Real testing** - Use actual implementations to catch real bugs
- **Meaningful coverage** - Coverage metrics reflect real code usage
- **Less maintenance** - No need to keep mocks in sync with real code

## 🚀 Getting Started

1. Read [TESTING_BEST_PRACTICES.md](./TESTING_BEST_PRACTICES.md) for comprehensive guidelines
2. Check out the refactored example files to see the patterns in action
3. Import helpers from `test/unit/helpers/componentTestHelpers.js`
4. Remember: Only mock when absolutely necessary (GraphQL files, external APIs, assets)

## 💡 Key Learnings

### What We Discovered
During our test migration project, we reviewed 47 component test files and found:
- **30 files** needed refactoring to remove excessive mocks
- **17 files** already followed best practices
- **20+ mock re-implementations** of utilities (lodash, numeral, loanUtils)
- Tests passing with mocks but not testing real behavior

### Real Impact
After removing unnecessary mocks:
- ✅ All 4,622 tests still pass
- ✅ Code coverage metrics now meaningful (e.g., loanUtils: 33% real coverage)
- ✅ Tests catch bugs in actual code, not mock implementations
- ✅ Developers save hours not re-implementing module logic
- ✅ 176 tests now use real implementations instead of mocks

### Golden Rules
1. **Don't mock what you can use** - Utilities are fast and already tested
2. **Stub components, not modules** - Use `stubs` in global config
3. **Only mock side effects** - GraphQL files, external APIs, browser APIs
4. **Test real behavior** - Mocks hide bugs, real code reveals them

## ❓ Questions?

- Check the full API documentation in `test/unit/helpers/componentTestHelpers.js`
- Look at the example files for real-world usage
- Review [TESTING_BEST_PRACTICES.md](./TESTING_BEST_PRACTICES.md) for detailed guidelines
