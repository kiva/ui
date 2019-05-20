<template>
	<www-page class="ui-error-page">
		<div class="page-content row align-center">
			<div class="columns shrink">
				<h1>Oh no, something went wrong!</h1>
				<h2 v-if="description">
					{{ description }}
				</h2>
				<p class="message" v-if="loginRedirectUrl">
					Please <a :href="`${loginRedirectUrl}`">try again.</a>
				</p>
				<p>
					If you need us, we're always available at
					<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>
				</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: { WwwPage },
	inject: ['auth0Config'],
	metaInfo: {
		title: 'Error'
	},
	data() {
		return {
			errorCode: this.$route.query.error,
			errorDescription: this.$route.query.error_description,
			clientId: this.$route.query.client_id,
		};
	},
	computed: {
		description() {
			if (this.errorDescription === 'Access expired.') {
				return 'The link emailed to you has expired.';
			}
			return this.errorDescription;
		},
		loginRedirectUrl() {
			return this.auth0Config.loginRedirectUrls[this.clientId];
		},
	},
	created() {
		// eslint-disable-next-line no-console
		console.warn('Auth0 error:', this.$route.query);
	},
};
</script>

<style lang="scss">
@import 'settings';

.ui-error-page {
	.page-content {
		text-align: center;
		padding: 1.625rem 0;
	}

	h1 {
		margin: 1.5rem 0;
	}
}
</style>
