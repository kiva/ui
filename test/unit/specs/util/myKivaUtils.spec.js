import { hasLoanFunFactFootnote, getIsMyKivaEnabled } from '#src/util/myKivaUtils';

describe('myKivaUtils.js', () => {
	describe('hasLoanFunFactFootnote', () => {
		it('should return true for loan in United States', () => {
			const loan = {
				geocode: {
					country: {
						region: 'North America',
						name: 'United States'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return false for loan in North America but not United States', () => {
			const loan = {
				geocode: {
					country: {
						region: 'North America',
						name: 'Mexico'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(false);
		});

		it('should return true for loan in Central America', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Central America'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return true for loan in Africa', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Africa'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return true for loan in Asia', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Asia'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(true);
		});

		it('should return false for loan in Middle East', () => {
			const loan = {
				geocode: {
					country: {
						region: 'Middle East'
					}
				}
			};

			const result = hasLoanFunFactFootnote(loan);

			expect(result).toBe(false);
		});
	});

	describe('getIsMyKivaEnabled', () => {
		let apolloMock;
		let $kvTrackEventMock;
		let generalSettingsMock;
		let preferencesMock;

		beforeEach(() => {
			apolloMock = { readFragment: jest.fn() };
			$kvTrackEventMock = jest.fn();
			generalSettingsMock = { 'myKivaEnabled.value': true };
			preferencesMock = {};
		});

		it('should return false if myKivaFeatureEnabled is false', () => {
			generalSettingsMock['myKivaEnabled.value'] = false;
			apolloMock.readFragment
				.mockReturnValueOnce({ version: 'a' })
				.mockReturnValueOnce({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 3);

			expect(result).toBe(false);
		});

		it('should return false if loanTotal is greater than or equal to MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment
				.mockReturnValueOnce({ version: 'a' })
				.mockReturnValueOnce({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 4);

			expect(result).toBe(false);
		});

		it('should return false if no experiments are enabled', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 4);

			expect(result).toBe(false);
		});

		it('should return true if experiments are enabled', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 4);

			expect(result).toBe(true);
		});

		it('should return true if hasSeenMyKiva is true', () => {
			preferencesMock = { myKivaPageExp: 1 };

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 4);

			expect(result).toBe(true);
		});

		it('should return true if loanTotal is less than MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment
				.mockReturnValueOnce({ version: 'a' })
				.mockReturnValueOnce({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 3);

			expect(result).toBe(true);
		});
	});
});
