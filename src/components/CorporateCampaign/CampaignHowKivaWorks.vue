<template>
	<div class="works section campaign-how-it-works section">
		<div class="row">
			<div class="columns">
				<p class="works__subhead tw-text-h2">
					By lending as little as $25 on Kiva, you can support the causes you care
					about and make a real personal impact.
				</p>
				<fifteen-years-how-kiva-works-carousel class="carousel" :slides="slides" />
			</div>
		</div>
	</div>
</template>

<script>
import FifteenYearsHowKivaWorksCarousel from '#src/components/15Years/15YearsHowKivaWorksCarousel';

import step1Video from '#src/assets/media/15-years/step1.mp4';
import step2Video from '#src/assets/media/15-years/step2.mp4';
import step3Video from '#src/assets/media/15-years/step3.mp4';
import step4Video from '#src/assets/media/15-years/step4.mp4';

export default {
	name: 'CampaignHowKivaWorks',
	components: {
		FifteenYearsHowKivaWorksCarousel,
	},
	props: {
		isMatchingCampaign: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		slides() {
			const steps = [
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
					blurb: `When the borrower repays, funds return back to the
						${this.isMatchingCampaign ? 'lenders' : 'funders'} account.`,
					video: step3Video,
				}
			];
			if (this.isMatchingCampaign) {
				steps.push(
					{
						step: 'Step Four',
						title: 'Repeat',
						blurb: 'Relend your money or withdraw your funds.',
						video: step4Video,
					},
				);
			}
			return steps;
		}
	}
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

.works {
	padding: 4rem 0;

	/* hides the horizontal scrollbar created by hacking the carousel below */
	width: 100%;
	overflow-x: hidden;

	&__subhead {
		@include large-text();

		margin: 0;
	}

	&__header {
		margin-bottom: 2rem;

		@include breakpoint('xxlarge') {
			margin-bottom: 4rem;
		}
	}
}
</style>
