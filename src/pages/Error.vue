<template>
	<www-page class="ui-error-page">
		<div class="page-content row align-center">
			<div class="columns shrink">
				<template v-if="errorDescription === 'force_password_reset'">
					<h1>New password required</h1>
					<p>
						It's been a while since we've seen you, so we need you to reset your password.
					</p>
					<p class="message" v-if="loginRedirectUrl">
						Please
						<a :href="`${loginRedirectUrl}`">return to login</a>
						and click "{{ forgotPasswordText }}" to continue.
					</p>
				</template>
				<template v-else>
					<h1>Oh no, something went wrong!</h1>
					<h2 v-if="description">
						{{ description }}
					</h2>
					<p class="message" v-if="loginRedirectUrl">
						Please <a :href="`${loginRedirectUrl}`">try again.</a>
					</p>
				</template>
				<p>
					If you need us, we're always available at
					<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>
				</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import sanitize from 'sanitize-html';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: { WwwPage },
	metaInfo: {
		title: 'Error'
	},
	data() {
		return {
			errorCode: this.$route.query.error,
			errorDescription: sanitize(this.$route.query.error_description),
			clientId: this.$route.query.client_id,
			lenderLogin: this.$route.query.lender_login !== '0'
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
			return this.$appConfig.auth0.loginRedirectUrls[this.clientId];
		},
		forgotPasswordText() {
			return this.lenderLogin ? 'Forgot your password?' : 'Don\'t remember your password?';
		}
	},
	created() {
		// eslint-disable-next-line no-console
		console.warn('Auth0 error:', JSON.stringify(this.$route.query));
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
