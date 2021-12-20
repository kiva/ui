import KvAuth0, { KIVA_ID_KEY, LAST_LOGIN_KEY, USED_MFA_KEY } from '@/util/KvAuth0';

function getKvAuth0WithFACookie(cookieValue) {
	return new KvAuth0({
		domain: '',
		clientID: '',
		cookieStore: {
			get: () => cookieValue,
			set: () => {},
		},
	});
}

describe('KvAuth0', () => {
	describe('Fake authentication', () => {
		describe('constructor', () => {
			it('does not set anything auth related when the cookie is undefined', () => {
				const kvAuth0 = getKvAuth0WithFACookie(undefined);
				expect(kvAuth0.user).toEqual(null);
				expect(kvAuth0.accessToken).toEqual('');
			});

			it('simulates being logged in when a user id is in the cookie', () => {
				const kvAuth0 = getKvAuth0WithFACookie('123');
				expect(kvAuth0.user[KIVA_ID_KEY]).toEqual(123);
				expect(kvAuth0.isMfaAuthenticated()).toEqual(false);
				expect(kvAuth0.isNotedLoggedIn()).toEqual(true);
				expect(kvAuth0.isNotedUserSessionUser()).toEqual(true);
			});

			it('makes isMfaAuthenticated return true when mfa is included in the cookie', () => {
				const kvAuth0 = getKvAuth0WithFACookie('456:recent/mfa');
				expect(kvAuth0.isMfaAuthenticated()).toEqual(true);
			});
		});

		describe('getFakeAuthCookieValue', () => {
			function expectValuesForCookie(cookie, expected) {
				const kvAuth0 = getKvAuth0WithFACookie(cookie);
				const fakeAuthInfo = kvAuth0.getFakeAuthCookieValue();
				expect(fakeAuthInfo).toEqual(expected);
			}

			it('returns undefined when no cookie is present', () => {
				expectValuesForCookie(undefined, undefined);
			});

			it('returns undefined when cookie does not have a valid user id', () => {
				expectValuesForCookie('abc', undefined);
				expectValuesForCookie('a12b', undefined);
				expectValuesForCookie(':recent', undefined);
			});

			it('returns user id and scopes when cookie contains a valid user id', () => {
				expectValuesForCookie('1a', { userId: 1, scopes: [] });
				expectValuesForCookie('123', { userId: 123, scopes: [] });
				expectValuesForCookie('456:', { userId: 456, scopes: [] });
				expectValuesForCookie('789:active', { userId: 789, scopes: ['active'] });
				expectValuesForCookie('123:recent/active', { userId: 123, scopes: ['recent', 'active'] });
				expectValuesForCookie('123:recent/active/mfa', { userId: 123, scopes: ['recent', 'active', 'mfa'] });
			});
		});

		describe('getFakeIdTokenPayload', () => {
			function expectUndefinedForCookie(cookie) {
				const kvAuth0 = getKvAuth0WithFACookie(cookie);
				const fakeIdTokenPayload = kvAuth0.getFakeIdTokenPayload();
				expect(fakeIdTokenPayload).not.toBeDefined();
			}
			function expectValuesForCookie(cookie, {
				id, lastLogin, mfa, scopes
			}) {
				const kvAuth0 = getKvAuth0WithFACookie(cookie);
				const fakeIdTokenPayload = kvAuth0.getFakeIdTokenPayload();
				expect(fakeIdTokenPayload[KIVA_ID_KEY]).toEqual(id);
				expect(fakeIdTokenPayload[LAST_LOGIN_KEY] / 1000).toBeCloseTo(lastLogin / 1000, 1);
				expect(fakeIdTokenPayload[USED_MFA_KEY]).toEqual(mfa);
				expect(fakeIdTokenPayload.scopes).toEqual(scopes);
			}

			it('returns undefined when no cookie is present', () => {
				expectUndefinedForCookie(undefined);
			});

			it('returns undefined when cookie does not have a valid user id', () => {
				expectUndefinedForCookie('abc');
				expectUndefinedForCookie('a12b');
				expectUndefinedForCookie(':recent');
			});

			it('returns user id, last login time, mfa status, and scopes when cookie contains a valid user id', () => {
				const recent = Date.now();
				const active = Date.now() - (1 + (5 * 60)) * 1000; // 5 minutes and 1 second before now
				const passive = Date.now() - (1 + (60 * 60)) * 1000; // 1 hour and 1 second before now

				expectValuesForCookie('1a', {
					id: 1, lastLogin: passive, mfa: false, scopes: []
				});
				expectValuesForCookie('123', {
					id: 123, lastLogin: passive, mfa: false, scopes: []
				});
				expectValuesForCookie('456:', {
					id: 456, lastLogin: passive, mfa: false, scopes: []
				});
				expectValuesForCookie('789:active', {
					id: 789, lastLogin: active, mfa: false, scopes: ['active']
				});
				expectValuesForCookie('123:recent/active', {
					id: 123, lastLogin: recent, mfa: false, scopes: ['recent', 'active']
				});
				expectValuesForCookie('456:recent/active/mfa', {
					id: 456, lastLogin: recent, mfa: true, scopes: ['recent', 'active', 'mfa']
				});
			});
		});
	});
});
