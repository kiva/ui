<template>
	<div class="monthly-good-explained">
		<div class="row">
			<h1 class="column small-12 tw-text-center">
				How does Monthly Good work?
			</h1>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					1
				</span>
				<mg-step-one class="mg-image" />
				<h2>
					Sign up
				</h2>
				<div class="description-text">
					to automatically help a borrower every month
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					2
				</span>
				<mg-step-two class="mg-image" />
				<h2>
					Choose
				</h2>
				<div class="description-text">
					how much and who you want to lend to - Kiva's got it from here
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					3
				</span>
				<mg-step-three class="mg-image" />
				<h2>
					Receive
				</h2>
				<div class="description-text">
					a personalized report on your impact once a month
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					4
				</span>
				<mg-step-four class="mg-image" />
				<h2>
					Multiply
				</h2>
				<div class="description-text">
					your impact as Kiva continues to re-lend your repayments
				</div>
			</div>
			<div class="column large-12 tw-text-center learn-more-wrapper">
				<router-link
					:to="`/monthlygood`"
					class="learn-more-text"
					v-kv-track-event="[
						'homepage',
						'click-monthly-good-Learn more',
						'homepage-monthly-good-learn-more-link'
					]"
				>
					Learn more
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import MgStepOne from '@/assets/inline-svgs/hp-mg-1-signup.svg';
import MgStepTwo from '@/assets/inline-svgs/hp-mg-2-choose.svg';
import MgStepThree from '@/assets/inline-svgs/hp-mg-3-receive.svg';
import MgStepFour from '@/assets/inline-svgs/hp-mg-4-multiply.svg';

export default {
	components: {
		MgStepOne,
		MgStepTwo,
		MgStepThree,
		MgStepFour
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-explained {
	background-color: $kiva-green;
	margin-bottom: 6rem;

	h1,
	h2,
	.learn-more-text,
	.number,
	.description-text {
		color: $white;
	}

	h2,
	.description-text {
		text-align: center;

		@include breakpoint(medium) {
			text-align: unset;
		}
	}

	h1 {
		padding: 1.6rem 0;
	}

	h2 {
		margin-bottom: 0.125rem;
	}

	.step-wrapper {
		margin-bottom: 2.5rem;
	}

	.number {
		position: relative;
		top: 0.625rem;
		padding-left: 5.3rem;

		@include breakpoint(medium) {
			padding-left: unset;
		}
	}

	.description-text {
		max-width: 12.5rem;
		margin: 0 auto;
		line-height: 1.4;

		@include breakpoint(medium) {
			margin: unset;
		}
	}

	.mg-image {
		max-height: 6.25rem;
		display: block;
		margin: 0 auto 1rem auto;

		@include breakpoint(medium) {
			text-align: unset;
			margin-left: 1.25rem;
		}
	}

	.learn-more-wrapper {
		margin-bottom: 2rem;
	}
}

</style>
