<template>
	<www-page
		class="autolending"
		:gray-background="true"
		:header-theme="greenHeader"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending settings</h1>
				<p class="h3">
					Make the impact you want even if you’re away from your account for a while
				</p>
			</div>
		</div>
		<router-view />
	</www-page>
</template>

<script>
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';
import { greenHeader } from '@/util/siteThemes';

export default {
	data() {
		return {
			greenHeader,
		};
	},
	components: {
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	metaInfo: {
		title: 'Auto-lending settings',
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.autolending {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}
}
</style>
