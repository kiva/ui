import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import VueRouter from 'vue-router';
import TheHeader from '@/components/WwwFrame/TheHeader';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import CookieStore from '@/util/cookieStore';
import { MockKvAuth0 } from '@/util/KvAuth0';
import numeralFilter from '@/plugins/numeral-filter';

const emptyComponent = {
	template: '<div></div>',
};

describe('TheHeader', () => {
	it('should hide/show the search area when the search toggle button is clicked', async () => {
		const { getByText, findByPlaceholderText, queryByPlaceholderText } = render(
			TheHeader,
			{
				provide: {
					apollo: {
						readFragment: () => {},
						query: () => Promise.resolve({}),
					},
					cookieStore: new CookieStore(),
					kvAuth0: MockKvAuth0,
				},
				routes: new VueRouter(),
				// Stubbing out child components not used in this test
				stubs: {
					MonthlyGoodExpMenuWrapper: { ...emptyComponent },
					PromoBannerLarge: { ...emptyComponent },
					PromoBannerSmall: { ...emptyComponent },
					TheLendMenu: { ...emptyComponent },
				},
			},
			vue => {
				vue.use(kvAnalytics);
				vue.filter('numeral', numeralFilter);
			},
		);

		// Expect the search bar to not exist
		let searchBar = queryByPlaceholderText('Search all loans');
		expect(searchBar).toBeNull();

		// Click the search toggle button to open the search
		const searchToggle = getByText('Open Search');
		await userEvent.click(searchToggle);

		// Expect the search bar to exist and be focused
		searchBar = await findByPlaceholderText('Search all loans');
		expect(searchBar).toBe(document.activeElement);

		// Click the search toggle button again to close the search
		await userEvent.click(searchToggle);

		// Expect the search bar not to exist anymore
		searchBar = queryByPlaceholderText('Search all loans');
		expect(searchBar).toBeNull();
	});
});
