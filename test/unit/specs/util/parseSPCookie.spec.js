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

	it('returns the session id, not the last field, from the newer Snowplow cookie format', () => {
		// Newer trackers (3.5 and up) add four fields after the session id
		const cookieStore = new CookieStore({
			'_sp_id.1234': [
				'domain-user-id', 'created-timestamp', 'visit-count', 'current-timestamp', 'last-visit-timestamp',
				'session-id', 'previous-session-id', 'first-event-id', 'first-event-timestamp', 'event-index',
			].join('.'),
		});
		expect(parseSPCookie(cookieStore)).toEqual({
			snowplowUserId: 'domain-user-id',
			snowplowSessionId: 'session-id',
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
		// The cookie has no 6th field, so there is no session id
		const result = parseSPCookie(cookieStore);
		expect(result.snowplowUserId).toBe('singlevalue');
		expect(result.snowplowSessionId).toBeUndefined();
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
