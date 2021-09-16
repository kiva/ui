<template>
	<www-page id="homepage">
		<hero-slideshow
			v-if="showSlideShow && !isExperimentActive"
			:promo-enabled="promoEnabled"
			:promo-content="promoContent"
		/>
		<monthly-good-explained v-if="isMonthlyGoodPromoActive && !isExperimentActive" />

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
import _get from 'lodash/get';
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import contentfulEntries from '@/graphql/query/contentfulEntries.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';
import MonthlyGoodExplained from '@/components/Homepage/MonthlyGoodExplained';
import MGCovidExplained from '@/pages/LandingPages/MGCovid19/MGCovidExplained';
import MGCovidHero from '@/pages/LandingPages/MGCovid19/MGCovidHero';
import CategoryGrid from '@/components/Homepage/CategoryGrid';
import { processContent } from '@/util/contentfulUtils';
import HeroSlideshow from './HeroSlideshow';

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
		HeroSlideshow,
		MonthlyGoodExplained,
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
			promoContent: {}
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
	created() {
		this.apollo.query({
			query: contentfulEntries,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-homepage-promo',
			}
		}).then(({ data }) => {
			// returns the contentful content of the uiSetting key ui-homepage-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiPromoSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-homepage-promo'); // eslint-disable-line max-len
			// exit if missing setting or fields
			if (!uiPromoSetting || !uiPromoSetting.fields) {
				return false;
			}
			this.promoEnabled = settingEnabled(
				uiPromoSetting.fields,
				'active',
				'startDate',
				'endDate'
			);
			this.promoContent = processContent(uiPromoSetting.fields.content);
		}).finally(() => {
			this.showSlideShow = true;
		});
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
	computed: {
		isMonthlyGoodPromoActive() {
			try {
				return this.promoEnabled && this.promoContent.genericContentBlock.key === 'monthlyGoodPromoHomepage';
			} catch {
				return false;
			}
		}
	}
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
