<template>
	<www-page v-if="isProtocolLive">
		<div id="banner-container">
			<div id="banner-content">
				<div id="banner-text">
					Building the credit bureau of the future
				</div>
				<div id="banner-logo">
					<img id="banner-logo-image" src="~@/assets/images/protocol/kiva-protocol.svg">
				</div>
			</div>
		</div>
		<div class="row" id="intro">
			<div class="small-12 columns">
				<div id="intro-title">
					{{ introTitle }}
				</div>
				<p v-for="(paragraph, index) in introText" :key="index">
					{{ paragraph }}
				</p>
				<p><a href="https://pages.kiva.org/kiva-protocol-faq">{{ introLinkTitle }}</a></p>
			</div>
		</div>
		<div v-if="showPartners" class="row" id="partners">
			<div class="small-12 columns">
				<div id="partners-title">
					In partnership with
				</div>
				<div id="partners-row" class="row">
					<div class="partners-block small-4 columns">
						<div>
							<img
								class="partners-image"
								src="~@/assets/images/protocol/partner-sierra-leone.svg"
								alt="Sierra Leone"
							>
						</div>
						<div class="partner-name">
							Government of Sierra Leone
						</div>
					</div>
					<div class="partners-block small-4 columns">
						<div>
							<img
								class="partners-image"
								src="~@/assets/images/protocol/partner-undp.svg"
								alt="UNDP"
							>
						</div>
						<div class="partner-name">
							United Nations Development Programme
						</div>
					</div>
					<div class="partners-block small-4 columns">
						<div>
							<img
								class="partners-image"
								src="~@/assets/images/protocol/partner-uncdf.svg"
								alt="UNCDF"
							>
						</div>
						<div class="partner-name">
							United Nations Capital Development Fund
						</div>
					</div>
				</div>
			</div>
			<div id="partner-become" class="small-12 columns">
				<!-- eslint-disable-next-line max-len -->
				Interested in becoming a partner? Email us at <a href="mailto:contactus@kiva.org?subject=Kiva Protocol partner">contactus@kiva.org</a>
			</div>
		</div>
		<div v-if="showPress" id="press-container">
			<div class="row" id="press">
				<div class="press-block">
					<div>
						<img class="press-image" src="~@/assets/images/protocol/time.png">
					</div>
					<div
						class="press-text"
					>
						"The 0% small business loan that's for real."
					</div>
				</div>
				<div class="press-block">
					<div>
						<img class="press-image" src="~@/assets/images/protocol/fast-company.png">
					</div>
					<div
						class="press-text"
					>
						"less impersonal than the data-driven approach taken by mainstream lenders..."
					</div>
				</div>
				<div class="press-block">
					<div>
						<img class="press-image" src="~@/assets/images/protocol/wired.png">
					</div>
					<div
						class="press-text"
					>
						"Best perk: no interest"
					</div>
				</div>
			</div>
		</div>
		<div id="support-container">
			<div class="row">
				<div id="support-donate-container" class="small-12 large-6 columns">
					<h1 id="support-title">
						Support Kiva innovation
					</h1>
					<div id="support-text">
						{{ supportText }}
					</div>
					<kv-custom-donation :default-value="100" />
				</div>
				<div class="show-for-large medium-8 medium-offset-2 large-5 large-offset-1 columns">
					<img src="~@/assets/images/10-years-billion-impact.jpg">
				</div>
			</div>
		</div>
		<div id="about-container">
			<div class="row" id="about">
				<div class="small-12 large-7 columns">
					<h1>About Kiva</h1>
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
import _get from 'lodash/get';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';
import KvCustomDonation from '@/components/Kv/KvCustomDonation';
import protocolUiPageQuery from '@/graphql/query/protocolUiPage.graphql';

export default {
	inject: ['apollo'],
	apollo: {
		query: protocolUiPageQuery,
		preFetch: true,
		result({ data }) {
			this.isProtocolLive = _get(data, 'general.protocol.value') === 'true' || false;
		},
	},
	components: {
		WwwPage,
		KvCharityNavigator,
		KvCustomDonation,
	},
	data() {
		return {
			isProtocolLive: false,
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
			showPress: false,
			showPartners: false,
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
		background: #fff;
		padding: rem-calc(40) rem-calc(60) rem-calc(20) rem-calc(60);
		max-height: rem-calc(500);
		max-width: rem-calc(650);

		@include breakpoint(medium) {
			padding: rem-calc(60) rem-calc(80) rem-calc(40) rem-calc(80);
		}
	}

	#banner-text {
		@include impact-text();

		margin-bottom: rem-calc(20);
		color: #43657D;
		text-align: center;
	}

	/* Intro */
	#intro {
		margin-top: rem-calc(80);
		margin-bottom: 3rem;
	}

	#intro-title {
		@include featured-text();

		margin-bottom: 1rem;
	}

	/* Partners */
	#partners {
		margin-bottom: rem-calc(80);
	}

	#partners-title {
		padding-bottom: rem-calc(40);
		text-align: center;
		font-size: 1rem;
		font-weight: $global-weight-highlight;
	}

	.partners-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

	.partners-image {
		height: rem-calc(80);

		@include breakpoint(medium) {
			height: rem-calc(120);
		}

		@include breakpoint(large) {
			height: rem-calc(140);
		}
	}

	.partner-small {
		text-align: center;
		line-height: 1.1rem;
	}

	.partner-name {
		@extend .partner-small;

		font-size: 0.8rem;
		padding-top: 0.6rem;
	}

	#partner-become {
		@extend .partner-small;

		font-size: 1rem;
		padding-top: 3rem;
	}

	/* Press */
	#press-container {
		padding: rem-calc(80) 0;
		background: #EFEFEF;
	}

	#press {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.press-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 30%;
		height: rem-calc(110);
	}

	.press-image {
		height: rem-calc(34);
	}

	.press-text {
		margin-top: rem-calc(20);
		text-align: center;
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
		background: #FAFAFA;
		padding: rem-calc(40) 0 rem-calc(80) 0;
	}

	#about-text {
		margin: 1rem 0;
	}

	h1,
	h2 {
		color: $kiva-green;
	}

	#charity-navigator-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

</style>
