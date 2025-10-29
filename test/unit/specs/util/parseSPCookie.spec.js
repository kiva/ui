import CookieStore from '../../../../src/util/cookieStore';
import parseSPCookie from '../../../../src/util/parseSPCookie';

describe('parseSPCookie.js', () => {
	it('returns the user id and session id from the Snowplow cookie', () => {
		const cookieStore = new CookieStore({
			'_sp_id.1234': 'snowplow-user-id-1234.1454737815.21.1459135379.1459124000.snowplow-session-id-5678'
		});
		expect(parseSPCookie(cookieStore)).toEqual({
			snowplowUserId: 'snowplow-user-id-1234',
			snowplowSessionId: 'snowplow-session-id-5678',
		});
	});

	it('returns an empty object if the Snowplow cookie is not present', () => {
		const cookieStore = new CookieStore();
		expect(parseSPCookie(cookieStore)).toEqual({});
	});

	it('returns an empty object if the cookie data is empty', () => {
		const cookieStore = new CookieStore({
			'_sp_id.1234': ''
		});
		expect(parseSPCookie(cookieStore)).toEqual({});
	});

	it('handles cookie with a single value without periods', () => {
		const cookieStore = new CookieStore({
			'_sp_id.1234': 'singlevalue'
		});
		// When split('.') returns a single element array, both userId and sessionId are the same value
		expect(parseSPCookie(cookieStore)).toEqual({
			snowplowUserId: 'singlevalue',
			snowplowSessionId: 'singlevalue',
		});
	});

	it('correctly handles cookie with different _sp_id prefix', () => {
		const cookieStore = new CookieStore({
			'_sp_id.9999': 'user-abc.123.45.678.901.session-xyz'
		});
		expect(parseSPCookie(cookieStore)).toEqual({
			snowplowUserId: 'user-abc',
			snowplowSessionId: 'session-xyz',
		});
	});
});
