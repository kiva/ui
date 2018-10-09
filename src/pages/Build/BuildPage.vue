<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Developer Home</h1>
				<p>{{ developerDescription }}</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';

export default {
	components: {
		WwwPage,
		DeveloperSecondaryMenu,
	},
	metaInfo: {
		title: 'Developer Home'
	},
	data() {
		return {
			// eslint-disable-next-line max-len
			developerDescription: 'Developers worldwide are helping us make it easy and transparent to lend to the working poor via microfinance and the Kiva API. This is the home for all the information and tools you need to join us!',
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
