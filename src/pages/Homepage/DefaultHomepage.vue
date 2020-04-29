<template>
	<div>
		<hero-slideshow
			v-if="showSlideShow && !isExperimentActive"
			:promo-enabled="promoEnabled"
			:promo-content="promoContent"
		/>
		<monthly-good-explained v-if="isMonthlyGoodPromoActive && !isExperimentActive" />
		<m-g-covid-hero
			class="section"
			v-if="isExperimentActive"
		/>
		<m-g-covid-explained
			class="small-12 columns mg-explained section"
			:class="{'experiment':isExperimentActive}"
			v-if="isExperimentActive"
		/>
		<why-kiva />
		<category-grid />
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import contentful from '@/graphql/query/contentful.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import WhyKiva from '@/components/Homepage/WhyKiva';
import HeroSlideshow from './HeroSlideshow';
import MonthlyGoodExplained from '@/components/Homepage/MonthlyGoodExplained';
import MGCovidExplained from '@/pages/LandingPages/MGCovid19/MGCovidExplained';
import MGCovidHero from '@/pages/LandingPages/MGCovid19/MGCovidHero';
import CategoryGrid from '@/components/Homepage/CategoryGrid';
import { processContent } from '@/util/contentfulUtils';

const pageQuery = gql`{
	general {
		uiExperimentSetting(key: "homepage_mg_hero") {
			key
			value
		}
	}
}`;

export default {
	components: {
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
			promoEnabled: false,
			showSlideShow: null,
			promoContent: {}
		};
	},
	inject: ['apollo', 'federation'],
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
			this.isExperimentActive = homepageMGHero.version === 'shown';
			// Fire Event for GROW-79
			this.$kvTrackEvent(
				'Home',
				'EXP-GROW-79-Apr2020',
				homepageMGHero.version === 'shown' ? 'b' : 'a'
			);
		},
	},
	created() {
		this.federation.query({
			query: contentful,
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

// Experiment Styles - GROW-79
.section.experiment {
	margin-top: 1rem;
	margin-bottom: 1rem;
	@include breakpoint(large) {
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
}
</style>
