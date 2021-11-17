<template>
	<www-page
		:header-theme="headerTheme"
	>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Available Routes</h1>
				<route-listing />
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import { lightHeader } from '@/util/siteThemes';
import RouteListing from './RouteListing';

export default {
	data() {
		return {
			headerTheme: lightHeader,
		};
	},
	components: {
		WwwPage,
		RouteListing
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
