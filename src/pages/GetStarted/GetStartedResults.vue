<template>
	<div>
		<kv-progress-bar value="100" max="100" />
		<div class="row page-content">
			<div class="small-12 ">
				<h1>Here are X people you can support!</h1>
				<p>
					In fact, we found X people that we think you’ll love to lend to.
					<!-- <router-link>View all loans</router-link> -->
				</p>
				<div>loans here</div>

				<section>
					<h2>Looking for different loans?</h2>
				</section>

				<section>
					<h2>Here's how it works</h2>
				</section>

				<section>
					<h2>Frequently asked questions</h2>
				</section>
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
		title: 'Results - Get Started'
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
