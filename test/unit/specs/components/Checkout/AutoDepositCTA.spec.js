import { render } from '@testing-library/vue';
import AutoDepositCTA from '#src/components/Checkout/AutoDepositCTA';

const global = {
	provide: {
		apollo: {
			mutate: vi.fn(() => Promise.resolve({ data: {} })),
		},
	},
	mocks: {
		$kvTrackEvent: vi.fn(),
		$filters: {
			numeral: vi.fn((value, format) => {
				if (format === 'Oo') {
					const suffix = ['th', 'st', 'nd', 'rd'];
					const v = value % 100;
					return value + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
				}
				return value;
			}),
		},
	},
	directives: {
		'kv-track-event': vi.fn(),
	},
	stubs: {
		KvSelect: {
			name: 'KvSelect',
			props: ['modelValue', 'id'],
			template: '<select :id="id" :value="modelValue"><slot /></select>',
		},
		KvCurrencyInput: {
			name: 'KvCurrencyInput',
			props: ['modelValue', 'id'],
			template: '<input type="text" :id="id" :value="modelValue" />',
		},
		KvTextInput: {
			name: 'KvTextInput',
			props: ['modelValue', 'id', 'type', 'placeholder', 'required', 'min', 'max'],
			template: '<input :type="type" :id="id" :placeholder="placeholder" :value="modelValue" />',
		},
		KvButton: {
			name: 'KvButton',
			props: ['to', 'state'],
			template: '<button :disabled="state === \'disabled\'" class="kv-button"><slot /></button>',
		},
		KvMaterialIcon: {
			name: 'KvMaterialIcon',
			template: '<span class="kv-material-icon"></span>',
		},
		AutoDepositDropInPaymentWrapper: {
			name: 'AutoDepositDropInPaymentWrapper',
			props: ['amount', 'buttonText', 'category', 'dayOfMonth', 'donation'],
			template: '<div class="auto-deposit-wrapper"><button>{{ buttonText }}</button></div>',
		},
	},
};

describe('AutoDepositCTA.vue', () => {
	it('renders default headline', () => {
		const { getByText } = render(AutoDepositCTA, {
			global,
		});

		expect(getByText('Never forget to lend')).toBeTruthy();
	});

	it('renders custom headline', () => {
		const { getByText } = render(AutoDepositCTA, {
			props: {
				headline: 'Custom Headline',
			},
			global,
		});

		expect(getByText('Custom Headline')).toBeTruthy();
	});

	it('renders default body copy', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		expect(container.textContent).toContain('Do more good by setting aside money each month');
	});

	it('renders custom body copy', () => {
		const { getByText } = render(AutoDepositCTA, {
			props: {
				bodyCopy: 'Custom body text',
			},
			global,
		});

		expect(getByText('Custom body text')).toBeTruthy();
	});

	it('does not render body copy when not provided', () => {
		const { container } = render(AutoDepositCTA, {
			props: {
				bodyCopy: '',
			},
			global,
		});

		const subhead = container.querySelector('.auto-deposit-cta__subhead');
		expect(subhead).toBeFalsy();
	});

	it('renders amount dropdown', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const amountSelect = container.querySelector('#amount');
		expect(amountSelect).toBeTruthy();
	});

	it('has name property', () => {
		expect(AutoDepositCTA.name).toBe('AutoDepositCTA');
	});

	it('accepts headline prop', () => {
		expect(AutoDepositCTA.props.headline).toBeDefined();
		expect(AutoDepositCTA.props.headline.type).toBe(String);
		expect(AutoDepositCTA.props.headline.default).toBe('Never forget to lend');
	});

	it('accepts bodyCopy prop', () => {
		expect(AutoDepositCTA.props.bodyCopy).toBeDefined();
		expect(AutoDepositCTA.props.bodyCopy.type).toBe(String);
	});

	it('accepts buttonText prop', () => {
		expect(AutoDepositCTA.props.buttonText).toBeDefined();
		expect(AutoDepositCTA.props.buttonText.type).toBe(String);
		expect(AutoDepositCTA.props.buttonText.default).toBe('Join today');
	});

	it('has data properties', () => {
		const component = new AutoDepositCTA.constructor();
		const data = AutoDepositCTA.data.call(component);
		expect(data.adAmount).toBe(5);
		expect(data.adOptionSelected).toBe(5);
		expect(data.adAmountOptions).toBeDefined();
		expect(Array.isArray(data.adAmountOptions)).toBe(true);
	});

	it('has validations defined', () => {
		expect(AutoDepositCTA.validations).toBeDefined();
	});

	it('applies tw-text-center class to container', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const wrapper = container.querySelector('.tw-text-center');
		expect(wrapper).toBeTruthy();
	});

	it('applies hide-for-print class to container', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const wrapper = container.querySelector('.hide-for-print');
		expect(wrapper).toBeTruthy();
	});

	it('applies tw-sr-only class to amount label', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const label = container.querySelector('.tw-sr-only');
		expect(label).toBeTruthy();
		expect(label.textContent).toContain('Amount');
	});

	it('renders form element', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const form = container.querySelector('form');
		expect(form).toBeTruthy();
		expect(form.className).toContain('auto-deposit-cta__form');
	});

	it('applies auto-deposit-cta__headline class', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const headline = container.querySelector('.auto-deposit-cta__headline');
		expect(headline).toBeTruthy();
	});

	it('applies tw-text-left class to subhead', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const subhead = container.querySelector('.tw-text-left');
		expect(subhead).toBeTruthy();
	});

	it('renders hr divider', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const hr = container.querySelector('hr');
		expect(hr).toBeTruthy();
		expect(hr.className).toContain('tw-my-4');
	});

	it('renders loan recycle image', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const img = container.querySelector('img');
		expect(img).toBeTruthy();
		expect(img.alt).toBe('loan to loan relending graphic');
	});

	it('applies tw-mx-auto class to image', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const img = container.querySelector('.tw-mx-auto');
		expect(img).toBeTruthy();
	});

	it('renders form with novalidate attribute', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const form = container.querySelector('form');
		expect(form?.hasAttribute('novalidate')).toBe(true);
	});

	it('applies tw-mb-2 class to input wrapper', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const wrapper = container.querySelector('.tw-mb-2');
		expect(wrapper).toBeTruthy();
	});

	it('renders day of month edit button when input not shown', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const editButton = container.querySelector('.tw-text-action');
		expect(editButton).toBeTruthy();
	});

	it('applies tw-flex class to amount wrapper', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const flexWrapper = container.querySelector('.tw-mb-2\\.5.tw-flex');
		expect(flexWrapper).toBeTruthy();
	});

	it('applies auto-deposit-cta__dropdown class', () => {
		const { container } = render(AutoDepositCTA, {
			global,
		});

		const dropdown = container.querySelector('.auto-deposit-cta__dropdown');
		expect(dropdown).toBeTruthy();
	});
});
