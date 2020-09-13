<template>
	<div>
		<appeal-banner-15 :appeal-banner-content="{}" />
		<www-page
			:header-theme="headerTheme"
			:footer-theme="footerTheme"
		>
			<div class="page-wrap">
				<fifteen-years-styles>
					<section>
						<fifteen-years-header />
					</section>
					<section>
						<fifteen-years-timeline />
					</section>
					<section>
						<fifteen-years-individuals />
					</section>
					<section>
						<fifteen-years-sponsors />
					</section>
					<section>
						<fifteen-years-how-kiva-works />
					</section>
				</fifteen-years-styles>
			</div>
		</www-page>
	</div>
</template>

<script>
import { fifteenYearHeaderTheme, fifteenYearFooterTheme } from '@/util/siteThemes';
import AppealBanner15 from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealBanner15';
import FifteenYearsHeader from '@/components/15Years/15YearsHeader';
import FifteenYearsHowKivaWorks from '@/components/15Years/15YearsHowKivaWorks';
import FifteenYearsIndividuals from '@/components/15Years/15YearsIndividuals';
import FifteenYearsSponsors from '@/components/15Years/15YearsSponsors';
import FifteenYearsStyles from '@/components/15Years/15YearsStyles';
import FifteenYearsTimeline from '@/components/15Years/15YearsTimeline';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		AppealBanner15,
		FifteenYearsHeader,
		FifteenYearsHowKivaWorks,
		FifteenYearsIndividuals,
		FifteenYearsSponsors,
		FifteenYearsStyles,
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
};
</script>

<style lang="scss">
@import 'settings';
@import 'components/15-years/15-years';

.page-wrap { // scootch the page behind the semi-transparent top nav
	margin-top: rem-calc(-45);

	@include breakpoint(large) {
		margin-top: rem-calc(-64);
	}
}

.row { // the width of the comp is larger than our normal 990px
	max-width: rem-calc(1152);
}
</style>
