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

const renderHeader = (props = {}, renderConfig = {}) => render(
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
				$renderConfig: renderConfig,
				$route: {
					path: '/',
				},
			},
		},
	},
);

// jsdom does not enumerate custom properties through CSSStyleDeclaration, so read the attribute.
const bridgedVars = queryByTestId => {
	const style = queryByTestId('basic-header').getAttribute('style') ?? '';
	return Object.fromEntries(
		style.split(';')
			.filter(declaration => declaration.includes(':'))
			.map(declaration => {
				const [name, ...value] = declaration.split(':');
				return [name.trim(), value.join(':').trim()];
			}),
	);
};

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

	// The ESI head emits --ui-data-* names; the header library reads unprefixed ones. The bridge
	// exists only while a CDN-cached shell is showing placeholder state, because that is the only
	// time the library binds display to those variables.
	describe('esiCssVarBridge', () => {
		it('should not bridge any variables when the page is not CDN cached', () => {
			const { queryByTestId } = renderHeader({}, { useCDNCaching: false });

			expect(bridgedVars(queryByTestId)).toEqual({});
		});

		it('should bridge the basket variable while only the basket is loading', () => {
			const { queryByTestId } = renderHeader({}, { useCDNCaching: true, cdnNotedLoggedIn: false });

			expect(bridgedVars(queryByTestId)).toMatchObject({
				'--basket-display': 'var(--ui-data-basket-count-display)',
			});
		});

		it('should bridge the user variables while the cached shell says logged in', () => {
			const { queryByTestId } = renderHeader({}, { useCDNCaching: true, cdnNotedLoggedIn: true });

			expect(bridgedVars(queryByTestId)).toEqual({
				'--basket-display': 'var(--ui-data-basket-count-display)',
				'--user-loading-display': 'var(--ui-data-user-loading-display)',
				'--user-avatar-display': 'var(--ui-data-user-avatar-display)',
				'--user-avatar-legacy-display': 'var(--ui-data-user-avatar-legacy-display)',
				'--user-avatar': 'var(--ui-data-user-avatar)',
			});
		});
	});
});
