import { render } from '@testing-library/vue';
import {
	describe, it, expect, vi
} from 'vitest';
import MonthlyGoodCTA from '#src/components/Checkout/MonthlyGoodCTA';

const global = {
	mocks: {
		$kvTrackEvent: vi.fn(),
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
		KvButton: {
			name: 'KvButton',
			props: ['to', 'state'],
			template: '<button :disabled="state === \'disabled\'" class="kv-button"><slot /></button>',
		},
	},
};

describe('MonthlyGoodCTA.vue', () => {
	it('renders default headline', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			global,
		});

		expect(getByText('Grow your lending with Monthly Good!')).toBeTruthy();
	});

	it('renders custom headline', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			props: {
				headline: 'Custom Headline',
			},
			global,
		});

		expect(getByText('Custom Headline')).toBeTruthy();
	});

	it('renders default body copy', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		expect(container.textContent).toContain('Want to change lives all year long?');
	});

	it('renders custom body copy', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			props: {
				bodyCopy: 'Custom body text',
			},
			global,
		});

		expect(getByText('Custom body text')).toBeTruthy();
	});

	it('renders Amount label', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			global,
		});

		expect(getByText('Amount')).toBeTruthy();
	});

	it('renders Cause to support label', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			global,
		});

		expect(getByText('Cause to support')).toBeTruthy();
	});

	it('renders amount dropdown', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const amountSelect = container.querySelector('#amount');
		expect(amountSelect).toBeTruthy();
	});

	it('renders cause dropdown', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const causeSelect = container.querySelector('#cause');
		expect(causeSelect).toBeTruthy();
	});

	it('renders default button text', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			global,
		});

		expect(getByText('Sign me up')).toBeTruthy();
	});

	it('renders custom button text', () => {
		const { getByText } = render(MonthlyGoodCTA, {
			props: {
				buttonText: 'Custom Button',
			},
			global,
		});

		expect(getByText('Custom Button')).toBeTruthy();
	});

	it('has name property', () => {
		expect(MonthlyGoodCTA.name).toBe('MonthlyGoodCTA');
	});

	it('accepts headline prop', () => {
		expect(MonthlyGoodCTA.props.headline).toBeDefined();
		expect(MonthlyGoodCTA.props.headline.type).toBe(String);
		expect(MonthlyGoodCTA.props.headline.default).toBe('Grow your lending with Monthly Good!');
	});

	it('accepts bodyCopy prop', () => {
		expect(MonthlyGoodCTA.props.bodyCopy).toBeDefined();
		expect(MonthlyGoodCTA.props.bodyCopy.type).toBe(String);
	});

	it('accepts buttonText prop', () => {
		expect(MonthlyGoodCTA.props.buttonText).toBeDefined();
		expect(MonthlyGoodCTA.props.buttonText.type).toBe(String);
		expect(MonthlyGoodCTA.props.buttonText.default).toBe('Sign me up');
	});

	it('has data properties', () => {
		const component = new MonthlyGoodCTA.constructor();
		const data = MonthlyGoodCTA.data.call(component);
		expect(data.selectedGroup).toBe('default');
		expect(data.mgAmount).toBe(10);
		expect(data.mgOptionSelected).toBe(10);
		expect(data.mgAmountOptions).toBeDefined();
		expect(Array.isArray(data.mgAmountOptions)).toBe(true);
	});

	it('has validations defined', () => {
		expect(MonthlyGoodCTA.validations).toBeDefined();
	});

	it('applies tw-text-left class to container', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const wrapper = container.querySelector('.tw-text-left');
		expect(wrapper).toBeTruthy();
	});

	it('applies md:tw-text-center class to container', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const wrapper = container.querySelector('.md\\:tw-text-center');
		expect(wrapper).toBeTruthy();
	});

	it('applies hide-for-print class to container', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const wrapper = container.querySelector('.hide-for-print');
		expect(wrapper).toBeTruthy();
	});

	it('applies tw-font-medium class to labels', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const labels = container.querySelectorAll('.tw-font-medium');
		expect(labels.length).toBeGreaterThan(0);
	});

	it('renders form element', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const form = container.querySelector('form');
		expect(form).toBeTruthy();
		expect(form.className).toContain('monthly-good-cta__form');
	});

	it('applies monthly-good-cta__headline class', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const headline = container.querySelector('.monthly-good-cta__headline');
		expect(headline).toBeTruthy();
	});

	it('applies monthly-good-cta__subhead class', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const subhead = container.querySelector('.monthly-good-cta__subhead');
		expect(subhead).toBeTruthy();
	});

	it('applies monthly-good-cta__button class', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const button = container.querySelector('.monthly-good-cta__button');
		expect(button).toBeTruthy();
	});

	it('uses row class for form layout', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const rows = container.querySelectorAll('.row');
		expect(rows.length).toBeGreaterThan(0);
	});

	it('uses column class for form layout', () => {
		const { container } = render(MonthlyGoodCTA, {
			global,
		});

		const columns = container.querySelectorAll('.column');
		expect(columns.length).toBeGreaterThan(0);
	});
});
