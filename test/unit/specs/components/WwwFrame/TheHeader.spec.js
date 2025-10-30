import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import TheHeader from '#src/components/WwwFrame/TheHeader';
import CookieStore from '#src/util/cookieStore';
import {
	createStubComponent,
	createGlobalConfig,
	createMockApollo,
	commonStubs
} from '../../../helpers/componentTestHelpers';

describe('TheHeader', () => {
	const renderComponent = (options = {}) => {
		const apollo = createMockApollo();
		const cookieStore = new CookieStore();

		return render(TheHeader, {
			global: {
				...createGlobalConfig({
					mocks: {
						$route: { path: '/' },
						$renderConfig: { useCDNCaching: false },
						$filters: {
							numeral: (val, format) => {
								if (format === '$0') return `$${Math.floor(val)}`;
								return String(val);
							}
						},
						...options.mocks
					},
					provide: {
						apollo,
						cookieStore,
						...options.provide
					}
				}),
				stubs: {
					MonthlyGoodExpMenuWrapper: createStubComponent('MonthlyGoodExpMenuWrapper'),
					PromoBannerLarge: createStubComponent('PromoBannerLarge'),
					PromoBannerSmall: createStubComponent('PromoBannerSmall'),
					TheLendMenu: createStubComponent('TheLendMenu'),
					RouterLink: commonStubs.RouterLink,
					...options.stubs
				}
			}
		});
	};

	it('should display a search area', async () => {
		const user = userEvent.setup();
		const { queryByPlaceholderText } = renderComponent();

		// Expect the search bar to exist and be focused on click
		const searchBar = queryByPlaceholderText('Search all loans');
		await user.click(searchBar);
		expect(searchBar).toBe(document.activeElement);
	});
});
