import { render } from '@testing-library/vue';
import TheHeader from '#src/components/WwwFrame/TheHeader';

import { emptyComponent, globalOptions } from '../../../specUtils';

// Stand-in for the external @kiva/kv-components header. It is stubbed rather than
// rendered so the spec asserts *which* header the component chose, not the
// internals of a released library component. The two methods exist because
// TheHeader's `loadMenu()` / `loadSearchData()` call them through `$refs`, and
// `loadSearchData()` fires on mount whenever the basic header is shown.
const KvWwwHeaderBasicStub = {
	name: 'KvWwwHeaderBasic',
	template: '<div data-testid="basic-header"></div>',
	methods: {
		loadMenuData() {},
		loadSearchSuggestions() {},
	},
};

const renderHeader = (props = {}) => render(
	TheHeader,
	{
		props,
		global: {
			...globalOptions,
			stubs: {
				KvWwwHeaderBasic: KvWwwHeaderBasicStub,
				MonthlyGoodExpMenuWrapper: { ...emptyComponent },
				PromoBannerLarge: { ...emptyComponent },
				PromoBannerSmall: { ...emptyComponent },
				TheLendMenu: { ...emptyComponent },
				RouterLink: { ...emptyComponent },
			},
			mocks: {
				...globalOptions.mocks,
				$route: {
					path: '/',
				},
			},
		},
	},
);

describe('TheHeader', () => {
	it('should render the basic header by default', () => {
		const { queryByTestId, container } = renderHeader();

		expect(queryByTestId('basic-header')).not.toBeNull();
		expect(container.querySelector('nav[aria-label="Primary navigation"]')).toBeNull();
	});

	it('should render the minimal header instead of the basic header when minimal', () => {
		const { queryByTestId, container } = renderHeader({ minimal: true });

		expect(queryByTestId('basic-header')).toBeNull();
		expect(container.querySelector('nav[aria-label="Primary navigation"]')).not.toBeNull();
		expect(queryByTestId('header-home')).not.toBeNull();
	});

	it('should render the corporate header instead of the basic header when corporate', () => {
		const { queryByTestId, container } = renderHeader({ corporate: true });

		expect(queryByTestId('basic-header')).toBeNull();
		expect(container.querySelector('nav[aria-label="Primary navigation"]')).not.toBeNull();
		expect(queryByTestId('header-basket')).not.toBeNull();
	});
});
