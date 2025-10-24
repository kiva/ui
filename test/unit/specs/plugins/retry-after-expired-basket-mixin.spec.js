import { setDonationAmount, setLendAmount } from '#src/util/basketUtils';
import retryBasketMixin from '#src/plugins/retry-after-expired-basket-mixin';

// Mock the dependencies
vi.mock('#src/util/basketUtils', () => ({
	setDonationAmount: vi.fn(),
	setLendAmount: vi.fn()
}));

vi.mock('#src/util/injectionCheck', () => ({
	default: vi.fn()
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

describe('retry-after-expired-basket-mixin.js', () => {
	let mockCookieStore;
	let mockRouter;
	let context;

	const flushPromises = () => new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	beforeEach(() => {
		mockCookieStore = {
			get: vi.fn(),
			remove: vi.fn()
		};

		mockRouter = {
			push: vi.fn()
		};

		context = {
			apollo: {},
			cookieStore: mockCookieStore,
			$router: mockRouter,
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn(),
			$emit: vi.fn()
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('mounted', () => {
		it('should handle failed donation and retry adding to basket', async () => {
			const donationData = JSON.stringify({
				donationAmount: 25,
				navigateToCheckout: false
			});
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbamt') return donationData;
				return null;
			});
			setDonationAmount.mockResolvedValue({});

			await retryBasketMixin.mounted.call(context);

			// Allow promises to resolve
			await flushPromises();

			expect(context.$kvTrackEvent).toHaveBeenCalledWith(
				'donation',
				'add-to-basket',
				'donation-one-time-retry-after-basket-cookie-refresh',
				null,
				25
			);
			expect(setDonationAmount).toHaveBeenCalledWith({
				apollo: context.apollo,
				donationAmount: 25
			});
			expect(context.$showTipMsg).toHaveBeenCalledWith('Your donation has been added to the basket.');
			expect(mockCookieStore.remove).toHaveBeenCalledWith('kvatbamt');
		});

		it('should navigate to checkout when navigateToCheckout is true for donation', async () => {
			const donationData = JSON.stringify({
				donationAmount: 50,
				navigateToCheckout: true
			});
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbamt') return donationData;
				return null;
			});
			setDonationAmount.mockResolvedValue({});

			await retryBasketMixin.mounted.call(context);
			await flushPromises();

			expect(mockRouter.push).toHaveBeenCalledWith({ path: '/checkout' });
		});

		it('should handle donation add to basket error', async () => {
			const donationData = JSON.stringify({
				donationAmount: 25,
				navigateToCheckout: false
			});
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbamt') return donationData;
				return null;
			});
			const error = new Error('Donation failed');
			setDonationAmount.mockRejectedValue(error);

			await retryBasketMixin.mounted.call(context);
			await flushPromises();

			expect(context.$showTipMsg).toHaveBeenCalledWith(
				'There was a problem adding the donation to your basket',
				'error'
			);
		});

		it('should handle failed loan and retry adding to basket', async () => {
			const loanData = JSON.stringify({
				id: 12345,
				price: 25
			});
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbid') return loanData;
				return null;
			});
			setLendAmount.mockResolvedValue({});

			await retryBasketMixin.mounted.call(context);
			await flushPromises();

			expect(context.$kvTrackEvent).toHaveBeenCalledWith(
				'Lending',
				'Add to basket',
				'Retry after basket cookie refresh'
			);
			expect(setLendAmount).toHaveBeenCalledWith({
				apollo: context.apollo,
				amount: 25,
				loanId: 12345
			});
			expect(context.$showTipMsg).toHaveBeenCalledWith('Your loan has been added to the basket.');
			expect(context.$emit).toHaveBeenCalledWith('add-to-basket', { loanId: 12345, success: true });
			expect(mockCookieStore.remove).toHaveBeenCalledWith('kvatbid');
		});

		it('should handle loan add to basket error with generic message', async () => {
			const loanData = JSON.stringify({
				id: 12345,
				price: 25
			});
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbid') return loanData;
				return null;
			});
			const error = [{ extensions: { code: 'some_error' } }];
			setLendAmount.mockRejectedValue(error);

			await retryBasketMixin.mounted.call(context);
			await flushPromises();

			expect(context.$showTipMsg).toHaveBeenCalledWith(
				'There was a problem adding the loan to your basket',
				'error'
			);
		});

		it('should handle loan add to basket error with anonymous basket limit message', async () => {
			const loanData = JSON.stringify({
				id: 12345,
				price: 25
			});
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbid') return loanData;
				return null;
			});
			const error = [{
				extensions: { code: 'reached_anonymous_basket_limit' },
				message: 'You have reached the anonymous basket limit'
			}];
			setLendAmount.mockRejectedValue(error);

			await retryBasketMixin.mounted.call(context);
			await flushPromises();

			expect(context.$showTipMsg).toHaveBeenCalledWith(
				'You have reached the anonymous basket limit',
				'error'
			);
		});

		it('should do nothing when no cookies are present', async () => {
			mockCookieStore.get.mockReturnValue(null);

			await retryBasketMixin.mounted.call(context);

			expect(context.$kvTrackEvent).not.toHaveBeenCalled();
			expect(setDonationAmount).not.toHaveBeenCalled();
			expect(setLendAmount).not.toHaveBeenCalled();
		});

		it('should handle both loan and donation cookies if both present', async () => {
			const loanData = JSON.stringify({ id: 12345, price: 25 });
			const donationData = JSON.stringify({ donationAmount: 50, navigateToCheckout: false });
			mockCookieStore.get.mockImplementation(key => {
				if (key === 'kvatbid') return loanData;
				if (key === 'kvatbamt') return donationData;
				return null;
			});
			setLendAmount.mockResolvedValue({});
			setDonationAmount.mockResolvedValue({});

			await retryBasketMixin.mounted.call(context);
			await flushPromises();

			expect(setDonationAmount).toHaveBeenCalled();
			expect(setLendAmount).toHaveBeenCalled();
			expect(mockCookieStore.remove).toHaveBeenCalledWith('kvatbid');
			expect(mockCookieStore.remove).toHaveBeenCalledWith('kvatbamt');
		});
	});
});
