<template>
	<www-page class="security-login" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="title-area">
			<div class="row column">
				<h2 class="strong">
					Security and login
				</h2>
			</div>
		</div>
		<div class="security-settings-page">
			<password />
			<two-step-verification />
		</div>
	</www-page>
</template>

<script>
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import Password from './Password';
import TwoStepVerification from './TwoStepVerification';

export default {
	components: {
		Password,
		TheMyKivaSecondaryMenu,
		TwoStepVerification,
		WwwPage,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.security-login {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}
}

</style>
