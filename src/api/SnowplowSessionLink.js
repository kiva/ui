import { setContext } from '@apollo/client/link/context';
import _set from 'lodash/set';

function getSPCookieSession(cookieStore) {
	// kiva specific sp cookie
	const sp = cookieStore.get('_sp_id.6d5c');
	// handle missing cookie
	if (typeof sp === 'undefined') {
		return '';
	}
	const spCookieArray = sp.split('.');
	// get last item in the array, our session id
	const sessionId = spCookieArray[spCookieArray.length - 1];
	return sessionId;
}

export default ({ cookieStore }) => {
	return setContext((operation, previousContext) => {
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
