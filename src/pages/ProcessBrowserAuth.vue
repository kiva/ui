<template>
	<div></div>
</template>

<script>
import store2 from 'store2';
import cookieStore from '@/util/cookieStore';

function checkHashSuccess(hash) {
	if (hash.indexOf('error') > -1) {
		return false;
	}
	if (hash.indexOf('access_token') === -1 &&
		hash.indexOf('id_token') === -1 &&
		hash.indexOf('refresh_token') === -1) {
		return false;
	}
	return true;
}

export default {
	inject: ['kvAuth0'],
	mounted() {
		const hashKey = 'auth0.browser_hash';

		if (window.location.hash) {
			const { hash } = window.location;

			if (checkHashSuccess(hash)) {
				// note the user as logged in
				cookieStore.set('kvls', 'i', { secure: true });
				// store hash for after post-auth redirect
				store2.session(hashKey, hash);
				// post-auth redirect
				window.location = '/authenticate/ui?doneUrl=/process-browser-auth';
			} else {
				// some problem occured, so close the window and let normal error handling take over
				this.kvAuth0.popupCallback({ hash });
			}
		} else {
			// fetch & erase stored hash
			const hash = store2.session(hashKey);
			store2.session.remove(hashKey);
			// final callback
			this.kvAuth0.popupCallback({ hash });
		}
	},
};
</script>
