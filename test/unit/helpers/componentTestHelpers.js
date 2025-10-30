/**
 * Component Testing Helper Utilities
 *
 * This module provides utilities to eliminate repetitive test patterns and reduce
 * the need for vi.mock() by providing reusable component stubs and test helpers.
 *
 * WHEN TO USE vi.mock():
 * - Only when you need to mock side effects (e.g., window.location, timers)
 * - When testing module-level code execution
 * - When absolutely no other option works
 *
 * PREFER INSTEAD:
 * - Use `stubs` option in global config for child components
 * - Use `components` option for specific component replacements
 * - Use these helper utilities for common patterns
 */

/**
 * Creates a simple stub component with template and props
 * Use this instead of vi.mock() for child components
 *
 * @param {string} name - Component name
 * @param {Object} options - Component options
 * @param {string} options.template - Template string (default: renders slot)
 * @param {Array<string>|Object} options.props - Props to accept
 * @param {Array<string>} options.emits - Events the component can emit
 * @returns {Object} Vue component definition
 *
 * @example
 * const global = {
 *   stubs: {
 *     KvButton: createStubComponent('KvButton', { props: ['to', 'variant'] }),
 *     KvIcon: createStubComponent('KvIcon', { template: '<svg class="kv-icon" />' })
 *   }
 * };
 */
export function createStubComponent(name, options = {}) {
	const {
		template = '<div><slot /></div>',
		props = [],
		emits = [],
		slots = []
	} = options;

	return {
		name,
		template,
		props,
		emits,
		...(slots.length > 0 && { slots })
	};
}

/**
 * Common stub components that can be reused across tests
 * Use these instead of repeatedly mocking the same components
 *
 * NOTE: Only stub components when necessary! In many cases, you can let Vue render
 * the actual child components. Stub only when:
 * - Component requires router/apollo/auth that's hard to set up
 * - Component makes network requests or has side effects
 * - Component is very complex and slows tests significantly
 * - You specifically want to isolate the component under test
 *
 * These stubs are provided for components that commonly need stubbing due to
 * dependencies on router-link, external services, or complex rendering logic.
 *
 * @example
 * import { commonStubs } from '../../../helpers/componentTestHelpers';
 *
 * const global = {
 *   stubs: {
 *     KvButton: commonStubs.KvButton, // Needs stub due to router-link
 *     KvIcon: commonStubs.KvIcon, // Needs stub due to async component loading
 *     // Don't stub simple presentational components unnecessarily
 *   }
 * };
 */
export const commonStubs = {
	KvButton: createStubComponent('KvButton', {
		template: `<a v-if="to" :href="to" class="kv-button"><slot /></a>
			<button v-else class="kv-button"><slot /></button>`,
		props: ['to', 'variant', 'type', 'state', 'disabled']
	}),

	KvIcon: createStubComponent('KvIcon', {
		template: '<svg class="kv-icon"><use :xlink:href="name" /></svg>',
		props: ['name', 'title']
	}),

	KvLightbox: createStubComponent('KvLightbox', {
		template: '<div v-if="visible" class="kv-lightbox"><h2>{{ title }}</h2><slot /><slot name="controls" /></div>',
		props: ['visible', 'title', 'preventClose'],
		emits: ['lightbox-closed']
	}),

	KvLoadingSpinner: createStubComponent('KvLoadingSpinner', {
		template: '<div class="kv-loading-spinner"></div>'
	}),

	KvLoadingPlaceholder: createStubComponent('KvLoadingPlaceholder', {
		template: '<span class="kv-loading-placeholder"></span>',
		props: ['class', 'style']
	}),

	KvSettingsCard: createStubComponent('KvSettingsCard', {
		template: '<div class="kv-settings-card"><h2>{{ title }}</h2><slot name="content" /></div>',
		props: ['title', 'class']
	}),

	KvTooltip: createStubComponent('KvTooltip', {
		template: '<div class="kv-tooltip"><slot /></div>',
		props: ['controller']
	}),

	KvExpandable: createStubComponent('KvExpandable', {
		template: '<div class="kv-expandable"><slot /></div>',
		props: ['title']
	}),

	KvCheckbox: createStubComponent('KvCheckbox', {
		template: `<input type="checkbox" :checked="modelValue"
			@change="$emit('update:modelValue', $event.target.checked)" />`,
		props: ['modelValue', 'id'],
		emits: ['update:modelValue']
	}),

	KvTextInput: createStubComponent('KvTextInput', {
		template: `<input :id="id" :placeholder="placeholder" :value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)" />`,
		props: ['modelValue', 'id', 'placeholder', 'type'],
		emits: ['update:modelValue']
	}),

	KvResponsiveImage: createStubComponent('KvResponsiveImage', {
		template: '<img :alt="alt" />',
		props: ['images', 'loading', 'alt', 'width', 'height']
	}),

	RouterLink: createStubComponent('RouterLink', {
		template: '<a :href="to"><slot /></a>',
		props: ['to']
	}),

	KvAlert: createStubComponent('KvAlert', {
		template: '<div class="kv-alert" :data-variant="variant"><slot /></div>',
		props: ['variant']
	}),
};

