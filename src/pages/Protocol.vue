<template>
	<www-page>
		<div id="banner-container">
			<div id="banner-content">
				<div id="banner-text">
					Building the credit bureau of the future
				</div>
				<div id="banner-logo">
					<img src="~@/assets/images/protocol/kiva-protocol.svg">
				</div>
			</div>
		</div>
		<div class="row" id="intro">
			<div class="small-12 columns">
				<p v-for="(paragraph, index) in infoText" :key="index">{{ paragraph }}</p>
				<p><a href="#">How the Protocol works</a></p>
			</div>
		</div>
		<div id="about-container">
			<div class="row" id="about">
				<div class="small-12 large-7 columns">
					<h1>About Kiva</h1>
					<p>{{ aboutText }}</p>
				</div>
				<div
					id="charity-navigator-container"
					class="small-12 medium-8 medium-offset-2 large-4 large-offset-1 columns"
				>
					<kv-charity-navigator />
				</div>
			</div>
		</div>
		<div id="support-container">
			<div class="row">
				<div class="small-12 large-6 columns">
					<h2 id="donate-title">Support Kiva innovation</h2>
					{{ supportText }}
					<kv-custom-donation default-value="100" />
				</div>
				<div class="small-10 small-offset-1 medium-8 medium-offset-2 large-5 large-offset-1 columns">
					<img src="~@/assets/images/10-years-billion-impact.jpg">
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';
import KvCustomDonation from '@/components/Kv/KvCustomDonation';

export default {
	components: {
		WwwPage,
		KvCharityNavigator,
		KvCustomDonation,
	},
	data() {
		return {
			/* eslint-disable max-len */
			aboutText: 'Kiva is a nonprofit focused on expanding financial access for underserved people around the world. Since 2005, Kiva’s global community of 1.7 million lenders has crowdfunded more than $1.2 billion in microloans to 3 million borrowers in more than 80 countries. On Kiva’s lending platform, anyone can help a borrower start or grow a business, go to school and realize their potential. Kiva also works to address the systemic issues that keep communities from accessing the financial services they need, through projects like Kiva Protocol.',
			infoText: [
				'Kiva, Sierra Leone and U.N. agencies announced the first implementation of the Kiva Protocol on Sept. 27, 2018, at the U.N. General Assembly. The Kiva Protocol will be used to create a nationwide digital identification system designed to help the country’s 7 million citizens access the financial services they need to improve their lives.',
				'Globally, 1.7 billion adults are unbanked, including 80% of the citizens of Sierra Leone. Two of the major barriers to accessing financial services are a lack of formal identification and a lack of verifiable credit history.',
				'The new Kiva Protocol is designed to address these barriers by using distributed ledger technology to issue digital identification to all citizens. Through the Kiva Protocol, both formal and informal financial institutions (from banks to shopkeepers giving credit) can help contribute to a person’s credit history.',
			],
			supportText: 'Donate to Kiva to help us create innovative solutions to the global challenge of financial inclusion.',
			/* eslint-enable max-len */
		};
	},
	metaInfo: {
		title: 'Introducing Protocol',
		description: 'My description',
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
		background: url('~@/assets/images/protocol/protocol-hero.jpg') no-repeat;
		background-size: cover;
		padding: 0.625rem;
		box-sizing: border-box;

		* {
			box-sizing: border-box;
		}

		@media print, screen and (min-width: 30em) {
			padding: 2rem;
		}

		@media print, screen and (min-width: 42.5em) {
			padding-top: 3.8rem;
			padding-bottom: 3.8rem;
		}
	}

	#banner-content {
		background: #fff;
		padding: 40px 80px;
		max-height: 500px;
		max-width: 650px;
	}

	#banner-text {
		@include impact-text();

		color: #3361A0;

		text-align: center;
	}

	/* Intro */
	#intro {
		margin-top: 80px;
		margin-bottom: 80px;
	}

	/* Partners */

	/* About, Support */

	#about-container,
	#support-container {
		background: #FAFAFA;
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

	/* Donate */
	#donate-title {
		font-weight: 400;
	}
</style>
