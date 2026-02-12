import CheckoutPage from '#src/pages/Checkout/CheckoutPage';

describe('CheckoutPage bonusAvailableTotal and showPromoCreditPill', () => {
	let component;

	beforeEach(() => {
		// Create a minimal instance of the component for testing computed properties
		component = {
			...CheckoutPage.computed,
			isLoggedIn: false,
			totals: { bonusAvailableTotal: 0 },
			cookieStore: {
				get: () => null
			}
		};
	});

	describe('bonusAvailableTotal', () => {
		it('should return formatted amount from cookie for logged-out users', () => {
			component.isLoggedIn = false;
			component.cookieStore = {
				get: name => {
					if (name === 'kiva_lending_credit') {
						return encodeURIComponent('{"amount":25,"campaign_id":null}');
					}
					return null;
				}
			};

			const result = component.bonusAvailableTotal.call(component);
			expect(result).toBe('$25');
		});

		it('should return formatted amount from totals for logged-in users', () => {
			component.isLoggedIn = true;
			component.totals = { bonusAvailableTotal: 50 };

			const result = component.bonusAvailableTotal.call(component);
			expect(result).toBe('$50');
		});

		it('should handle large amounts with comma formatting', () => {
			component.isLoggedIn = true;
			component.totals = { bonusAvailableTotal: 1000 };

			const result = component.bonusAvailableTotal.call(component);
			expect(result).toBe('$1,000');
		});

		it('should handle zero for logged-out users with no cookie', () => {
			component.isLoggedIn = false;
			component.cookieStore = {
				get: () => null
			};

			const result = component.bonusAvailableTotal.call(component);
			expect(result).toBe('$0');
		});
	});

	describe('showPromoCreditPill', () => {
		it('should show pill for logged-out users with lending credit cookie', () => {
			component.isLoggedIn = false;
			component.cookieStore = {
				get: name => {
					if (name === 'kiva_lending_credit') {
						return encodeURIComponent('{"amount":40,"campaign_id":null}');
					}
					return null;
				}
			};

			const result = component.showPromoCreditPill.call(component);
			expect(result).toBe(true);
		});

		it('should show pill for logged-out users with lending credit even without banner cookie', () => {
			component.isLoggedIn = false;
			component.cookieStore = {
				get: name => {
					if (name === 'kiva_lending_credit') {
						return encodeURIComponent('{"amount":40,"campaign_id":null}');
					}
					// No banner cookie set
					return null;
				}
			};

			const result = component.showPromoCreditPill.call(component);
			expect(result).toBe(true);
		});

		it('should NOT show pill for logged-out users with zero lending credit', () => {
			component.isLoggedIn = false;
			component.cookieStore = {
				get: name => {
					if (name === 'kiva_lending_credit') {
						return encodeURIComponent('{"amount":0,"campaign_id":null}');
					}
					return null;
				}
			};

			const result = component.showPromoCreditPill.call(component);
			expect(result).toBe(false);
		});

		it('should show pill for logged-in users with bonus available and banner cookie set', () => {
			component.isLoggedIn = true;
			component.totals = { bonusAvailableTotal: 50 };
			component.cookieStore = {
				get: name => {
					if (name === 'showPromoCreditPill') {
						return 'true';
					}
					return null;
				}
			};

			const result = component.showPromoCreditPill.call(component);
			expect(result).toBe(true);
		});

		it('should NOT show pill for logged-in users without bonus available', () => {
			component.isLoggedIn = true;
			component.totals = { bonusAvailableTotal: 0 };
			component.cookieStore = {
				get: name => {
					if (name === 'showPromoCreditPill') {
						return 'true';
					}
					return null;
				}
			};

			const result = component.showPromoCreditPill.call(component);
			expect(result).toBe(false);
		});

		it('should handle plain number format in cookie for logged-out users', () => {
			component.isLoggedIn = false;
			component.cookieStore = {
				get: name => {
					if (name === 'kiva_lending_credit') {
						return '75';
					}
					return null;
				}
			};

			const result = component.showPromoCreditPill.call(component);
			expect(result).toBe(true);
		});
	});
});
