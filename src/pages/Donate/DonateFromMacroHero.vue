<template>
	<kv-hero class="donation-hero">
		<template #images>
			<kv-contentful-img
				:contentful-src="heroImage"
				fallback-format="jpg"
				:width="1440"
				:alt="heroImageAlt"
				:source-sizes="sourceSizes"
				crop="&fit=fill"
			/>
		</template>
		<template #overlayContent>
			<div class="row">
				<div
					class="
						overlay-column columns
						medium-10 medium-offset-1 large-8 large-offset-0 xlarge-7 xxlarge-6"
				>
					<h1 class="tw-text-h2" v-html="headlineCopy"></h1>
					<p class="tw-my-2" v-html="subheadCopy"></p>
					<donate-form
						:key="1"
						:button-text="buttonCopy"
						:data="donationValues"
						:form-disclaimer="formDisclaimer"
						:form-submit-analytics="formSubmitAnalytics"
					/>
				</div>
			</div>
		</template>
	</kv-hero>
</template>
<script>
import KvHero from '@/components/Kv/KvHero';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import DonateForm from './DonateForm';

export default {
	name: 'DonateFromMacroHero',
	props: {
		data: {
			type: Object,
			default: null,
		},
	},
	metaInfo() {
		return 	{
			title: 'Donate to Kiva and support our mission!',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Your generous donations help Kiva continue and grow our mission of financial inclusivity.'
						+ ' Click here to learn more and make a difference.'
				}
			]
		};
	},
	components: {
		DonateForm,
		KvContentfulImg,
		KvHero,
	},
	data() {
		return {
			formSubmitAnalytics: {
				category: '/support-kiva',
				action: 'Donate from Macro',
			},
			sourceSizes: [
				{
					width: 1920,
					height: 575,
					media: 'min-width: 1441px',
				},
				{
					width: 1440,
					height: 575,
					media: 'min-width: 1025px',
				},
				{
					width: 1024,
					height: 620,
					media: 'min-width: 681px',
				},
				{
					width: 680,
					height: 372,
					media: 'min-width: 481px',
				},
				{
					width: 480,
					height: 540,
					media: 'min-width: 0px',
				},
			],
		};
	},
	computed: {
		heroImage() {
			return this.data?.media?.[0]?.file?.url ?? '';
		},
		heroImageAlt() {
			return this.data?.media?.[0]?.description ?? '';
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
	background-color: #EEEFE9;
	margin-bottom: 0;
	padding-bottom: 1rem;
	position: relative;
	overflow: hidden;

	::v-deep .overlay-holder {
		display: flex;
		flex-direction: column-reverse;

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

	::v-deep .kv-contentful-img {
		position: absolute;
		top: 0;
		bottom: 0;
		align-self: center;

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

</style>
