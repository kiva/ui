/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { flushPromises } from '@vue/test-utils';
/* eslint-enable import/no-extraneous-dependencies */
import CookieStore from '#src/util/cookieStore';
import apolloPlugin from '#src/plugins/apollo-plugin';
import MoreAboutLoan from '#src/components/BorrowerProfile/MoreAboutLoan';
import { toBeVisible } from '../../../specUtils';

const makeData = ({ loanAlertText = 'Partner alert text' } = {}) => ({
	lend: {
		loan: {
			id: 1,
			name: 'Arifa',
			sector: { id: 1, name: 'Retail' },
			partnerName: 'Karif Foundation',
			moreInfoAboutLoan: '<p>More info about this loan</p>',
			dualStatementNote: '',
			partner: { id: 2, loanAlertText },
		},
	},
});

function makeApollo(dataOptions) {
	const data = makeData(dataOptions);
	return {
		readFragment: () => {},
		readQuery: () => {},
		query: () => Promise.resolve({ data }),
		watchQuery: () => ({
			subscribe: ({ next }) => next({ data }),
			setVariables: () => {},
		}),
		mutate: () => Promise.resolve({}),
	};
}

function renderComponent(props = {}, dataOptions = {}) {
	return render(MoreAboutLoan, {
		global: {
			plugins: [apolloPlugin],
			provide: {
				apollo: makeApollo(dataOptions),
				cookieStore: new CookieStore(),
			},
			mocks: { $kvTrackEvent: () => {} },
		},
		props: { loanId: 1, ...props },
	});
}

describe('MoreAboutLoan', () => {
	let originalObserver;

	beforeEach(() => {
		// Without IntersectionObserver the lazy query runs immediately
		originalObserver = window.IntersectionObserver;
		delete window.IntersectionObserver;
	});

	afterEach(() => {
		window.IntersectionObserver = originalObserver;
	});

	it('shows the heading and content open when not collapsible', async () => {
		const { getByRole, queryByRole, findByText } = renderComponent();

		expect(getByRole('heading', { level: 2, name: 'More about this loan' })).toBeTruthy();
		expect(queryByRole('button')).toBeNull();
		expect(toBeVisible(await findByText('More info about this loan'))).toBe(true);
	});

	it('nests the partner block under its own heading when not collapsible', async () => {
		const { findByRole, getByText } = renderComponent();

		expect(await findByRole('heading', { level: 3, name: 'About Karif Foundation:' })).toBeTruthy();
		expect(toBeVisible(getByText('Partner alert text'))).toBe(true);
	});

	describe('when collapsible', () => {
		it('shows the loan and the partner as separate collapsed rows', async () => {
			const { findByRole, getByRole, findByText } = renderComponent({ collapsible: true });

			const loanRow = getByRole('button', { name: /More about this loan/ });
			const partnerRow = await findByRole('button', { name: 'About Karif Foundation' });
			expect(loanRow.getAttribute('aria-expanded')).toBe('false');
			expect(partnerRow.getAttribute('aria-expanded')).toBe('false');
			expect(toBeVisible(await findByText('More info about this loan'))).toBe(false);
			expect(toBeVisible(await findByText('Partner alert text'))).toBe(false);
		});

		it('keeps the partner text out of the loan row', async () => {
			const user = userEvent.setup();
			const { getByRole, findByText } = renderComponent({ collapsible: true });
			await flushPromises();

			await user.click(getByRole('button', { name: /More about this loan/ }));

			expect(toBeVisible(await findByText('More info about this loan'))).toBe(true);
			expect(toBeVisible(await findByText('Partner alert text'))).toBe(false);
		});

		it('opens the partner row on its own', async () => {
			const user = userEvent.setup();
			const { findByRole, findByText } = renderComponent({ collapsible: true });

			await user.click(await findByRole('button', { name: 'About Karif Foundation' }));

			expect(toBeVisible(await findByText('Partner alert text'))).toBe(true);
			expect(toBeVisible(await findByText('More info about this loan'))).toBe(false);
		});

		it('shows no partner row when the partner has no alert text', async () => {
			const { queryByRole } = renderComponent({ collapsible: true }, { loanAlertText: '' });
			await flushPromises();

			expect(queryByRole('button', { name: /About Karif Foundation/ })).toBeNull();
		});
	});
});
