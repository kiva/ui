import {
	hasLoanFunFactFootnote,
	getIsMyKivaEnabled,
	fetchPostCheckoutAchievements,
	setGuestAssignmentCookie,
	checkGuestAssignmentCookie,
	GUEST_ASSIGNMENT_COOKIE,
	setMyKivaRedirectCookie,
	setPostLendingCardCookie,
	checkPostLendingCardCookie,
	POST_LENDING_NEXT_STEPS_COOKIE,
	removePostLendingCardCookie
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

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

		it('should return false for loan with missing geocode data', () => {
			expect(hasLoanFunFactFootnote({})).toBe(false);
			expect(hasLoanFunFactFootnote({ geocode: null })).toBe(false);
			expect(hasLoanFunFactFootnote({ geocode: { country: null } })).toBe(false);
			expect(hasLoanFunFactFootnote(null)).toBe(false);
			expect(hasLoanFunFactFootnote(undefined)).toBe(false);
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
				'mykivaredirectv2',
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
		let cookieStoreMock;

		beforeEach(() => {
			apolloMock = { readFragment: vi.fn() };
			$kvTrackEventMock = vi.fn();
			cookieStoreMock = { set: vi.fn(), get: vi.fn() };
		});

		it('should return false if myKivaFlagEnabled is false', () => {
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, false, cookieStoreMock);
			expect(result).toBe(false);
			expect(apolloMock.readFragment).not.toHaveBeenCalled();
			expect($kvTrackEventMock).not.toHaveBeenCalled();
			expect(cookieStoreMock.set).not.toHaveBeenCalled();
		});

		it('should return true and set cookie if experiment version is "b"', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });
			cookieStoreMock.get.mockReturnValue(undefined);
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(true);
			expect(apolloMock.readFragment).toHaveBeenCalledWith({
				id: 'Experiment:my_kiva_jan_2025',
				fragment: expect.any(Object),
			});
			expect($kvTrackEventMock).toHaveBeenCalledWith(
				'event-tracking',
				'EXP-MP-1235-Jan2025',
				'b'
			);
			expect(cookieStoreMock.set).toHaveBeenCalledWith(
				'mykivaredirectv2',
				'true',
				expect.any(Date)
			);
		});

		// eslint-disable-next-line max-len
		it('should return true and set cookie if guest assignment cookie exists (regardless of experiment version)', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });
			cookieStoreMock.get.mockReturnValue('true');
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(true);
			expect($kvTrackEventMock).toHaveBeenCalledWith(
				'event-tracking',
				'EXP-MP-1235-Jan2025',
				'b'
			);
			expect(cookieStoreMock.set).toHaveBeenCalledWith(
				'mykivaredirectv2',
				'true',
				expect.any(Date)
			);
		});

		it('should return false and not set cookie if experiment version is not "b" and no guest assignment', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'a' });
			cookieStoreMock.get.mockReturnValue(undefined);
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(false);
			expect(apolloMock.readFragment).toHaveBeenCalled();
			expect($kvTrackEventMock).toHaveBeenCalledWith(
				'event-tracking',
				'EXP-MP-1235-Jan2025',
				'a'
			);
			expect(cookieStoreMock.set).not.toHaveBeenCalled();
		});

		it('should not throw if cookieStore is undefined', () => {
			apolloMock.readFragment.mockReturnValue({ version: 'b' });
			expect(() => getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, undefined)).not.toThrow();
		});

		it('should handle when readFragment returns null', () => {
			apolloMock.readFragment.mockReturnValue(null);
			cookieStoreMock.get.mockReturnValue(undefined);
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(false);
			expect($kvTrackEventMock).toHaveBeenCalledWith(
				'event-tracking',
				'EXP-MP-1235-Jan2025',
				undefined
			);
		});

		it('should handle when readFragment returns undefined', () => {
			apolloMock.readFragment.mockReturnValue(undefined);
			cookieStoreMock.get.mockReturnValue(undefined);
			const result = getIsMyKivaEnabled(apolloMock, $kvTrackEventMock, true, cookieStoreMock);
			expect(result).toBe(false);
		});
	});

	describe('setPostLendingCardCookie', () => {
		it('should set the post lending card cookie if post lending is enabled', () => {
			const cookieStore = {
				set: vi.fn(),
			};
			const postLendingEnabled = true;

			setPostLendingCardCookie(cookieStore, postLendingEnabled);

			expect(cookieStore.set).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE, 'true', { path: '/' });
		});

		it('should not set the post lending card cookie if post lending is not enabled', () => {
			const cookieStore = {
				set: vi.fn(),
			};
			const postLendingEnabled = false;

			setPostLendingCardCookie(cookieStore, postLendingEnabled);

			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		it('should not throw an error if cookieStore is undefined', () => {
			expect(() => setPostLendingCardCookie(undefined, true)).not.toThrow();
		});
	});

	describe('checkPostLendingCardCookie', () => {
		it('should return true if the guest assignment cookie exists', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('true'),
			};

			const result = checkPostLendingCardCookie(cookieStore);

			expect(result).toBe(true);
			expect(cookieStore.get).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE);
		});

		it('should return false if the guest assignment cookie does not exist', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(undefined),
			};

			const result = checkPostLendingCardCookie(cookieStore);

			expect(result).toBe(false);
			expect(cookieStore.get).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE);
		});

		it('should return false if cookieStore is undefined', () => {
			const result = checkPostLendingCardCookie(undefined);

			expect(result).toBe(false);
		});
	});

	describe('removePostLendingCardCookie', () => {
		it('should remove post lending cookie', () => {
			const cookieStore = {
				remove: vi.fn(),
			};

			removePostLendingCardCookie(cookieStore);
			expect(cookieStore.remove).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE);
		});
	});
});
