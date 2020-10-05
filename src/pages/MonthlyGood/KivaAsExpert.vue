<template>
	<div class="kiva-as-expert-section-wrapper" id="kiva-as-expert">
		<div class="row">
			<div class="small-12 columns">
				<h2 class="impact-text">
					10 years, $1 billion in impact
				</h2>
			</div>
			<div class="small-12 large-7 columns">
				<p>
					<!-- eslint-disable-next-line max-len -->
					With more than $1 billion in loans funded, Kiva is a leading global nonprofit creating opportunity for communities in need around the world. Your support will help us continue to push boundaries, from offering flexible loan terms that help farmers deal with unpredictable weather to providing capital to refugees in need of stability.
				</p>
				<kv-responsive-image
					:images="billionImpactImages"
					class="hide-for-large community-image"
					alt="10 years and $1 billion in loans funded"
				/>
				<p class="join-the-movement">
					<!-- eslint-disable-next-line max-len -->
					Join the movement of over <strong>1.6 million lenders</strong> who’ve supported <strong>2.5 million borrowers</strong>.
				</p>
				<slot name="form"></slot>
			</div>

			<div class="large-5 columns">
				<kv-responsive-image
					:images="billionImpactImages"
					class="show-for-large community-image"
					alt="10 years and $1 billion in loans funded"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const billionImpactImagesRequire = require.context('@/assets/images/10-years-billion-impact', true);

export default {
	data() {
		return {
			billionImpactImages: [
				['small', billionImpactImagesRequire('./10-years-billion-impact_ghost.jpg')],
				['small retina', billionImpactImagesRequire('./10-years-billion-impact_2x_ghost.jpg')],
			]
		};
	},
	components: {
		KvResponsiveImage
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.kiva-as-expert-section-wrapper {
	padding: 2rem 0 3rem;
	background-color: $ghost;

	h2 {
		color: $kiva-green;
		margin-bottom: 1.85rem;
	}

	.community-image {
		padding: 1.25rem;
		width: 100%;
	}

	.hide-for-large.community-image {
		max-width: 25rem;
		display: block;
		margin: 0 auto;
	}

	.join-the-movement {
		padding: 1.85rem 0;
	}
}
</style>
