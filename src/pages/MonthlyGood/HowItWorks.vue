<template>
	<div class="how-works-section-wrapper" :class="{'experiment':isExperimentActive}" id="how-it-works">
		<div class="row">
			<h1 class="column small-12 text-center impact-text">
				How it works
			</h1>

			<div class="small-12 large-4 column step-wrapper text-center">
				<icon-auto-deposit-alternate class="mg-image" />
				<h4>Contribute automatically</h4>
				<div class="description-text">
					<p>Sign up once by choosing a monthly amount that works for you. Cancel anytime.</p>
				</div>
			</div>
			<div class="small-12 large-4 column step-wrapper text-center">
				<icon-lend class="mg-image" />
				<h4>Help entrepreneurs in need</h4>
				<div class="description-text">
					<!-- eslint-disable-next-line max-len -->
					<p>Kiva will automatically lend 100% of your funds to borrowers who need help reaching their goals. This could be anyone on Kiva, from farmers to students, artisans to shopkeepers.</p>
				</div>
			</div>
			<div class="small-12 large-4 column step-wrapper text-center">
				<icon-updates-alternate class="mg-image" />
				<h4>Receive inspiring stories</h4>
				<div class="description-text">
					<p>We’ll send you an update once a month, including who you supported and why it mattered.</p>
				</div>
			</div>
			<div class="small-12 column text-center learn-more-wrapper">
				<p class="learn-more-text">
					<!-- eslint-disable-next-line max-len -->
					As you’re repaid, your funds will be automatically relent to borrowers in need, multiplying your impact
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import IconAutoDepositAlternate from '@/assets/icons/inline/auto-deposit-alternate.svg';
import IconLend from '@/assets/icons/inline/lend.svg';
import IconUpdatesAlternate from '@/assets/icons/inline/updates-alternate.svg';

export default {
	components: {
		IconAutoDepositAlternate,
		IconLend,
		IconUpdatesAlternate,
	},
	props: {
		isExperimentActive: {
			type: Boolean
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.how-works-section-wrapper {
	background-color: $kiva-green;
	margin-bottom: 1.85rem;

	h1,
	h4,
	.learn-more-text,
	.description-text {
		color: $white;
	}

	h4,
	.description-text {
		p { margin: 1em 0; }
	}

	h1 {
		padding: 2rem 0;
	}

	h4 {
		margin-bottom: 1rem;
		text-transform: inherit;
	}

	.step-wrapper {
		margin-bottom: 2.15rem;
	}

	.description-text {
		margin: 0 auto;
		line-height: 1.4;
	}

	.mg-image {
		fill: $white;
		width: 3.125rem;
		display: block;
		margin: 0 auto 1rem auto;
		color: $kiva-green;
	}

	.learn-more-wrapper {
		margin-bottom: 2rem;
	}
}

.how-works-section-wrapper.experiment {
	@include breakpoint(medium) {
		padding-top: 12rem;
	}

	@include breakpoint(large) {
		padding-top: 6rem;
	}

	@include breakpoint(xlarge) {
		padding-top: 1rem;
	}
}
</style>
