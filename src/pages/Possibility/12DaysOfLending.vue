<template>
	<div>
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="twelveDaysImages" alt="Be a part of Possibility: 12 Days of Lending" />
			</template>
		</kv-hero>
		<div class="row intro">
			<div class="text-center featured-text columns large-10 large-offset-1">
				<p>
					Join us in a series of daily challenges to amplify your impact! Check back every morning
					to see what surprises we have up our sleeves. Can't wait? Click below to support
					a borrower and be a part of possibility.
				</p>
				<router-link
					to="/lend-by-category"
					class="cta-link"
					v-kv-track-event="['possibiliy', 'click-intro-link', '12-days-of-lending']"
				>
					Lend now
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const possibilitiesImageRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	components: {
		KvHero,
		KvResponsiveImage,
	},
	metaInfo: {
		title: '12 Days of Lending'
	},
	data() {
		return {
			twelveDaysImages: [
				['small', possibilitiesImageRequire('./Phase2-sm-std.jpg')],
				['small retina', possibilitiesImageRequire('./Phase2-sm-retina.jpg')],
				['medium', possibilitiesImageRequire('./Phase2-med-std.jpg')],
				['medium retina', possibilitiesImageRequire('./Phase2-med-retina.jpg')],
				['large', possibilitiesImageRequire('./Phase2-lg-std.jpg')],
				['large retina', possibilitiesImageRequire('./Phase2-lg-retina.jpg')],
				['xga', possibilitiesImageRequire('./Phase2-xl-std.jpg')],
				['xga retina', possibilitiesImageRequire('./Phase2-xl-retina.jpg')],
				['wxga', possibilitiesImageRequire('./Phase2-xxl-std.jpg')],
				['wxga retina', possibilitiesImageRequire('./Phase2-xxl-retina.jpg')]
			],
		};
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$cta-color: #02582e;

.intro {
	margin-bottom: 4rem;
}

.cta-link {
	color: $cta-color;
	font-weight: $global-weight-bold;
}
</style>
