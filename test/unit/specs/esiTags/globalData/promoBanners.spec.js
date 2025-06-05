import { promoBannerData } from '#src/esiTags/globalData/promoBanners';
import { isFromImpactDashboard, hasPromoSession } from '#src/util/promoCredit';

vi.mock('#src/util/promoCredit', async importOriginal => {
	const mod = await importOriginal();
	return {
		...mod,
		isFromImpactDashboard: vi.fn(),
		hasPromoSession: vi.fn(),
	};
});

describe('promoBannerData', () => {
	it('shows banner if isFromImpactDashboard returns true', () => {
		isFromImpactDashboard.mockReturnValue(true);
		hasPromoSession.mockReturnValue(false);
		const data = {};
		const route = new URL('https://kiva.org/?fromContext=/impact-dashboard');
		const result = promoBannerData(data, route);
		expect(result).toEqual({});
	});

	it('shows banner if hasPromoSession returns true', () => {
		isFromImpactDashboard.mockReturnValue(false);
		hasPromoSession.mockReturnValue(true);
		const data = { shop: { lendingRewardOffered: true } };
		const route = {};
		const result = promoBannerData(data, route);
		expect(result).toEqual({});
	});

	it('hides banner if all checks are false', () => {
		isFromImpactDashboard.mockReturnValue(false);
		hasPromoSession.mockReturnValue(false);
		const data = {};
		const route = {};
		const result = promoBannerData(data, route);
		expect(result).toEqual({ 'promo-credit-banner-display': 'none' });
	});
});
