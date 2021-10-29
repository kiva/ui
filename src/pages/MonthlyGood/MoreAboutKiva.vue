<template>
	<div class="more-about-kiva-section-wrapper row
			tw-py-4 md:tw-py-6 lg:tw-py-8"
		id="more-about-kiva"
	>
		<div class="small-12 columns">
			<h2 class="tw-mb-4">
				More about Kiva
			</h2>
		</div>
		<p class="small-12 large-7 columns tw-mb-4">
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
	display: block;
	margin: 0 auto 2rem;
	max-height: 8.125rem;
}
</style>
