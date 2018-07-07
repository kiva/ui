<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Available Routes</h1>
				<route-listing/>
				<br><hr><br>
				<a @click.prevent="$showTipMsg('global message')">Default Tip Message</a> -
				<a @click.prevent="$showTipMsg('global message', 'warning')">Warning Tip Message</a> -
				<a @click.prevent="$showTipMsg('global message', 'error', true)">Error Tip Message</a> -
				<a @click.prevent="$closeTipMsg()">Close Tip Message</a>
				<br><br>
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
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
