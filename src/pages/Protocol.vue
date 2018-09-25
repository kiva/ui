<template>
	<www-page>
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
				<h3 id="intro-title">{{ introTitle }}</h3>
				<p v-for="(paragraph, index) in introText" :key="index">{{ paragraph }}</p>
				<p><a href="#">Learn more about how the Protocol works</a></p>
			</div>
		</div>
		<div class="row" id="partners">
			<div class="small-12 columns">
				<div id="partners-title">In partnership with</div>
				<div id="partners-row">
					<div class="partners-block">
						<img
							class="partners-image"
							src="~@/assets/images/protocol/partner-sierra-leone.svg"
							alt="Sierra Leone"
						>
					</div>
					<div class="partners-block">
						<img
							class="partners-image"
							src="~@/assets/images/protocol/partner-undp.svg"
							alt="UNDP"
						>
					</div>
					<div class="partners-block">
						<img
							class="partners-image"
							src="~@/assets/images/protocol/partner-UNCDF.svg"
							alt="UNCDF"
						>
					</div>
				</div>
			</div>
		</div>
		<div id="press-container">
			<div class="row" id="press">
				<div class="press-block">
					<div>
						<img class="press-image" src="~@/assets/images/protocol/time.png" >
					</div>
					<div
						class="press-text"
					>
						"The 0% small business loan that's for real."
					</div>
				</div>
				<div class="press-block">
					<div>
						<img class="press-image" src="~@/assets/images/protocol/fast-company.png" >
					</div>
					<div
						class="press-text"
					>
						"less impersonal than the data-driven approach taken by mainstream lenders..."
					</div>
				</div>
				<div class="press-block">
					<div>
						<img class="press-image" src="~@/assets/images/protocol/wired.png" >
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
				<div class="small-12 large-6 columns">
					<h2 id="donate-title">Support Kiva innovation</h2>
					<div id="support-text">{{ supportText }}</div>
					<kv-custom-donation :default-value="100" />
				</div>
				<div class="small-10 small-offset-1 medium-8 medium-offset-2 large-5 large-offset-1 columns">
					<img src="~@/assets/images/10-years-billion-impact.jpg">
				</div>
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
			introText: [
				'Kiva, Sierra Leone and U.N. agencies announced the first implementation of Kiva Protocol on Sept. 27 at the U.N. General Assembly.  The Protocol will be used to create a nationwide digital identification system designed to help the country’s 7 million citizens access the services they need to improve their lives.',
				'Globally, 1.7 billion adults are unbanked and can’t access critical services like loans and savings accounts. In Sierra Leone, only 20% of the population is financially included. Two of the major barriers to accessing financial services are a lack of formal identification and a lack of verifiable credit history.',
				'The new Kiva Protocol™ is designed to address these barriers by issuing digital identification to all citizens and enabling formal and informal financial institutions to contribute to a person’s verifiable credit history.',
			],
			introTitle: 'Introducing Kiva Protocol™, an exciting new initiative to give unbanked people formal identity and secure control over their own credit information.',
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
		background: url('~@/assets/images/protocol/protocol-header-default.jpg') no-repeat;
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

	#banner-logo-image {
		display: block;
		max-width: 200px;
		margin: 0 auto;
	}

	#banner-content {
		background: #fff;
		padding: 60px 80px 40px 80px;
		max-height: 500px;
		max-width: 650px;
	}

	#banner-text {
		@include impact-text();

		margin-bottom: 20px;
		color: #43657D;
		text-align: center;
	}

	/* Intro */
	#intro {
		margin-top: 80px;
		margin-bottom: 80px;
	}

	#intro-title {
		margin-bottom: 1rem;
	}

	/* Partners */
	#partners {
		margin-bottom: 80px;
	}

	#partners-title {
		padding-bottom: 40px;
		text-align: center;
		font-size: 0.9rem;
	}

	#partners-row {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.partners-image {
		height: 120px;
	}

	/* Press */
	#press-container {
		padding: 80px 0;
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
		height: 110px;
	}

	.press-image {
		height: 34px;
	}

	.press-text {
		margin-top: 20px;
		text-align: center;
	}

	/* Support */
	#support-container {
		padding: 80px 0 40px 0;
	}

	#support-text {
		margin: 40px 0 30px 0;
	}

	/* About */

	#about-container {
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
