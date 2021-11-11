<template>
	<www-page>
		<div id="banner-container">
			<div id="banner-content" class="tw-bg-primary">
				<p id="banner-text" class="tw-text-h1">
					Building the credit bureau of the future
				</p>
				<div id="banner-logo">
					<img id="banner-logo-image" src="~@/assets/images/protocol/kiva-protocol.svg">
				</div>
			</div>
		</div>
		<div class="row" id="intro">
			<div class="small-12 columns tw-prose">
				<p id="intro-title" class="tw-text-subhead">
					{{ introTitle }}
				</p>
				<p v-for="(paragraph, index) in introText" :key="index">
					{{ paragraph }}
				</p>
				<p><a href="https://pages.kiva.org/kiva-protocol-faq">{{ introLinkTitle }}</a></p>
			</div>
		</div>
		<div id="support-container">
			<div class="row">
				<div id="support-donate-container" class="small-12 large-6 columns">
					<h2 id="support-title">
						Support Kiva innovation
					</h2>
					<div id="support-text">
						{{ supportText }}
					</div>
					<kv-custom-donation :default-value="100" />
				</div>
				<div class="show-for-large medium-8 medium-offset-2 large-5 large-offset-1 columns">
					<kv-responsive-image
						:images="billionImpactImages" alt="10 years and $1 billion in loans funded"
					/>
				</div>
			</div>
		</div>
		<div id="about-container" class="tw-bg-secondary">
			<div class="row" id="about">
				<div class="small-12 large-7 columns">
					<h2>
						About Kiva
					</h2>
					<p id="about-text">
						{{ aboutText }}
					</p>
				</div>
				<div
					id="charity-navigator-container"
					class="small-8 small-offset-2 large-4 large-offset-1 columns"
				>
					<kv-charity-navigator />
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';
import KvCustomDonation from '@/components/Kv/KvCustomDonation';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

const billionImpactImagesRequire = require.context('@/assets/images/10-years-billion-impact', true);

export default {
	components: {
		WwwPage,
		KvCharityNavigator,
		KvCustomDonation,
		KvResponsiveImage
	},
	data() {
		return {
			/* eslint-disable max-len */
			aboutText: 'Kiva is a nonprofit focused on expanding financial access for underserved people around the world. Since 2005, Kiva’s global community of 1.7 million lenders has crowdfunded more than $1.2 billion in microloans to 3 million borrowers in more than 80 countries. On Kiva’s lending platform, anyone can help a borrower start or grow a business, go to school and realize their potential. Kiva also works to address the systemic issues that keep communities from accessing the financial services they need, through projects like Kiva Protocol.',
			introText: [
				'Kiva, Sierra Leone and U.N. agencies announced the first implementation of the Kiva Protocol on Sept. 27, 2018, at the U.N. General Assembly.  The Kiva Protocol will be used to create a nationwide digital identification system designed to help the country’s 7 million citizens access the financial services they need to improve their lives.',
				'Globally, 1.7 billion adults are unbanked, including 80% of the citizens of Sierra Leone. Two of the major barriers to accessing financial services are a lack of formal identification and a lack of verifiable credit history.',
				'The new Kiva Protocol is designed to address these barriers by using distributed ledger technology to issue digital identification to all citizens. Through the Kiva Protocol, both formal and informal financial institutions (from banks to shopkeepers giving credit) can help contribute to a person’s credit history.',
			],
			introLinkTitle: 'Learn more about the Kiva Protocol.',
			introTitle: 'Introducing Kiva Protocol, an exciting new initiative to give unbanked people digital identity and secure control over their own credit information.',
			supportText: 'Donate to Kiva to help us create innovative solutions to the global challenge of financial inclusion.',
			/* eslint-enable max-len */
			billionImpactImages: [
				['small', billionImpactImagesRequire('./10-years-billion-impact.jpg')],
				['small retina', billionImpactImagesRequire('./10-years-billion-impact_2x.jpg')],
			]
		};
	},
	metaInfo: {
		title: 'Kiva Protocol - Building the credit bureau of the future',
		titleTemplate: null,
		meta: [
			{
				vmid: 'description',
				name: 'description',
				// eslint-disable-next-line max-len
				content: 'Introducing Kiva Protocol, an exciting new initiative to give unbanked people formal identity and secure control over their own credit information'
			},
			{
				property: 'og:title',
				vmid: 'og:title',
				content: 'Kiva Protocol'
			},
			{
				property: 'og:description',
				vmid: 'og:description',
				// eslint-disable-next-line max-len
				content: 'An exciting new initiative to give unbanked people formal identity and secure control over their own credit.'
			},
			{
				name: 'twitter:title',
				vmid: 'twitter:title',
				content: 'Kiva Protocol'
			},
			{
				name: 'twitter:description',
				vmid: 'twitter:description',
				// eslint-disable-next-line max-len
				content: 'An exciting new initiative to give unbanked people formal identity and secure control over their own credit.'
			},
		],
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	/* Banner/Header */
	#banner-container {
		display: flex;
		align-items: center;
		justify-content: center;
		background: url('~@/assets/images/protocol/protocol-header-default.jpg') no-repeat;
		background-size: cover;
		padding: 0.625rem;
		box-sizing: border-box;

		* {
			box-sizing: border-box;
		}

		@include breakpoint(medium) {
			padding: 2rem;
		}

		@include breakpoint(large) {
			padding-top: 3.8rem;
			padding-bottom: 3.8rem;
		}
	}

	#banner-logo-image {
		display: block;
		max-width: rem-calc(200);
		margin: 0 auto;
	}

	#banner-content {
		padding: rem-calc(40) rem-calc(60) rem-calc(20) rem-calc(60);
		max-height: rem-calc(500);
		max-width: rem-calc(650);

		@include breakpoint(medium) {
			padding: rem-calc(60) rem-calc(80) rem-calc(40) rem-calc(80);
		}
	}

	#banner-text {
		margin-bottom: rem-calc(20);
		text-align: center;
	}

	/* Intro */
	#intro {
		margin-top: rem-calc(80);
		margin-bottom: 3rem;
	}

	#intro-title {
		margin-bottom: 1rem;
	}

	/* Support */
	#support-container {
		padding: 0 0 rem-calc(40) 0;
	}

	#support-donate-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	#support-title,
	#support-text {
		margin-bottom: 0;
		text-align: center;

		@include breakpoint(large) {
			text-align: left;
		}
	}

	#support-text {
		margin: 1rem 0 1.2rem 0;
	}

	/* About */

	#about-container {
		padding: rem-calc(40) 0 rem-calc(80) 0;
	}

	#about-text {
		margin: 1rem 0;
	}

	#charity-navigator-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

</style>
