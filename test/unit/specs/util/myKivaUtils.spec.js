import {
	hasLoanFunFactFootnote,
	createUserPreferences,
	updateUserPreferences,
	getIsMyKivaEnabled,
	fetchPostCheckoutAchievements,
	MY_KIVA_PREFERENCE_KEY,
	createUserPreferencesMutation,
	updateUserPreferencesMutation,
	setGuestAssignmentCookie,
	checkGuestAssignmentCookie,
	GUEST_ASSIGNMENT_COOKIE,
	setMyKivaRedirectCookie,
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
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

	describe('setGuestAssignmentCookie', () => {
		it('should set the guest assignment cookie if MyKiva is enabled and the user is a guest', () => {
			const cookieStore = {
				set: vi.fn(),
			};
			const myKivaEnabled = true;
			const isGuest = true;

			setGuestAssignmentCookie(cookieStore, myKivaEnabled, isGuest);

			expect(cookieStore.set).toHaveBeenCalledWith(GUEST_ASSIGNMENT_COOKIE, 'true', { path: '/' });
		});

		it('should not set the guest assignment cookie if MyKiva is not enabled', () => {
			const cookieStore = {
				set: vi.fn(),
			};
			const myKivaEnabled = false;
			const isGuest = true;

			setGuestAssignmentCookie(cookieStore, myKivaEnabled, isGuest);

			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		it('should not set the guest assignment cookie if the user is not a guest', () => {
			const cookieStore = {
				set: vi.fn(),
			};
			const myKivaEnabled = true;
			const isGuest = false;

			setGuestAssignmentCookie(cookieStore, myKivaEnabled, isGuest);

			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		it('should not throw an error if cookieStore is undefined', () => {
			expect(() => setGuestAssignmentCookie(undefined, true, true)).not.toThrow();
		});
	});

	describe('checkGuestAssignmentCookie', () => {
		it('should return true if the guest assignment cookie exists', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('true'),
			};

			const result = checkGuestAssignmentCookie(cookieStore);

			expect(result).toBe(true);
			expect(cookieStore.get).toHaveBeenCalledWith(GUEST_ASSIGNMENT_COOKIE);
		});

		it('should return false if the guest assignment cookie does not exist', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(undefined),
			};

			const result = checkGuestAssignmentCookie(cookieStore);

			expect(result).toBe(false);
			expect(cookieStore.get).toHaveBeenCalledWith(GUEST_ASSIGNMENT_COOKIE);
		});

		it('should return false if cookieStore is undefined', () => {
			const result = checkGuestAssignmentCookie(undefined);

			expect(result).toBe(false);
		});
	});

	describe('setMyKivaRedirectCookie', () => {
		it('should set a cookie with the correct name, value, and expiration', () => {
			const mockCookieStore = {
				set: vi.fn(),
			};

			setMyKivaRedirectCookie(mockCookieStore);

			expect(mockCookieStore.set).toHaveBeenCalledTimes(1);
			expect(mockCookieStore.set).toHaveBeenCalledWith(
				'mykivaredirect',
				'true',
				expect.any(Date)
			);

			// Verify the expiration date is approximately 2 months from now
			const expirationDate = mockCookieStore.set.mock.calls[0][2];
			const expectedDate = new Date();
			expectedDate.setMonth(expectedDate.getMonth() + 2);
			expect(expirationDate.getMonth()).toBe(expectedDate.getMonth());
			expect(expirationDate.getFullYear()).toBe(expectedDate.getFullYear());
		});

		it('should not throw an error when cookieStore is undefined', () => {
			expect(() => setMyKivaRedirectCookie(undefined)).not.toThrow();
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

		it('should return true if myKivaFlagEnabled is true', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });
			myKivaFlagEnabled = true;

			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, preferencesMock, 4, myKivaFlagEnabled);

			expect(result).toBe(true);
		});

		it('should set the redirect cookie when conditions are met', () => {
			const mockApollo = {
				readFragment: vi.fn().mockReturnValue({ version: 'b' }),
			};
			const mockTrackEvent = vi.fn();
			const mockCookieStore = {
				set: vi.fn(),
			};
			const userPreferences = { preferences: JSON.stringify({}) };
			const loanTotal = 5;

			const result = getIsMyKivaEnabled(
				mockApollo,
				mockTrackEvent,
				userPreferences,
				loanTotal,
				true,
				mockCookieStore
			);

			expect(result).toBe(true);
			expect(mockApollo.readFragment).toHaveBeenCalledWith({
				id: 'Experiment:my_kiva_jan_2025',
				fragment: expect.any(Object),
			});
			expect(mockTrackEvent).toHaveBeenCalled();
			expect(mockCookieStore.set).toHaveBeenCalledWith(
				'mykivaredirect',
				'true',
				expect.any(Date)
			);
		});

		it('should not set the redirect cookie if conditions are not met', () => {
			const mockApollo = {
				readFragment: vi.fn().mockReturnValue({ version: 'a' }),
			};
			const mockTrackEvent = vi.fn();
			const mockCookieStore = {
				set: vi.fn(),
			};
			const userPreferences = { preferences: JSON.stringify({}) };
			const loanTotal = 3; // Below the loan limit

			const result = getIsMyKivaEnabled(
				mockApollo,
				mockTrackEvent,
				userPreferences,
				loanTotal,
				myKivaFlagEnabled,
				mockCookieStore
			);

			expect(result).toBe(false);
			expect(mockApollo.readFragment).toHaveBeenCalled();
			expect(mockTrackEvent).toHaveBeenCalled();
			expect(mockCookieStore.set).not.toHaveBeenCalled();
		});
	});
});
