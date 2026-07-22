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

function buildApiResponse(comments, {
	subscribed = false,
	loggedIn = true,
	// Defaults make canAddComment true (fundraising loan) so form-focused tests render the form.
	status = 'fundraising',
	isPrivileged = false,
	loanTrusteeId = null,
	isAdmin = false,
	borrowedLoanIds = [],
	myTrusteeId = null,
	loanCount = 0,
} = {}) {
	return {
		lend: {
			loan: {
				id: 123,
				status,
				comments: { values: comments },
				userProperties: { isPrivileged, subscribed },
				trustee: loanTrusteeId ? { id: loanTrusteeId } : null,
			},
		},
		my: loggedIn
			? {
				id: 1,
				isAdmin,
				borrowedLoans: borrowedLoanIds.map(id => ({ id })),
				trustee: myTrusteeId ? { id: myTrusteeId } : null,
				lender: { id: 1, loanCount },
			}
			: {
				id: null, isAdmin: false, borrowedLoans: [], trustee: null, lender: null,
			},
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
	const kvTrackEvent = vi.fn();
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
					$kvTrackEvent: kvTrackEvent,
				},
			},
			props: {
				loanId: 123, isPrivileged: true, ...propsOverrides
			},
		}),
		mutate,
		query,
		showTipMsg,
		kvTrackEvent,
	};
}

