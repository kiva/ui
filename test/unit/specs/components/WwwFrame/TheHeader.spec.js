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
	it('should display a search area', async () => {
		const user = userEvent.setup();
		const { queryByPlaceholderText } = render(
			TheHeader,
			{
				provide: {
					apollo: {
						readFragment: () => {},
						query: () => Promise.resolve({}),
						readQuery: () => {},
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

		// Expect the search bar to exist and be focused on click
		const searchBar = queryByPlaceholderText('Search all loans');
		await user.click(searchBar);
		expect(searchBar).toBe(document.activeElement);
	});
});
