<template>
	<div class="about">
		<div class="row">
			<div class="small-12 large-6 columns">
				<kv-responsive-image class="about__img" :images="aboutImageSet" alt="" />
			</div>
			<div class="small-12 large-6 columns">
				<h2 class="tw-mb-2">
					Over $1.4 billion in impact in <span class="no-wrap">70+ countries</span>
				</h2>
				<p class="tw-mb-2">
					Kiva is an international nonprofit, founded in 2005 in San Francisco, with a mission
					to expand financial access to help underserved communities thrive and in some cases,
					provide relief when crises may arise.
				</p>
				<p class="tw-mb-2">
					We do this by crowdfunding loans and unlocking capital for the underserved, improving
					the quality and cost of financial services, and addressing the underlying barriers to
					financial access around the world. Through Kiva's work, students can pay for tuition,
					women can start businesses, farmers are able to invest in equipment and families can
					afford needed emergency care.
				</p>
				<p class="tw-mb-2">
					By lending as little as $25 on Kiva, you can be part of the solution and make a real
					difference in someone’s life.
				</p>
				<p>
					<strong>
						100% of every dollar you lend on Kiva goes to funding loans.
					</strong>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const billionImpactImagesRequire = require.context('@/assets/images/10-years-billion-impact', true);

export default {
	components: {
		KvResponsiveImage
	},
	data() {
		return {
			aboutImageSet: [
				['small', billionImpactImagesRequire('./10-years-billion-impact_ghost.jpg')],
				['small retina', billionImpactImagesRequire('./10-years-billion-impact_2x_ghost.jpg')],
			]
		};
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.about {
	&__img {
		width: 100%;
		margin-bottom: 2rem;

		@include breakpoint(large) {
			margin-bottom: 0;
			padding-right: 2rem;
		}
	}
}
</style>