/**
 * Tests common component structure properties in a single test
 * Eliminates repetitive "has X property" tests
 *
 * @param {Object} component - Vue component definition
 * @param {Object} expectations - What to test
 * @param {string} expectations.name - Expected component name
 * @param {Array<string>} expectations.props - Expected prop names
 * @param {Array<string>} expectations.computed - Expected computed property names
 * @param {Array<string>} expectations.methods - Expected method names
 * @param {Object} expectations.data - Expected data properties with their default values
 *
 * @example
 * describe('MyComponent', () => {
 *   testComponentStructure(MyComponent, {
 *     name: 'MyComponent',
 *     props: ['title', 'value'],
 *     computed: ['displayValue', 'isValid'],
 *     methods: ['handleClick', 'validate'],
 *     data: { isLoading: false, error: null }
 *   });
 * });
 */
export function testComponentStructure(component, expectations = {}) {
	const {
		name,
		props = [],
		computed = [],
		methods = [],
		data = null,
		inject = [],
		components = []
	} = expectations;

	describe('Component Structure', () => {
		if (name) {
			it(`has name "${name}"`, () => {
				expect(component.name).toBe(name);
			});
		}

		if (props.length > 0) {
			it('has expected props', () => {
				expect(component.props).toBeDefined();
				props.forEach(prop => {
					expect(component.props[prop]).toBeDefined();
				});
			});
		}

		if (computed.length > 0) {
			it('has expected computed properties', () => {
				expect(component.computed).toBeDefined();
				computed.forEach(computedProp => {
					expect(component.computed[computedProp]).toBeDefined();
				});
			});
		}

		if (methods.length > 0) {
			it('has expected methods', () => {
				expect(component.methods).toBeDefined();
				methods.forEach(method => {
					expect(component.methods[method]).toBeDefined();
					expect(typeof component.methods[method]).toBe('function');
				});
			});
		}

		if (data !== null) {
			it('has expected data properties with defaults', () => {
				expect(component.data).toBeDefined();
				const componentData = component.data.call({});
				Object.entries(data).forEach(([key, expectedValue]) => {
					expect(componentData[key]).toEqual(expectedValue);
				});
			});
		}

		if (inject.length > 0) {
			it('has expected inject properties', () => {
				expect(component.inject).toBeDefined();
				inject.forEach(injectProp => {
					expect(component.inject).toContain(injectProp);
				});
			});
		}

		if (components.length > 0) {
			it('declares expected components', () => {
				expect(component.components).toBeDefined();
				components.forEach(comp => {
					expect(component.components[comp]).toBeDefined();
				});
			});
		}
	});
}

/**
 * Tests that specific text content is rendered
 * Reduces boilerplate for basic text rendering tests
 *
 * @param {Object} renderFn - Function that returns the render result
 * @param {Array<string>} texts - Array of texts to check for
 *
 * @example
 * testRendersText(
 *   () => render(MyComponent, { props: { title: 'Hello' } }),
 *   ['Hello', 'Welcome', 'Click here']
 * );
 */
export function testRendersText(renderFn, texts) {
	describe('Text Rendering', () => {
		texts.forEach(text => {
			it(`renders "${text}"`, () => {
				const { getByText } = renderFn();
				expect(getByText(new RegExp(text))).toBeTruthy();
			});
		});
	});
}

/**
 * Tests that specific CSS classes are applied
 *
 * @param {Object} renderFn - Function that returns the render result
 * @param {Object} expectations - Map of selectors to expected classes
 *
 * @example
 * testCssClasses(
 *   () => render(MyComponent),
 *   {
 *     '.header': ['tw-text-h1', 'tw-mb-4'],
 *     '.button': ['kv-button', 'kv-button--primary']
 *   }
 * );
 */
