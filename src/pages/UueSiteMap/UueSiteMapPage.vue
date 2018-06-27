<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1 @click="showCustomMessage()">Available Routes</h1>
				<route-listing/>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import RouteListing from './RouteListing';

export default {
	components: { WwwPage, RouteListing },
	inject: ['apollo'],
	metaInfo: {
		title: 'Sitemap'
	},
	methods: {
		showCustomMessage() {
			this.$showTipMsg('global message', 'warning');
		}
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
