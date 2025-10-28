import { render } from '@testing-library/vue';
import KvCauseSelector from '#src/components/Kv/KvCauseSelector';

// Mock change-case
vi.mock('change-case', () => ({
	kebabCase: vi.fn(str => str.toLowerCase().replace(/\s+/g, '-')),
}));

// Mock image imports using metaGlobReader
vi.mock('#src/util/importHelpers', () => ({
	metaGlobReader: vi.fn(() => fileName => `/assets/images/cause-selector/${fileName}`),
}));

// Mock KvIcon component
const KvIcon = {
	name: 'KvIcon',
	template: '<svg class="kv-icon"><use /></svg>',
	props: ['name'],
};

const global = {
	stubs: {
		KvIcon,
	},
};

describe('KvCauseSelector.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvCauseSelector).toBeDefined();
		expect(KvCauseSelector.name).toBe('KvCauseSelector');
	});

	it('requires cause prop', () => {
		expect(KvCauseSelector.props.cause.required).toBe(true);
	});

	it('has checked prop with default null', () => {
		expect(KvCauseSelector.props.checked.default).toBe(null);
	});

	it('has disabled prop with default false', () => {
		expect(KvCauseSelector.props.disabled.default).toBe(false);
	});

	it('has asRadio prop with default false', () => {
		expect(KvCauseSelector.props.asRadio.default).toBe(false);
	});

	it('has asIcon prop with default false', () => {
		expect(KvCauseSelector.props.asIcon.default).toBe(false);
	});

	it('renders wrapper div', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const wrapper = container.querySelector('.kv-cause-selector');
		expect(wrapper).toBeTruthy();
	});

	it('renders as checkbox by default', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const checkbox = container.querySelector('input[type="checkbox"]');
		expect(checkbox).toBeTruthy();
	});

	it('renders as radio when asRadio is true', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
				asRadio: true,
			},
			global,
		});

		const radio = container.querySelector('input[type="radio"]');
		expect(radio).toBeTruthy();
	});

	it('renders as icon when asIcon is true', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
				asIcon: true,
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input).toBeFalsy();
		const circle = container.querySelector('.kv-cause-selector__circle');
		expect(circle).toBeTruthy();
	});

	it('renders cause image', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const img = container.querySelector('.kv-cause-selector__img');
		expect(img).toBeTruthy();
	});

	it('renders cause label', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'education',
			},
			global,
		});

		const label = container.querySelector('.kv-cause-selector__label');
		expect(label).toBeTruthy();
	});

	it('displays cause name as text', () => {
		const { getByText } = render(KvCauseSelector, {
			props: {
				cause: 'education',
			},
			global,
		});

		expect(getByText('education')).toBeTruthy();
	});

	it('renders checkmark icon', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const icon = container.querySelector('.kv-icon');
		expect(icon).toBeTruthy();
	});

	it('has causeImageSrc computed property', () => {
		expect(KvCauseSelector.computed.causeImageSrc).toBeDefined();
	});

	it('has causeImage2xSrc computed property', () => {
		expect(KvCauseSelector.computed.causeImage2xSrc).toBeDefined();
	});

	it('has onChange method', () => {
		expect(KvCauseSelector.methods.onChange).toBeDefined();
	});

	it('emits change event', () => {
		expect(KvCauseSelector.emits).toContain('change');
	});

	it('sets checked attribute when checked prop is true', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
				checked: true,
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(true);
	});

	it('can be disabled', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
				disabled: true,
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(true);
	});

	it('sets correct input name for checkbox', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'education',
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.name).toBe('education');
	});

	it('sets correct input name for radio', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'education',
				asRadio: true,
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.name).toBe('kv-cause-selector');
	});

	it('sets correct id for checkbox', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.id).toContain('cause-selector-women-checkbox');
	});

	it('sets correct id for radio', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
				asRadio: true,
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.id).toContain('cause-selector-women-radio');
	});

	it('label has correct for attribute for checkbox', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const label = container.querySelector('label');
		expect(label.getAttribute('for')).toContain('cause-selector-women-checkbox');
	});

	it('renders with 2x srcset', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const img = container.querySelector('img');
		expect(img.srcset).toContain('2x');
	});

	it('applies tw-bg-primary to circle in icon mode', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
				asIcon: true,
			},
			global,
		});

		const circle = container.querySelector('.tw-bg-primary');
		expect(circle).toBeTruthy();
	});

	it('sets loading lazy on images', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const img = container.querySelector('img');
		expect(img.loading).toBe('lazy');
	});

	it('sets width and height attributes on images', () => {
		const { container } = render(KvCauseSelector, {
			props: {
				cause: 'women',
			},
			global,
		});

		const img = container.querySelector('img');
		expect(img.width).toBe(120);
		expect(img.height).toBe(120);
	});
});
