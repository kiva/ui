import {
	globalPromoSetting,
	filterForPromoBanner,
	showBannerForPromo,
	activePromoBanner,
	inactivePromoBanners,
	globalBannerDenyList
} from '../../../../src/util/globalPromoBanner';
import { add, sub } from 'date-fns';

const oneYearAgo = sub(new Date(), { years: 1 }).toISOString();
const oneYearFromNow = add(new Date(), { years: 1 }).toISOString();

function makeBanner(fields = {}) {
	const {
		active = true,
		startDate = oneYearAgo,
		endDate = oneYearFromNow,
		hiddenUrls = [],
		visibleUrls = [],
		showForPromo = false,
	} = fields;

	return {
		sys: { contentType: { sys: { id: 'globalPromoBanner' } } },
		fields: {
			active,
			startDate,
			endDate,
			hiddenUrls,
			visibleUrls,
			showForPromo,
		}
	};
}

function makeUiGlobalPromoSetting(fields = {}) {
	const {
		active = true,
		startDate = oneYearAgo,
		endDate = oneYearFromNow,
		content = []
	} = fields;

	return {
		fields: {
			key: 'ui-global-promo',
			active,
			startDate,
			endDate,
			content,
		}
	};
}

function makeData(items = []) {
	return {
		contentful: {
			entries: {
				items,
			},
		},
	};
}

