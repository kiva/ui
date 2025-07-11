<template>
	<kv-carousel>
		<div class="slide-placeholder"></div>
		<kv-carousel-slide
			v-for="({ images, url, headline, subheadline }, index) in kivaContentBlockData"
			:key="`headline-${index}`"
			:class="`slide-${index}`"
		>
			<div class="row">
				<div class="columns small-12 hide-for-large small-image tw-text-center">
					<kv-responsive-image :images="images" alt="" />
				</div>
				<div class="columns small-12 large-7">
					<h1 class="headline">
						{{ headline }}
					</h1>
					<h3 class="subheadline">
						{{ subheadline }}
					</h3>
					<div class="action-button-wrapper">
						<kv-button
							class="smallest action-button"
							:href="url"
							v-kv-track-event="['possibility', 'click-kiva-content-block-read-more', 'giving-tuesday']"
						>
							Read more
						</kv-button>
					</div>
				</div>
				<div class="columns large-5 show-for-large">
					<kv-responsive-image :images="images" alt="Images of possibility" />
				</div>
			</div>
		</kv-carousel-slide>
	</kv-carousel>
</template>

<script>
import KvButton from '#src/components/Kv/KvButton';
import KvResponsiveImage from '#src/components/Kv/KvResponsiveImage';
import KvCarousel from '#src/components/Kv/KvCarousel';
import KvCarouselSlide from '#src/components/Kv/KvCarouselSlide';
import { metaGlobReader } from '#src/util/importHelpers';

const kivaContentBlockImageGlob = import.meta.glob(
	'/src/assets/images/possibilities-banners/kiva-content-block/**/*.*',
	{ eager: true }
);
const kivaContentBlockImageRequire = metaGlobReader(
	kivaContentBlockImageGlob,
	'/src/assets/images/possibilities-banners/kiva-content-block/'
);

export default {
	name: 'KivaContentBlock',
	components: {
		KvButton,
		KvResponsiveImage,
		KvCarousel,
		KvCarouselSlide,
	},
	data() {
		return {
			kivaContentBlockData: [
				{
					images: [
						['small', kivaContentBlockImageRequire('1x/Asset2.jpg')],
						['small retina', kivaContentBlockImageRequire('2x/Asset2@2x.jpg')]
					],
					url: '/blog/a-loan-to-one-entrepreneur-in-togo-impacts-his-whole-community',
					headline: 'Possibility in family traditions',
					subheadline: 'From a mother to her son — how one man turned possibility into a community dream'
				},
				{
					images: [
						['small', kivaContentBlockImageRequire('1x/Asset3.jpg')],
						['small retina', kivaContentBlockImageRequire('2x/Asset3@2x.jpg')]
					],
					url: '/blog/three-sisters-become-fish-farming-pioneers',
					headline: 'Possibility grows in ponds',
					subheadline: 'Pioneering possibility — a story of three sisters from Zimbabwe spreading knowledge'
				},
				{
					images: [
						['small', kivaContentBlockImageRequire('1x/Asset4.jpg')],
						['small retina', kivaContentBlockImageRequire('2x/Asset4@2x.jpg')]
					],
					url: '/blog/ernestina-is-a-skilled-carver-making-a-name-for-herself-in-a-male-dominated-craft',
					headline: 'Turning possibility into craft',
					// eslint-disable-next-line max-len
					subheadline: 'Carving a place for women in a male-dominated craft, Ernestina is more than a trailblazer'
				}
			]
		};
	},
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '#src/assets/scss/settings' as *;

$cta-color: #611b1f;
$cta-color2: #00244e;
$cta-color3: #02582e;

.kv-carousel {
	.kv-carousel-slide {
		width: 100%;
		background: $white;
	}

	.small-image {
		margin-bottom: 2rem;
	}

	.headline {
		color: $cta-color;
		font-weight: bold;
		max-width: 24rem;
		margin: 0 auto 1rem;
		text-align: center;

		@include breakpoint(large) {
			margin: unset;
			margin-bottom: 1rem;
			text-align: unset;
		}
	}

	.subheadline {
		font-weight: $global-weight-highlight;
		max-width: 24rem;
		margin: 0 auto 1.5rem;
		text-align: center;

		@include breakpoint(large) {
			margin: unset;
			margin-bottom: 2rem;
			text-align: unset;
		}
	}

	.action-button-wrapper {
		text-align: center;

		@include breakpoint(large) {
			text-align: unset;
		}

		.action-button {
			background-color: $cta-color;
			box-shadow: 0 2px color.adjust($cta-color, $lightness: -10%);

			&:hover,
			&:focus {
				background-color: color.adjust($cta-color, $lightness: -10%);
			}
		}
	}

	/* stylelint-disable */
	// Slide 1 color override
	.slide-0 {
		.headline {
			color: $cta-color2;
		}

		.action-button-wrapper .action-button {
			background-color: $cta-color2;
			box-shadow: 0 2px color.adjust($cta-color2, $lightness: -10%);

			&:hover,
			&:focus {
				background-color: color.adjust($cta-color2, $lightness: -10%);
			}
		}
	}

	// Slide 2 color override
	.slide-1 {
		.headline {
			color: $cta-color3;
		}

		.action-button-wrapper .action-button {
			background-color: $cta-color3;
			box-shadow: 0 2px color.adjust($cta-color3, $lightness: -10%);

			&:hover,
			&:focus {
				background-color: color.adjust($cta-color3, $lightness: -10%);
			}
		}
	}
	/* stylelint-enable */

	// This is brute force solution to the varing heights of the content within this component
	// In the furture slideshows should have a defined height, so we can avoid this customization.
	.slide-placeholder {
		padding-bottom: 39rem;

		@include breakpoint(360 up) {
			padding-bottom: 42rem;
		}

		@include breakpoint(420 up) {
			padding-bottom: 43rem;
		}

		@include breakpoint(481 up) {
			padding-bottom: 48rem;
		}

		@include breakpoint(510 up) {
			padding-bottom: 50rem;
		}

		@include breakpoint(535 up) {
			padding-bottom: 55rem;
		}

		@include breakpoint(630 up) {
			padding-bottom: 59rem;
		}

		@include breakpoint(680 up) {
			padding-bottom: 20rem;
		}
	}
}

</style>
