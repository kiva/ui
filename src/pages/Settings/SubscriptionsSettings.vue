<template>
	<www-page
		class="subscriptions"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<div>
				<h1 class="tw-mb-4">
					Subscription settings
				</h1>
			</div>
			<subscriptions-settings-cards />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import SubscriptionsSettingsCards from '#src/components/Settings/SubscriptionsSettingsCards';
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';

export default {
	name: 'SubscriptionsSettings',
	components: {
		KvDefaultWrapper,
		SubscriptionsSettingsCards,
		TheMyKivaSecondaryMenu,
		WwwPage
	},
	head: {
		title: 'Subscription settings',
	},
};
</script>