describe('globalPromoBanner', () => {
	describe('globalPromoSetting', () => {
		it('returns the ui-global-promo setting if active and within date', () => {
			const setting = makeUiGlobalPromoSetting();
			const data = makeData([
				setting,
				{ fields: { key: 'other' } },
			]);
			expect(globalPromoSetting(data)).toEqual(setting);
		});

		it('returns undefined if today is not in the ui-global-promo entry date range', () => {
			const startDate = add(new Date(), { days: 1 }).toISOString();
			const setting = makeUiGlobalPromoSetting({ startDate });
			const data = makeData([setting]);
			expect(globalPromoSetting(data)).toBeUndefined();
		});

		it('returns undefined if the ui-global-promo entry is not active', () => {
			const setting = makeUiGlobalPromoSetting({ active: false });
			const data = makeData([setting]);
			expect(globalPromoSetting(data)).toBeUndefined();
		});

		it('returns undefined if there is no ui-global-promo entry', () => {
			const data = makeData();
			expect(globalPromoSetting(data)).toBeUndefined();
		});

		it('returns undefined if data or content is undefined', () => {
			expect(globalPromoSetting()).toBeUndefined();
			expect(globalPromoSetting(null)).toBeUndefined();
			expect(globalPromoSetting({ contentful: {} })).toBeUndefined();
		});
	});

	describe('filterForPromoBanner', () => {
		it('returns false if not globalPromoBanner type', () => {
			const promoContent = { sys: { contentType: { sys: { id: 'notGlobalPromoBanner' } } } };
			expect(filterForPromoBanner(promoContent, '/foo')).toBe(false);
		});

		it('returns false if path is in hiddenUrls', () => {
			const promoContent = makeBanner({ hiddenUrls: ['/foo'], visibleUrls: [] });
			expect(filterForPromoBanner(promoContent, '/foo')).toBe(false);
		});

		it('returns true for valid globalPromoBanner', () => {
			const promoContent = makeBanner({ hiddenUrls: [], visibleUrls: [] });
			expect(filterForPromoBanner(promoContent, '/bar')).toBe(true);
		});

		it('returns true for valid globalPromoBanner missing hiddenUrls and visibleUrls', () => {
			const promoContent = makeBanner({ hiddenUrls: null, visibleUrls: null });
			expect(filterForPromoBanner(promoContent, '/bar')).toBe(true);
		});

		it('returns false if path is in default deny list', () => {
			const promoContent = makeBanner({ hiddenUrls: [] });
			// '/checkout' is always in the deny list
			expect(filterForPromoBanner(promoContent, '/checkout')).toBe(false);
		});
	});

	describe('showBannerForPromo', () => {
		it('returns true if showForPromo is true', () => {
			const banner = { fields: { showForPromo: true } };
			expect(showBannerForPromo(banner)).toBe(true);
		});

		it('returns false if showForPromo is false or missing', () => {
			expect(showBannerForPromo({ fields: { showForPromo: false } })).toBe(false);
			expect(showBannerForPromo({})).toBe(false);
		});

		it('returns false if banner is missing', () => {
			expect(showBannerForPromo(null)).toBe(false);
			expect(showBannerForPromo()).toBe(false);
		});
	});

	describe('activePromoBanner', () => {
		it('returns the first active promo banner', () => {
			const activeBanner1 = makeBanner();
			const activeBanner2 = makeBanner();
			const inactiveBanner1 = makeBanner({ active: false });
			const inactiveBanner2 = makeBanner({ active: false });
			const data = makeData([
				makeUiGlobalPromoSetting({
					content: [
						inactiveBanner1,
						activeBanner1,
						activeBanner2,
						inactiveBanner2,
					],
				}),
			]);
			expect(activePromoBanner(data, '/foo')).toEqual(activeBanner1);
		});

		it('returns undefined if today is not in the active banner date range', () => {
			const startDate = add(new Date(), { days: 1 }).toISOString();
			const activeBanner = makeBanner({ startDate });
			const data = makeData([
				makeUiGlobalPromoSetting({
					content: [activeBanner],
				}),
			]);
			expect(activePromoBanner(data, '/foo')).toBeUndefined();
		});

		it('returns undefined if there are no active promo banners', () => {
			const data = makeData([
				makeUiGlobalPromoSetting({
					content: [makeBanner({ active: false })],
				}),
			]);
			expect(activePromoBanner(data, '/foo')).toBeUndefined();
		});

		it('returns undefined if ui-global-promo is not active', () => {
			const data = makeData([
				makeUiGlobalPromoSetting({
					active: false,
					content: [makeBanner({ active: true })],
				}),
			]);
			expect(activePromoBanner(data, '/foo')).toBeUndefined();
		});

		it('returns undefined if no promoContent passes filterForPromoBanner', () => {
			const promoContent = makeBanner();
			const data = makeData([
				makeUiGlobalPromoSetting({ content: [promoContent] }),
			]);
			// path is in deny list
			expect(activePromoBanner(data, '/checkout')).toBeUndefined();
		});
	});

	describe('inactivePromoBanners', () => {
		it('returns all inactive promo banners within date range', () => {
			const inactiveBanner1 = makeBanner({ active: false });
			const inactiveBanner2 = makeBanner({ active: false });
			const inactiveBanner3 = makeBanner({
				active: false,
				startDate: add(new Date(), { days: 1 }).toISOString(),
			});
			const activeBanner = makeBanner();
			const data = makeData([
				makeUiGlobalPromoSetting({
					content: [
						inactiveBanner1,
						activeBanner,
						inactiveBanner2,
						inactiveBanner3,
					],
				}),
			]);
			const result = inactivePromoBanners(data, '/foo');
			expect(result).toEqual([inactiveBanner1, inactiveBanner2]);
		});

		it('returns empty array if there are no inactive promo banners', () => {
			const data = makeData([
				makeUiGlobalPromoSetting({
					content: [makeBanner({ active: true })],
				}),
			]);
			expect(inactivePromoBanners(data, '/foo')).toEqual([]);
		});

		it('returns empty array if ui-global-promo is not active', () => {
			const data = makeData([
				makeUiGlobalPromoSetting({
					active: false,
					content: [makeBanner({ active: false })],
				}),
			]);
			expect(inactivePromoBanners(data, '/foo')).toEqual([]);
		});

		it('returns empty array if no promoContent passes filterForPromoBanner', () => {
			const promoContent = makeBanner({ active: false });
			const data = makeData([
				makeUiGlobalPromoSetting({ content: [promoContent] }),
			]);
			// path is in deny list
			const result = inactivePromoBanners(data, '/checkout');
			expect(result).toEqual([]);
		});
	});

	describe('globalBannerDenyList', () => {
		it('contains known deny list paths', () => {
			expect(globalBannerDenyList).toContain('/checkout');
			expect(globalBannerDenyList).toContain('/error');
		});
	});
});
