<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Available Routes</h1>
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
	mounted() {
		// console.log(this);
		// console.log(typeof this.$tipMsg);
		// this.$ti	pMsg('some message', 'some type');
		// console.log(this.$root);
		// console.log(typeof this.$root.$tipMsg);
		// console.log(typeof this.uiTipMsg);
		// console.log(typeof this.$root.uiTipMsg);
		this.$tipMsg({
			apolloClient: this.apollo,
			tipMsg: 'global message',
			tipMsgType: 'global type',
			showTipOnLoad: true
		});
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
