import {
	hasLoanFunFactFootnote,
	isFirstLogin,
	createUserPreferences,
	updateUserPreferences,
	saveUserPreferences,
	saveMyKivaToUserPreferences,
	getIsMyKivaEnabled,
	fetchPostCheckoutAchievements,
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import { getUnixTime } from 'date-fns';
import * as experimentUtils from '#src/util/experiment/experimentUtils';
import * as logFormatter from '#src/util/logFormatter';
import { expect } from '@storybook/test';

jest.mock('#src/util/logReadQueryError');

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

	describe('createUserPreferences', () => {
		it('should create user preferences as expected', async () => {
			const apolloMock = {
				mutate: jest.fn().mockReturnValueOnce(Promise.resolve({ data: createPreferenceDataMock }))
			};

			const newUserPreference = await createUserPreferences(apolloMock);

			expect(newUserPreference).toEqual({
				data: createPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: { preferences: '' }
			});
		});
	});

	describe('updateUserPreferences', () => {
		it('should update user preferences as expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await updateUserPreferences(
				apolloMock,
				userPreferenceDataMock.my.userPreference,
				{ test: 'test' }
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					updateUserPreferencesId: userPreferenceDataMock.my.userPreference.id,
					preferences: '{"test":"test"}',
				},
			});
		});
	});

	describe('saveUserPreferences', () => {
		it('should create user preferences as expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: createPreferenceDataMock }))
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await saveUserPreferences(
				apolloMock,
				{},
				{ test: 'test' },
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(2);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: { preferences: '' }
			});
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					updateUserPreferencesId: createPreferenceDataMock.my.createUserPreferences.id,
					preferences: '{"test":"test"}',
				},
			});
		});

		it('should updated user preferences as expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await saveUserPreferences(
				apolloMock,
				userPreferenceDataMock?.my?.userPreference,
				{ test: 'test' },
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					updateUserPreferencesId: userPreferenceDataMock.my.userPreference.id,
					preferences: '{"test":"test"}',
				},
			});
		});
	});

	describe('saveMyKivaToUserPreferences', () => {
		it('should create user preferences as expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: createPreferenceDataMock }))
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await saveMyKivaToUserPreferences(apolloMock, {});

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(2);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: { preferences: '' }
			});
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					updateUserPreferencesId: createPreferenceDataMock.my.createUserPreferences.id,
					preferences: '{"myKivaJan2025Exp":1}',
				},
			});
		});

		it('should updated user preferences as expected', async () => {
			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await saveMyKivaToUserPreferences(
				apolloMock,
				updatedPreferenceDataMock.my.userPreference,
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(1);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					updateUserPreferencesId: userPreferenceDataMock.my.userPreference.id,
					preferences: '{"test":"test","myKivaJan2025Exp":1}',
				},
			});
		});

		it('should handle bad json', async () => {
			const mockLogFormatter = jest.spyOn(logFormatter, 'default').mockImplementation(() => ({}));

			const apolloMock = {
				mutate: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: createPreferenceDataMock }))
					.mockReturnValueOnce(Promise.resolve({ data: updatedPreferenceDataMock }))
			};

			const newUserPreference = await saveMyKivaToUserPreferences(
				apolloMock,
				{ preferences: '' },
			);

			expect(newUserPreference).toEqual({
				data: updatedPreferenceDataMock
			});
			expect(apolloMock.mutate).toHaveBeenCalledTimes(2);
			expect(apolloMock.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					updateUserPreferencesId: userPreferenceDataMock.my.userPreference.id,
					preferences: '{"myKivaJan2025Exp":1}',
				},
			});
			expect(mockLogFormatter).toHaveBeenCalledTimes(1);
		});
	});

	describe('getIsMyKivaEnabled', () => {
		let apolloMock;
		let $kvTrackEventMock;
		let preferencesMock;
		let trackExperimentVersionMock;

		beforeEach(() => {
			apolloMock = { readFragment: jest.fn(), mutate: jest.fn() };
			$kvTrackEventMock = jest.fn();
			preferencesMock = {};
			trackExperimentVersionMock = jest.spyOn(experimentUtils, 'trackExperimentVersion');
		});

		afterEach(jest.restoreAllMocks);

		it('should return false if loanTotal is greater than or equal to MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4);

			expect(result).toBe(false);
		});

		it('should return false if no experiments are enabled', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3);

			expect(result).toBe(false);
		});

		it('should return true if experiments are enabled', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3);

			expect(result).toBe(true);
		});

		it('should return true if hasSeenMyKiva is true', () => {
			preferencesMock = { myKivaJan2025Exp: 1 };

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4);

			expect(result).toBe(true);
		});

		it('should return true if loanTotal is less than MY_KIVA_LOAN_LIMIT', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3);

			expect(result).toBe(true);
		});

		it('should call trackExperimentVersion', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3);

			expect(trackExperimentVersionMock).toBeCalledTimes(1);
		});

		it('should call apollo to store preferences', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });

			getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 3);

			// Just checking if called instead of the number of times due to not wanting to wait for promise
			expect(apolloMock.mutate).toBeCalled();
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
