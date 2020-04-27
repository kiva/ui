<template>
	<www-page
		id="co19-landing"
		:header-theme="co19HeaderTheme"
		:footer-theme="co19FooterTheme"
	>
		<m-g-covid-hero
			class="section"
		/>

		<div class="row">
			<m-g-covid-explained class="small-12 columns mg-explained section" />
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
			co19HeaderTheme: {
				themeKey: 'CO19',
				backgroundColor: '#fff',
				logoColor: '#4faf4e',
				linkColor: '#767676',
				linkHoverColor: '#efefef',
				separatorColor: 'transparent'
			},
			co19FooterTheme: {
				themeKey: 'CO19',
				backgroundColor: '#fff',
				textColor: '#484848',
				linkColor: '#4faf4e',
				separatorColor: '#8ccb8c'
			},
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
	margin-bottom: 1rem;

	@include breakpoint(xlarge) {
		margin-bottom: 4rem;
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
