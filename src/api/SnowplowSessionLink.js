import { setContext } from 'apollo-link-context';
import _set from 'lodash/set';

function getSPCookieSession(cookies) {
	// kiva specific sp cookie
	const sp = cookies.get('_sp_id.6d5c');
	// handle missing cookie
	if (typeof sp === 'undefined') {
		return '';
	}
	const spCookieArray = sp.split('.');
	// get last item in the array, our session id
	const sessionId = spCookieArray[spCookieArray.length - 1];
	return sessionId;
}

export default ({ cookies }) => {
	return setContext((operation, previousContext) => {
		// fetch session id
		const spSessionId = getSPCookieSession(cookies);
		// pass along existing context if no session id exists
		if (spSessionId === '') {
			return previousContext;
		}
		// add header to existing context and pass along
		return _set(previousContext, 'headers.X-Session-Id', spSessionId);
	});
};
