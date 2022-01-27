<template>
	<www-page
		id="co19-landing"
	>
		<m-g-covid-hero />

		<div class="mg-explained-wrapper">
			<div class="row">
				<m-g-covid-explained class="small-12 columns" />
			</div>
		</div>

		<div class="row">
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

.mg-explained-wrapper {
	background-color: #fdf7eb;
	background-image: url('~@/assets/images/covid-response/background-texture.png');
	background-position-y: 100%;
	background-size: cover;
	padding-top: 3rem;
	padding-bottom: 2rem;
	margin-bottom: 2rem;

	@include breakpoint(large) {
		padding-top: 5rem;
		padding-bottom: 3rem;
		margin-top: 0;
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
</style>
