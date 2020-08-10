<template>
	<div>
		<kv-progress-bar value="66" max="100" />
		<div class="row page-content">
			<div class="small-12 large-5 columns">
				<h1>Choose places <br class="lu">you care about</h1>
				<p>
					You can lend to people in 6 continents and 77 countries thanks to our
					Field Partners — local banks, NGOs, and social enterprises in each region.
				</p>
			</div>
			<div class="small-12 large-6 large-offset-1 columns">
				places checkboxes go here
			</div>
		</div>
	</div>
</template>

<script>
import KvProgressBar from '@/components/Kv/KvProgressBar';

export default {
	components: {
		KvProgressBar,
	},
	metaInfo: {
		title: 'Places - Get Started'
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
