import createNewBasketMutation from '../../../../src/graphql/mutation/shopCreateNewBsket.graphql';
import updateDonation from '../../../../src/graphql/mutation/updateDonation.graphql';
import updateLoanReservation from '../../../../src/graphql/mutation/updateLoanReservation.graphql';
import {
	createNewBasket,
	hasBasketExpired,
	handleInvalidBasket,
	handleInvalidBasketForDonation,
	setLendAmount,
	setDonationAmount,
} from '../../../../src/util/basketUtils';
import * as logFormatter from '../../../../src/util/logFormatter';

describe('basketUtils', () => {
	describe('createNewBasket', () => {
		it('calls apollo.mutate and sets cookie if basket is created', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: { shop: { createBasket: 'basket123' } } }) };
			const cookieStore = { set: vi.fn() };
			const result = await createNewBasket({ apollo, cookieStore });
			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({ mutation: createNewBasketMutation }));
			expect(cookieStore.set).toHaveBeenCalledWith('kvbskt', 'basket123', { path: '/', secure: true });
			expect(result).toBe('basket123');
		});

		it('does not set cookie if no basket is returned', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: { shop: {} } }) };
			const cookieStore = { set: vi.fn() };
			const result = await createNewBasket({ apollo, cookieStore });
			expect(cookieStore.set).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		it('handles null data from mutation', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: null }) };
			const cookieStore = { set: vi.fn() };
			const result = await createNewBasket({ apollo, cookieStore });
			expect(cookieStore.set).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		it('handles undefined data.shop.createBasket', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: { shop: { createBasket: undefined } } }) };
			const cookieStore = { set: vi.fn() };
			const result = await createNewBasket({ apollo, cookieStore });
			expect(cookieStore.set).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});
	});

	describe('hasBasketExpired', () => {
		it('returns true for shop.invalidBasketId', () => {
			expect(hasBasketExpired('shop.invalidBasketId')).toBe(true);
		});
		it('returns true for shop.basketRequired', () => {
			expect(hasBasketExpired('shop.basketRequired')).toBe(true);
		});
		it('returns false for other error codes', () => {
			expect(hasBasketExpired('other')).toBe(false);
		});
	});

	describe('handleInvalidBasket', () => {
		it('removes kvbskt, sets kvatbid, and reloads', () => {
			const cookieStore = { remove: vi.fn(), set: vi.fn() };
			const loan = { id: 1 };
			const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

			handleInvalidBasket({ loan, cookieStore });

			expect(cookieStore.remove).toHaveBeenCalledWith('kvbskt', { path: '/', secure: true });
			expect(cookieStore.set).toHaveBeenCalledWith('kvatbid', JSON.stringify(loan));
			expect(reloadSpy).toHaveBeenCalled();
		});
	});

	describe('handleInvalidBasketForDonation', () => {
		it('removes kvbskt, sets kvatbamt, and reloads', () => {
			const cookieStore = { remove: vi.fn(), set: vi.fn() };
			const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
			const expectedCookieValue = JSON.stringify({ donationAmount: 5, navigateToCheckout: true });

			handleInvalidBasketForDonation({ cookieStore, donationAmount: 5, navigateToCheckout: true });

			expect(cookieStore.remove).toHaveBeenCalledWith('kvbskt', { path: '/', secure: true });
			expect(cookieStore.set).toHaveBeenCalledWith('kvatbamt', expectedCookieValue);
			expect(reloadSpy).toHaveBeenCalled();
		});

		it('defaults navigateToCheckout to false when not provided', () => {
			const cookieStore = { remove: vi.fn(), set: vi.fn() };
			const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});
			const expectedCookieValue = JSON.stringify({ donationAmount: 10, navigateToCheckout: false });

			handleInvalidBasketForDonation({ cookieStore, donationAmount: 10 });

			expect(cookieStore.set).toHaveBeenCalledWith('kvatbamt', expectedCookieValue);
			expect(reloadSpy).toHaveBeenCalled();
		});
	});

	describe('setLendAmount', () => {
		it('calls apollo.mutate and resolves on success', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({}) };
			await expect(setLendAmount({ amount: 25, apollo, loanId: 1 })).resolves.toBeUndefined();
			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
				mutation: updateLoanReservation,
				variables: expect.objectContaining({
					price: '25.00',
					loanId: 1,
				}),
			}));
		});

		it('logs and rejects on result.errors', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const apollo = { mutate: vi.fn().mockResolvedValue({ errors: [new Error('fail')] }) };
			await expect(setLendAmount({ amount: 25, apollo, loanId: 1 })).rejects.toBeDefined();
			expect(mockLogFormatter).toBeCalledWith(expect.any(Error), 'error');
		});

		it('logs and rejects on thrown error', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const apollo = { mutate: vi.fn().mockRejectedValue(new Error('fail')) };
			await expect(setLendAmount({ amount: 25, apollo, loanId: 1 })).rejects.toBeDefined();
			expect(mockLogFormatter).toBeCalledWith(expect.any(Error), 'error');
		});
	});

	describe('setDonationAmount', () => {
		it('calls apollo.mutate and returns data', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: 'ok' }) };
			const result = await setDonationAmount({ apollo, donationAmount: 5 });
			expect(apollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
				mutation: updateDonation,
				variables: expect.objectContaining({
					price: '5.00',
					isTip: true,
				}),
			}));
			expect(result).toEqual({ data: 'ok' });
		});

		it('logs errors when data.errors exists', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const errors = [new Error('error1'), new Error('error2')];
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: { ok: true }, errors }) };
			const result = await setDonationAmount({ apollo, donationAmount: 5 });
			expect(mockLogFormatter).toHaveBeenCalledTimes(2);
			expect(mockLogFormatter).toHaveBeenCalledWith(errors[0], 'error');
			expect(mockLogFormatter).toHaveBeenCalledWith(errors[1], 'error');
			expect(result).toEqual({ data: { ok: true }, errors });
		});

		it('logs error if apollo.mutate throws', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const apollo = { mutate: vi.fn().mockRejectedValue(new Error('fail')) };
			await setDonationAmount({ apollo, donationAmount: 5 });
			expect(mockLogFormatter).toBeCalledWith(expect.any(Error), 'error');
		});
	});

	describe('setLendAmount error logging', () => {
		beforeEach(() => {
			vi.mock('@sentry/vue');
		});

		it('logs errors to Sentry when mutation has errors', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const error = new Error('mutation failed');
			const apollo = { mutate: vi.fn().mockResolvedValue({ errors: [error] }) };

			await expect(setLendAmount({ amount: 25, apollo, loanId: 123 })).rejects.toBeDefined();

			expect(mockLogFormatter).toHaveBeenCalledWith(error, 'error');
		});

		it('handles Sentry error gracefully when capturing exception fails', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const error = new Error('mutation failed');
			const apollo = { mutate: vi.fn().mockResolvedValue({ errors: [error] }) };

			// Mock Sentry to throw an error
			const { withScope } = await import('@sentry/vue');
			vi.mocked(withScope).mockImplementation(() => {
				throw new Error('Sentry error');
			});

			// Should not throw despite Sentry error
			await expect(setLendAmount({ amount: 25, apollo, loanId: 123 })).rejects.toBeDefined();

			expect(mockLogFormatter).toHaveBeenCalledWith(error, 'error');
		});

		it('handles array of errors when mutation is rejected', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const errors = [new Error('error1'), new Error('error2')];
			const apollo = { mutate: vi.fn().mockRejectedValue(errors) };

			await expect(setLendAmount({ amount: 25, apollo, loanId: 123 })).rejects.toBe(errors);

			expect(mockLogFormatter).toHaveBeenCalledTimes(2);
			expect(mockLogFormatter).toHaveBeenCalledWith(errors[0], 'error');
			expect(mockLogFormatter).toHaveBeenCalledWith(errors[1], 'error');
		});

		it('handles single error when mutation is rejected', async () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			const error = new Error('single error');
			const apollo = { mutate: vi.fn().mockRejectedValue(error) };

			await expect(setLendAmount({ amount: 25, apollo, loanId: 123 })).rejects.toBe(error);

			expect(mockLogFormatter).toHaveBeenCalledWith(error, 'error');
		});
	});
});
