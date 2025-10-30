import { render } from '@testing-library/vue';
import GuestUpsell from '#src/components/Checkout/GuestUpsell';
import { createStubComponent } from '../../../helpers/componentTestHelpers';

describe('GuestUpsell.vue', () => {
	const mockKvTrackEvent = vi.fn();
	const defaultProps = {
		loans: []
	};

	const renderComponent = (props = {}) => {
		return render(GuestUpsell, {
			props: {
				...defaultProps,
				...props
			},
			global: {
				mocks: {
					$kvTrackEvent: mockKvTrackEvent
				},
				stubs: {
					GuestAccountCreation: createStubComponent('GuestAccountCreation', {
						template: '<div data-testid="mock-guest-account-creation">Guest Account Creation</div>'
					})
				}
			}
		});
	};

	beforeEach(() => {
		mockKvTrackEvent.mockClear();
	});

	// Component structure tests
	it('should render component with correct name', () => {
		const { container } = renderComponent();
		const section = container.querySelector('section.guest-account-upsell');
		expect(section).toBeTruthy();
	});

	it('should render section with correct classes', () => {
		const { container } = renderComponent();
		const section = container.querySelector('section');
		expect(section.classList.contains('guest-account-upsell')).toBe(true);
		expect(section.classList.contains('hide-for-print')).toBe(true);
		expect(section.classList.contains('tw-p-3')).toBe(true);
	});

	it('should render headline', () => {
		const { container } = renderComponent();
		const headline = container.querySelector('h2');
		expect(headline).toBeTruthy();
		expect(headline.textContent.trim()).toBe('Before you go!');
	});

	it('should render headline with correct class', () => {
		const { container } = renderComponent();
		const headline = container.querySelector('h2');
		expect(headline.classList.contains('guest-account-upsell__headline')).toBe(true);
	});

	it('should render subhead paragraph with correct class', () => {
		const { container } = renderComponent();
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.tagName).toBe('P');
		expect(paragraph.classList.contains('guest-account-upsell__subhead')).toBe(true);
		expect(paragraph.classList.contains('tw-mb-4')).toBe(true);
	});

	it('should render GuestAccountCreation component', () => {
		const { container } = renderComponent();
		const guestAccount = container.querySelector('[data-testid="mock-guest-account-creation"]');
		expect(guestAccount).toBeTruthy();
	});

	// Computed property: borrowerName - multiple loans
	it('should display generic text when multiple loans', () => {
		const loans = [
			{ name: 'John' },
			{ name: 'Jane' }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('the borrowers you support');
	});

	it('should display specific borrower name when single loan', () => {
		const loans = [
			{ name: 'Maria' }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('Maria');
		expect(paragraph.textContent).not.toContain('the borrowers you support');
	});

	it('should display generic text when no loans', () => {
		const { container } = renderComponent({ loans: [] });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('the borrowers you support');
	});

	// Computed property: borrowerUpdateText - content verification
	it('should display complete update text for multiple loans', () => {
		const loans = [
			{ name: 'John' },
			{ name: 'Jane' }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain(
			'Finish setting up your account to get updates from the borrowers you support'
		);
		expect(paragraph.textContent).toContain('and choose how to re-lend your money when they pay you back.');
	});

	it('should display complete update text for single loan', () => {
		const loans = [
			{ name: 'Carlos' }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('Finish setting up your account to get updates from Carlos');
		expect(paragraph.textContent).toContain('and choose how to re-lend your money when they pay you back.');
	});

	it('should handle loan name with special characters', () => {
		const loans = [
			{ name: "María José O'Brien-Smith" }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain("María José O'Brien-Smith");
	});

	it('should handle very long loan name', () => {
		const loans = [
			{ name: 'A'.repeat(100) }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('A'.repeat(100));
	});

	// Tracking tests
	it('should fire tracking event on mount with multiple loans', () => {
		const loans = [
			{ name: 'John' },
			{ name: 'Jane' }
		];
		renderComponent({ loans });
		expect(mockKvTrackEvent).toHaveBeenCalledWith(
			'post-checkout',
			'show',
			'register-upsell',
			expect.stringContaining('the borrowers you support')
		);
		expect(mockKvTrackEvent).toHaveBeenCalledTimes(1);
	});

	it('should fire tracking event on mount with single loan', () => {
		const loans = [
			{ name: 'Maria' }
		];
		renderComponent({ loans });
		expect(mockKvTrackEvent).toHaveBeenCalledWith(
			'post-checkout',
			'show',
			'register-upsell',
			expect.stringContaining('Maria')
		);
		expect(mockKvTrackEvent).toHaveBeenCalledTimes(1);
	});

	it('should fire tracking event with complete message text', () => {
		const loans = [
			{ name: 'Pedro' }
		];
		renderComponent({ loans });
		expect(mockKvTrackEvent).toHaveBeenCalledWith(
			'post-checkout',
			'show',
			'register-upsell',
			expect.stringContaining('Finish setting up your account to get updates from Pedro')
		);
		expect(mockKvTrackEvent).toHaveBeenCalledWith(
			'post-checkout',
			'show',
			'register-upsell',
			expect.stringContaining('and choose how to re-lend your money when they pay you back.')
		);
	});

	// Props tests
	it('should accept empty loans array', () => {
		const { container } = renderComponent({ loans: [] });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('the borrowers you support');
	});

	it('should handle three or more loans', () => {
		const loans = [
			{ name: 'One' },
			{ name: 'Two' },
			{ name: 'Three' }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		expect(paragraph.textContent).toContain('the borrowers you support');
	});

	it('should handle loans with minimal data', () => {
		const loans = [
			{ name: '' }
		];
		const { container } = renderComponent({ loans });
		const paragraph = container.querySelector('.guest-account-upsell__subhead');
		// Should display empty name
		expect(paragraph.textContent).toContain('Finish setting up your account to get updates from');
	});
});
