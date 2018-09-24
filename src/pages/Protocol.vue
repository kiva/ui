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
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
	data() {
		return {
			infoText: [
				/* eslint-disable max-len */
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

	#banner-text {
		@include impact-text();

		color: #3361A0;
	}
</style>
