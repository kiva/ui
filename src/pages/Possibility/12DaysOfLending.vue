<template>
	<div>
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="twelveDaysImages" alt="Be a part of Possibility: 12 Days of Lending" />
			</template>
		</kv-hero>
	</div>
</template>

<script>
// import KvButton from '@/components/Kv/KvButton';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const possibilitiesImageRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	components: {
		// KvButton,
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
@import "settings";

</style>
