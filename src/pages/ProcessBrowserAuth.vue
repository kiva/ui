<template>
	<div></div>
</template>

<script>
import store2 from 'store2';

export default {
	name: 'ProcessBrowserAuth',
	inject: ['kvAuth0'],
	mounted() {
		const { state } = this.$route.query;
		if (state) {
			const auth0State = store2.session('auth0.state');
			if (auth0State === state) {
				const redirect = store2.session('auth0.redirect');

				store2.session.remove('auth0.state');
				store2.session.remove('auth0.redirect');

				this.$router.push(`${redirect}${window.location.hash}`);
			}
		}
	},
};
</script>
