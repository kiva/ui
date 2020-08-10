<template>
	<div>
		<kv-progress-bar value="33" max="100" />
		<div class="row page-content">
			<div class="small-12 large-5 columns">
				<h1>Choose causes <br class="lu">you care about</h1>
				<p>
					With Kiva, you can choose causes you care about and borrowers to support.
					You’ll get updates from borrowers as they repay their loan.
				</p>
			</div>
			<div class="small-12 large-6 large-offset-1 columns">
				cause checkboxes go here
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
		title: 'Get Started'
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
