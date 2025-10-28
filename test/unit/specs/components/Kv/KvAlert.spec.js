import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvAlert from '#src/components/Kv/KvAlert';

describe('KvAlert.vue', () => {
	it('renders alert with default success variant', () => {
		const { container } = render(KvAlert, {
			slots: {
				default: 'Success message'
			}
		});

		const alert = container.querySelector('.kv-alert');
		expect(alert).toBeTruthy();
		expect(alert.classList.contains('kv-alert--success')).toBe(true);
		expect(alert.textContent).toContain('Success message');
	});

	it('renders with caution variant', () => {
		const { container } = render(KvAlert, {
			props: {
				variant: 'caution'
			},
			slots: {
				default: 'Warning message'
			}
		});

		const alert = container.querySelector('.kv-alert');
		expect(alert.classList.contains('kv-alert--caution')).toBe(true);
	});

	it('renders with danger variant', () => {
		const { container } = render(KvAlert, {
			props: {
				variant: 'danger'
			},
			slots: {
				default: 'Error message'
			}
		});

		const alert = container.querySelector('.kv-alert');
		expect(alert.classList.contains('kv-alert--danger')).toBe(true);
	});

	it('does not render close button by default', () => {
		const { container } = render(KvAlert, {
			slots: {
				default: 'Message'
			}
		});

		const closeButton = container.querySelector('.kv-alert__close-btn');
		expect(closeButton).toBeFalsy();
	});

	it('renders close button when canClose is true', () => {
		const { container } = render(KvAlert, {
			props: {
				canClose: true
			},
			slots: {
				default: 'Closeable message'
			}
		});

		const closeButton = container.querySelector('.kv-alert__close-btn');
		expect(closeButton).toBeTruthy();
	});

	it('closes alert when close button is clicked', async () => {
		const user = userEvent.setup();
		const { container } = render(KvAlert, {
			props: {
				canClose: true
			},
			slots: {
				default: 'Closeable message'
			}
		});

		// Alert should be visible initially
		let alert = container.querySelector('.kv-alert');
		expect(alert).toBeTruthy();

		// Click close button
		const closeButton = container.querySelector('.kv-alert__close-btn');
		await user.click(closeButton);

		// Wait for transition and check alert is gone
		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});
		alert = container.querySelector('.kv-alert');
		expect(alert).toBeFalsy();
	});

	it('renders slot content', () => {
		const { container } = render(KvAlert, {
			slots: {
				default: '<strong>Bold message</strong>'
			}
		});

		const message = container.querySelector('.kv-alert__message');
		expect(message.innerHTML).toContain('<strong>Bold message</strong>');
	});
});
