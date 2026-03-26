import { render, fireEvent } from '@testing-library/vue';
import LoanBookmark from '#src/components/BorrowerProfile/LoanBookmark';
import bookmarkLoan from '#src/util/bookmarkUtil';
import { globalOptions } from '../../../specUtils';

vi.mock('#src/util/bookmarkUtil', () => ({
	default: vi.fn(() => Promise.resolve({})),
}));

function renderLoanBookmark(dataOverrides = {}) {
	const mutate = vi.fn(() => Promise.resolve({}));
	const Component = {
		...LoanBookmark,
		data() {
			return {
				...LoanBookmark.data.call(this),
				isLoading: false,
				isBookmarked: false,
				...dataOverrides,
			};
		},
		apollo: undefined,
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
			props: { loanId: 123 },
		}),
		mutate,
	};
}

describe('LoanBookmark', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('click bookmark calls favorite mutation', async () => {
		const { getByRole } = renderLoanBookmark();
		const button = getByRole('button');

		await fireEvent.click(button);

		expect(bookmarkLoan).toHaveBeenCalledWith(
			expect.objectContaining({ mutate: expect.any(Function) }),
			123,
			true,
		);
	});

	it('bookmarked state shows filled icon and "Saved" text', () => {
		const { getByText } = renderLoanBookmark({ isBookmarked: true });

		expect(getByText('Saved')).toBeTruthy();
	});
});
