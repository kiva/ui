<template>
	<div>
		<kv-hero>
			<template #images>
				<kv-responsive-image :images="yearEndImages" alt="Be a part of Possibility" />
			</template>
			<template #action>
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
			<div class="tw-text-center columns large-10 large-offset-1">
				<p>
					Help us turn possibility into reality for borrowers around the world.
				</p>
			</div>
		</div>

		<!--
		<div class="row">
			<div class="columns large-12">
				<kivan-slider />
			</div>
		</div>
		-->
		<div class="row dual-cta">
			<div class="small-12 large-6 tw-text-center dual-cta-block">
				<router-link class="dual-cta-link" to="/blog/what-your-donations-really-do">
					<h2 class="dual-cta-header">
						Already donated?
					</h2>
					<p class="dual-cta-body">
						Take a look at the impact you made<br> with your contribution.
					</p>
					<sketchy-arrow class="sketchy-arrow" />
				</router-link>
			</div>
			<div class="small-12 large-6 tw-text-center dual-cta-block">
				<router-link class="dual-cta-link" to="/donate/supportus">
					<h2 class="dual-cta-header">
						Haven't donated yet?
					</h2>
					<p class="dual-cta-body">
						There's still time! Help us<br> empower borrowers.
					</p>
					<sketchy-arrow class="sketchy-arrow" />
				</router-link>
			</div>
		</div>

		<!-- Kiva Content Block -->
		<div class="row kiva-stories">
			<div class="columns small-12 large-10 large-offset-1">
				<kiva-content-block />
			</div>
		</div>
		<br><br>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
// import KivanSlider from '@/pages/Possibility/KivanSlider'; // replaced by KvCarousel
import SketchyArrow from '@/assets/inline-svgs/sketchy-arrow.svg';
import KivaContentBlock from '@/pages/Possibility/KivaContentBlock';

const yearEndImagesRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	name: 'YearEnd',
	components: {
		KvButton,
		KvHero,
		KvResponsiveImage,
		// KivanSlider, // replaced by KvCarousel
		SketchyArrow,
		KivaContentBlock,
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

$blue: #015a76;
$dark_blue: #00244e;

.sketchy-arrow {
	display: block;
	margin: 0 auto;
	width: 6.5rem;

	path {
		fill: $blue;
	}
}

.intro,
.dual-cta {
	margin-bottom: 1.5rem;
}

.dual-cta-block {
	margin-bottom: 3rem;
}

.dual-cta-header {
	font-weight: $global-weight-bold;
}

.dual-cta-body {
	font-size: $medium-text-font-size;
	line-height: $subheader-lineheight;
}

.dual-cta-link {
	color: $blue;

	&:hover,
	&:focus,
	&:active {
		color: $dark_blue;
		text-decoration: none;

		.dual-cta-header {
			text-decoration: underline;
		}

		.sketchy-arrow {
			path {
				fill: $dark_blue;
			}
		}
	}
}
</style>
