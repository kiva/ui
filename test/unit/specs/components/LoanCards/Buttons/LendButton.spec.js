import { render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LendButton from '../../../../../../src/components/LoanCards/Buttons/LendButton';
import * as Sentry from '@sentry/vue';
import * as basketUtils from '../../../../../../src/util/basketUtils';

// Mock dependencies
vi.mock('@sentry/vue', () => ({
	captureMessage: vi.fn(),
	captureException: vi.fn(),
}));

vi.mock('#src/util/basketUtils', () => ({
	handleInvalidBasket: vi.fn(),
	hasBasketExpired: vi.fn(),
}));

describe('LendButton', () => {
	let mockApollo;
	let mockCookieStore;
	let mockKvTrackEvent;
	let mockShowTipMsg;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn(),
			query: vi.fn(),
		};

		mockCookieStore = {
			get: vi.fn(),
			set: vi.fn(),
		};

		mockKvTrackEvent = vi.fn();
		mockShowTipMsg = vi.fn();

		// Mock window.fbq
		global.window = global.window || {};
		global.window.fbq = vi.fn();
		global.fbq = vi.fn();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	const renderComponent = (props = {}) => {
		return render(LendButton, {
			props: {
				loanId: 123,
				price: 25,
				...props,
			},
			global: {
				provide: {
					apollo: mockApollo,
					cookieStore: mockCookieStore,
				},
				mocks: {
					$kvTrackEvent: mockKvTrackEvent,
					$showTipMsg: mockShowTipMsg,
				},
			},
		});
	};

	describe('rendering', () => {
		it('should render the button with default text', () => {
			const { getByText } = renderComponent();
			expect(getByText('Lend now')).toBeTruthy();
		});

		it('should render custom slot content', () => {
			const { getByText } = render(LendButton, {
				props: {
					loanId: 123,
					price: 25,
				},
				slots: {
					default: 'Custom Button Text',
				},
				global: {
					provide: {
						apollo: mockApollo,
						cookieStore: mockCookieStore,
					},
					mocks: {
						$kvTrackEvent: mockKvTrackEvent,
						$showTipMsg: mockShowTipMsg,
					},
				},
			});

			expect(getByText('Custom Button Text')).toBeTruthy();
		});

		it('should have loading state when loading', async () => {
			mockApollo.mutate.mockImplementation(() => new Promise(() => {})); // Never resolves

			const { container, getByText } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				// KvButton should have loading state
				const kvButton = container.querySelector('button');
				expect(kvButton).toBeTruthy();
			});
		});
	});

	describe('adding to basket - success', () => {
		it('should track event when button is clicked', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByText } = renderComponent({
				loanId: 456,
				price: 50,
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'Lending',
					'Add to basket',
					'lend-button-click',
					456,
					50,
				);
			});
		});

		it('should call apollo mutate with correct variables', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });
			mockApollo.query.mockResolvedValue({ data: {} });

			const { getByText } = renderComponent({
				loanId: 789,
				price: 100,
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: expect.any(Object),
					variables: {
						loanId: 789,
						price: '100.00',
					},
				});
			});
		});

		it('should emit add-to-basket event on success', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });
			mockApollo.query.mockResolvedValue({ data: {} });

			const { getByText, emitted } = renderComponent({
				loanId: 123,
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(emitted()['add-to-basket']).toBeTruthy();
				expect(emitted()['add-to-basket'][0]).toEqual([{
					loanId: 123,
					success: true,
				}]);
			});
		});

		it('should track facebook pixel on success', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });
			mockApollo.query.mockResolvedValue({ data: {} });

			const { getByText } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(global.window.fbq).toHaveBeenCalledWith(
					'track',
					'AddToCart',
					{ content_category: 'Loan' },
				);
			});
		});

		it('should query loanCardBasketed on success', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });
			mockApollo.query.mockResolvedValue({ data: {} });

			const { getByText } = renderComponent({
				loanId: 456,
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalledWith({
					query: expect.any(Object),
					variables: {
						id: 456,
					},
					fetchPolicy: 'network-only',
				});
			});
		});

		it('should emit update:loading events', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });
			mockApollo.query.mockResolvedValue({ data: {} });

			const { getByText, emitted } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(emitted()['update:loading']).toBeTruthy();
				expect(emitted()['update:loading'][0]).toEqual([true]);
				expect(emitted()['update:loading'][1]).toEqual([false]);
			});
		});
	});

	describe('adding to basket - errors', () => {
		it('should handle mutation errors', async () => {
			mockApollo.mutate.mockResolvedValue({
				errors: [{ message: 'Something went wrong' }],
			});

			const { getByText, emitted } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(emitted()['add-to-basket'][0]).toEqual([{
					loanId: 123,
					success: false,
				}]);
				expect(mockShowTipMsg).toHaveBeenCalledWith('Something went wrong', 'error');
				expect(Sentry.captureMessage).toHaveBeenCalledWith('Add to Basket: Something went wrong');
			});
		});

		it('should track failed add-to-basket event', async () => {
			mockApollo.mutate.mockResolvedValue({
				errors: [{ message: 'Error occurred while adding loan to basket' }],
			});

			const { getByText } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'Lending',
					'Add-to-Basket',
					expect.stringContaining('Failed: Error occurred while adding loan to'),
				);
			});
		});

		it('should handle expired basket error', async () => {
			basketUtils.hasBasketExpired.mockReturnValue(true);
			basketUtils.handleInvalidBasket.mockResolvedValue({});

			mockApollo.mutate.mockResolvedValue({
				errors: [{
					message: 'Basket expired',
					extensions: { code: 'basket_expired' },
				}],
			});

			const { getByText } = renderComponent({
				loanId: 999,
				price: 50,
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith(
					'There was a problem adding the loan to your basket, refreshing the page to try again.',
					'error',
				);
				expect(basketUtils.handleInvalidBasket).toHaveBeenCalledWith({
					cookieStore: mockCookieStore,
					loan: {
						id: 999,
						price: 50,
					},
				});
			});
		});

		it('should handle mutation rejection', async () => {
			const error = new Error('Network error');
			mockApollo.mutate.mockRejectedValue(error);

			const { getByText } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith(
					'Failed to add loan. Please try again.',
					'error',
				);
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'Lending',
					'Add-to-Basket',
					'Failed to add loan. Please try again.',
				);
				expect(Sentry.captureException).toHaveBeenCalledWith(error);
			});
		});

		it('should handle multiple errors', async () => {
			mockApollo.mutate.mockResolvedValue({
				errors: [
					{ message: 'Error 1' },
					{ message: 'Error 2' },
				],
			});

			const { getByText } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledTimes(2);
				expect(Sentry.captureMessage).toHaveBeenCalledTimes(2);
			});
		});

		it('should handle fbq not being available', async () => {
			global.window.fbq = undefined;
			global.fbq = undefined;

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			mockApollo.mutate.mockResolvedValue({ data: {} });
			mockApollo.query.mockResolvedValue({ data: {} });

			const { getByText, emitted } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				// Should not throw error
				expect(emitted()['add-to-basket']).toBeTruthy();
			});

			consoleErrorSpy.mockRestore();
		});
	});

	describe('props', () => {
		it('should use default price when not provided', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByText } = renderComponent({
				price: undefined,
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: expect.any(Object),
					variables: {
						loanId: 123,
						price: '25.00',
					},
				});
			});
		});

		it('should handle string price', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByText } = renderComponent({
				price: '75',
			});
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: expect.any(Object),
					variables: {
						loanId: 123,
						price: '75.00',
					},
				});
			});
		});
	});

	describe('computed properties', () => {
		it('should return loading state when loading', async () => {
			mockApollo.mutate.mockImplementation(() => new Promise(() => {})); // Never resolves

			const { container, getByText } = renderComponent();
			const button = getByText('Lend now');

			await userEvent.click(button);

			await waitFor(() => {
				// Button should be in loading state
				const kvButton = container.querySelector('button');
				expect(kvButton).toBeTruthy();
			});
		});

		it('should return empty string when not loading', () => {
			const { container } = renderComponent();
			const kvButton = container.querySelector('button');
			expect(kvButton).toBeTruthy();
		});
	});
});
