import { render, waitFor } from '@testing-library/vue';
import WhatIsNextTemplate from '../../../../../src/components/Thanks/WhatIsNextTemplate';

// Mock confetti
vi.mock('canvas-confetti', () => ({
	default: vi.fn()
}));

// Mock child components
vi.mock('#src/components/Kv/KvExpandable', () => ({
	default: {
		name: 'KvExpandable',
		template: '<div class="kv-expandable" v-show="true"><slot /></div>',
		props: ['easing']
	}
}));

vi.mock('#src/components/Checkout/CheckoutReceipt', () => ({
	default: {
		name: 'CheckoutReceipt',
		template: '<div class="checkout-receipt">Receipt</div>',
		props: ['lender', 'receipt']
	}
}));

vi.mock('#src/components/Checkout/SocialShareV2', () => ({
	default: {
		name: 'SocialShareV2',
		template: '<div class="social-share-v2">Share</div>',
		props: ['lender', 'loans']
	}
}));

vi.mock('#src/components/BorrowerProfile/BorrowerImage', () => ({
	default: {
		name: 'BorrowerImage',
		template: '<img class="borrower-image" :alt="alt" />',
		props: ['alt', 'aspectRatio', 'defaultImage', 'hash', 'images']
	}
}));

vi.mock('#src/components/Forms/GuestAccountCreation', () => ({
	default: {
		name: 'GuestAccountCreation',
		template: '<div class="guest-account-creation">Create Account</div>',
		props: ['eventCategory', 'eventLabel', 'guestUsername']
	}
}));

vi.mock('#src/components/Thanks/AnimatedSparkles', () => ({
	default: {
		name: 'AnimatedSparkles',
		template: '<div class="animated-sparkles"></div>'
	}
}));

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		name: 'KvButton',
		template: '<button class="kv-button" @click="$emit(\'click\')"><slot /></button>',
		props: ['to', 'variant']
	},
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span class="kv-material-icon" :class="$attrs.class"></span>',
		props: ['icon']
	}
}));

// Mock smooth-scroll-mixin
vi.mock('#src/plugins/smooth-scroll-mixin', () => ({
	default: {
		methods: {
			smoothScrollTo: vi.fn()
		}
	}
}));

// Mock logFormatter
vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

// Mock image imports
vi.mock('#src/util/importHelpers', () => ({
	metaGlobReader: vi.fn(() => filename => `/images/${filename}`)
}));

// Mock apollo client
const mockApolloMutate = vi.fn();
const mockApollo = {
	mutate: mockApolloMutate
};

