<template>
	<www-page class="ui-error-page">
		<div class="page-content row">
			<div class="columns">
				<h1>Oh no, something went wrong!</h1>
				<div class="message">Please <a :href="`${loginRedirectUrl}`">try again.</a></div>
				<div class="contact">
					If you need us, we're always available at
					<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: { WwwPage },
	inject: ['apollo'],
	metaInfo: {
		title: 'Error'
	},
	data() {
		return {
			errorCode: this.$route.query.error,
			errorDescription: this.$route.query.error_description,
			clientId: this.$route.query.client_id,
			loginRedirectUrl: this.$route.query.login_redirect_url
		};
	},
	mounted() {
		console.log(`Auth0 error: ${this.errorCode}`);
	}
};
</script>

<style lang="scss">
@import 'settings';

.ui-error-page {
	.page-content {
		text-align: center;
		padding: 1.625rem 0;
		font-size: 1.125rem;
		font-weight: 400;
	}
	h1 {
		margin: 1.5rem;
	}
	.contact {
		margin-bottom: 1rem;
	}
}

</style>
