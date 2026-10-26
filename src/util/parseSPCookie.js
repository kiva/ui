import _find from 'lodash/find';

export default function parseSPCookie(cookieStore) {
	// get the cookie that has a name that starts with '_sp_id'
	const cookie = _find(cookieStore.getAll(), (val, key) => key.indexOf('_sp_id') === 0);
	if (!cookie) {
		// return an empty object if the cookie isn't present
		return {};
	}

	// split the cookie to get the data
	const data = cookie.split('.');

	// return the user id and sessionid if they were fetched, otherwise return an empty object
	// the session id is the 6th field, newer Snowplow trackers add more fields after it
	return data.length ? {
		snowplowUserId: data[0],
		snowplowSessionId: data[5],
	} : {};
}
