import {
	hasLoanFunFactFootnote,
	isFirstLogin,
	createUserPreferences,
	updateUserPreferences,
	getIsMyKivaEnabled,
	fetchPostCheckoutAchievements,
	MY_KIVA_PREFERENCE_KEY,
	createUserPreferencesMutation,
	updateUserPreferencesMutation,
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { getUnixTime } from 'date-fns';
import * as experimentUtils from '#src/util/experiment/experimentUtils';
import * as logFormatter from '#src/util/logFormatter';
import { expect } from '@storybook/test';

vi.mock('#src/util/logReadQueryError');

const userPreferenceDataMock = {
	my: {
		userPreference: {
			id: 1,
			preferences: ''
		}
	}
};

const createPreferenceDataMock = {
	my: {
		createUserPreferences: {
			id: 1,
			preferences: ''
		}
	}
};

const updatedPreferenceDataMock = {
	my: {
		userPreference: {
			id: 1,
			preferences: {
				test: 'test'
			}
		}
	}
};

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
				query: vi.fn()
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

	describe('createUserPreferences', () => {
		it('should create user preferences as expected', async () => {
			const apolloMock = {
				mutate: vi.fn().mockReturnValueOnce(Promise.resolve({ data: createPreferenceDataMock }))
			};
			const preferences = { test: 'test' };

			const newUserPreference = await createUserPreferences(apolloMock, preferences);

			expect(newUserPreference).toEqual({
				data: createPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: createUserPreferencesMutation,
				variables: { preferences: JSON.stringify(preferences) },
			});
		});
	});

	describe('updateUserPreferences', () => {
		it('should update user preferences as expected', async () => {
			const apolloMock = {
				mutate: vi.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await updateUserPreferences(
				apolloMock,
				userPreferenceDataMock.my.userPreference,
				// Pass existing preferences to ensure they are merged correctly
				{ test: 'test' },
				{ new: 'new' },
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: updateUserPreferencesMutation,
				variables: {
					updateUserPreferencesId: userPreferenceDataMock.my.userPreference.id,
					preferences: JSON.stringify({ test: 'test', new: 'new' }),
				},
			});
		});
	});

	describe('getIsMyKivaEnabled', () => {
		let apolloMock;
		let $kvTrackEventMock;
		let preferencesMock;
		let trackExperimentVersionMock;
		let windowMock;
		let myKivaFlagEnabled;

		beforeEach(() => {
			apolloMock = { readFragment: vi.fn(), mutate: vi.fn() };
			$kvTrackEventMock = vi.fn();
			preferencesMock = {};
			trackExperimentVersionMock = vi.spyOn(experimentUtils, 'trackExperimentVersion');
			windowMock = vi.spyOn(window, 'window', 'get').mockImplementation(() => ({}));
			myKivaFlagEnabled = false;
		});

		afterEach(vi.restoreAllMocks);

		it('should return true if loanTotal is less than MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(result).toBe(true);
		});

		it('should return false if loanTotal is greater than or equal to MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4, myKivaFlagEnabled);

			expect(result).toBe(false);
		});

		it('should return false if user is in control', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(result).toBe(false);
		});

		it('should return true if user is in variant', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(result).toBe(true);
		});

		it('should return true if hasSeenMyKiva is true', () => {
			preferencesMock = {
				id: 123,
				preferences: JSON.stringify({ [MY_KIVA_PREFERENCE_KEY]: 1 }),
			};

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4, myKivaFlagEnabled);

			expect(result).toBe(true);
		});

		it('should return false if hasSeenMyKiva is missing', () => {
			preferencesMock = {
				id: 123,
				preferences: '',
			};

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4, myKivaFlagEnabled);

			expect(result).toBe(false);
		});

		it('should handle bad preferences json', () => {
			const mockLogFormatter = vi.spyOn(logFormatter, 'default').mockImplementation(() => ({}));
			preferencesMock = {
				id: 123,
				preferences: 'asdasd',
			};

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4, myKivaFlagEnabled);

			expect(result).toBe(false);
			expect(mockLogFormatter).toBeCalledTimes(1);
			expect(mockLogFormatter).toBeCalledWith('getIsMyKivaEnabled JSON parsing exception', 'error');
		});

		it('should call trackExperimentVersion', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(trackExperimentVersionMock).toBeCalledTimes(1);
		});

		it('should only call apollo if client-side', () => {
			windowMock.mockImplementation(() => ({}));
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(apolloMock.mutate).toBeCalledTimes(1);
		});

		it('should not call apollo if server-side', () => {
			windowMock.mockImplementation(() => (undefined));
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(apolloMock.mutate).toBeCalledTimes(0);
		});

		it('should call apollo to create new user preferences', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, null, 3, myKivaFlagEnabled);

			expect(apolloMock.mutate).toBeCalledWith({
				mutation: createUserPreferencesMutation,
				variables: {
					preferences: JSON.stringify({ [MY_KIVA_PREFERENCE_KEY]: 1 }),
				},
			});
		});

		it('should call apollo to update user preferences', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3, myKivaFlagEnabled);

			expect(apolloMock.mutate).toBeCalledWith({
				mutation: updateUserPreferencesMutation,
				variables: {
					updateUserPreferencesId: preferencesMock.id,
					preferences: JSON.stringify({ [MY_KIVA_PREFERENCE_KEY]: 1 }),
				},
			});
		});

		it('should return false if myKivaFlagEnabled is false', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4, myKivaFlagEnabled);

			expect(result).toBe(false);
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
