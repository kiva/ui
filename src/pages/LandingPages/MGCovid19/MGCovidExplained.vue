<template>
	<div>
		<div class="mg-explained row">
			<h2 class="mg-explained__title text-center small-12 columns">
				Three Steps to Impact
			</h2>
			<p class="mg-explained__body small-12 columns text-center">
				Set your commitment once, Kiva will do the rest to make sure
				every dollar is lent to COVID-19 impacted individuals and businesses.
			</p>
		</div>
		<ol class="three-steps row">
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="three-steps__step">
					<div class="three-steps__icon-wrapper">
						<span class="three-steps__number three-steps__number--1">
							1
						</span>
						<mg-step-one class="three-steps__icon" />
					</div>
					<h3 class="three-steps__title">
						Choose
					</h3>
					<div class="three-steps__description">
						Choose a monthly amount to go toward COVID-19 relief that
						works <span class="no-wrap">for you.</span>
					</div>
				</div>
			</li>
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="three-steps__step">
					<div class="three-steps__icon-wrapper">
						<span class="three-steps__number three-steps__number--2">
							2
						</span>
						<mg-step-two class="three-steps__icon three-steps__icon--inbox" />
					</div>
					<h3 class="three-steps__title">
						Check
					</h3>
					<div class="three-steps__description">
						Receive a monthly impact report on your COVID-19 <span class="no-wrap">relief support.</span>
					</div>
				</div>
			</li>
			<li class="three-steps__step-wrapper column small-12 large-4">
				<div class="three-steps__step">
					<div class="three-steps__icon-wrapper">
						<span class="three-steps__number three-steps__number--3">
							3
						</span>
						<mg-step-three class="three-steps__icon" />
					</div>
					<h3 class="three-steps__title">
						Grow
					</h3>
					<div class="three-steps__description">
						As you get repaid, Kiva will re-lend your money and
						multiply <span class="no-wrap">your impact.</span>
					</div>
				</div>
			</li>
		</ol>
	</div>
</template>

<script>
import MgStepOne from '@/assets/inline-svgs/covid-response/choose-checkmark.svg';
import MgStepTwo from '@/assets/inline-svgs/covid-response/inbox-notification.svg';
import MgStepThree from '@/assets/inline-svgs/covid-response/grow.svg';

export default {
	components: {
		MgStepOne,
		MgStepTwo,
		MgStepThree,
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.three-steps {
	list-style: none;
	margin-bottom: 0;
	padding: 0;

	&__step-wrapper {
		margin-bottom: 2rem;
	}

	&__step {
		border-radius: rem-calc(10);
		box-shadow: $platinum 0 rem-calc(1) rem-calc(5) rem-calc(2);
		height: 100%;
		padding: 2rem;
		text-align: center;
	}

	&__icon-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	&__icon {
		height: 6.25rem;
		display: block;

		&--inbox {
			margin-right: -0.65rem; // pull it keep it visually centered since the red notification dot takes up space
			width: 7rem;
		}
	}

	&__number {
		$num-size: 2.25rem;

		background-color: $kiva-green;
		border: rem-calc(4) solid #fff;
		color: #fff;
		border-radius: 50%;
		font-weight: 700;
		width: $num-size;
		height: $num-size;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: calc(50% - #{$num-size / 2});

		&--1 {
			left: calc(50% - #{$num-size / 2} - 3rem);
		}

		&--2 {
			left: calc(50% - #{$num-size / 2} - 3.5rem);
		}

		&--3 {
			left: calc(50% - #{$num-size / 2} - 1.65rem);
		}
	}

	&__title {
		@include featured-text();

		line-height: 1.2;
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	&__description {
		text-align: center;
		line-height: 1.4;
	}
}

.mg-explained {
	&__title {
		@include large-text();

		margin-bottom: 1rem;
	}

	&__body {
		@include medium-text();

		max-width: 30rem;
		margin: 0 auto 2.5rem auto;
	}
}

</style>
