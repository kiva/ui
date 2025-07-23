import {
	hasLoanFunFactFootnote,
	getIsMyKivaEnabled,
	fetchPostCheckoutAchievements,
	setGuestAssignmentCookie,
	checkGuestAssignmentCookie,
	GUEST_ASSIGNMENT_COOKIE,
	setMyKivaRedirectCookie,
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import * as experimentUtils from '#src/util/experiment/experimentUtils';

vi.mock('#src/util/logReadQueryError');

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
		let trackExperimentVersionMock;
		let cookieStoreMock;

		beforeEach(() => {
			apolloMock = { readFragment: vi.fn() };
			$kvTrackEventMock = vi.fn();
			trackExperimentVersionMock = vi.spyOn(experimentUtils, 'trackExperimentVersion');
			cookieStoreMock = { set: vi.fn() };
		});

		afterEach(vi.restoreAllMocks);

		it('should return false if myKivaFlagEnabled is false', () => {
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, false, cookieStoreMock);
			expect(result).toBe(false);
			expect(apolloMock.readFragment).not.toHaveBeenCalled();
			expect(trackExperimentVersionMock).not.toHaveBeenCalled();
			expect(cookieStoreMock.set).not.toHaveBeenCalled();
		});

		it('should return true and set cookie if experiment version is "b"', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(true);
			expect(apolloMock.readFragment).toHaveBeenCalledWith({
				id: 'Experiment:my_kiva_jan_2025',
				fragment: expect.any(Object),
			});
			expect(trackExperimentVersionMock).toHaveBeenCalledWith(
				apolloMock,
				$kvTrackEventMock,
				'event-tracking',
				'my_kiva_jan_2025',
				'EXP-MP-1235-Jan2025'
			);
			expect(cookieStoreMock.set).toHaveBeenCalledWith(
				'mykivaredirect',
				'true',
				expect.any(Date)
			);
		});

		it('should return false and not set cookie if experiment version is not "b"', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(false);
			expect(apolloMock.readFragment).toHaveBeenCalled();
			expect(trackExperimentVersionMock).toHaveBeenCalled();
			expect(cookieStoreMock.set).not.toHaveBeenCalled();
		});

		it('should not throw if cookieStore is undefined', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });
			expect(() => getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, undefined)).not.toThrow();
		});
	});
});
