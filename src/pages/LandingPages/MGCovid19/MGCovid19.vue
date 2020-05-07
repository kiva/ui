<template>
	<www-page
		id="co19-landing"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<m-g-covid-hero
			class="section"
		/>

		<div class="row">
			<m-g-covid-explained class="small-12 columns mg-explained" />
			<div class="separator section"></div>
			<m-g-covid-faq class="small-12 large-9 xlarge-8 xxlarge-7 columns section" />
		</div>

		<div class="about-wrapper section ">
			<div class="row">
				<m-g-covid-about class="about small-12 columns" />
			</div>
		</div>
	</www-page>
</template>

<script>
import { lightHeader, lightFooter } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';

import MGCovidAbout from './MGCovidAbout';
import MGCovidExplained from './MGCovidExplained';
import MGCovidFaq from './MGCovidFAQ';
import MGCovidHero from './MGCovidHero';

export default {
	metaInfo: {
		title: "Join Kiva's Global COVID-19 Response"
	},
	components: {
		WwwPage,
		MGCovidAbout,
		MGCovidExplained,
		MGCovidFaq,
		MGCovidHero,
	},
	props: {
		category: {
			type: String,
			default: 'covid-relief'
		}
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			isExperimentActive: true,
			isMonthlyGoodSubscriber: false,
		};
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.section {
	margin-bottom: 2rem;

	@include breakpoint(xlarge) {
		margin-bottom: 5rem;
	}
}

.separator {
	width: 100%;
	border-top: rem-calc(1) solid $kiva-stroke-gray;
}

.mg-explained {
	margin-top: 1rem;
	margin-bottom: 2rem;
	@include breakpoint(large) {
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
}

.about-wrapper {
	background: $kiva-bg-lightgray;
}

.about {
	margin-top: 2rem;
	margin-bottom: 2rem;

	@include breakpoint(xlarge) {
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
}

// Hide global promo bar (this is the promo landing page!!!)
::v-deep .generic-banner {
	display: none;
}
</style>
