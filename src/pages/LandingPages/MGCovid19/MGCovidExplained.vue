<template>
	<div class="monthly-good-explained page-content">
		<div class="row">
			<h1 class="column small-12 text-center">
				Set your commitment once
			</h1>
			<h2 class="featured-text text-center">
				Kiva will do the rest to make sure every $ goes
				to help COVID-19 impacted individuals and businesses.
			</h2>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					1
				</span>
				<mg-step-one class="mg-image" />
				<h3>
					Choose
				</h3>
				<div class="description-text">
					a monthly amount to go toward COVID-19 relief that works for you.
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					2
				</span>
				<mg-step-three class="mg-image" />
				<h3>
					Stay informed
				</h3>
				<div class="description-text">
					Receive a monthly impact report on your COVID-19 relief support
				</div>
			</div>
			<div class="column small-12 medium-6 large-3 step-wrapper">
				<span class="number">
					3
				</span>
				<mg-step-four class="mg-image" />
				<h3>
					Grow your impact
				</h3>
				<div class="description-text">
					As you get repaid, Kiva will continue to re-lend the funds to multiply your impact.
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import MgStepOne from '@/assets/inline-svgs/hp-mg-1-signup.svg';
import MgStepOne from '@/assets/inline-svgs/hp-mg-2-choose.svg';
import MgStepThree from '@/assets/inline-svgs/hp-mg-3-receive.svg';
import MgStepFour from '@/assets/inline-svgs/hp-mg-4-multiply.svg';

export default {
	components: {
		MgStepOne,
		// MgStepTwo,
		MgStepThree,
		MgStepFour
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-explained {
	background-color: $kiva-green;
	margin-bottom: 1rem;

	h1,
	h2,
	h3,
	.learn-more-text,
	.number,
	.description-text {
		color: $white;
	}

	h3,
	.description-text {
		text-align: center;

		@include breakpoint(medium) {
			text-align: unset;
		}
	}

	h1 {
		padding: 1.6rem 0;
	}

	h3 {
		margin-bottom: 0.325rem;
		font-weight: 400;
		line-height: 1.5rem;
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
		min-height: 4.75rem;

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
