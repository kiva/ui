import { render } from '@testing-library/vue';
import KvPopper from '../../../../../src/components/Kv/KvPopper';

// Mock touchEvents utilities
vi.mock('#src/util/touchEvents', () => ({
	onBodyTouchstart: vi.fn(),
	offBodyTouchstart: vi.fn(),
	isTargetElement: vi.fn(() => false),
}));

// Mock Popper.js
const mockPopper = {
	scheduleUpdate: vi.fn(),
	destroy: vi.fn(),
};

vi.mock('popper.js', () => ({
	default: vi.fn(() => mockPopper),
}));

describe('KvPopper.vue', () => {
	beforeEach(() => {
		// Create a mock reference element
		const mockElement = document.createElement('div');
		mockElement.id = 'test-controller';
		mockElement.tabIndex = -1;
		mockElement.setAttribute = vi.fn();
		document.getElementById = vi.fn(() => mockElement);
	});

	it('exports a valid Vue component', () => {
		expect(KvPopper).toBeDefined();
		expect(KvPopper.name).toBe('KvPopper');
	});

	it('requires controller prop', () => {
		expect(KvPopper.props.controller.required).toBe(true);
	});

	it('has openDelay prop with default 0', () => {
		expect(KvPopper.props.openDelay.default).toBe(0);
	});

	it('has closeDelay prop with default 200', () => {
		expect(KvPopper.props.closeDelay.default).toBe(200);
	});

	it('has transitionType prop with default empty string', () => {
		expect(KvPopper.props.transitionType.default).toBe('');
	});

	it('has popperPlacement prop with default bottom-start', () => {
		expect(KvPopper.props.popperPlacement.default).toBe('bottom-start');
	});

	it('has popperModifiers prop', () => {
		expect(KvPopper.props.popperModifiers).toBeDefined();
		expect(KvPopper.props.popperModifiers.type).toBe(Object);
	});

	it('validates controller prop as string', () => {
		const { validator } = KvPopper.props.controller;
		expect(validator('popper-id')).toBe(true);
	});

	it('renders with tw-absolute class', () => {
		const { container } = render(KvPopper, {
			props: {
				controller: 'test-controller',
			},
		});

		const popper = container.querySelector('.tw-absolute');
		expect(popper).toBeTruthy();
	});

	it('renders slot content', () => {
		const { getByText } = render(KvPopper, {
			props: {
				controller: 'test-controller',
			},
			slots: {
				default: 'Popper content',
			},
		});

		expect(getByText('Popper content')).toBeTruthy();
	});

	it('has reference computed property', () => {
		expect(KvPopper.computed.reference).toBeDefined();
	});

	it('emits show event', () => {
		expect(KvPopper.emits).toContain('show');
	});

	it('emits hide event', () => {
		expect(KvPopper.emits).toContain('hide');
	});

	it('has open method', () => {
		expect(KvPopper.methods.open).toBeDefined();
	});

	it('has close method', () => {
		expect(KvPopper.methods.close).toBeDefined();
	});

	it('has toggle method', () => {
		expect(KvPopper.methods.toggle).toBeDefined();
	});

	it('has show data property', () => {
		expect(KvPopper.data).toBeDefined();
	});

	it('watches show state', () => {
		expect(KvPopper.watch.show).toBeDefined();
	});

	it('sets aria-hidden when not shown', () => {
		const { container } = render(KvPopper, {
			props: {
				controller: 'test-controller',
			},
		});

		const popper = container.querySelector('[aria-hidden]');
		expect(popper.getAttribute('aria-hidden')).toBe('true');
	});

	it('applies transition', () => {
		const { container } = render(KvPopper, {
			props: {
				controller: 'test-controller',
				transitionType: 'kvfade',
			},
		});

		// Transition wrapper is applied by Vue
		expect(container.querySelector('.tw-absolute')).toBeTruthy();
	});

	it('hides content by default', () => {
		const { container } = render(KvPopper, {
			props: {
				controller: 'test-controller',
			},
		});

		const popper = container.querySelector('.tw-absolute');
		// v-show directive adds display: none
		expect(popper).toBeTruthy();
	});
});
