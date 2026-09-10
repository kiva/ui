import { render, waitFor } from '@testing-library/vue';
import TheHeader from '#src/components/WwwFrame/TheHeader';
import CookieStore from '#src/util/cookieStore';

import { emptyComponent, globalOptions } from '../../../specUtils';

// Stand-in for the external @kiva/kv-components header. It is stubbed rather than
// rendered so the spec asserts *which* header the component chose, not the
// internals of a released library component. The two methods exist because
// TheHeader's `loadMenu()` / `loadSearchData()` call them through `$refs`, and
// `loadSearchData()` fires on mount whenever the basic header is shown.
const KvWwwHeaderBasicStub = {
	name: 'KvWwwHeaderBasic',
	props: {
		useEsiAvatar: {
			type: Boolean,
			default: false,
		},
		showMajorGiftsExp: {
			type: Boolean,
			default: false,
		},
	},
	template: `<div
		data-testid="basic-header"
		:data-use-esi-avatar="useEsiAvatar"
		:data-show-major-gifts-exp="showMajorGiftsExp"
	></div>`,
	methods: {
		loadMenuData() {},
		loadSearchSuggestions() {},
	},
};

const renderHeader = (props = {}, renderConfig = {}, {
	apollo = globalOptions.provide.apollo,
	cookieStore = globalOptions.provide.cookieStore,
	$kvTrackEvent = globalOptions.mocks.$kvTrackEvent,
} = {}) => render(
	TheHeader,
	{
		props,
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				apollo,
				cookieStore,
			},
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
				$kvTrackEvent,
				$renderConfig: renderConfig,
				$route: {
					path: '/',
				},
			},
		},
	},
);

const MAJOR_GIFTS_EXP_KEY = 'major_gifts_header';

// Passing request cookies keeps the assignment on the instance instead of jsdom's shared
// document.cookie, so one spec's assignment can't leak into the next.
const cookieStoreAssigning = version => new CookieStore({
	uiab: `${MAJOR_GIFTS_EXP_KEY}:${version}:123456:1:false`,
});

// The resolver writes the assignment into the cache, so `readFragment` finds nothing until `query`
// has resolved. That ordering is the point: it is what an unassigned visitor sees, and
// `trackExperimentVersion` reads the fragment rather than the query result.
const apolloAssigning = version => {
	const cache = new Map();
	return {
		...globalOptions.provide.apollo,
		query: vi.fn(({ variables }) => {
			const experiment = { id: variables.id, version };
			cache.set(`Experiment:${variables.id}`, experiment);
			return Promise.resolve({ data: { experiment } });
		}),
		readFragment: ({ id }) => cache.get(id) ?? null,
	};
};

const majorGiftsEnabled = queryByTestId => queryByTestId('basic-header').dataset.showMajorGiftsExp;

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

	// `ui` is the only host whose ESI emits the avatar URL, so the opt-in lives here rather than
	// in the library default.
	it('should opt the basic header into the ESI avatar', () => {
		const { queryByTestId } = renderHeader();

		expect(queryByTestId('basic-header').dataset.useEsiAvatar).toBe('true');
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

	// Stickiness is decided by the frame and applied here, so both frames pin the same element.
	describe('stickyHeader', () => {
		it('should not pin the header by default', () => {
			const { container } = renderHeader();

			expect(container.querySelector('header').className).not.toContain('tw-sticky');
		});

		it('should pin the header when stickyHeader is set', () => {
			const { container } = renderHeader({ stickyHeader: true });

			expect(container.querySelector('header').className).toContain('tw-sticky');
		});

		it('should pin the corporate header when stickyHeader is set', () => {
			const { container } = renderHeader({ corporate: true, stickyHeader: true });

			expect(container.querySelector('header').className).toContain('tw-sticky');
		});
	});

	// The assignment is made client-side, so an unassigned visitor is resolved after mount rather
	// than during SSR. Version b adds the Major gifts nav link and relabels "Support Kiva" as "Give".
	describe('major gifts header experiment', () => {
		it('should leave the major gifts state off for an unassigned visitor', async () => {
			const { queryByTestId } = renderHeader();

			await waitFor(() => expect(majorGiftsEnabled(queryByTestId)).toBe('false'));
		});

		// Nothing reads the assignment before mount. The stored assignment reaches the header
		// through the query's own cache-first lookup and the resolver's cookie read, so a first
		// render that consulted the cookie itself would only risk putting a per-visitor value into
		// server-rendered markup that a CDN can share.
		it('should ignore the stored assignment until the query resolves', async () => {
			const { queryByTestId } = renderHeader({}, {}, {
				apollo: apolloAssigning('b'),
				cookieStore: cookieStoreAssigning('b'),
			});

			expect(majorGiftsEnabled(queryByTestId)).toBe('false');
			await waitFor(() => expect(majorGiftsEnabled(queryByTestId)).toBe('true'));
		});

		it('should turn the major gifts state on once the client-side assignment resolves to version b', async () => {
			const { queryByTestId } = renderHeader({}, {}, { apollo: apolloAssigning('b') });

			expect(majorGiftsEnabled(queryByTestId)).toBe('false');
			await waitFor(() => expect(majorGiftsEnabled(queryByTestId)).toBe('true'));
		});

		it('should leave the major gifts state off when the assignment resolves to the control', async () => {
			const apollo = apolloAssigning('a');
			const { queryByTestId } = renderHeader({}, {}, { apollo });

			await waitFor(() => expect(apollo.query).toHaveBeenCalled());
			expect(majorGiftsEnabled(queryByTestId)).toBe('false');
		});

		it('should track the resolved assignment against the parent ticket', async () => {
			const $kvTrackEvent = vi.fn();
			renderHeader({}, {}, { apollo: apolloAssigning('b'), $kvTrackEvent });

			await waitFor(() => expect($kvTrackEvent).toHaveBeenCalledWith(
				'event-tracking',
				'EXP-CIT-5148-Sept2026',
				'b',
				undefined,
			));
		});
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
