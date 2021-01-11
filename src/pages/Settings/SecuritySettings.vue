<template>
	<www-page class="security-login-page" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="security-login__title-area">
			<div class="row column">
				<h1>
					Security and login
				</h1>
			</div>
		</div>
		<div class="row">
			<div class="columns small-12 large-8 security-login-page__component-container">
				<password />
				<two-step-verification />
			</div>
			<div class="columns small-12 large-4 security-login-page__component-container">
				<two-step-faq />
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import Password from '@/components/Settings/Password';
import TwoStepVerification from '@/components/Settings/TwoStepVerification';
import TwoStepFaq from '@/components/Settings/TwoStepFaq';

export default {
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		Password,
		TwoStepVerification,
		TwoStepFaq,
	},
	metaInfo: {
		title: 'Security and login',
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.security-login-page {
	&__title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	&__component-container {
		padding: 0;

		@include breakpoint(medium) {
			padding: unset;
		}
	}
}

</style>
