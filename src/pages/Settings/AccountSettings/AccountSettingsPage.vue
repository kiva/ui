<template>
	<www-page
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<div>
				<h1 class="tw-mb-4">
					Account Settings
				</h1>
			</div>
			<account-settings-personal-info />
			<account-settings-email />
			<account-settings-lender-profile />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import AccountSettingsPersonalInfo from './components/AccountSettingsPersonalInfo';
import AccountSettingsEmail from './components/AccountSettingsEmail';
import AccountSettingsLenderProfile from './components/AccountSettingsLenderProfile';

export default {
	name: 'AccountSettingsPage',
	components: {
		AccountSettingsEmail,
		AccountSettingsLenderProfile,
		AccountSettingsPersonalInfo,
		KvDefaultWrapper,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	head: {
		title: 'Account settings',
	},
};
</script>
