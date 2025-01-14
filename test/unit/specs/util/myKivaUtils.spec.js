import {
	hasLoanFunFactFootnote,
	isFirstLogin,
	getIsMyKivaEnabled,
	fetchPostCheckoutAchievements,
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { getUnixTime } from 'date-fns';
import * as experimentUtils from '#src/util/experiment/experimentUtils';

jest.mock('#src/util/logReadQueryError');

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

	describe('fetchPostCheckoutAchievements', () => {
		let apolloMock;

		beforeEach(() => {
			apolloMock = {
				query: jest.fn()
			};
		});

		it('should call apollo.query with the correct parameters', async () => {
			const loanIds = [1, 2, 3];
			await fetchPostCheckoutAchievements(apolloMock, loanIds);

			expect(apolloMock.query).toHaveBeenCalledWith({
				query: postCheckoutAchievementsQuery,
				variables: { loanIds }
			});
		});

		it('should call logReadQueryError on error', async () => {
			const loanIds = [1, 2, 3];
			const error = new Error('Test error');
			apolloMock.query.mockRejectedValueOnce(error);

			await fetchPostCheckoutAchievements(apolloMock, loanIds);

			expect(logReadQueryError).toHaveBeenCalledWith(error, 'myKivaUtils postCheckoutAchievementsQuery');
		});
	});

	describe('getIsMyKivaEnabled', () => {
		let apolloMock;
		let $kvTrackEventMock;
		let generalSettingsMock;
		let preferencesMock;
		let trackExperimentVersionMock;

		beforeEach(() => {
			apolloMock = { readFragment: jest.fn() };
			$kvTrackEventMock = jest.fn();
			generalSettingsMock = { 'myKivaEnabled.value': true };
			preferencesMock = {};
			trackExperimentVersionMock = jest.spyOn(experimentUtils, 'trackExperimentVersion');
		});

		afterEach(jest.restoreAllMocks);

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

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 3);

			expect(result).toBe(false);
		});

		it('should return true if experiments are enabled', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 3);

			expect(result).toBe(true);
		});

		it('should return true if hasSeenMyKiva is true', () => {
			preferencesMock = { myKivaPageExp: 1 };

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 4);

			expect(result).toBe(true);
		});

		it('should return true if loanTotal is less than MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 3);

			expect(result).toBe(true);
		});

		it('should call trackExperimentVersion', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, generalSettingsMock, preferencesMock, 3);

			expect(trackExperimentVersionMock).toBeCalledTimes(1);
		});
	});

	describe('isFirstLogin', () => {
		it('should return true for first login user', () => {
			const memberSince = new Date();
			let lastLogin = new Date(memberSince);
			lastLogin.setMinutes(lastLogin.getMinutes() + 62);
			lastLogin = getUnixTime(lastLogin);

			const result = isFirstLogin(lastLogin, memberSince);

			expect(result).toBe(true);
		});

		it('should return false if not first login user', () => {
			const memberSince = new Date();
			let lastLogin = new Date(memberSince);
			lastLogin.setMinutes(lastLogin.getMinutes() + 82);
			lastLogin = getUnixTime(lastLogin);

			const result = isFirstLogin(lastLogin, memberSince);

			expect(result).toBe(false);
		});
	});
});
