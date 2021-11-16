<template>
	<www-page
		class="subscriptions"
		:header-theme="headerTheme"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<div class="title-area">
			<div class="row column">
				<h1>Subscription settings</h1>
			</div>
		</div>
		<subscriptions-settings-cards />
	</www-page>
</template>

<script>
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import { lightHeader } from '@/util/siteThemes';
import SubscriptionsSettingsCards from '@/components/Settings/SubscriptionsSettingsCards';

export default {
	data() {
		return {
			headerTheme: lightHeader,
		};
	},
	components: {
		SubscriptionsSettingsCards,
		TheMyKivaSecondaryMenu,
		WwwPage
	},
	metaInfo: {
		title: 'Subscription settings',
	},
};
</script>

<style lang="scss">
@import 'settings';

.subscriptions {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}
}
</style>
