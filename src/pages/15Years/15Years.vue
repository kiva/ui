<template>
	<www-page
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="page-wrap">
			<section>
				<fifteen-years-header class="section" />
			</section>
			<section>
				<fifteen-years-timeline class="section" />
			</section>
			<section>
				<fifteen-years-individuals class="section" />
			</section>
			<section>
				<h2>Sponsors</h2>
				<h3>Our Selected Partners</h3>
				<fifteen-years-sponsors class="section" />
			</section>
			<section>
				<h2>How Kiva Works</h2>
			</section>
			<section class="section section--join">
				<h2>Join over 1.9 million fellow changemakers</h2>
			</section>
		</div>
	</www-page>
</template>

<script>
import { fifteenYearHeaderTheme, fifteenYearFooterTheme } from '@/util/siteThemes';

import FifteenYearsHeader from '@/components/15Years/15YearsHeader';
import FifteenYearsIndividuals from '@/components/15Years/15YearsIndividuals';
import FifteenYearsSponsors from '@/components/15Years/15YearsSponsors';
import FifteenYearsTimeline from '@/components/15Years/15YearsTimeline';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		FifteenYearsHeader,
		FifteenYearsIndividuals,
		FifteenYearsSponsors,
		FifteenYearsTimeline,
		WwwPage,
	},
	metaInfo: {
		title: '15 Years'
	},
	data() {
		return {
			headerTheme: fifteenYearHeaderTheme,
			footerTheme: fifteenYearFooterTheme
		};
	},
	computed: {
	},
};
</script>

<style lang="scss">
@import 'settings';
@import 'components/15-years/15-years';

.page-wrap {
	margin-top: rem-calc(-45);

	@include breakpoint(large) {
		margin-top: rem-calc(-64);
	}
}
</style>
