<template>
	<div>
		<kv-hero>
			<template v-slot:images>
				<kv-responsive-image :images="yearEndImages" alt="Be a part of Possibility" />
			</template>
			<template v-slot:action>
				<kv-button
					class="cta-button"
					to="/donate/supportus"
					v-kv-track-event="['possibiliy', 'click-hero-link', 'year-end']"
				>
					Donate to Kiva
				</kv-button>
			</template>
		</kv-hero>
		<div class="row intro">
			<div class="text-center featured-text columns large-10 large-offset-1">
				<p>
					Help us turn possibility into reality for borrowers around the world.
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const yearEndImagesRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage,
	},
	metaInfo: {
		title: 'Year End'
	},
	data() {
		return {
			yearEndImages: [
				['small', yearEndImagesRequire('./Phase3-sm-std.jpg')],
				['small retina', yearEndImagesRequire('./Phase3-sm-retina.jpg')],
				['medium', yearEndImagesRequire('./Phase3-med-std.jpg')],
				['medium retina', yearEndImagesRequire('./Phase3-med-retina.jpg')],
				['large', yearEndImagesRequire('./Phase3-lg-std.jpg')],
				['large retina', yearEndImagesRequire('./Phase3-lg-retina.jpg')],
				['xga', yearEndImagesRequire('./Phase3-xl-std.jpg')],
				['xga retina', yearEndImagesRequire('./Phase3-xl-retina.jpg')],
				['wxga', yearEndImagesRequire('./Phase3-xxl-std.jpg')],
				['wxga retina', yearEndImagesRequire('./Phase3-xxl-retina.jpg')]
			],
		};
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

</style>
