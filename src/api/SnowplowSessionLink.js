import { setContext } from '@apollo/client/link/context/index';
import _set from 'lodash/set';

function getSPCookieSession(cookieStore) {
	// kiva specific sp cookie
	const sp = cookieStore.get('_sp_id.6d5c');
	// handle missing cookie
	if (typeof sp === 'undefined') {
		return '';
	}
	const spCookieArray = sp.split('.');
	// the session id is the 6th field, newer Snowplow trackers add more fields after it
	return spCookieArray[5] || '';
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
