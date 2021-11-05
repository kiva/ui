<template>
	<www-page id="homepage">
		<m-g-covid-hero
			v-if="isExperimentActive"
		/>
		<div
			v-if="isExperimentActive"
			class="mg-explained-wrapper"
		>
			<m-g-covid-explained
				class="small-12 columns"
			/>
		</div>
		<why-kiva />
		<category-grid />
	</www-page>
</template>

<script>
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';
import MGCovidExplained from '@/pages/LandingPages/MGCovid19/MGCovidExplained';
import MGCovidHero from '@/pages/LandingPages/MGCovid19/MGCovidHero';
import CategoryGrid from '@/components/Homepage/CategoryGrid';

const pageQuery = gql`query homepageMGHeroExperiment {
	general {
		uiExperimentSetting(key: "homepage_mg_hero") {
			key
			value
		}
	}
}`;

export default {
	components: {
		WwwPage,
		WhyKiva,
		CategoryGrid,
		MGCovidExplained,
		MGCovidHero,
	},
	data() {
		return {
			isExperimentActive: false,
			experimentVersion: null,
			promoEnabled: false,
			showSlideShow: null,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return client.query({
					query: experimentQuery, variables: { id: 'homepage_mg_hero' }
				});
			});
		},
		result() {
			// GROW-79 Experiment
			const homepageMGHero = this.apollo.readFragment({
				id: 'Experiment:homepage_mg_hero',
				fragment: experimentVersionFragment,
			}) || {};
			this.experimentVersion = homepageMGHero.version;
			this.isExperimentActive = homepageMGHero.version === 'shown';
		},
	},
	mounted() {
		// Fire Event for GROW-79
		if (this.experimentVersion && this.experimentVersion !== 'unassigned') {
			this.$kvTrackEvent(
				'Home',
				'EXP-GROW-79-Apr2020',
				this.isExperimentActive ? 'b' : 'a'
			);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
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
</style>
