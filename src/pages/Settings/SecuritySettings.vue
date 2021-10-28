<template>
	<www-page class="security-login-page" :gray-background="true">
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-4">
					Security and login
				</h1>
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
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import Password from '@/components/Settings/Password';
import TwoStepVerification from '@/components/Settings/TwoStepVerification';
import TwoStepFaq from '@/components/Settings/TwoStepFaq';

export default {
	components: {
		KvDefaultWrapper,
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
