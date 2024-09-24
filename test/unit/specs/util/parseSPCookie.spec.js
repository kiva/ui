import CookieStore from '#src/util/cookieStore';
import parseSPCookie from '#src/util/parseSPCookie';

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
});
