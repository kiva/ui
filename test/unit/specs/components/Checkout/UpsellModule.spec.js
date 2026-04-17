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
			const copy = /Time is running out for Maria's loan\. Add \$25 before it expires\./;
			expect(screen.getByText(copy)).toBeTruthy();
		});

		it('uses apostrophe-only possessive for names ending in s', () => {
			renderUpsellModule({
				isExpiringSoonExpEnabled: true,
				loan: { ...mockLoan, name: 'Carlos' },
			});
			const copy = /Time is running out for Carlos' loan\. Add \$25 before it expires\./;
			expect(screen.getByText(copy)).toBeTruthy();
		});

		it('passes fixed $25 to addToBasket in variant', async () => {
			const addToBasket = vi.fn();
			const { getByText } = renderUpsellModule({ isExpiringSoonExpEnabled: true, addToBasket });
			await getByText('Add loan to basket').click();
			expect(addToBasket).toHaveBeenCalledWith(12345, 25);
		});

		it('passes dynamic amountLeft to addToBasket in control', async () => {
			const addToBasket = vi.fn();
			const { getByText } = renderUpsellModule({ addToBasket });
			await getByText('Add loan to basket').click();
			// amountLeft = 500 - 400 - 50 = 50
			expect(addToBasket).toHaveBeenCalledWith(12345, 50);
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
