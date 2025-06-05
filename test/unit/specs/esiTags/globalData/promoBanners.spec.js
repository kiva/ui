import { promoBannerData } from '#src/esiTags/globalData/promoBanners';
import { isFromImpactDashboard, bonusBalance } from '#src/util/promoCredit';

vi.mock('#src/util/promoCredit', async importOriginal => {
	const mod = await importOriginal();
	return {
		...mod,
		isFromImpactDashboard: vi.fn(),
		bonusBalance: vi.fn(),
	};
});

describe('promoBannerData', () => {
	it('shows banner if isFromImpactDashboard returns true', () => {
		isFromImpactDashboard.mockReturnValue(true);
		bonusBalance.mockReturnValue(0);
		const data = {};
		const route = new URL('https://kiva.org/?fromContext=/impact-dashboard');
		const result = promoBannerData(data, route);
		expect(result).toEqual({});
	});

	it('shows banner if lendingRewardOffered is true', () => {
		isFromImpactDashboard.mockReturnValue(false);
		bonusBalance.mockReturnValue(0);
		const data = { shop: { lendingRewardOffered: true } };
		const route = {};
		const result = promoBannerData(data, route);
		expect(result).toEqual({});
	});

	it('shows banner if bonusBalance > 0', () => {
		isFromImpactDashboard.mockReturnValue(false);
		bonusBalance.mockReturnValue(10);
		const data = {};
		const route = {};
		const result = promoBannerData(data, route);
		expect(result).toEqual({});
	});

	it('hides banner if all checks are false/zero', () => {
		isFromImpactDashboard.mockReturnValue(false);
		bonusBalance.mockReturnValue(0);
		const data = {};
		const route = {};
		const result = promoBannerData(data, route);
		expect(result).toEqual({ 'promo-credit-banner-display': 'none' });
	});
});
