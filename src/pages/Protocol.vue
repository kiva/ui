<template>
	<www-page>
		<div id="banner-container">
			<div id="banner-content">
				<div id="banner-logo">
					<img>
				</div>
				<div id="banner-text">
					an exciting new initiative that could radically expand financial exclusion
				</div>
			</div>
		</div>
		<div class="row">
			<div class="small-12 columns">
				<p v-for="(paragraph, index) in infoText" :key="index">{{ paragraph }}</p>
				<p><a href="#">How the Protocol works</a></p>
			</div>
			<div class="small-12 medium-8 columns">
				<h1>About Kiva</h1>
				<p>{{ aboutText }}</p>
			</div>
			<div id="charity-navigator-container" class="small-12 medium-4 columns">
				<kv-charity-navigator />
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvCharityNavigator from '@/components/Kv/KvCharityNavigator';

export default {
	components: {
		WwwPage,
		KvCharityNavigator,
	},
	data() {
		return {
			/* eslint-disable max-len */
			aboutText: 'Kiva is a nonprofit focused on expanding financial access for underserved people around the world. Since 2005, Kiva’s global community of 1.7 million lenders has crowdfunded more than $1.2 billion in microloans to 3 million borrowers in more than 80 countries. On Kiva’s lending platform, anyone can help a borrower start or grow a business, go to school and realize their potential. Kiva also works to address the systemic issues that keep communities from accessing the financial services they need, through projects like Kiva Protocol.',
			infoText: [
				'Kiva, Sierra Leone and U.N. agencies announced the first implementation of the Kiva Protocol on Sept. 27, 2018, at the U.N. General Assembly. The Kiva Protocol will be used to create a nationwide digital identification system designed to help the country’s 7 million citizens access the financial services they need to improve their lives.',
				'Globally, 1.7 billion adults are unbanked, including 80% of the citizens of Sierra Leone. Two of the major barriers to accessing financial services are a lack of formal identification and a lack of verifiable credit history.',
				'The new Kiva Protocol is designed to address these barriers by using distributed ledger technology to issue digital identification to all citizens. Through the Kiva Protocol, both formal and informal financial institutions (from banks to shopkeepers giving credit) can help contribute to a person’s credit history.',
				/* eslint-enable max-len */
			],
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

	/* Banner */
	#banner-container {
		background: darkblue;
	}

	#banner-content {
		background: #ffffff;
	}

	#banner-text {
		@include impact-text();

		color: #3361A0;
	}

	/* Headers */
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
