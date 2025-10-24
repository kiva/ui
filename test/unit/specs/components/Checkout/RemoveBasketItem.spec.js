import {
	describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import RemoveBasketItem from '#src/components/Checkout/RemoveBasketItem';

describe('RemoveBasketItem', () => {
	let mockApollo;
	let mockKvTrackEvent;
	let mockShowTipMsg;
	let mockCloseTipMsg;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn(),
		};

		mockKvTrackEvent = vi.fn();
		mockShowTipMsg = vi.fn();
		mockCloseTipMsg = vi.fn();
	});

	const renderComponent = (props = {}) => {
		return render(RemoveBasketItem, {
			props: {
				loanId: 123,
				type: 'loan',
				...props,
			},
			global: {
				provide: {
					apollo: mockApollo,
				},
				mocks: {
					$kvTrackEvent: mockKvTrackEvent,
					$showTipMsg: mockShowTipMsg,
					$closeTipMsg: mockCloseTipMsg,
				},
			},
		});
	};

	describe('rendering', () => {
		it('should render the remove button', () => {
			const { getByTestId } = renderComponent();
			const button = getByTestId('removeBasketItem');

			expect(button).toBeTruthy();
			expect(button.tagName).toBe('BUTTON');
		});

		it('should have accessible sr-only text', () => {
			const { getByText } = renderComponent();
			expect(getByText('Close')).toBeTruthy();
		});

		it('should render with mdiClose icon', () => {
			const { container } = renderComponent();
			// KvMaterialIcon should be rendered
			expect(container.querySelector('.remove-wrapper')).toBeTruthy();
		});
	});

	describe('removing loan from basket', () => {
		it('should emit updating-totals true when clicked', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByTestId, emitted } = renderComponent();
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(emitted()['updating-totals']).toBeTruthy();
				expect(emitted()['updating-totals'][0]).toEqual([true]);
			});
		});

		it('should call apollo mutate with correct variables for loan', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByTestId } = renderComponent({
				loanId: 456,
				type: 'loan',
			});
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: expect.any(Object),
					variables: {
						loanId: 456,
						price: 0,
					},
				});
			});
		});

		it('should emit refreshtotals and tracking on successful removal', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByTestId, emitted } = renderComponent();
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockCloseTipMsg).toHaveBeenCalled();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'basket',
					'Update Loan Amount',
					'Loan Removed',
					0,
					0,
				);
				expect(emitted().refreshtotals).toBeTruthy();
				expect(emitted().refreshtotals[0]).toEqual(['removeLoan']);
				expect(emitted()['updating-totals'][1]).toEqual([false]);
			});
		});

		it('should handle errors from mutation', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: {},
				errors: [{ message: 'Error message', code: 'some_error' }],
			});

			const { getByTestId, emitted } = renderComponent();
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith('Error message', 'error');
				expect(emitted()['updating-totals'][1]).toEqual([false]);
			});
		});

		it('should handle mutation rejection', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockApollo.mutate.mockRejectedValue(new Error('Network error'));

			const { getByTestId, emitted } = renderComponent();
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(consoleErrorSpy).toHaveBeenCalled();
				expect(emitted()['updating-totals'][1]).toEqual([false]);
			});

			consoleErrorSpy.mockRestore();
		});
	});

	describe('removing kiva card from basket', () => {
		it('should call apollo mutate with correct variables for kiva card', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByTestId } = renderComponent({
				type: 'kivaCard',
				idsInGroup: [1, 2, 3],
			});
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: expect.any(Object),
					variables: {
						idsInGroup: [1, 2, 3],
						individualPrice: 0,
					},
				});
			});
		});

		it('should track kiva card removal', async () => {
			mockApollo.mutate.mockResolvedValue({ data: {} });

			const { getByTestId } = renderComponent({
				type: 'kivaCard',
			});
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'basket',
					'Update Kiva Card Amount',
					'Kiva Card Removed',
					0,
					0,
				);
			});
		});

		it('should handle kiva card errors from mutation', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: {},
				errors: [{ message: 'Kiva Card error' }],
			});

			const { getByTestId, emitted } = renderComponent({
				type: 'kivaCard',
			});
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith('Kiva Card error', 'error');
				expect(emitted()['updating-totals'][1]).toEqual([false]);
			});
		});

		it('should handle kiva card mutation rejection', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockApollo.mutate.mockRejectedValue(new Error('Network error'));

			const { getByTestId, emitted } = renderComponent({
				type: 'kivaCard',
			});
			const button = getByTestId('removeBasketItem');

			await userEvent.click(button);

			await waitFor(() => {
				expect(consoleErrorSpy).toHaveBeenCalled();
				expect(emitted()['updating-totals'][1]).toEqual([false]);
			});

			consoleErrorSpy.mockRestore();
		});
	});

	describe('props', () => {
		it('should use default props when not provided', () => {
			const { container } = renderComponent({
				loanId: undefined,
				type: undefined,
				idsInGroup: undefined,
			});

			expect(container.querySelector('.remove-wrapper')).toBeTruthy();
		});

		it('should accept custom idsInGroup prop', () => {
			const { container } = renderComponent({
				idsInGroup: [10, 20, 30],
			});

			expect(container.querySelector('.remove-wrapper')).toBeTruthy();
		});
	});
});
