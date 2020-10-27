<template>
	<www-page class="security-login" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>
					Security and login
				</h1>
			</div>
		</div>
		<div class="security-settings-page">
			<password />
			<two-step-verification />
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import Password from './Password';
import TwoStepVerification from './TwoStepVerification';

export default {
	components: {
		WwwPage,
		Password,
		TwoStepVerification,
	},
	metaInfo: {
		title: 'Security and login',
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
