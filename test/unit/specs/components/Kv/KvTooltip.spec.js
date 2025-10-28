import { render } from '@testing-library/vue';
import KvTooltip from '#src/components/Kv/KvTooltip';

// Mock @kiva/kv-tokens
vi.mock('@kiva/kv-tokens', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		darkTheme: { name: 'dark' },
		mintTheme: { name: 'mint' },
	};
});

// Mock child components
const KvPopper = {
	name: 'KvPopper',
	template: '<div class="kv-popper"><slot /></div>',
	props: ['controller', 'popperModifiers', 'popperPlacement', 'transitionType'],
};

const KvThemeProvider = {
	name: 'KvThemeProvider',
	template: '<div class="kv-theme-provider"><slot /></div>',
	props: ['theme'],
};

const global = {
	stubs: {
		KvPopper,
		KvThemeProvider,
	},
};

describe('KvTooltip.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvTooltip).toBeDefined();
		expect(KvTooltip.name).toBe('KvTooltip');
	});

	it('requires controller prop', () => {
		expect(KvTooltip.props.controller.required).toBe(true);
	});

	it('has theme prop with default value', () => {
		expect(KvTooltip.props.theme.default).toBe('default');
	});

	it('validates theme prop', () => {
		const { validator } = KvTooltip.props.theme;
		expect(validator('default')).toBe(true);
		expect(validator('mint')).toBe(true);
		expect(validator('dark')).toBe(true);
		expect(validator('invalid')).toBe(false);
	});

	it('validates controller prop as string', () => {
		const { validator } = KvTooltip.props.controller;
		expect(validator('tooltip-id')).toBe(true);
	});

	it('renders KvThemeProvider', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const themeProvider = container.querySelector('.kv-theme-provider');
		expect(themeProvider).toBeTruthy();
	});

	it('renders KvPopper', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const popper = container.querySelector('.kv-popper');
		expect(popper).toBeTruthy();
	});

	it('renders tooltip pane', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			slots: {
				default: 'Tooltip content',
			},
			global,
		});

		const pane = container.querySelector('.tooltip-pane');
		expect(pane).toBeTruthy();
	});

	it('renders tooltip arrow', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const arrow = container.querySelector('.tooltip-arrow');
		expect(arrow).toBeTruthy();
	});

	it('renders default slot content', () => {
		const { getByText } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			slots: {
				default: 'Tooltip text',
			},
			global,
		});

		expect(getByText('Tooltip text')).toBeTruthy();
	});

	it('renders title slot when provided', () => {
		const { getByText } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			slots: {
				title: 'Tooltip Title',
				default: 'Tooltip text',
			},
			global,
		});

		expect(getByText('Tooltip Title')).toBeTruthy();
	});

	it('does not render title div when title slot is empty', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			slots: {
				default: 'Tooltip text',
			},
			global,
		});

		const titleDiv = container.querySelector('.tw-font-medium');
		expect(titleDiv).toBeFalsy();
	});

	it('has themeStyle computed property', () => {
		expect(KvTooltip.computed.themeStyle).toBeDefined();
	});

	it('has popperModifiers data property', () => {
		expect(KvTooltip.data).toBeDefined();
	});

	it('applies kv-tailwind class', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const element = container.querySelector('.kv-tailwind');
		expect(element).toBeTruthy();
	});

	it('applies tw-absolute class to tooltip pane', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const pane = container.querySelector('.tw-absolute');
		expect(pane).toBeTruthy();
	});

	it('applies tw-bg-primary class', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const bgElement = container.querySelector('.tw-bg-primary');
		expect(bgElement).toBeTruthy();
	});

	it('applies tw-rounded class', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const roundedElement = container.querySelector('.tw-rounded');
		expect(roundedElement).toBeTruthy();
	});

	it('applies tw-z-popover class', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const zElement = container.querySelector('.tw-z-popover');
		expect(zElement).toBeTruthy();
	});

	it('applies tw-p-2.5 class to content wrapper', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			slots: {
				default: 'Content',
			},
			global,
		});

		const padding = container.querySelector('.tw-p-2\\.5');
		expect(padding).toBeTruthy();
	});

	it('has max-width style on content wrapper', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			slots: {
				default: 'Content',
			},
			global,
		});

		const contentWrapper = container.querySelector('.tw-p-2\\.5');
		expect(contentWrapper.style.maxWidth).toBe('250px');
	});

	it('arrow has x-arrow attribute', () => {
		const { container } = render(KvTooltip, {
			props: {
				controller: 'tooltip-trigger',
			},
			global,
		});

		const arrow = container.querySelector('[x-arrow]');
		expect(arrow).toBeTruthy();
	});
});
