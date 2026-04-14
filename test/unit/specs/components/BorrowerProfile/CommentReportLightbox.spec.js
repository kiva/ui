import { nextTick } from 'vue';
import { render, fireEvent } from '@testing-library/vue';
import LoanComments from '#src/components/BorrowerProfile/LoanComments';
import CommentReportLightbox from '#src/components/BorrowerProfile/CommentReportLightbox';
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
		props: { loanId: 123, isPrivileged: true },
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

describe('CommentReportLightbox direct submit behaviour', () => {
	it('calls apollo.mutate with loanId, commentId, and the selected reason', async () => {
		const mutate = vi.fn(() => Promise.resolve({ data: { loan: { flagComment: true } } }));
		const Component = { ...CommentReportLightbox, apollo: undefined };

		const { getByLabelText, getByText } = render(Component, {
			props: { visible: true, loanId: 42, commentId: 7 },
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, mutate },
				},
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: vi.fn(),
				},
			},
		});

		await fireEvent.click(getByLabelText('I find it offensive'));
		await fireEvent.click(getByText('Submit report'));
		await nextTick();
		await nextTick();

		expect(mutate).toHaveBeenCalledTimes(1);
		const callArg = mutate.mock.calls[0][0];
		expect(callArg.variables).toEqual({
			loanId: 42,
			commentId: 7,
			description: 'I find it offensive',
		});
	});

	it("emits 'reported' and 'close' after a successful mutation", async () => {
		const mutate = vi.fn(() => Promise.resolve({ data: { loan: { flagComment: true } } }));
		const Component = { ...CommentReportLightbox, apollo: undefined };

		const { getByLabelText, getByText, emitted } = render(Component, {
			props: { visible: true, loanId: 42, commentId: 7 },
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, mutate },
				},
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: vi.fn(),
				},
			},
		});

		await fireEvent.click(getByLabelText("It's spam or misleading"));
		await fireEvent.click(getByText('Submit report'));
		await nextTick();
		await nextTick();

		expect(emitted().reported).toBeTruthy();
		expect(emitted().reported[0]).toEqual([7]);
		expect(emitted().close).toBeTruthy();
	});

	it('shows an error tip and does not emit reported when the mutation rejects', async () => {
		const mutate = vi.fn(() => Promise.reject(new Error('boom')));
		const showTipMsg = vi.fn();
		const Component = { ...CommentReportLightbox, apollo: undefined };

		const { getByLabelText, getByText, emitted } = render(Component, {
			props: { visible: true, loanId: 42, commentId: 7 },
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, mutate },
				},
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: showTipMsg,
				},
			},
		});

		await fireEvent.click(getByLabelText('I find it offensive'));
		await fireEvent.click(getByText('Submit report'));
		await nextTick();
		await nextTick();

		expect(showTipMsg).toHaveBeenCalledWith(expect.any(String), 'error');
		expect(emitted().reported).toBeFalsy();
	});

	it('does not call mutate a second time while a submission is in flight', async () => {
		// Create a mutate mock whose promise never resolves, so the component
		// stays in the isSubmitting state for the entire test.
		let resolveMutate;
		const mutate = vi.fn(() => new Promise(resolve => {
			resolveMutate = resolve;
		}));
		const Component = { ...CommentReportLightbox, apollo: undefined };

		const { getByLabelText, getByText } = render(Component, {
			props: { visible: true, loanId: 42, commentId: 7 },
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, mutate },
				},
				mocks: {
					...globalOptions.mocks,
					$showTipMsg: vi.fn(),
				},
			},
		});

		await fireEvent.click(getByLabelText('I find it offensive'));
		await fireEvent.click(getByText('Submit report'));
		await nextTick();

		// Second click while the first mutation is still pending.
		await fireEvent.click(getByText('Submit report'));
		await nextTick();

		expect(mutate).toHaveBeenCalledTimes(1);

		// Clean up the pending promise so Vitest doesn't hold the worker open.
		resolveMutate({ data: { loan: { flagComment: true } } });
		await nextTick();
	});
});
