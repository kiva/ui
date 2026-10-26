/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { flushPromises } from '@vue/test-utils';
/* eslint-enable import/no-extraneous-dependencies */
import CookieStore from '#src/util/cookieStore';
import apolloPlugin from '#src/plugins/apollo-plugin';
import LendersAndTeams from '#src/components/BorrowerProfile/LendersAndTeams';
import { toBeVisible } from '../../../specUtils';

const lender = id => ({
	id,
	name: `Lender ${id}`,
	publicId: `lender${id}`,
	lenderPage: { whereabouts: 'Oakland, CA' },
	image: { id, hash: '' },
});

function makeApollo({ totalCount = 2, values = [lender(1), lender(2)] } = {}) {
	const data = {
		lend: {
			loan: {
				id: 1,
				userProperties: { lentTo: false },
				lenders: { totalCount, values },
				teams: { totalCount, values: [] },
			},
		},
	};
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

function renderComponent({ apolloOptions = {}, props = {} } = {}) {
	return render(LendersAndTeams, {
		global: {
			plugins: [apolloPlugin],
			directives: { kvTrackEvent: () => {} },
			provide: {
				apollo: makeApollo(apolloOptions),
				cookieStore: new CookieStore(),
			},
			mocks: {
				$kvTrackEvent: () => {},
			},
			stubs: { SupporterDetails: { props: ['name'], template: '<div>{{ name }}</div>' } },
		},
		props: { loanId: 1, displayType: 'lenders', ...props },
	});
}

describe('LendersAndTeams', () => {
	let originalObserver;

	beforeEach(() => {
		// Without IntersectionObserver the lazy query runs immediately
		originalObserver = window.IntersectionObserver;
		delete window.IntersectionObserver;
	});

	afterEach(() => {
		window.IntersectionObserver = originalObserver;
	});

	describe('when collapsible', () => {
		it('shows a collapsed row with the powered by subtitle', async () => {
			const { getByRole, getByTestId } = renderComponent({ props: { collapsible: true } });
			await flushPromises();

			const button = getByRole('button', { name: /Contributing lenders/ });
			expect(button.getAttribute('aria-expanded')).toBe('false');
			expect(button.textContent).toContain('Powered by 2 lenders');
			expect(toBeVisible(getByTestId('bp-lenders-grid'))).toBe(false);
		});

		it('shows the lenders once opened', async () => {
			const user = userEvent.setup();
			const { getByRole, getByTestId } = renderComponent({ props: { collapsible: true } });
			await flushPromises();

			await user.click(getByRole('button', { name: /Contributing lenders/ }));

			expect(toBeVisible(getByTestId('bp-lenders-grid'))).toBe(true);
		});

		it('opens the see all lightbox from inside the opened row', async () => {
			const user = userEvent.setup();
			const values = Array.from({ length: 8 }, (_, i) => lender(i + 1));
			const { getByRole, getByTestId, findByRole } = renderComponent({
				apolloOptions: { totalCount: 8, values },
				props: { collapsible: true },
			});
			await flushPromises();

			await user.click(getByRole('button', { name: /Contributing lenders/ }));
			const seeAll = getByTestId('bp-lenders-see-all-link');
			expect(toBeVisible(seeAll)).toBe(true);
			await user.click(seeAll);

			expect(await findByRole('dialog')).toBeTruthy();
		});

		it('uses a distinct toggle id per display type', async () => {
			const { getByRole } = renderComponent({ props: { collapsible: true, displayType: 'teams' } });
			await flushPromises();

			expect(getByRole('button', { name: /Contributing lending teams/ }).getAttribute('aria-controls'))
				.toBe('kv-accordion-bp-teams');
		});

		it('asks to hide the section when there are no supporters', async () => {
			const { emitted } = renderComponent({
				apolloOptions: { totalCount: 0, values: [] },
				props: { collapsible: true },
			});
			await flushPromises();

			expect(emitted()['hide-section']).toBeTruthy();
		});
	});

	describe('when not collapsible', () => {
		it('shows the heading and powered by line with no toggle', async () => {
			const {
				getByRole, queryByRole, getByTestId,
			} = renderComponent();
			await flushPromises();

			expect(getByRole('heading', { level: 2, name: 'Contributing lenders' })).toBeTruthy();
			expect(queryByRole('button', { name: /Contributing lenders/ })).toBeNull();
			expect(getByTestId('bp-powered-by-lenders-message').textContent.trim()).toBe('powered by 2 lenders');
			expect(toBeVisible(getByTestId('bp-lenders-grid'))).toBe(true);
		});
	});
});
