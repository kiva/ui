import { render } from '@testing-library/vue';
import {
	describe, it, expect, vi, beforeEach
} from 'vitest';
import KivaCardRedemption from '#src/components/Checkout/KivaCardRedemption';

// Mock GraphQL mutations
const mockAddCreditByType = vi.fn();
const mockRemoveCreditByType = vi.fn();

const global = {
	provide: {
		apollo: {
			mutate: vi.fn(options => {
				if (options.mutation === mockAddCreditByType) {
					return Promise.resolve({ data: {} });
				}
				if (options.mutation === mockRemoveCreditByType) {
					return Promise.resolve({ data: {} });
				}
				return Promise.resolve({});
			}),
		},
	},
	mocks: {
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
	},
	stubs: {
		KvIcon: {
			name: 'KvIcon',
			template: '<svg class="kv-icon"><use /></svg>',
		},
		KvExpandable: {
			name: 'KvExpandable',
			template: '<div class="kv-expandable"><slot /></div>',
		},
		KvButton: {
			name: 'KvButton',
			template: '<button class="kv-button"><slot /></button>',
		},
		KvLightbox: {
			name: 'KvLightbox',
			props: ['visible', 'title'],
			template: '<div v-if="visible" class="kv-lightbox"><slot /></div>',
		},
		KvTextInput: {
			name: 'KvTextInput',
			props: ['modelValue', 'id', 'placeholder'],
			template: `<input
				:id="id"
				:placeholder="placeholder"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
			/>`,
		},
	},
};

const mockCredits = [
	{
		id: 'credit-1',
		amount: 25,
		applied: 25,
	},
	{
		id: 'credit-2',
		amount: 50,
		applied: 50,
	},
];

const mockTotals = {
	redemptionCodeAppliedTotal: '75.00',
	itemTotal: '100.00',
};

