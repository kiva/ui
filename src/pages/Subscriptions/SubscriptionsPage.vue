<template>
	<www-page class="subscriptions" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="title-area">
			<div class="row column">
				<h1>Subscription settings</h1>
			</div>
		</div>
		<router-view />
	</www-page>
</template>

<script>
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu
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
