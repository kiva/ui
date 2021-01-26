<template>
	<div class="works section campaign-how-it-works section">
		<div class="row">
			<div class="columns">
				<p class="works__subhead campaign-how-it-works__subhead">
					By lending as little as $25 on Kiva, you can support the causes you care
					about and make a real personal impact.
				</p>
				<fifteen-years-how-kiva-works-carousel
					class="carousel"
					:slides="slides"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsHowKivaWorksCarousel from '@/components/15Years/15YearsHowKivaWorksCarousel';

const step1Video = require('@/assets/media/15-years/step1.mp4');
const step2Video = require('@/assets/media/15-years/step2.mp4');
const step3Video = require('@/assets/media/15-years/step3.mp4');
// const step4Video = require('@/assets/media/15-years/step4.mp4');

export default {
	components: {
		FifteenYearsHowKivaWorksCarousel,
	},
	data() {
		return {
			slides: [
				{
					step: 'Step One',
					title: 'Choose a borrower',
					blurb: 'Browse by category and find an entrepeneur to support',
					video: step1Video,
				},
				{
					step: 'Step Two',
					title: 'Make a loan',
					blurb: 'Help fund a loan with as little as $25',
					video: step2Video,
				},
				{
					step: 'Step Three',
					title: 'Borrower repays',
					blurb: 'When the borrower repays, funds return back to the funders account.',
					video: step3Video,
				},
				// {
				// 	step: 'Step Four',
				// 	title: 'Repeat',
				// 	blurb: 'Relend your money or withdraw your funds.',
				// 	video: step4Video,
				// },
			],
		};
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

/* stylelint-disable no-descending-specificity */

.works {
	// max-width: inherit;
	padding: 4rem 0;
	// background-color: rgba(0, 0, 0, 0.1);
	background: #fff;
	color: $twilight;

	/* hides the horizontal scrollbar created by hacking the carousel below */
	width: 100%;
	overflow-x: hidden;

	&__subhead {
		@include h4();

		// max-width: rem-calc(913);
		padding: 0 2rem;
		margin: 0;
	}

	&__header {
		--section-header-line-color: #{$twilight};

		margin-bottom: 2rem;

		@include breakpoint('xxlarge') {
			margin-bottom: 4rem;
		}
	}
}
</style>