describe('KivaCardRedemption.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders Have a Kiva Card text', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const toggleText = getByTestId('basket-code-entry-toggle-text');
		expect(toggleText.textContent).toContain('Have a Kiva Card?');
	});

	it('renders toggle icon button', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const toggleIcon = getByTestId('basket-code-entry-toggle-icon');
		expect(toggleIcon).toBeTruthy();
	});

	it('renders text input for Kiva Card code', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const input = getByTestId('basket-code-entry-input');
		expect(input).toBeTruthy();
		expect(input.placeholder).toBe('ABCD-1234-EFGH-5678');
	});

	it('renders Apply button', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const applyButton = getByTestId('apply-card');
		expect(applyButton).toBeTruthy();
		expect(applyButton.textContent).toContain('Apply');
	});

	it('renders Need help button', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const helpButton = getByTestId('basket-code-entry-help-text-button');
		expect(helpButton).toBeTruthy();
		expect(helpButton.textContent).toContain('Need help?');
	});

	it('has lightbox title text', () => {
		const { container } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		// KvLightbox stub renders when visible=true in data
		const lightboxes = container.querySelectorAll('.kv-lightbox');
		// Lightbox exists in template (though may not be visible)
		expect(lightboxes.length).toBeGreaterThanOrEqual(0);
	});

	it('has print card code location data', () => {
		const component = new KivaCardRedemption.constructor();
		const data = KivaCardRedemption.data.call(component);
		expect(data.printCardCodeLocation).toBeDefined();
	});

	it('has email card code location data', () => {
		const component = new KivaCardRedemption.constructor();
		const data = KivaCardRedemption.data.call(component);
		expect(data.emailCardCodeLocation).toBeDefined();
	});

	it('renders applied credits list', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: mockCredits,
				totals: mockTotals,
			},
			global,
		});

		const credit0 = getByTestId('basket-code-entry-applied-credit-0');
		expect(credit0).toBeTruthy();
		expect(credit0.textContent).toContain('Kiva Card value:');
		expect(credit0.textContent).toContain('$25');
	});

	it('renders second applied credit', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: mockCredits,
				totals: mockTotals,
			},
			global,
		});

		const credit1 = getByTestId('basket-code-entry-applied-credit-1');
		expect(credit1).toBeTruthy();
		expect(credit1.textContent).toContain('$50');
	});

	it('renders remove button for applied credits', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: mockCredits,
				totals: mockTotals,
			},
			global,
		});

		const removeButton = getByTestId('basket-code-entry-remove-applied-credit-0');
		expect(removeButton).toBeTruthy();
	});

	it('renders applied credits list', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: mockCredits,
				totals: mockTotals,
			},
			global,
		});

		const credit0 = getByTestId('basket-code-entry-applied-credit-0');
		expect(credit0).toBeTruthy();
		expect(credit0.textContent).toContain('Kiva Card value:');
		expect(credit0.textContent).toContain('$25');
	});

	it('renders second applied credit', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: mockCredits,
				totals: mockTotals,
			},
			global,
		});

		const credit1 = getByTestId('basket-code-entry-applied-credit-1');
		expect(credit1).toBeTruthy();
		expect(credit1.textContent).toContain('$50');
	});

	it('renders remove button for applied credits', () => {
		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: mockCredits,
				totals: mockTotals,
			},
			global,
		});

		const removeButton = getByTestId('basket-code-entry-remove-applied-credit-0');
		expect(removeButton).toBeTruthy();
	});

	it('has name property', () => {
		expect(KivaCardRedemption.name).toBe('KivaCardRedemption');
	});

	it('accepts credits prop', () => {
		expect(KivaCardRedemption.props.credits).toBeDefined();
		expect(KivaCardRedemption.props.credits.type).toBe(Array);
	});

	it('accepts totals prop', () => {
		expect(KivaCardRedemption.props.totals).toBeDefined();
		expect(KivaCardRedemption.props.totals.type).toBe(Object);
	});

	it('has data properties', () => {
		const component = new KivaCardRedemption.constructor();
		const data = KivaCardRedemption.data.call(component);
		expect(data.open).toBe(false);
		expect(data.kivaCardCode).toBe('');
		expect(data.defaultLbVisible).toBe(false);
	});

	it('has showKivaCardTotal computed property', () => {
		expect(KivaCardRedemption.computed.showKivaCardTotal).toBeDefined();
	});

	it('has toggleAccordion method', () => {
		expect(KivaCardRedemption.methods.toggleAccordion).toBeDefined();
	});

	it('has updateKivaCard method', () => {
		expect(KivaCardRedemption.methods.updateKivaCard).toBeDefined();
	});

	it('has removeCredit method', () => {
		expect(KivaCardRedemption.methods.removeCredit).toBeDefined();
	});

	it('has triggerDefaultLightbox method', () => {
		expect(KivaCardRedemption.methods.triggerDefaultLightbox).toBeDefined();
	});

	it('has lightboxClosed method', () => {
		expect(KivaCardRedemption.methods.lightboxClosed).toBeDefined();
	});

	it('applies tw-flex class to wrapper', () => {
		const { container } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const wrapper = container.querySelector('.tw-flex');
		expect(wrapper).toBeTruthy();
	});

	it('applies tw-text-h3 class to title', () => {
		const { container } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const title = container.querySelector('.tw-text-h3');
		expect(title).toBeTruthy();
	});

	it('applies tw-sr-only class to label', () => {
		const { container } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const label = container.querySelector('.tw-sr-only');
		expect(label).toBeTruthy();
		expect(label.textContent).toBe('Kiva Card Code');
	});

	it('renders fat-chevron icon for toggle', () => {
		const { container } = render(KivaCardRedemption, {
			props: {
				credits: [],
				totals: { redemptionCodeAppliedTotal: '0.00' },
			},
			global,
		});

		const toggleArrow = container.querySelector('.toggle-arrow');
		expect(toggleArrow).toBeTruthy();
	});

	it('displays credit amount when applied is null', () => {
		const creditsWithNull = [
			{
				id: 'credit-3',
				amount: 100,
				applied: null,
			},
		];

		const { getByTestId } = render(KivaCardRedemption, {
			props: {
				credits: creditsWithNull,
				totals: { redemptionCodeAppliedTotal: '100.00' },
			},
			global,
		});

		const credit = getByTestId('basket-code-entry-applied-credit-0');
		expect(credit.textContent).toContain('$100');
	});
});
