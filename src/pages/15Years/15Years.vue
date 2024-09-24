<template>
	<www-page
		class="fifteen-years-page"
	>
		<div class="page-wrap">
			<fifteen-years-styles>
				<section>
					<fifteen-years-header />
				</section>
				<section id="years-of-impact">
					<fifteen-years-timeline />
				</section>
				<section id="world-of-kiva">
					<fifteen-years-individuals />
				</section>
				<section id="orgs-making-difference">
					<fifteen-years-partners />
				</section>
				<section id="how-kiva-works">
					<fifteen-years-how-kiva-works />
				</section>
				<div class="footer"></div>
			</fifteen-years-styles>
		</div>
	</www-page>
</template>

<script>

import FifteenYearsHeader from '#src/components/15Years/15YearsHeader';
import FifteenYearsHowKivaWorks from '#src/components/15Years/15YearsHowKivaWorks';
import FifteenYearsIndividuals from '#src/components/15Years/15YearsIndividuals';
import FifteenYearsPartners from '#src/components/15Years/15YearsPartners';
import FifteenYearsStyles from '#src/components/15Years/15YearsStyles';
import FifteenYearsTimeline from '#src/components/15Years/15YearsTimeline';
import WwwPage from '#src/components/WwwFrame/WwwPage';

export default {
	name: '15Years',
	components: {
		FifteenYearsHeader,
		FifteenYearsHowKivaWorks,
		FifteenYearsIndividuals,
		FifteenYearsPartners,
		FifteenYearsStyles,
		FifteenYearsTimeline,
		WwwPage,
	},
	head: {
		title: '15 Years'
	},
};
</script>

<style lang="scss">
@import '#src/assets/scss/settings';
@import '#src/assets/scss/components/15-years/15-years';

.fifteen-years-page {
	.row {
		// the width of the comp is larger than our normal 990px
		max-width: rem-calc(1152);
	}

	.footer {
		height: 11rem;
		background-image: url('#src/assets/images/15-years/footer-background.svg');
		background-size: 100%;
		background-position: bottom;
		background-repeat: no-repeat;

		@include breakpoint(large) {
			height: 20rem;
		}

		@include breakpoint(xxlarge) {
			height: 25rem;
		}
	}
}
</style>
