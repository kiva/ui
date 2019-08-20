<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>NEW UI HOMEPAGE</h1>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage
	},
	metaInfo: {
		title: 'Sitemap'
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
