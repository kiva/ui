import { render, fireEvent } from '@testing-library/vue';
import LoanComments from '#src/components/BorrowerProfile/LoanComments';
import { globalOptions } from '../../../specUtils';

const mockComments = [
	{
		id: 1,
		authorName: 'Sarah',
		authorImageUrl: 'https://example.com/img.jpg',
		authorRole: 'Lender',
		body: 'Great loan!',
		date: '2025-03-15T12:00:00Z',
		timeFlagged: null,
	},
	{
		id: 2,
		authorName: 'Aisha',
		authorImageUrl: null,
		authorRole: 'Borrower',
		body: 'Thank you!',
		date: '2025-03-16T12:00:00Z',
		timeFlagged: null,
	},
];

function renderLoanComments(dataOverrides = {}, propsOverrides = {}) {
	const mutate = vi.fn(() => Promise.resolve({ data: { loan: { postComment: { id: 99 } } } }));
	const Component = {
		...LoanComments,
		data() {
			return {
				...LoanComments.data.call(this),
				comments: mockComments.map(c => ({
					...c,
					isBorrower: c.authorRole === 'Borrower',
					isFlagged: !!c.timeFlagged,
				})),
				isLoggedIn: true,
				lentTo: true,
				isSubscribed: false,
				...dataOverrides,
			};
		},
		mounted() {
			// Skip loadComments in tests
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
					},
				},
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: vi.fn(),
				},
			},
			props: {
				loanId: 123, isPrivileged: true, isAdmin: false, ...propsOverrides
			},
		}),
		mutate,
	};
}

describe('LoanComments', () => {
	it('submit comment calls post mutation', async () => {
		const { getByTestId, mutate } = renderLoanComments();
		const textarea = getByTestId('bp-comment-form-textarea');
		await fireEvent.update(textarea, 'New comment text');
		await fireEvent.click(getByTestId('bp-comment-form-submit'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123, body: 'New comment text' },
			}),
		);
	});

	it('delete comment opens confirmation lightbox then calls mutation', async () => {
		const { getAllByTestId, getByText, mutate } = renderLoanComments({}, { isAdmin: true });
		const deleteButtons = getAllByTestId('bp-comment-delete');
		await fireEvent.click(deleteButtons[0]);

		// Confirmation lightbox should be visible
		expect(getByText('Delete this comment?')).toBeTruthy();

		// Confirm the delete
		await fireEvent.click(getByText('Delete comment'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { commentId: 1 },
			}),
		);
	});

	it('flag comment opens report lightbox', async () => {
		const { getAllByTestId, getByText } = renderLoanComments();
		const flagButtons = getAllByTestId('bp-comment-flag');
		await fireEvent.click(flagButtons[0]);

		// Report lightbox should be visible
		expect(getByText('Report Comment')).toBeTruthy();
	});

	it('subscribe calls subscribe mutation', async () => {
		const { getByTestId, mutate } = renderLoanComments();
		await fireEvent.click(getByTestId('bp-comment-subscribe'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123 },
			}),
		);
	});

	it('unsubscribe calls unsubscribe mutation', async () => {
		const { getByTestId, mutate } = renderLoanComments({ isSubscribed: true });
		await fireEvent.click(getByTestId('bp-comment-unsubscribe'));

		expect(mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: { loanId: 123 },
			}),
		);
	});

	it('show all reveals spillover comments', async () => {
		const manyComments = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			authorName: `User ${i}`,
			authorImageUrl: null,
			authorRole: 'Lender',
			body: `Comment ${i}`,
			date: '2025-03-15T12:00:00Z',
			timeFlagged: null,
			isBorrower: false,
			isFlagged: false,
		}));
		const { getByTestId, queryByText } = renderLoanComments({ comments: manyComments });

		// Initially only 15 visible
		expect(queryByText('Comment 19')).toBeNull();

		await fireEvent.click(getByTestId('bp-comment-show-all'));
		expect(queryByText('Comment 19')).toBeTruthy();
	});
});
