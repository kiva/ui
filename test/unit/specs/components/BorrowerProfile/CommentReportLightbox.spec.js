import { render, fireEvent } from '@testing-library/vue';
import LoanComments from '#src/components/BorrowerProfile/LoanComments';
import { globalOptions } from '../../../specUtils';

const stubs = {
	CommentReportLightbox: {
		template: `<div v-if="visible" data-testid="report-lightbox">
			<h2>Report Comment</h2>
			<h3>Why are you reporting this comment?</h3>
		</div>`,
		props: ['visible', 'loanId', 'commentId'],
		emits: ['close', 'reported'],
	},
};

function renderLoanCommentsWithReport(dataOverrides = {}) {
	const mockComments = [
		{
			id: 1,
			authorName: 'Sarah',
			authorImageUrl: 'https://example.com/img.jpg',
			authorRole: 'Lender',
			body: 'Great loan!',
			date: '2025-03-15T12:00:00Z',
			timeFlagged: null,
			isBorrower: false,
			isFlagged: false,
		},
		{
			id: 2,
			authorName: 'Aisha',
			authorImageUrl: null,
			authorRole: 'Borrower',
			body: 'Thank you!',
			date: '2025-03-16T12:00:00Z',
			timeFlagged: null,
			isBorrower: true,
			isFlagged: false,
		},
	];

	const Component = {
		...LoanComments,
		data() {
			return {
				...LoanComments.data.call(this),
				comments: mockComments,
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

	return render(Component, {
		global: {
			...globalOptions,
			stubs,
			provide: {
				...globalOptions.provide,
				apollo: {
					...globalOptions.provide.apollo,
					mutate: vi.fn(() => Promise.resolve({})),
				},
			},
			mocks: {
				...globalOptions.mocks,
				$showTipMsg: vi.fn(),
			},
		},
		props: { loanId: 123, isPrivileged: true, isAdmin: false },
	});
}

describe('CommentReportLightbox', () => {
	it('clicking flag as inappropriate opens the report lightbox', async () => {
		const { getAllByTestId, queryByTestId, getByText } = renderLoanCommentsWithReport();

		expect(queryByTestId('report-lightbox')).toBeNull();

		const flagButtons = getAllByTestId('bp-comment-flag');
		await fireEvent.click(flagButtons[0]);

		expect(queryByTestId('report-lightbox')).toBeTruthy();
		expect(getByText('Report Comment')).toBeTruthy();
		expect(getByText('Why are you reporting this comment?')).toBeTruthy();
	});
});
