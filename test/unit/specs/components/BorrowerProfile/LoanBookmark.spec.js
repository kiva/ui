import { render, fireEvent } from '@testing-library/vue';
import bookmarkLoan from '#src/util/bookmarkUtil';
import LoanBookmark from '#src/components/BorrowerProfile/LoanBookmark';
import { globalOptions } from '../../../specUtils';

vi.mock('#src/util/bookmarkUtil', () => ({
	default: vi.fn(() => Promise.resolve({})),
}));

function renderLoanBookmark() {
	const mutate = vi.fn(() => Promise.resolve({}));
	const Component = {
		...LoanBookmark,
		data() {
			return {
				...LoanBookmark.data.call(this),
				isLoading: false,
				isBookmarked: false,
			};
		},
		apollo: undefined,
	};

	return render(Component, {
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
		props: { loanId: 123 },
	});
}

describe('LoanBookmark', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('click bookmark calls favorite mutation', async () => {
		const { getByRole } = renderLoanBookmark();
		await fireEvent.click(getByRole('button'));

		expect(bookmarkLoan).toHaveBeenCalledWith(
			expect.objectContaining({ mutate: expect.any(Function) }),
			123,
			true,
		);
	});
});
