import { render } from '@testing-library/vue';
import {
	describe, it, expect, vi
} from 'vitest';
import BasketVerification from '#src/components/Checkout/BasketVerification';

const global = {
	provide: {
		apollo: {
			mutate: vi.fn(() => Promise.resolve({ data: {} })),
			query: vi.fn(() => Promise.resolve({ data: {} })),
		},
		cookieStore: {
			get: vi.fn(),
			set: vi.fn(),
		},
	},
	mocks: {
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
	},
	stubs: {
		KvButton: {
			name: 'KvButton',
			template: '<button class="kv-button"><slot /></button>',
		},
		KvLightbox: {
			name: 'KvLightbox',
			props: ['visible', 'title'],
			template: `<div v-if="visible" class="kv-lightbox">
				<h2>{{ title }}</h2>
				<slot />
			</div>`,
		},
		KvLoadingSpinner: {
			name: 'KvLoadingSpinner',
			template: '<div class="kv-loading-spinner"></div>',
		},
		RouterLink: {
			name: 'RouterLink',
			props: ['to'],
			template: '<a :href="to"><slot /></a>',
		},
	},
};

describe('BasketVerification.vue', () => {
	it('renders basket verification container', () => {
		const { container } = render(BasketVerification, {
			global,
		});

		const verification = container.querySelector('.basket-verification');
		expect(verification).toBeTruthy();
	});

	it('has name property', () => {
		expect(BasketVerification.name).toBe('BasketVerification');
	});

	it('has data properties', () => {
		const component = new BasketVerification.constructor();
		const data = BasketVerification.data.call(component);
		expect(data.email).toBe('');
		expect(data.verificationState).toBe('');
		expect(data.visible).toBe(false);
		expect(data.sending).toBe(false);
	});

	it('has apollo queries defined', () => {
		expect(BasketVerification.apollo).toBeDefined();
	});

	it('renders Basket Verified message when state is verified', async () => {
		const { getByText } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'verified',
					visible: false,
					sending: false,
				};
			},
			global,
		});

		expect(getByText('Basket Verified!')).toBeTruthy();
	});

	it('applies verification-verified class when verified', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'verified',
					visible: false,
					sending: false,
				};
			},
			global,
		});

		const verified = container.querySelector('.verification-verified');
		expect(verified).toBeTruthy();
	});

	it('renders required lightbox when state is required and visible', () => {
		const { getByTestId } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const lightbox = getByTestId('basket-verification-lightbox');
		expect(lightbox).toBeTruthy();
	});

	it('renders Verify your email title for required state', () => {
		const { getByText } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		expect(getByText('Verify your email')).toBeTruthy();
	});

	it('renders Send verification link button for required state', () => {
		const { getByTestId } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const button = getByTestId('basket-verification-send-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Send verification link');
	});

	it('renders pending lightbox when state is pending and visible', () => {
		const { getByTestId } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const lightbox = getByTestId('basket-verification-pending-lightbox');
		expect(lightbox).toBeTruthy();
	});

	it('renders Verification link sent title for pending state', () => {
		const { getByText } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		expect(getByText('Verification link sent')).toBeTruthy();
	});

	it('renders Resend email button for pending state', () => {
		const { getByTestId } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const button = getByTestId('basket-verification-resend-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Resend email');
	});

	it('renders email address in pending state', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		expect(container.textContent).toContain('test@example.com');
	});

	it('applies data-hj-suppress class to email', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const emailSpan = container.querySelector('.data-hj-suppress');
		expect(emailSpan).toBeTruthy();
	});

	it('renders Need help contact link', () => {
		const { getByText } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		expect(getByText('Need help? Contact us')).toBeTruthy();
	});

	it('renders loading spinner when sending', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: true,
				};
			},
			global,
		});

		const spinner = container.querySelector('.kv-loading-spinner');
		expect(spinner).toBeTruthy();
	});

	it('applies sending-spinner class', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: true,
				};
			},
			global,
		});

		const spinner = container.querySelector('.sending-spinner');
		expect(spinner).toBeTruthy();
	});

	it('applies verification-required class to required lightbox', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const lightbox = container.querySelector('.verification-required');
		expect(lightbox).toBeTruthy();
	});

	it('applies verification-pending class to pending lightbox', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const lightbox = container.querySelector('.verification-pending');
		expect(lightbox).toBeTruthy();
	});

	it('applies tw-mb-4 class to paragraphs', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const paragraphs = container.querySelectorAll('.tw-mb-4');
		expect(paragraphs.length).toBeGreaterThan(0);
	});

	it('does not render lightbox when not visible', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: '',
					verificationState: 'required',
					visible: false,
					sending: false,
				};
			},
			global,
		});

		const lightbox = container.querySelector('.kv-lightbox');
		expect(lightbox).toBeFalsy();
	});

	it('renders contact us link pointing to help', () => {
		const { container } = render(BasketVerification, {
			data() {
				return {
					email: 'test@example.com',
					verificationState: 'pending',
					visible: true,
					sending: false,
				};
			},
			global,
		});

		const link = container.querySelector('a[href="/help/contact-us"]');
		expect(link).toBeTruthy();
	});
});
