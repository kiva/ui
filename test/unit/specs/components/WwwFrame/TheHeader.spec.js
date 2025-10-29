import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import TheHeader from '../../../../../src/components/WwwFrame/TheHeader';

import { emptyComponent, globalOptions } from '../../../specUtils';

describe('TheHeader', () => {
	it('should display a search area', async () => {
		const user = userEvent.setup();
		const { queryByPlaceholderText } = render(
			TheHeader,
			{
				global: {
					...globalOptions,
					// Stubbing out child components not used in this test
					stubs: {
						MonthlyGoodExpMenuWrapper: { ...emptyComponent },
						PromoBannerLarge: { ...emptyComponent },
						PromoBannerSmall: { ...emptyComponent },
						TheLendMenu: { ...emptyComponent },
						RouterLink: { ...emptyComponent },
					},
					mocks: {
						...globalOptions.mocks,
						$route: {
							path: '/'
						},
					}
				},
			},
		);

		// Expect the search bar to exist and be focused on click
		const searchBar = queryByPlaceholderText('Search all loans');
		await user.click(searchBar);
		expect(searchBar).toBe(document.activeElement);
	});
});
