<template>
	<www-page
		class="subscriptions"
		:gray-background="true"
		:header-theme="greenHeader"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-4">
					Subscription settings
				</h1>
			</div>
			<subscriptions-settings-cards />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import { greenHeader } from '@/util/siteThemes';
import SubscriptionsSettingsCards from '@/components/Settings/SubscriptionsSettingsCards';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';

export default {
	data() {
		return {
			greenHeader,
		};
	},
	components: {
		KvDefaultWrapper,
		SubscriptionsSettingsCards,
		TheMyKivaSecondaryMenu,
		WwwPage
	},
	metaInfo: {
		title: 'Subscription settings',
	},
};
</script>
