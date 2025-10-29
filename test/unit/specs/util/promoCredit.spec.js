import { isFromImpactDashboard, bonusBalance, hasPromoSession } from '../../../../src/util/promoCredit';

describe('promoCredit', () => {
	describe('isFromImpactDashboard', () => {
		it('returns true for URL with fromContext=/impact-dashboard', () => {
			const url = new URL('https://kiva.org/?fromContext=/impact-dashboard/foo');
			expect(isFromImpactDashboard(url)).toBe(true);
		});

		it('returns false for URL with fromContext not /impact-dashboard', () => {
			const url = new URL('https://kiva.org/?fromContext=/other-context');
			expect(isFromImpactDashboard(url)).toBe(false);
		});

		it('returns false for URL with no fromContext', () => {
			const url = new URL('https://kiva.org/');
			expect(isFromImpactDashboard(url)).toBe(false);
		});

		it('returns true for route object with fromContext=/impact-dashboard', () => {
			const route = { query: { fromContext: '/impact-dashboard/foo' } };
			expect(isFromImpactDashboard(route)).toBe(true);
		});

		it('returns false for route object with fromContext not /impact-dashboard', () => {
			const route = { query: { fromContext: '/other-context' } };
			expect(isFromImpactDashboard(route)).toBe(false);
		});

		it('returns false for route object with no fromContext', () => {
			const route = { query: {} };
			expect(isFromImpactDashboard(route)).toBe(false);
		});

		it('returns false for null/undefined input', () => {
			expect(isFromImpactDashboard(null)).toBe(false);
			expect(isFromImpactDashboard(undefined)).toBe(false);
		});
	});

	describe('bonusBalance', () => {
		it('returns userPromoBalance if it is greater than basketPromoBalance', () => {
			const data = {
				my: { userAccount: { promoBalance: '50' } },
				shop: {
					basket: {
						totals: {
							bonusAvailableTotal: '10',
							freeTrialAvailableTotal: '5',
							redemptionCodeAvailableTotal: '5',
							universalCodeAvailableTotal: '5',
						}
					}
				}
			};
			expect(bonusBalance(data)).toBe(50);
		});

		it('returns basketPromoBalance if it is greater than userPromoBalance', () => {
			const data = {
				my: { userAccount: { promoBalance: '10' } },
				shop: {
					basket: {
						totals: {
							bonusAvailableTotal: '20',
							freeTrialAvailableTotal: '10',
							redemptionCodeAvailableTotal: '10',
							universalCodeAvailableTotal: '10',
						}
					}
				}
			};
			expect(bonusBalance(data)).toBe(50);
		});

		it('returns 0 if no promo balances are present', () => {
			const data = {};
			expect(bonusBalance(data)).toBe(0);
		});

		it('handles missing basket or userAccount gracefully', () => {
			const data1 = { my: {} };
			const data2 = { shop: {} };
			expect(bonusBalance(data1)).toBe(0);
			expect(bonusBalance(data2)).toBe(0);
		});
	});

	describe('hasPromoSession', () => {
		it('returns true if any basket promo total is > 0', () => {
			const data = {
				shop: {
					basket: {
						totals: {
							bonusAvailableTotal: '10',
							freeTrialAvailableTotal: '0',
							redemptionCodeAvailableTotal: '0',
							universalCodeAvailableTotal: '0',
						},
					},
				},
			};
			expect(hasPromoSession(data)).toBe(true);
		});

		it('returns true if user promoBalance is > 0', () => {
			const data = {
				my: { userAccount: { promoBalance: '5' } },
				shop: {
					basket: {
						totals: {
							bonusAvailableTotal: '0',
							freeTrialAvailableTotal: '0',
							redemptionCodeAvailableTotal: '0',
							universalCodeAvailableTotal: '0',
						},
					},
				},
			};
			expect(hasPromoSession(data)).toBe(true);
		});

		it('returns true if lendingRewardOffered is true', () => {
			const data = {
				shop: { lendingRewardOffered: true },
			};
			expect(hasPromoSession(data)).toBe(true);
		});

		it('returns true if basket has free credits', () => {
			const data = {
				shop: { basket: { hasFreeCredits: true } },
			};
			expect(hasPromoSession(data)).toBe(true);
		});

		it('returns false if all promo balances are 0 or missing', () => {
			const data = {
				my: { userAccount: { promoBalance: '0' } },
				shop: {
					basket: {
						totals: {
							bonusAvailableTotal: '0',
							freeTrialAvailableTotal: '0',
							redemptionCodeAvailableTotal: '0',
							universalCodeAvailableTotal: '0',
						},
					},
				},
			};
			expect(hasPromoSession(data)).toBe(false);
		});

		it('handles missing basket or userAccount gracefully', () => {
			expect(hasPromoSession({})).toBe(false);
			expect(hasPromoSession({ my: {} })).toBe(false);
			expect(hasPromoSession({ shop: {} })).toBe(false);
		});
	});
});
