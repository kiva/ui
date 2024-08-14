<template>
	<div></div>
</template>

<script>
import store2 from 'store2';

export default {
	name: 'ProcessBrowserAuth',
	inject: ['kvAuth0'],
	mounted() {
		const { hash } = window.location;
		const state = new URLSearchParams(hash?.substring(1) ?? '').get('state');

		if (state) {
			const auth0State = store2.session('auth0.state');
			if (auth0State === state) {
				const redirect = store2.session('auth0.redirect');

				store2.session.remove('auth0.state');
				store2.session.remove('auth0.redirect');

				this.$router.push(`${redirect}${hash}`);
			} else {
				this.goToErrorPage('state_mismatch');
			}
		} else {
			this.goToErrorPage('missing_state');
		}
	},
	methods: {
		goToErrorPage(error) {
			this.$router.push({
				path: '/error',
				query: {
					error,
					error_description: 'You may have clicked on an old or invalid link. Please try again.',
				},
			});
		},
	},
};
</script>
