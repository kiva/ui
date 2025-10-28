import { render } from '@testing-library/vue';
import KvIconButton from '#src/components/Kv/KvIconButton';

describe('KvIconButton.vue', () => {
	it('renders with default slot content', () => {
		const { getByText } = render(KvIconButton, {
			slots: {
				default: 'Button Text'
			}
		});

		expect(getByText('Button Text')).toBeTruthy();
	});

	it('renders with icon-left slot', () => {
		const { container } = render(KvIconButton, {
			slots: {
				default: 'Button Text',
				'icon-left': '<svg data-testid="left-icon">Left</svg>'
			}
		});

		const leftIcon = container.querySelector('.icon-btn__icon--left');
		expect(leftIcon).toBeTruthy();
	});

	it('renders with icon-right slot', () => {
		const { container } = render(KvIconButton, {
			slots: {
				default: 'Button Text',
				'icon-right': '<svg data-testid="right-icon">Right</svg>'
			}
		});

		const rightIcon = container.querySelector('.icon-btn__icon--right');
		expect(rightIcon).toBeTruthy();
	});

	it('renders with both icon slots', () => {
		const { container } = render(KvIconButton, {
			slots: {
				default: 'Button Text',
				'icon-left': '<span>Left</span>',
				'icon-right': '<span>Right</span>'
			}
		});

		const leftIcon = container.querySelector('.icon-btn__icon--left');
		const rightIcon = container.querySelector('.icon-btn__icon--right');
		expect(leftIcon).toBeTruthy();
		expect(rightIcon).toBeTruthy();
	});

	it('renders icon background container for left icon', () => {
		const { container } = render(KvIconButton, {
			slots: {
				default: 'Button Text',
				'icon-left': '<span>Icon</span>'
			}
		});

		const background = container.querySelector('.icon-btn__icon-background');
		expect(background).toBeTruthy();
	});

	it('applies icon-btn class to button', () => {
		const { container } = render(KvIconButton, {
			slots: {
				default: 'Button Text'
			}
		});

		const button = container.querySelector('.icon-btn');
		expect(button).toBeTruthy();
	});

	it('uses default theme when theme prop is not provided', () => {
		const { container } = render(KvIconButton, {
			slots: {
				default: 'Button Text'
			}
		});

		const button = container.querySelector('.icon-btn');
		// Default theme applies CSS variables
		expect(button.style.getPropertyValue('--kv-left-icon-background')).toBeTruthy();
	});

	it('applies default theme CSS variables', () => {
		const { container } = render(KvIconButton, {
			props: {
				theme: 'default'
			},
			slots: {
				default: 'Button Text'
			}
		});

		const button = container.querySelector('.icon-btn');
		expect(button.style.getPropertyValue('--kv-left-icon-background')).toBe('rgb(var(--bg-secondary))');
		expect(button.style.getPropertyValue('--kv-left-icon-color')).toBe('rgb(var(--text-primary))');
	});
});