export function testCssClasses(renderFn, expectations) {
	describe('CSS Classes', () => {
		Object.entries(expectations).forEach(([selector, classes]) => {
			it(`applies correct classes to ${selector}`, () => {
				const { container } = renderFn();
				const element = container.querySelector(selector);
				expect(element).toBeTruthy();
				classes.forEach(className => {
					expect(element.classList.contains(className)).toBe(true);
				});
			});
		});
	});
}

/**
 * Creates a standard global config with common mocks and stubs
 * Extends the base specUtils.globalOptions
 *
 * @param {Object} overrides - Additional or override options
 * @returns {Object} Global config for render()
 *
 * @example
 * const global = createGlobalConfig({
 *   stubs: {
 *     MyCustomComponent: createStubComponent('MyCustomComponent')
 *   },
 *   mocks: {
 *     $customMethod: vi.fn()
 *   }
 * });
 */
export function createGlobalConfig(overrides = {}) {
	const base = {
		directives: {
			kvTrackEvent: {
				mounted: vi.fn(),
				updated: vi.fn()
			}
		},
		mocks: {
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn(),
		},
		stubs: {},
		components: {},
		provide: {}
	};

	// Deep merge overrides
	return {
		directives: { ...base.directives, ...overrides.directives },
		mocks: { ...base.mocks, ...overrides.mocks },
		stubs: { ...base.stubs, ...overrides.stubs },
		components: { ...base.components, ...overrides.components },
		provide: { ...base.provide, ...overrides.provide }
	};
}

/**
 * Creates a mock Apollo client with common methods
 * Use this instead of mocking Apollo at module level
 *
 * @param {Object} overrides - Override specific methods
 * @returns {Object} Mock Apollo client
 *
 * @example
 * const apollo = createMockApollo({
 *   query: vi.fn(() => Promise.resolve({ data: { user: { id: 1 } } }))
 * });
 *
 * const global = {
 *   provide: { apollo }
 * };
 */
export function createMockApollo(overrides = {}) {
	return {
		query: vi.fn(() => Promise.resolve({ data: {} })),
		mutate: vi.fn(() => Promise.resolve({ data: {} })),
		watchQuery: vi.fn(() => ({
			subscribe: vi.fn(),
			refetch: vi.fn()
		})),
		readQuery: vi.fn(),
		readFragment: vi.fn(),
		writeQuery: vi.fn(),
		writeFragment: vi.fn(),
		...overrides
	};
}

/**
 * Creates a mock router with common methods
 *
 * @param {Object} overrides - Override specific methods
 * @returns {Object} Mock router
 */
export function createMockRouter(overrides = {}) {
	return {
		push: vi.fn(),
		replace: vi.fn(),
		go: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		currentRoute: { value: { path: '/', query: {}, params: {} } },
		...overrides
	};
}

/**
 * Creates a mock kvAuth0 client
 *
 * @param {Object} overrides - Override specific methods
 * @returns {Object} Mock kvAuth0
 */
export function createMockKvAuth0(overrides = {}) {
	return {
		enabled: true,
		checkSession: vi.fn(() => Promise.resolve()),
		getMfaManagementToken: vi.fn(() => Promise.resolve('mock-token')),
		...overrides
	};
}

/**
 * Helper to test prop validation
 *
 * @param {Object} component - Vue component
 * @param {string} propName - Name of the prop
 * @param {Array} validValues - Values that should be valid
 * @param {Array} invalidValues - Values that should be invalid
 *
 * @example
 * testPropValidation(MyComponent, 'size', ['small', 'medium', 'large'], ['tiny', 'huge']);
 */
export function testPropValidation(component, propName, validValues = [], invalidValues = []) {
	describe(`${propName} prop validation`, () => {
		const { validator } = component.props[propName];

		if (!validator) {
			throw new Error(`No validator found for prop "${propName}"`);
		}

		validValues.forEach(value => {
			it(`accepts "${value}"`, () => {
				expect(validator(value)).toBe(true);
			});
		});

		invalidValues.forEach(value => {
			it(`rejects "${value}"`, () => {
				expect(validator(value)).toBe(false);
			});
		});
	});
}
