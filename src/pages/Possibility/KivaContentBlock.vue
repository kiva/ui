<template>
	<kv-carousel @change="slideChange">
		<div class="slide-placeholder"></div>
		<kv-carousel-slide :key="headline" v-for="{ images, url, headline, subheadline } in kivaContentBlockData">
			<div class="row">
				<div class="columns small-12 hide-for-large small-image">
					<kv-responsive-image :images="images" />
				</div>
				<div class="columns small-12 large-8 kiva-content-text">
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
				<div class="columns large-4 show-for-large">
					<kv-responsive-image :images="images" />
				</div>
			</div>
		</kv-carousel-slide>
	</kv-carousel>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';

const kivaContentBlockImageRequire = require.context('@/assets/images/kiva-content-block/', true);

export default {
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
						['small', kivaContentBlockImageRequire('./1x/Asset1.jpg')],
						['small retina', kivaContentBlockImageRequire('./2x/Asset1@2x.jpg')]
					],
					url: '/blog/one-woman-brewing-change-in-africa-and-beyond',
					headline: 'Possibility brews from fair trade',
					subheadline: 'Vava’s passion for creating change started with possibility in coffee farmers'
				},
				{
					images: [
						['small', kivaContentBlockImageRequire('./1x/Asset2.jpg')],
						['small retina', kivaContentBlockImageRequire('./2x/Asset2@2x.jpg')]
					],
					url: '/blog/a-loan-to-one-entrepreneur-in-togo-impacts-his-whole-community',
					headline: 'Possibility in family traditions',
					subheadline: 'From a mother to her son — how one man turned possibility into a community dream'
				},
				{
					images: [
						['small', kivaContentBlockImageRequire('./1x/Asset3.jpg')],
						['small retina', kivaContentBlockImageRequire('./2x/Asset3@2x.jpg')]
					],
					url: '/blog/three-sisters-become-fish-farming-pioneers',
					headline: 'Possibility grows in ponds',
					subheadline: 'Pioneering possibility — a story of three sisters from Zimbabwe spreading knowledge'
				},
				{
					images: [
						['small', kivaContentBlockImageRequire('./1x/Asset4.jpg')],
						['small retina', kivaContentBlockImageRequire('./2x/Asset4@2x.jpg')]
					],
					url: '/blog/ernestina-is-a-skilled-carver-making-a-name-for-herself-in-a-male-dominated-craft',
					headline: 'Turning possibility into craft',
					// eslint-disable-next-line max-len
					subheadline: 'Carving a place for women in a male-dominated craft, Ernestina is more than a trailblazer'
				}
			]
		};
	},
	methods: {
		slideChange() {
			if (this.counter < 4) this.counter += 1;
		}
	},
}
</script>

<style lang="scss" scoped>
@import "settings";

$cta-color: #611b1f;

.small-image {
	margin-bottom: 2rem;
	text-align: center;
}

.kiva-content-text {
	.headline {
		color: $cta-color;
		font-weight: bold;
		max-width: 24rem;
		margin: 0 auto 1rem auto;
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
		margin: 0 auto 2rem auto;
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
			box-shadow: darken($cta-color, 10%) !important;

			&:hover,
			&:focus {
				background-color: darken($cta-color, 10%) !important;
			}
		}
	}
}

.slide-placeholder {
	// background-color: red;
	width: 100%;
	padding-bottom: 600/480 * 100%;

	@include breakpoint(medium) {
		// background-color: blue;
		padding-bottom: 545/680 * 100%;
	}

	@include breakpoint(large) {
		// background-color: green;
		padding-bottom: 530/1024 * 100%;
	}
	// GOOD
	@include breakpoint(xga) {
		// background-color: purple;
		padding-bottom: 530/1440 * 100%;
	}
	// GOOD
	@include breakpoint(wxga) {
		// background-color: teal;
		padding-bottom: 690/1920 * 100%;
	}
}
</style>
