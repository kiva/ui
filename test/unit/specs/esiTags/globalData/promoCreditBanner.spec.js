import { promoCreditBannerData } from '#src/esiTags/globalData/promoCreditBanner';
import { isFromImpactDashboard, bonusBalance } from '#src/util/promoCreditBanner';

vi.mock('#src/util/promoCreditBanner', async importOriginal => {
	const mod = await importOriginal();
	return {
		...mod,
		isFromImpactDashboard: vi.fn(),
		bonusBalance: vi.fn(),
	};
});

describe('promoCreditBannerData', () => {
	it('shows banner if isFromImpactDashboard returns true', () => {
		isFromImpactDashboard.mockReturnValue(true);
		bonusBalance.mockReturnValue(0);
		const data = {};
		const route = new URL('https://kiva.org/?fromContext=/impact-dashboard');
		const result = promoCreditBannerData(data, route);
		expect(result).toEqual({});
	});

	it('shows banner if lendingRewardOffered is true', () => {
		isFromImpactDashboard.mockReturnValue(false);
		bonusBalance.mockReturnValue(0);
		const data = { shop: { lendingRewardOffered: true } };
		const route = {};
		const result = promoCreditBannerData(data, route);
		expect(result).toEqual({});
	});

	it('shows banner if bonusBalance > 0', () => {
		isFromImpactDashboard.mockReturnValue(false);
		bonusBalance.mockReturnValue(10);
		const data = {};
		const route = {};
		const result = promoCreditBannerData(data, route);
		expect(result).toEqual({});
	});

	it('hides banner if all checks are false/zero', () => {
		isFromImpactDashboard.mockReturnValue(false);
		bonusBalance.mockReturnValue(0);
		const data = {};
		const route = {};
		const result = promoCreditBannerData(data, route);
		expect(result).toEqual({ 'promo-credit-banner-display': 'none' });
	});
});
