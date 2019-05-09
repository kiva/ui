<template>
	<div></div>
</template>

<script>
import store2 from 'store2';

export default {
	inject: ['kvAuth0'],
	mounted() {
		const hashKey = 'auth0.browser_hash';

		if (window.location.hash) {
			// store hash for after post-auth redirect
			store2.session(hashKey, window.location.hash);
			// post-auth redirect
			window.location = '/authenticate/ui?doneUrl=/process-browser-auth';
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
