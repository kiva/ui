<template>
	<div class="more-about-kiva-section-wrapper row" id="more-about-kiva">
		<div class="small-12 columns">
			<h2 class="impact-text">
				More about Kiva
			</h2>
		</div>
		<p class="small-12 large-7 columns">
			<!-- eslint-disable-next-line max-len -->
			Kiva is an international nonprofit, founded in 2005 and based in San Francisco, with a mission of expanding financial access to help underserved communities thrive. We celebrate and support people looking to create a better future for themselves, their families and their communities.
		</p>
		<div class="small-12 large-5 columns">
			<icon-kiva-promise class="icon-kiva-promise" />
		</div>
		<p class="small-12 columns">
			<!-- eslint-disable-next-line max-len -->
			100% of funds lent on Kiva go to the field. Optional donations and support from our partners fund Kiva’s operations.
		</p>
	</div>
</template>

<script>
import IconKivaPromise from '@/assets/inline-svgs/kiva-promise.svg';

export default {
	components: {
		IconKivaPromise
	},
	data() {
		return {
		};
	},

};
</script>

<style lang="scss" scoped>
@import 'settings';

.icon-kiva-promise {
	fill: transparent;
	color: $charcoal;
	display: block;
	margin: 0 auto 2rem;
	max-height: 8.125rem;
}

.more-about-kiva-section-wrapper {
	padding: 2rem 0 2.5rem;

	h2 {
		color: $kiva-green;
		margin-bottom: 1.85rem;
	}
}
</style>
