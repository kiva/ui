import { promoBannerData } from '../../../../../src/esiTags/globalData/promoBanners';
import { isFromImpactDashboard, hasPromoSession } from '../../../../../src/util/promoCredit';
import { activePromoBanner, showBannerForPromo } from '../../../../../src/util/globalPromoBanner';

vi.mock('#src/util/promoCredit', async importOriginal => {
	const mod = await importOriginal();
	return {
		...mod,
		isFromImpactDashboard: vi.fn(),
		hasPromoSession: vi.fn(),
	};
});

vi.mock('#src/util/globalPromoBanner', async importOriginal => {
	const mod = await importOriginal();
	return {
		...mod,
		activePromoBanner: vi.fn(),
		showBannerForPromo: vi.fn(),
	};
});

describe('promoBannerData', () => {
	it('shows promo credit banner if isFromImpactDashboard returns true', () => {
		isFromImpactDashboard.mockReturnValue(true);
		const result = promoBannerData({}, {});
		expect(result).not.toHaveProperty('promo-credit-banner-display', 'none');
	});

	it('shows promo credit banner if hasPromoSession returns true', () => {
		isFromImpactDashboard.mockReturnValue(false);
		hasPromoSession.mockReturnValue(true);
		const result = promoBannerData({}, {});
		expect(result).not.toHaveProperty('promo-credit-banner-display', 'none');
	});

	it('hides promo credit banner if all checks are false', () => {
		isFromImpactDashboard.mockReturnValue(false);
		hasPromoSession.mockReturnValue(false);
		const result = promoBannerData({}, {});
		expect(result).toHaveProperty('promo-credit-banner-display', 'none');
	});

	it('shows global banner if showBannerForPromo returns true', () => {
		hasPromoSession.mockReturnValue(true);
		activePromoBanner.mockReturnValue({ fields: { showForPromo: true } });
		showBannerForPromo.mockReturnValue(true);
		const result = promoBannerData({}, {});
		expect(result).not.toHaveProperty('global-promo-banner-display', 'none');
	});

	it('hides global banner if showBannerForPromo returns false and hasPromoSession is true', () => {
		hasPromoSession.mockReturnValue(true);
		activePromoBanner.mockReturnValue({ fields: { showForPromo: false } });
		showBannerForPromo.mockReturnValue(false);
		const result = promoBannerData({}, {});
		expect(result).toHaveProperty('global-promo-banner-display', 'none');
	});

	it('hides both banners if both checks are false', () => {
		isFromImpactDashboard.mockReturnValue(false);
		hasPromoSession.mockReturnValue(false);
		activePromoBanner.mockReturnValue(undefined);
		showBannerForPromo.mockReturnValue(false);
		const result = promoBannerData({}, {});
		expect(result).toHaveProperty('global-promo-banner-display', 'none');
		expect(result).toHaveProperty('promo-credit-banner-display', 'none');
	});
});
