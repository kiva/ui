/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import { render } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
/* eslint-enable import/no-extraneous-dependencies */
import CookieStore from '#src/util/cookieStore';
import apolloPlugin from '#src/plugins/apollo-plugin';
import ContributingPartners from '#src/components/BorrowerProfile/ContributingPartners';

const capitalOne = {
	managedAccountId: 203995508, displayName: 'Capital One', ratio: 3, logo: null
};
const tripadvisor = {
	managedAccountId: 204181523, displayName: 'the Tripadvisor Foundation', ratio: 1, logo: null
};

function makeApollo({ simultaneousMatching = [], status = 'fundraising', multiMatchingEnabled = true } = {}) {
	const data = {
		general: {
			multiMatchingEnabled: { key: 'multiMatchingEnabled', value: String(multiMatchingEnabled) },
		},
		lend: {
			loan: { id: 1, status, simultaneousMatching },
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

function renderComponent(apolloOptions = {}) {
	return render(ContributingPartners, {
		global: {
			plugins: [apolloPlugin],
			directives: { kvTrackEvent: () => {} },
			provide: {
				apollo: makeApollo(apolloOptions),
				cookieStore: new CookieStore(),
			},
			mocks: {
				$kvTrackEvent: () => {},
				$renderConfig: {},
				$route: { query: {} },
			},
		},
		props: { loanId: 1 },
	});
}

describe('ContributingPartners', () => {
	describe('section visibility', () => {
		it('shows the section when the flag is on and matchers are present', async () => {
			const { findByText } = renderComponent({ simultaneousMatching: [capitalOne] });
			await findByText('Contributing partners');
		});

		it('hides the section when multiMatchingEnabled is false', async () => {
			const { queryByText } = renderComponent({
				simultaneousMatching: [capitalOne],
				multiMatchingEnabled: false,
			});
			await flushPromises();
			expect(queryByText('Contributing partners')).toBeNull();
		});

		it('hides the section when simultaneousMatching is empty', async () => {
			const { queryByText } = renderComponent({ simultaneousMatching: [] });
			await flushPromises();
			expect(queryByText('Contributing partners')).toBeNull();
		});

		it('hides the section when the loan is not fundraising', async () => {
			const { queryByText } = renderComponent({
				simultaneousMatching: [capitalOne],
				status: 'funded',
			});
			await flushPromises();
			expect(queryByText('Contributing partners')).toBeNull();
		});
	});

	describe('ratio display', () => {
		it('displays the correct ratio for each partner', async () => {
			const { findByText } = renderComponent({ simultaneousMatching: [capitalOne, tripadvisor] });
			// Capital One ratio=3 → 4X MATCHING
			await findByText('4X MATCHING');
			// Tripadvisor ratio=1 → 2X MATCHING
			await findByText('2X MATCHING');
		});

		it('handles null ratio safely (displays 1X)', async () => {
			const { findByText } = renderComponent({
				simultaneousMatching: [{
					managedAccountId: 1, displayName: 'Test Partner', ratio: null, logo: null
				}],
			});
			await findByText('1X MATCHING');
		});
	});

	describe('partner name display', () => {
		it('displays the partner displayName', async () => {
			const { findByText } = renderComponent({ simultaneousMatching: [capitalOne] });
			await findByText('Capital One');
		});

		it('shows "A Kiva supporter" when displayName is null', async () => {
			const { findByText } = renderComponent({
				simultaneousMatching: [{
					managedAccountId: 1, displayName: null, ratio: 1, logo: null
				}],
			});
			await findByText('A Kiva supporter');
		});
	});

	describe('partner logo', () => {
		it('renders an image when logo url is provided', async () => {
			const { findByAltText } = renderComponent({
				simultaneousMatching: [{
					managedAccountId: 1,
					displayName: 'Visa',
					ratio: 1,
					logo: { id: 10, url: 'https://example.com/visa.png' },
				}],
			});
			const img = await findByAltText('Image of lender', { hidden: true });
			expect(img.src).toBe('https://example.com/visa.png');
		});

		it('renders a letter avatar when logo is null', async () => {
			const { findByText } = renderComponent({ simultaneousMatching: [capitalOne] });
			// KvUserAvatar shows first letter of displayName
			await findByText('C');
		});
	});
});
