import { render, fireEvent } from '@testing-library/vue';
import ThanksLayoutV2 from '#src/components/Thanks/ThanksLayoutV2';

// Mock child components
vi.mock('#src/components/Kv/KvIconButton', () => ({
	default: {
		name: 'KvIconButton',
		template: `<button class="mock-kv-icon-button" :class="$attrs.class" @click="$emit('click')">
			<slot name="icon-left" /><slot /><slot name="icon-right" />
		</button>`,
		props: ['aria-controls', 'aria-expanded']
	}
}));

vi.mock('#src/components/Kv/KvIcon', () => ({
	default: {
		name: 'KvIcon',
		template: '<span class="mock-kv-icon"><slot /></span>',
		props: ['name', 'class', 'fromSprite']
	}
}));

vi.mock('#src/components/Kv/KvExpandable', () => ({
	default: {
		name: 'KvExpandable',
		template: '<div class="mock-kv-expandable"><slot /></div>'
	}
}));

// Mock lodash throttle
vi.mock('lodash/throttle', () => ({
	default: vi.fn(fn => fn)
}));

const mockKvTrackEvent = vi.fn();

const renderComponent = (props = {}, slots = {}) => {
	return render(ThanksLayoutV2, {
		props: {
			showGuestUpsell: false,
			showMgCta: false,
			showShare: true,
			showReceipt: false,
			...props
		},
		slots,
		global: {
			mocks: {
				$kvTrackEvent: mockKvTrackEvent
			}
		}
	});
};

