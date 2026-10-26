import { setContext } from '@apollo/client/link/context/index';
import _set from 'lodash/set';

// newer Snowplow trackers add fields after the session id
const SESSION_ID_FIELD_INDEX = 5;

function getSPCookieSession(cookieStore) {
	// kiva specific sp cookie
	const sp = cookieStore.get('_sp_id.6d5c');
	// handle missing cookie
	if (typeof sp === 'undefined') {
		return '';
	}
	const spCookieArray = sp.split('.');
	return spCookieArray[SESSION_ID_FIELD_INDEX] || '';
}

export default ({ cookieStore }) => {
	return setContext((operation, previousContext) => {
		if (!cookieStore) return previousContext;

		// fetch session id
		const spSessionId = getSPCookieSession(cookieStore);
		// pass along existing context if no session id exists
		if (spSessionId === '') {
			return previousContext;
		}
		// add header to existing context and pass along
		return _set(previousContext, 'headers.X-Session-Id', spSessionId);
	});
};
