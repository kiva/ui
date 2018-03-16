<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Available Routes</h1>
				<route-listing/>
				<p><router-link to="/">go home</router-link></p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import RouteListing from './RouteListing';

export default {
	components: { WwwPage, RouteListing },
	metaInfo: {
		title: 'Sitemap'
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