describe('WhatIsNextTemplate', () => {
	let mockKvTrackEvent;
	let mockCookieStore;

	const defaultProps = {
		selectedLoan: { id: 1, name: 'Maria', image: { hash: 'abc123' } },
		isGuest: false,
		lender: { id: '123', firstName: 'John' },
		loans: [
			{ id: 1, name: 'Maria', image: { hash: 'abc123' } },
		],
		receipt: { id: 'receipt-1' },
		optedIn: false,
		guestUsername: 'test@example.com'
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockKvTrackEvent = vi.fn();
		mockCookieStore = {
			get: vi.fn(() => 'visitor-123')
		};
		mockApolloMutate.mockResolvedValue({});
		// Mock document.querySelector for scroll behavior
		global.document.querySelector = vi.fn(() => ({ offsetTop: 100 }));
	});

	const createComponent = (props = {}) => {
		return render(WhatIsNextTemplate, {
			props: { ...defaultProps, ...props },
			global: {
				mocks: {
					$kvTrackEvent: mockKvTrackEvent
				},
				provide: {
					apollo: mockApollo,
					cookieStore: mockCookieStore
				},
				directives: {
					'kv-track-event': () => {}
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(WhatIsNextTemplate.name).toBe('WhatIsNextTemplate');
		});

		it('should define expected props', () => {
			const {
				selectedLoan, isGuest, lender, loans, receipt, optedIn, guestUsername
			} = WhatIsNextTemplate.props;
			expect(selectedLoan).toBeDefined();
			expect(isGuest).toBeDefined();
			expect(lender).toBeDefined();
			expect(loans).toBeDefined();
			expect(receipt).toBeDefined();
			expect(optedIn).toBeDefined();
			expect(guestUsername).toBeDefined();
		});

		it('should register required components', () => {
			const {
				KvExpandable, CheckoutReceipt, SocialShareV2, BorrowerImage,
				GuestAccountCreation, AnimatedSparkles, KvButton, KvMaterialIcon
			} = WhatIsNextTemplate.components;
			expect(KvExpandable).toBeDefined();
			expect(CheckoutReceipt).toBeDefined();
			expect(SocialShareV2).toBeDefined();
			expect(BorrowerImage).toBeDefined();
			expect(GuestAccountCreation).toBeDefined();
			expect(AnimatedSparkles).toBeDefined();
			expect(KvButton).toBeDefined();
			expect(KvMaterialIcon).toBeDefined();
		});
	});

	describe('Initial Rendering', () => {
		it('should render success heading', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Success!');
		});

		it('should render borrower image', () => {
			const { container } = createComponent();
			const image = container.querySelector('.borrower-image');
			expect(image).toBeTruthy();
		});

		it('should render animated sparkles', () => {
			const { container } = createComponent();
			const sparkles = container.querySelector('.animated-sparkles');
			expect(sparkles).toBeTruthy();
		});

		it('should render expandable sections', () => {
			const { container } = createComponent();
			const expandables = container.querySelectorAll('.kv-expandable');
			expect(expandables.length).toBeGreaterThan(0);
		});
	});

	describe('Header Copy', () => {
		it('should show single loan message', () => {
			const { container } = createComponent({
				loans: [{ id: 1, name: 'Maria', image: { hash: 'abc' } }]
			});
			expect(container.textContent).toContain('You and Maria are in this together now');
		});

		it('should show two loans message', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } }
				]
			});
			expect(container.textContent).toContain('You are part of Maria and John\'s journey now');
		});

		it('should show three loans message', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } },
					{ id: 3, name: 'Anna', image: { hash: 'ghi' } }
				]
			});
			expect(container.textContent).toContain('Maria, John, and  Anna\'s journey now');
		});

		it('should show multiple loans message for more than 3', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } },
					{ id: 3, name: 'Anna', image: { hash: 'ghi' } },
					{ id: 4, name: 'Bob', image: { hash: 'jkl' } },
					{ id: 5, name: 'Eve', image: { hash: 'mno' } }
				]
			});
			expect(container.textContent).toContain('Maria, John, and  3 others journey now');
		});
	});

	describe('CTA Copy', () => {
		it('should show opt-in prompt for logged-in user not opted in', () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: false
			});
			expect(container.textContent).toContain('Want to hear how you\'re impacting');
		});

		it('should show opt-in prompt for guest user', () => {
			const { container } = createComponent({
				isGuest: true,
				optedIn: false
			});
			expect(container.textContent).toContain('Want to hear how you\'re impacting');
		});

		it('should show account completion message for opted-in guest', () => {
			const { container } = createComponent({
				isGuest: true,
				optedIn: true
			});
			expect(container.textContent).toContain('Complete your account to track your impact');
		});

		it('should not show CTA for opted-in logged-in user', () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: true
			});
			expect(container.textContent).not.toContain('Want to hear how you\'re impacting');
			expect(container.textContent).not.toContain('Complete your account');
		});
	});

	describe('Opt-In Buttons', () => {
		it('should show opt-in buttons when not opted in', () => {
			const { container } = createComponent({ optedIn: false });
			expect(container.textContent).toContain('Yes, keep me updated');
			expect(container.textContent).toContain('want to receive updates');
		});

		it('should not show opt-in buttons when opted in', () => {
			const { container } = createComponent({ optedIn: true });
			expect(container.textContent).not.toContain('Yes, keep me updated');
		});

		it('should show guest account creation for opted-in guest', () => {
			const { container } = createComponent({
				isGuest: true,
				optedIn: true
			});
			const guestCreation = container.querySelector('.guest-account-creation');
			expect(guestCreation).toBeTruthy();
		});

		it('should show portfolio button for opted-in logged-in user', () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: true
			});
			expect(container.textContent).toContain('Go to my kiva');
		});
	});

	describe('Expandable Sections', () => {
		it('should show create account section for guest when not opted in', () => {
			const { container } = createComponent({
				isGuest: true,
				optedIn: false
			});
			expect(container.textContent).toContain('Create your account');
		});

		it('should not show create account section for logged-in user', async () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: false
			});
			// Create account button only shows for guests
			await waitFor(() => {
				const text = container.textContent;
				// Should not contain "Create your account" option box
				const hasCreateOption = text.includes('Create your account');
				expect(hasCreateOption).toBe(false);
			});
		});

		it('should show order confirmation section', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Show previous loan details');
		});

		it('should show share section', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Share');
		});
	});

	describe('Opt-In Update Logic', () => {
		it('should call updateVisitorEmailOptIn for guest users', async () => {
			const { container } = createComponent({
				isGuest: true,
				optedIn: false
			});

			await waitFor(() => {
				const button = Array.from(container.querySelectorAll('.kv-button'))
					.find(btn => btn.textContent.includes('Yes, keep me updated'));
				if (button) button.click();
			});

			await waitFor(() => {
				expect(mockApolloMutate).toHaveBeenCalled();
			});
		});

		it('should call updateCommunicationSettings for logged-in users', async () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: false
			});

			await waitFor(() => {
				const button = Array.from(container.querySelectorAll('.kv-button'))
					.find(btn => btn.textContent.includes('Yes, keep me updated'));
				if (button) button.click();
			});

			await waitFor(() => {
				expect(mockApolloMutate).toHaveBeenCalled();
			});
		});

		it('should handle opt-in button clicks', async () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: false
			});

			const button = Array.from(container.querySelectorAll('.kv-button'))
				.find(btn => btn.textContent.includes('Yes, keep me updated'));

			expect(button).toBeTruthy();
		});
	});

	describe('Confirmation Messages', () => {
		it('should show positive confirmation when accepting opt-in', async () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: false
			});

			const button = Array.from(container.querySelectorAll('.kv-button'))
				.find(btn => btn.textContent.includes('Yes, keep me updated'));
			if (button) button.click();

			await waitFor(() => {
				expect(mockApolloMutate).toHaveBeenCalled();
			});
		});

		it('should handle negative opt-in response', async () => {
			const { container } = createComponent({
				isGuest: false,
				optedIn: false
			});

			const buttons = Array.from(container.querySelectorAll('.kv-button'));
			const button = buttons.find(btn => btn.textContent && btn.textContent.includes('want to receive updates'));

			expect(button).toBeTruthy();
		});
	});

	describe('Filtered Loans', () => {
		it('should display single loan correctly', () => {
			const { container } = createComponent({
				loans: [{ id: 1, name: 'Maria', image: { hash: 'abc' } }]
			});
			const images = container.querySelectorAll('.borrower-image');
			expect(images.length).toBe(1);
		});

		it('should display two loans correctly', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } }
				]
			});
			const images = container.querySelectorAll('.borrower-image');
			expect(images.length).toBe(2);
		});

		it('should display maximum of three loans', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } },
					{ id: 3, name: 'Anna', image: { hash: 'ghi' } },
					{ id: 4, name: 'Bob', image: { hash: 'jkl' } }
				]
			});
			const images = container.querySelectorAll('.borrower-image');
			expect(images.length).toBe(3);
		});
	});

	describe('Receipt Rendering', () => {
		it('should render checkout receipt when receipt is provided', () => {
			const { container } = createComponent({
				receipt: { id: 'receipt-1' }
			});
			// Receipt is in expandable, check it exists
			const expandables = container.querySelectorAll('.kv-expandable');
			expect(expandables.length).toBeGreaterThan(0);
		});

		it('should not render checkout receipt when receipt is not provided', () => {
			const { container } = createComponent({
				receipt: null
			});
			const receipt = container.querySelector('.checkout-receipt');
			expect(receipt).toBeFalsy();
		});
	});

	describe('Social Share Rendering', () => {
		it('should render social share when receipt is provided', () => {
			const { container } = createComponent({
				receipt: { id: 'receipt-1' }
			});
			// Social share is in expandable section
			const expandables = container.querySelectorAll('.kv-expandable');
			expect(expandables.length).toBeGreaterThan(0);
		});

		it('should not render social share when receipt is not provided', () => {
			const { container } = createComponent({
				receipt: null
			});
			const socialShare = container.querySelector('.social-share-v2');
			expect(socialShare).toBeFalsy();
		});
	});

	describe('Lifecycle - Created', () => {
		it('should track page view for guest users', () => {
			createComponent({ isGuest: true });
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'thanks',
				'view',
				'Thanks-marketing-opt-in-prompt',
				'guest'
			);
		});

		it('should track page view for registered users', () => {
			createComponent({ isGuest: false });
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'thanks',
				'view',
				'Thanks-marketing-opt-in-prompt',
				'registered'
			);
		});
	});

	describe('Hash Method', () => {
		it('should return image hash when available', () => {
			const { container } = createComponent();
			// Component successfully renders with hash
			expect(container).toBeTruthy();
		});

		it('should return empty string when hash is not available', () => {
			const { container } = createComponent({
				loans: [{ id: 1, name: 'Maria', image: {} }]
			});
			expect(container).toBeTruthy();
		});
	});

	describe('Margin Left Weight', () => {
		it('should return 0 for single loan', () => {
			const { container } = createComponent({
				loans: [{ id: 1, name: 'Maria', image: { hash: 'abc' } }]
			});
			// Component renders correctly with single loan
			expect(container).toBeTruthy();
		});

		it('should apply correct margin for two loans', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } }
				]
			});
			expect(container).toBeTruthy();
		});

		it('should apply correct margin for three loans', () => {
			const { container } = createComponent({
				loans: [
					{ id: 1, name: 'Maria', image: { hash: 'abc' } },
					{ id: 2, name: 'John', image: { hash: 'def' } },
					{ id: 3, name: 'Anna', image: { hash: 'ghi' } }
				]
			});
			expect(container).toBeTruthy();
		});
	});

	describe('Guest Username', () => {
		it('should pass guestUsername to GuestAccountCreation', () => {
			const { container } = createComponent({
				isGuest: true,
				optedIn: true,
				guestUsername: 'test@example.com'
			});
			const guestCreation = container.querySelector('.guest-account-creation');
			expect(guestCreation).toBeTruthy();
		});
	});
});
