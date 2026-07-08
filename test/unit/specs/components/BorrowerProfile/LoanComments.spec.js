import { render, fireEvent } from '@testing-library/vue';
import LoanComments from '#src/components/BorrowerProfile/LoanComments';
import { globalOptions } from '../../../specUtils';

const mockApiComments = [
	{
		id: 1,
		author: { name: 'Sarah', imageUrl: 'https://example.com/img.jpg', role: 'lender' },
		body: 'Great loan!',
		date: '2025-03-15T12:00:00Z',
	},
	{
		id: 2,
		author: { name: 'Aisha', imageUrl: null, role: 'borrower' },
		body: 'Thank you!',
		date: '2025-03-16T12:00:00Z',
	},
];

function buildApiResponse(comments, { lentTo = true, subscribed = false, loggedIn = true } = {}) {
	return {
		lend: {
			loan: {
				id: 123,
				comments: { values: comments },
				userProperties: { lentTo, subscribed },
			},
		},
		my: loggedIn ? { id: 1, userAccount: { id: 1 } } : { id: null, userAccount: null },
	};
}

// Runs mock API data through the component's actual applyCommentsData mapping
function applyMockData(apiComments, responseOverrides = {}) {
	const context = {};
	LoanComments.methods.applyCommentsData.call(context, buildApiResponse(apiComments, responseOverrides));
	return context;
}

function renderLoanComments(dataOverrides = {}, propsOverrides = {}) {
	const mutate = vi.fn(() => Promise.resolve({ data: {} }));
	const query = vi.fn(() => Promise.resolve({ data: {} }));
	const showTipMsg = vi.fn();
	const mapped = applyMockData(mockApiComments);
	const Component = {
		...LoanComments,
		data() {
			return {
				...LoanComments.data.call(this),
				...mapped,
				...dataOverrides,
			};
		},
	};

	return {
		...render(Component, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: {
						...globalOptions.provide.apollo,
						mutate,
						query,
					},
				},
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: showTipMsg,
				},
			},
			props: {
				loanId: 123, isPrivileged: true, ...propsOverrides
			},
		}),
		mutate,
		query,
		showTipMsg,
	};
}

describe('LoanComments', () => {
	it('submit comment calls addComment mutation and clears textarea', async () => {
		const { getByTestId, mutate } = renderLoanComments();
		const textarea = getByTestId('bp-comment-form-textarea');
		await fireEvent.update(textarea, 'New comment text');
		await fireEvent.click(getByTestId('bp-comment-form-submit'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { id: 123, body: 'New comment text' },
			}),
		);
		expect(textarea.value).toBe('');
	});

	it('submit ignores empty or whitespace-only input', async () => {
		const { getByTestId, mutate } = renderLoanComments();
		await fireEvent.update(getByTestId('bp-comment-form-textarea'), '   ');
		await fireEvent.click(getByTestId('bp-comment-form-submit'));

		expect(mutate).not.toHaveBeenCalled();
	});

	it('submit shows error on failure', async () => {
		const { getByTestId, mutate, showTipMsg } = renderLoanComments();
		mutate.mockRejectedValueOnce(new Error('network'));
		await fireEvent.update(getByTestId('bp-comment-form-textarea'), 'text');
		await fireEvent.click(getByTestId('bp-comment-form-submit'));

		expect(showTipMsg).toHaveBeenCalledWith('There was a problem posting your comment', 'error');
	});

	it('delete comment removes it from the list after confirmation', async () => {
		const {
			getAllByTestId, getByText, queryByText, mutate
		} = renderLoanComments({ isAdmin: true });
		await fireEvent.click(getAllByTestId('bp-comment-delete')[0]);

		expect(getByText('Delete this comment?')).toBeTruthy();
		await fireEvent.click(getByText('Delete comment'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, commentId: 1 },
			}),
		);
		expect(queryByText('Great loan!')).toBeNull();
	});

	it('delete shows error on failure', async () => {
		const {
			getAllByTestId, getByText, mutate, showTipMsg
		} = renderLoanComments({ isAdmin: true });
		mutate.mockRejectedValueOnce(new Error('network'));
		await fireEvent.click(getAllByTestId('bp-comment-delete')[0]);
		await fireEvent.click(getByText('Delete comment'));

		expect(showTipMsg).toHaveBeenCalledWith('There was a problem deleting this comment', 'error');
	});

	it('flag comment opens report lightbox', async () => {
		const { getAllByTestId, getByText } = renderLoanComments();
		await fireEvent.click(getAllByTestId('bp-comment-flag')[0]);

		expect(getByText('Report Comment')).toBeTruthy();
	});

	it('subscribe calls mutation and toggles to unsubscribe button', async () => {
		const { getByTestId, queryByTestId, mutate } = renderLoanComments();
		await fireEvent.click(getByTestId('bp-comment-subscribe'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, subscribe: true },
			}),
		);
		expect(queryByTestId('bp-comment-subscribe')).toBeNull();
		expect(getByTestId('bp-comment-unsubscribe')).toBeTruthy();
	});

	it('unsubscribe calls mutation and toggles to subscribe button', async () => {
		const { getByTestId, queryByTestId, mutate } = renderLoanComments({ isSubscribed: true });
		await fireEvent.click(getByTestId('bp-comment-unsubscribe'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, subscribe: false },
			}),
		);
		expect(queryByTestId('bp-comment-unsubscribe')).toBeNull();
		expect(getByTestId('bp-comment-subscribe')).toBeTruthy();
	});

	it('keeps a comment flagged after posting a new comment refetches the list (AD-314)', async () => {
		const {
			getAllByTestId, getByTestId, getByText, queryByText, mutate, query
		} = renderLoanComments();
		query.mockResolvedValue({ data: buildApiResponse(mockApiComments) });

		// Flag the first comment through the report lightbox
		mutate.mockResolvedValueOnce({ data: { loan: { flagComment: true } } });
		await fireEvent.click(getAllByTestId('bp-comment-flag')[0]);
		await fireEvent.click(getByText('I find it offensive'));
		await fireEvent.click(getByText('Submit report'));
		expect(queryByText(/Flagged on/)).toBeTruthy();

		// Posting a comment refetches the list; the flag must survive
		await fireEvent.update(getByTestId('bp-comment-form-textarea'), 'Another comment');
		await fireEvent.click(getByTestId('bp-comment-form-submit'));

		expect(queryByText(/Flagged on/)).toBeTruthy();
	});

	it('clears in-session flag state when the instance is reused for another loan (AD-314)', async () => {
		const {
			getAllByTestId, getByText, queryByText, mutate, rerender
		} = renderLoanComments();

		mutate.mockResolvedValueOnce({ data: { loan: { flagComment: true } } });
		await fireEvent.click(getAllByTestId('bp-comment-flag')[0]);
		await fireEvent.click(getByText('I find it offensive'));
		await fireEvent.click(getByText('Submit report'));
		expect(queryByText(/Flagged on/)).toBeTruthy();

		await rerender({ loanId: 456 });

		expect(queryByText(/Flagged on/)).toBeNull();
	});

	it('show all reveals spillover comments', async () => {
		const manyApiComments = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			author: { name: `User ${i}`, imageUrl: null, role: 'lender' },
			body: `Comment ${i}`,
			date: '2025-03-15T12:00:00Z',
		}));
		const mapped = applyMockData(manyApiComments);
		const { getByTestId, queryByText } = renderLoanComments({ rawComments: mapped.rawComments });

		expect(queryByText('Comment 19')).toBeNull();

		await fireEvent.click(getByTestId('bp-comment-show-all'));
		expect(queryByText('Comment 19')).toBeTruthy();
	});
});
