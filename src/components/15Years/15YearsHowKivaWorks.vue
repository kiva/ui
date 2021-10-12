<template>
	<div class="section tw-bg-primary tw-text-primary">
		<div class="row">
			<div class="columns">
				<fifteen-years-section-header class="works__header">
					<template #header>
						How Kiva Works
					</template>
					<template #subhead>
						A step-by-step<br class="smo"><br class="xxlu"> guide
					</template>
				</fifteen-years-section-header>

				<p class="works__subhead tw-text-h2">
					By lending as little as $25 on Kiva, you can support the causes you care
					about and make a real personal impact.
				</p>
				<fifteen-years-how-kiva-works-carousel
					:slides="slides"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsSectionHeader from './15YearsSectionHeader';
import FifteenYearsHowKivaWorksCarousel from './15YearsHowKivaWorksCarousel';

const step1Video = require('@/assets/media/15-years/step1.mp4');
const step2Video = require('@/assets/media/15-years/step2.mp4');
const step3Video = require('@/assets/media/15-years/step3.mp4');
const step4Video = require('@/assets/media/15-years/step4.mp4');

export default {
	components: {
		FifteenYearsSectionHeader,
		FifteenYearsHowKivaWorksCarousel
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
					title: 'Get repaid',
					blurb: 'Kiva borrowers have a 96% repayment rate historically.',
					video: step3Video,
				},
				{
					step: 'Step Four',
					title: 'Repeat',
					blurb: 'Relend your money or withdraw your funds.',
					video: step4Video,
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

@mixin timeline-link() {
	@include link();

	color: $mint;
}

/* stylelint-disable no-descending-specificity */

.works {
	/* hides the horizontal scrollbar created by hacking the carousel below */
	width: 100%;
	overflow-x: hidden;

	&__subhead {
		max-width: rem-calc(913);
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