describe('ThanksLayoutV2', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock document.documentElement.clientWidth for desktop
		Object.defineProperty(document.documentElement, 'clientWidth', {
			writable: true,
			configurable: true,
			value: 1024
		});
	});

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(ThanksLayoutV2.name).toBe('ThanksLayoutV2');
		});

		it('should define expected props with correct types and defaults', () => {
			expect(ThanksLayoutV2.props).toMatchObject({
				showGuestUpsell: {
					type: Boolean,
					default: false
				},
				showMgCta: {
					type: Boolean,
					default: false
				},
				showShare: {
					type: Boolean,
					default: true
				},
				showReceipt: {
					type: Boolean,
					default: false
				}
			});
		});

		it('should register expected components', () => {
			expect(ThanksLayoutV2.components).toHaveProperty('KvExpandable');
			expect(ThanksLayoutV2.components).toHaveProperty('KvIcon');
			expect(ThanksLayoutV2.components).toHaveProperty('KvIconButton');
		});
	});

	describe('Initial Active State', () => {
		it('should show receipt button as active when showReceipt is true', () => {
			const { getByTestId } = renderComponent({
				showReceipt: true
			});

			const receiptButton = getByTestId('thanks-page-button-receipt');
			expect(receiptButton.className).toContain('active');
		});

		it('should show guest button as active when showGuestUpsell is true and showReceipt is false', () => {
			const { getByTestId } = renderComponent({
				showGuestUpsell: true,
				showReceipt: false
			});

			const guestButton = getByTestId('thanks-page-button-guest');
			expect(guestButton.className).toContain('active');
		});

		it('should show share button as active when showShare is true and others are false', () => {
			const { getByTestId } = renderComponent({
				showShare: true,
				showReceipt: false,
				showGuestUpsell: false
			});

			const shareButton = getByTestId('thanks-page-button-share');
			expect(shareButton.className).toContain('active');
		});

		it('should show mg button as active when only showMgCta is true', () => {
			const { getByTestId } = renderComponent({
				showMgCta: true,
				showReceipt: false,
				showGuestUpsell: false,
				showShare: false
			});

			const mgButton = getByTestId('thanks-page-button-mg');
			expect(mgButton.className).toContain('active');
		});
	});

	describe('Lifecycle - Mounted', () => {
		it('should call $kvTrackEvent on mount with receipt section', () => {
			renderComponent({
				showReceipt: true
			});

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'post-checkout',
				'show',
				'receipt-v2-view',
				'signed-in'
			);
		});

		it('should call $kvTrackEvent on mount with guest utmContent when showGuestUpsell is true', () => {
			renderComponent({
				showGuestUpsell: true,
				showReceipt: false
			});

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'post-checkout',
				'show',
				'guest-v2-view',
				'guest'
			);
		});

		it('should call $kvTrackEvent on mount with share section', () => {
			renderComponent({
				showShare: true,
				showReceipt: false
			});

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'post-checkout',
				'show',
				'share-v2-view',
				'signed-in'
			);
		});

		it('should call $kvTrackEvent on mount with mg section', () => {
			renderComponent({
				showMgCta: true,
				showReceipt: false,
				showGuestUpsell: false,
				showShare: false
			});

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'post-checkout',
				'show',
				'mg-v2-view',
				'signed-in'
			);
		});
	});

	describe('Desktop Layout - Large Viewport', () => {
		it('should render desktop container', () => {
			const { getByTestId } = renderComponent({
				showReceipt: true
			});

			expect(getByTestId('thanks-page-large-up')).toBeTruthy();
		});

		it('should render guest button when showGuestUpsell is true', () => {
			const { getByTestId } = renderComponent({
				showGuestUpsell: true
			});

			expect(getByTestId('thanks-page-button-guest')).toBeTruthy();
		});

		it('should render mg button when showMgCta is true', () => {
			const { getByTestId } = renderComponent({
				showMgCta: true
			});

			expect(getByTestId('thanks-page-button-mg')).toBeTruthy();
		});

		it('should render receipt button', () => {
			const { getByTestId } = renderComponent();

			expect(getByTestId('thanks-page-button-receipt')).toBeTruthy();
		});

		it('should render share button when showShare is true', () => {
			const { getByTestId } = renderComponent({
				showShare: true
			});

			expect(getByTestId('thanks-page-button-share')).toBeTruthy();
		});

		it('should not render share button when showShare is false', () => {
			const { queryByTestId } = renderComponent({
				showShare: false
			});

			expect(queryByTestId('thanks-page-button-share')).toBeFalsy();
		});

		it('should render guest content area when showGuestUpsell is true', () => {
			const { getByTestId } = renderComponent({
				showGuestUpsell: true
			});

			expect(getByTestId('thanks-page-content-guest')).toBeTruthy();
		});

		it('should render mg content area when showMgCta is true', () => {
			const { getByTestId } = renderComponent({
				showMgCta: true
			});

			expect(getByTestId('thanks-page-content-mg')).toBeTruthy();
		});

		it('should render receipt content area', () => {
			const { getByTestId } = renderComponent();

			expect(getByTestId('thanks-page-content-receipt')).toBeTruthy();
		});

		it('should render share content area', () => {
			const { getByTestId } = renderComponent({
				showShare: true
			});

			expect(getByTestId('thanks-page-content-share')).toBeTruthy();
		});
	});

	describe('Mobile Layout - Medium Down Viewport', () => {
		it('should render mobile container', () => {
			const { getByTestId } = renderComponent();

			expect(getByTestId('thanks-page-medium-down')).toBeTruthy();
		});

		it('should render guest accordion button when showGuestUpsell is true', () => {
			const { getByTestId } = renderComponent({
				showGuestUpsell: true
			});

			expect(getByTestId('thanks-page-guest-button')).toBeTruthy();
		});

		it('should render mg accordion button when showMgCta is true', () => {
			const { getByTestId } = renderComponent({
				showMgCta: true
			});

			expect(getByTestId('thanks-page-mg-button')).toBeTruthy();
		});

		it('should render receipt accordion button', () => {
			const { getByTestId } = renderComponent();

			expect(getByTestId('thanks-page-receipt-button')).toBeTruthy();
		});

		it('should render share accordion button when showShare is true', () => {
			const { getByTestId } = renderComponent({
				showShare: true
			});

			expect(getByTestId('thanks-page-share-button')).toBeTruthy();
		});

		it('should render guest accordion pane when showGuestUpsell is true', () => {
			const { getByTestId } = renderComponent({
				showGuestUpsell: true
			});

			expect(getByTestId('thanks-page-accordion-guest')).toBeTruthy();
		});

		it('should render mg accordion pane when showMgCta is true', () => {
			const { getByTestId } = renderComponent({
				showMgCta: true
			});

			expect(getByTestId('thanks-page-accordion-mg')).toBeTruthy();
		});

		it('should render receipt accordion pane', () => {
			const { getByTestId } = renderComponent();

			expect(getByTestId('thanks-page-accordion-receipt')).toBeTruthy();
		});
	});

	describe('Button Interactions', () => {
		it('should switch active state to guest when guest button is clicked', async () => {
			const { getByTestId } = renderComponent({
				showGuestUpsell: true,
				showReceipt: true
			});

			const receiptButton = getByTestId('thanks-page-button-receipt');
			const guestButton = getByTestId('thanks-page-button-guest');

			expect(receiptButton.className).toContain('active');
			expect(guestButton.className).not.toContain('active');

			await fireEvent.click(guestButton);

			expect(guestButton.className).toContain('active');
			expect(receiptButton.className).not.toContain('active');
		});

		it('should switch active state to mg when mg button is clicked', async () => {
			const { getByTestId } = renderComponent({
				showMgCta: true,
				showReceipt: true
			});

			const receiptButton = getByTestId('thanks-page-button-receipt');
			const mgButton = getByTestId('thanks-page-button-mg');

			expect(receiptButton.className).toContain('active');
			expect(mgButton.className).not.toContain('active');

			await fireEvent.click(mgButton);

			expect(mgButton.className).toContain('active');
			expect(receiptButton.className).not.toContain('active');
		});

		it('should switch active state to receipt when receipt button is clicked', async () => {
			const { getByTestId } = renderComponent({
				showShare: true,
				showReceipt: false
			});

			const shareButton = getByTestId('thanks-page-button-share');
			const receiptButton = getByTestId('thanks-page-button-receipt');

			expect(shareButton.className).toContain('active');
			expect(receiptButton.className).not.toContain('active');

			await fireEvent.click(receiptButton);

			expect(receiptButton.className).toContain('active');
			expect(shareButton.className).not.toContain('active');
		});

		it('should switch active state to share when share button is clicked', async () => {
			const { getByTestId } = renderComponent({
				showShare: true,
				showReceipt: true
			});

			const receiptButton = getByTestId('thanks-page-button-receipt');
			const shareButton = getByTestId('thanks-page-button-share');

			expect(receiptButton.className).toContain('active');
			expect(shareButton.className).not.toContain('active');

			await fireEvent.click(shareButton);

			expect(shareButton.className).toContain('active');
			expect(receiptButton.className).not.toContain('active');
		});
	});

	describe('Slot Rendering', () => {
		it('should render guest slot content', () => {
			const { getAllByText } = renderComponent(
				{ showGuestUpsell: true, showReceipt: false },
				{ guest: '<div>Guest Content</div>' }
			);

			// Content appears in both desktop and mobile versions
			const elements = getAllByText('Guest Content');
			expect(elements.length).toBeGreaterThan(0);
		});

		it('should render mg slot content', () => {
			const { getAllByText } = renderComponent(
				{
					showMgCta: true, showReceipt: false, showShare: false
				},
				{ mg: '<div>Monthly Good Content</div>' }
			);

			// Content appears in both desktop and mobile versions
			const elements = getAllByText('Monthly Good Content');
			expect(elements.length).toBeGreaterThan(0);
		});

		it('should render receipt slot content', () => {
			const { getAllByText } = renderComponent(
				{ showReceipt: true },
				{ receipt: '<div>Receipt Content</div>' }
			);

			// Content appears in both desktop and mobile versions
			const elements = getAllByText('Receipt Content');
			expect(elements.length).toBeGreaterThan(0);
		});

		it('should render share slot content', () => {
			const { getAllByText } = renderComponent(
				{ showShare: true, showReceipt: false },
				{ share: '<div>Share Content</div>' }
			);

			// Content appears in both desktop and mobile versions
			const elements = getAllByText('Share Content');
			expect(elements.length).toBeGreaterThan(0);
		});
	});

	describe('Container Classes', () => {
		it('should render with thanks-page class', () => {
			const { container } = renderComponent();

			const thanksPage = container.querySelector('.thanks-page');
			expect(thanksPage).toBeTruthy();
		});
	});

	describe('Priority - Receipt Prioritized', () => {
		it('should show receipt as active when all props are true', () => {
			const { getByTestId } = renderComponent({
				showReceipt: true,
				showGuestUpsell: true,
				showMgCta: true,
				showShare: true
			});

			expect(getByTestId('thanks-page-button-receipt').className).toContain('active');
			expect(getByTestId('thanks-page-button-guest').className).not.toContain('active');
			expect(getByTestId('thanks-page-button-mg').className).not.toContain('active');
			expect(getByTestId('thanks-page-button-share').className).not.toContain('active');
		});
	});
});
