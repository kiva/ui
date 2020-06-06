<template>
	<kv-hero class="donation-hero">
		<template v-slot:images>
			<kv-responsive-image
				class="donation-hero-picture"
				:images="heroImages"
				alt=""
			/>
		</template>
		<template v-slot:overlayContent>
			<div class="row">
				<div class="
						overlay-column columns
						medium-10 medium-offset-1 large-8 large-offset-0 xlarge-7 xxlarge-6"
				>
					<h1 class="donate-headline" v-html="headlineCopy"></h1>
					<p class="donate-subhead" v-html="subheadCopy"></p>
					<donate-form
						:key="1"
						:button-text="buttonCopy"
						:data="donationValues"
					/>
				</div>
			</div>
		</template>
	</kv-hero>
</template>
<script>
import _get from 'lodash/get';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import DonateForm from './DonateForm';

const heroImagesRequire = require.context('@/assets/images/covid-hero-v2', true);

export default {
	props: {
		data: {
			type: Object,
			default: null,
		},
	},
	metaInfo: {
		title: 'Donate to Kiva today!'
	},
	components: {
		KvHero,
		DonateForm,
		KvResponsiveImage,
	},
	data() {
		return {
			// TODO: These need to be hooked up to the files in contentful still
			// https://app.contentful.com/spaces/j0p9a6ql0rn7/environments/development/entries/6pXrrPQucbeNLqf47tW3wh
			heroImages: [
				['small', heroImagesRequire('./hero_480x390.jpg')],
				['small retina', heroImagesRequire('./hero_960x780.jpg')],
				['medium', heroImagesRequire('./hero_680x375.jpg')],
				['medium retina', heroImagesRequire('./hero_1360x750.jpg')],
				['large', heroImagesRequire('./hero_1024x850.jpg')],
				['large retina', heroImagesRequire('./hero_2048x1700.jpg')],
				['xxlarge', heroImagesRequire('./hero_1320x760.jpg')],
				['xxlarge retina', heroImagesRequire('./hero_2640x1520.jpg')],
				['xga', heroImagesRequire('./hero_1440x710.jpg')],
				['xga retina', heroImagesRequire('./hero_2880x1420.jpg')],
				['wxga', heroImagesRequire('./hero_1920x740.jpg')],
				['wga retina', heroImagesRequire('./hero_3840x1480.jpg')],
			],
		};
	},
	computed: {
		donationHeroContent() {
			return _get(this.data, 'page.pageLayout.fields.contentGroups[0].fields.contents[1].fields');
		},
		headlineCopy() {
			return _get(this.donationHeroContent, 'headline');
		},
		subheadCopy() {
			return _get(this.donationHeroContent, 'subHeadline');
		},
		buttonCopy() {
			return _get(this.donationHeroContent, 'primaryCtaText');
		},
		// Will be used once images are coming through from contentful
		zeroImages() {
			// eslint-disable-next-line
			const donationImages = _get(this.data, 'page.pageLayout.fields.contentGroups[0].fields.contents[0].fields.images');
			return donationImages;
		},
		donationValues() {
			// defining the donation dollar amount to pass down for button values
			// eslint-disable-next-line
			const donationAmounts = _get(this.data, 'page.pageLayout.fields.contentGroups[0].fields.contents[2].fields.dataObject.amounts');
			return donationAmounts;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donation-hero {
	// background-color: #fdf7eb;
	background-color: #EEEFE9;
	margin-bottom: 0;
	padding-bottom: 1rem;
	position: relative;
	overflow: hidden;

	::v-deep .overlay-holder {
		display: flex;
		flex-direction: column-reverse;

		.donation-hero-picture {
			@include breakpoint(large) {
				position: absolute;
				top: 0;
				bottom: 0;
			}

			// Prevent whitespace below the image in browsers that understand object-fit. (IE11 will see some whitepace)
			@supports (object-fit: cover) {
				img {
					object-fit: cover;
					object-position: 50% 25%; // keep the illustrations heads visible
					height: 100%;
					width: 100%;
				}
			}
		}

		.overlay-content {
			margin-top: -1rem;
			margin-left: 1rem;
			margin-right: 1rem;
			z-index: 1;
			position: relative;
			top: auto;
			width: auto;
			transform: none;

			@include breakpoint(large) {
				margin-top: 2.5rem;
				margin-bottom: 1.5rem;
			}

			.overlay-column {
				max-width: none;
				padding: 1.5rem 1.5rem 1.25rem;
				background-color: $white;
				border-radius: 1rem;
				// initial idea for giving some definition to the form over a white bg
				box-shadow: 0 0 rem-calc(4) rgba(0, 0, 0, 0.2);

				@include breakpoint(large) {
					max-width: 31.25rem;
					padding: 2.5rem 2.5rem 2.25rem;
				}
			}
		}
	}

	//set min height to improve sizing when image has not loaded yet
	min-height: 6.25rem;

	@include breakpoint(xlarge) {
		min-height: 20rem;
		flex-direction: column;
	}
	@include breakpoint(xxlarge) {
		min-height: 24.65rem;
	}
	@include breakpoint(xga) {
		min-height: 27rem;
	}
}

.donation-headline {
	@include large-text();

	margin-bottom: 0.25rem;
}

.donation-subhead {
	@include medium-text();

	padding: 0;
	margin-bottom: 1.5rem;
}
</style>
