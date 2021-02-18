<template>
	<kv-hero class="donation-hero">
		<template v-slot:images>
			<kv-responsive-image
				class="donation-hero-picture show-for-large"
				:images="heroResponsiveImageSet"
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
						:form-disclaimer="formDisclaimer"
					/>
				</div>
			</div>
		</template>
	</kv-hero>
</template>
<script>
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import { createArrayOfResponsiveImageSet } from '@/util/contentfulUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import DonateForm from './DonateForm';

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
		};
	},
	computed: {
		heroResponsiveImageSet() {
			const imageSet = this.data?.contents?.find(contentItem => contentItem.name === 'donation-page-images');
			return createArrayOfResponsiveImageSet(imageSet);
		},
		donationHeroContent() {
			return this.data?.contents?.find(contentItem => contentItem.key === 'donation-form-copy');
		},
		headlineCopy() {
			return this.donationHeroContent?.headline;
		},
		subheadCopy() {
			return this.donationHeroContent?.subHeadline;
		},
		buttonCopy() {
			return this.donationHeroContent?.primaryCtaText;
		},
		donationValues() {
			// defining the donation dollar amount to pass down for button values
			const donationSetting = this.data?.contents?.find(contentItem => contentItem.key === 'donationAmounts');
			const donationAmounts = donationSetting?.dataObject?.amounts;
			return donationAmounts;
		},
		formDisclaimer() {
			// extracting form disclaimer from contentful to pass into form
			// eslint-disable-next-line max-len
			const formDisclaimerContent = this.data?.contents?.find(contentItem => contentItem.key === 'macro-donate-button-disclaimer');
			return documentToHtmlString(formDisclaimerContent);
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
			margin-top: 1rem;
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