describe('LoanComments', () => {
	it('submit comment calls addComment mutation and clears textarea', async () => {
		const { getByTestId, mutate, kvTrackEvent } = renderLoanComments();
		const textarea = getByTestId('bp-comment-form-textarea');
		await fireEvent.update(textarea, 'New comment text');
		await fireEvent.click(getByTestId('bp-comment-form-submit'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { id: 123, body: 'New comment text' },
			}),
		);
		expect(textarea.value).toBe('');
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-submit', null, 123);
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
			getAllByTestId, getByText, queryByText, mutate, kvTrackEvent
		} = renderLoanComments({ isAdmin: true });
		await fireEvent.click(getAllByTestId('bp-comment-delete')[0]);

		expect(getByText('Delete this comment?')).toBeTruthy();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'view', 'comment-delete-lightbox', null, 1);

		await fireEvent.click(getByText('Delete comment'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, commentId: 1 },
			}),
		);
		expect(queryByText('Great loan!')).toBeNull();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-delete-confirm', null, 1);
	});

	it('cancelling the delete confirmation tracks the cancel and leaves the comment intact', async () => {
		const {
			getAllByTestId, getByTestId, queryByText, mutate, kvTrackEvent
		} = renderLoanComments({ isAdmin: true });
		await fireEvent.click(getAllByTestId('bp-comment-delete')[0]);
		await fireEvent.click(getByTestId('bp-comment-delete-cancel'));

		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-delete-cancel', null, 1);
		expect(mutate).not.toHaveBeenCalled();
		expect(queryByText('Great loan!')).toBeTruthy();
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
		const { getAllByTestId, getByText, kvTrackEvent } = renderLoanComments();
		await fireEvent.click(getAllByTestId('bp-comment-flag')[0]);

		expect(getByText('Report Comment')).toBeTruthy();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-flag-click', null, 1);
	});

	it('subscribe calls mutation and toggles to unsubscribe button', async () => {
		const {
			getByTestId, queryByTestId, mutate, kvTrackEvent
		} = renderLoanComments();
		await fireEvent.click(getByTestId('bp-comment-subscribe'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, subscribe: true },
			}),
		);
		expect(queryByTestId('bp-comment-subscribe')).toBeNull();
		expect(getByTestId('bp-comment-unsubscribe')).toBeTruthy();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-subscribe', null, 123);
	});

	it('unsubscribe calls mutation and toggles to subscribe button', async () => {
		const {
			getByTestId, queryByTestId, mutate, kvTrackEvent
		} = renderLoanComments({ isSubscribed: true });
		await fireEvent.click(getByTestId('bp-comment-unsubscribe'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, subscribe: false },
			}),
		);
		expect(queryByTestId('bp-comment-unsubscribe')).toBeNull();
		expect(getByTestId('bp-comment-subscribe')).toBeTruthy();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-unsubscribe', null, 123);
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

	describe('add-comment permission gating', () => {
		// Base response that on its own does NOT allow commenting: ended loan, not privileged,
		// not admin, not a trustee, no loans lent, not a borrower on this loan.
		const notAllowedResponse = {
			status: 'ended',
			isPrivileged: false,
			isAdmin: false,
			myTrusteeId: null,
			loanTrusteeId: null,
			loanCount: 0,
			borrowedLoanIds: [],
		};

		function renderWith(responseOverrides) {
			const mapped = applyMockData(mockApiComments, { ...notAllowedResponse, ...responseOverrides });
			return renderLoanComments(mapped);
		}

		it('hides the comment form when the user is not allowed to add a comment', () => {
			const { queryByTestId } = renderWith({});
			expect(queryByTestId('bp-comment-form-textarea')).toBeNull();
			expect(queryByTestId('bp-comment-form-submit')).toBeNull();
			// Subscribe controls remain available
			expect(queryByTestId('bp-comment-subscribe')).toBeTruthy();
		});

		it('shows the form when the loan is fundraising', () => {
			const { getByTestId } = renderWith({ status: 'fundraising' });
			expect(getByTestId('bp-comment-form-submit')).toBeTruthy();
		});

		it('shows the form for an admin', () => {
			const { getByTestId } = renderWith({ isAdmin: true });
			expect(getByTestId('bp-comment-form-submit')).toBeTruthy();
		});

		it('shows the form for a trustee (of any loan)', () => {
			const { getByTestId } = renderWith({ myTrusteeId: 55 });
			expect(getByTestId('bp-comment-form-submit')).toBeTruthy();
		});

		it('shows the form for the trustee of this loan', () => {
			const { getByTestId } = renderWith({ myTrusteeId: 55, loanTrusteeId: 55 });
			expect(getByTestId('bp-comment-form-submit')).toBeTruthy();
		});

		it('shows the form for a privileged user who has lent to at least one loan', () => {
			const { getByTestId } = renderWith({ isPrivileged: true, loanCount: 3 });
			expect(getByTestId('bp-comment-form-submit')).toBeTruthy();
		});

		it('hides the form for a privileged user who has not lent and is not the borrower', () => {
			const { queryByTestId } = renderWith({ isPrivileged: true, loanCount: 0 });
			expect(queryByTestId('bp-comment-form-submit')).toBeNull();
		});

		it('shows the form for the loan borrower even when they have not lent to any loan', () => {
			// loanId is 123; this loan is among the viewer's borrowed loans (not necessarily the most recent).
			const { getByTestId } = renderWith({ isPrivileged: true, loanCount: 0, borrowedLoanIds: [456, 123] });
			expect(getByTestId('bp-comment-form-submit')).toBeTruthy();
		});

		it('does not treat a privileged user who has not borrowed this loan as the borrower', () => {
			const { queryByTestId } = renderWith({ isPrivileged: true, loanCount: 0, borrowedLoanIds: [456, 789] });
			expect(queryByTestId('bp-comment-form-submit')).toBeNull();
		});
	});

	it('show all reveals spillover comments and tracks show-all then hide', async () => {
		const manyApiComments = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			author: { name: `User ${i}`, imageUrl: null, role: 'lender' },
			body: `Comment ${i}`,
			date: '2025-03-15T12:00:00Z',
		}));
		const mapped = applyMockData(manyApiComments);
		const {
			getByTestId, queryByText, kvTrackEvent
		} = renderLoanComments({ rawComments: mapped.rawComments });

		expect(queryByText('Comment 19')).toBeNull();

		await fireEvent.click(getByTestId('bp-comment-show-all'));
		expect(queryByText('Comment 19')).toBeTruthy();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-show-all', null, 123);

		await fireEvent.click(getByTestId('bp-comment-show-all'));
		expect(queryByText('Comment 19')).toBeNull();
		expect(kvTrackEvent).toHaveBeenCalledWith('borrower-profile', 'click', 'comment-hide', null, 123);
	});
});
