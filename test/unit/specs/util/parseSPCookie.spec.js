import cookieStore from '@/util/cookieStore';
import parseSPCookie from '@/util/parseSPCookie';

describe('parseSPCookie.js', () => {
	afterEach(() => {
		cookieStore.reset({});
	});

	it('returns the user id and session id from the Snowplow cookie', () => {
		cookieStore.reset({
			'_sp_id.1234': 'snowplow-user-id-1234.1454737815.21.1459135379.1459124000.snowplow-session-id-5678'
		});
		expect(parseSPCookie()).toEqual({
			snowplowUserId: 'snowplow-user-id-1234',
			snowplowSessionId: 'snowplow-session-id-5678',
		});
	});

	it('returns an empty object if the Snowplow cookie is not present', () => {
		expect(parseSPCookie()).toEqual({});
	});
});
