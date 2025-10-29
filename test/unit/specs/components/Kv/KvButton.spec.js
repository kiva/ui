import { render, screen } from '@testing-library/vue';
import KvButton from '../../../../../src/components/Kv/KvButton';

describe('KvButton.vue', () => {
	it('renders a button element by default', () => {
		const { container } = render(KvButton, {
			slots: {
				default: 'Click me'
			}
		});

		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button.textContent).toBe('Click me');
		expect(button.classList.contains('button')).toBe(true);
	});

	it('renders with slot content', () => {
		render(KvButton, {
			slots: {
				default: 'Test Button Text'
			}
		});

		expect(screen.getByText('Test Button Text')).toBeTruthy();
	});

	it('renders an anchor tag when href prop is provided', () => {
		const { container } = render(KvButton, {
			props: {
				href: 'https://example.com'
			},
			slots: {
				default: 'Link'
			}
		});

		const anchor = container.querySelector('a');
		expect(anchor).toBeTruthy();
		expect(anchor.getAttribute('href')).toBe('https://example.com');
		expect(anchor.classList.contains('button')).toBe(true);
	});

	it('renders a router-link when to prop is provided', () => {
		const { container } = render(KvButton, {
			props: {
				to: '/test-route'
			},
			slots: {
				default: 'Route Link'
			},
			global: {
				stubs: {
					'router-link': true
				}
			}
		});

		// router-link is stubbed, check for button class
		const link = container.querySelector('.button');
		expect(link).toBeTruthy();
		expect(link.textContent).toBe('Route Link');
	});

	it('prioritizes to prop over href when both are provided', () => {
		const { container } = render(KvButton, {
			props: {
				to: '/route',
				href: 'https://example.com'
			},
			slots: {
				default: 'Both Props'
			},
			global: {
				stubs: {
					'router-link': true
				}
			}
		});

		// Should render router-link with button class (to prop takes priority)
		const link = container.querySelector('.button');
		expect(link).toBeTruthy();
		expect(link.textContent).toBe('Both Props');
		// The component should have used router-link, not an anchor
		expect(link.tagName.toLowerCase()).toBe('router-link');
	});
});
