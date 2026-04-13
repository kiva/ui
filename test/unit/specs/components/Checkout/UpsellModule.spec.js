import { render, screen } from '@testing-library/vue';
import numeralFilter from '#src/plugins/numeral-filter';
import UpsellModule from '#src/components/Checkout/UpsellModule';
import { globalOptions } from '../../../specUtils';

const mockLoan = {
	id: 12345,
	name: 'Maria',
	image: { s100: 'https://example.com/image.jpg' },
	loanAmount: 500,
	status: 'fundraising',
	gender: 'female',
	loanFundraisingInfo: {
		fundedAmount: 400,
		reservedAmount: 50,
	},
};

const mockKvTrackEvent = vi.fn();

function renderUpsellModule(props = {}) {
	return render(UpsellModule, {
		props: {
			loan: mockLoan,
			closeUpsellModule: vi.fn(),
			addToBasket: vi.fn(),
			...props,
		},
		global: {
			...globalOptions,
			mocks: {
				...globalOptions.mocks,
				$kvTrackEvent: mockKvTrackEvent,
				$filters: {
					numeral: numeralFilter,
				},
			},
		},
	});
}

describe('UpsellModule', () => {
	beforeEach(() => {
		mockKvTrackEvent.mockClear();
	});

	describe('control copy (default)', () => {
		it('shows almost-funded copy when no isExpiringSoonExpEnabled', () => {
			renderUpsellModule();
			expect(screen.getByText(/Maria is missing just/)).toBeTruthy();
			expect(screen.getByText(/Be the person to complete their loan/)).toBeTruthy();
		});

		it('shows almost-funded copy when isExpiringSoonExpEnabled is false', () => {
			renderUpsellModule({ isExpiringSoonExpEnabled: false });
			expect(screen.getByText(/Maria is missing just/)).toBeTruthy();
		});
	});

	describe('variant copy (expiring soon)', () => {
		it('shows expiring-soon copy when isExpiringSoonExpEnabled is true', () => {
			renderUpsellModule({ isExpiringSoonExpEnabled: true });
			expect(screen.getByText(/Time is running out for Maria/)).toBeTruthy();
			expect(screen.getByText(/to help this loan before it expires/)).toBeTruthy();
		});

		it('shows dynamic amount in variant copy', () => {
			renderUpsellModule({ isExpiringSoonExpEnabled: true });
			// amountLeft = 500 - 400 - 50 = 50
			expect(screen.getAllByText(/\$50/).length).toBeGreaterThan(0);
		});
	});

	describe('shared elements unchanged', () => {
		it('shows "Support Another Borrower" header for both variants', () => {
			const { unmount } = renderUpsellModule({ isExpiringSoonExpEnabled: true });
			expect(screen.getByText('Support Another Borrower')).toBeTruthy();
			unmount();

			renderUpsellModule();
			expect(screen.getByText('Support Another Borrower')).toBeTruthy();
		});

		it('shows "Add loan to basket" button for both variants', () => {
			renderUpsellModule({ isExpiringSoonExpEnabled: true });
			expect(screen.getByText('Add loan to basket')).toBeTruthy();
		});

		it('fires view-checkout-upsell tracking on mount', () => {
			renderUpsellModule({ isExpiringSoonExpEnabled: true });
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'Basket',
				'view-checkout-upsell',
				'View',
				12345,
				50
			);
		});
	});
});
