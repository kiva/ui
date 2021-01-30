<template>
	<www-page id="homepage"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<component :is="activeHomepage" :content="pageData" />
	</www-page>
</template>

<script>
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import { lightHeader } from '@/util/siteThemes';
import { settingEnabled } from '@/util/settingsUtils';
import { processPageContentFlat } from '@/util/contentfulUtils';

import WwwPage from '@/components/WwwFrame/WwwPage';

import DefaultHomePage from '@/pages/Homepage/DefaultHomepage';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';
import MonthlyGoodHomepage from '@/pages/Homepage/MonthlyGoodHomepage';
// import FifteenYearHomepage from '@/pages/Homepage/15YearHomepage';
// import IWDHomePage from '@/pages/Homepage/iwd/IWDHomepage';
// import WRDHomePage from '@/pages/Homepage/wrd/WRDHomepage';

import TopMessageContentful from './TopMessageContentful';

const activePageQuery = gql`query homepageFrame {
	contentful {
		entries(contentType: "page", contentKey: "home")
	}
	general {
		legacyHomeExp: uiExperimentSetting(key: "home_legacy") {
			key
			value
		}
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		DefaultHomePage,
		LendByCategoryHomepage,
		// FifteenYearHomepage,
		// IWDHomePage,
		// WRDHomePage,
		TopMessageContentful,
	},
	metaInfo: {
		meta: [
			{
				name: 'google-site-verification', // for Google Search Console
				content: 'vpxnq5XBGa1PgE4hhyEollJr4uEzN7mrC30iJxzuW_M'
			},
		],
	},
	data() {
		return {
			is15YearsActive: false,
			isLenderPreferencesActive: false,
			isContentfulHomepageActive: false,
			isIwdActive: false,
			isWrdActive: false,
			isMessageActive: false,
			pageData: null,
		};
	},
	computed: {
		activeHomepage() {
			// if (this.is15YearsActive) return FifteenYearHomepage;
			if (this.isContentfulHomepageActive) return MonthlyGoodHomepage;
			if (this.isLenderPreferencesActive) return LendByCategoryHomepage;
			// if (this.isMessageActive) return TopMessageContentful;
			// if (this.isIwdActive) return IWDHomePage;
			// if (this.isWrdActive) return WRDHomePage;
			return DefaultHomePage;
		},
		headerTheme() {
			// if (this.is15YearsActive) return fifteenYearHeaderTheme;
			if (this.isContentfulHomepageActive) return lightHeader;
			if (this.isLenderPreferencesActive) return lightHeader;
			// if (this.isMessageActive) return lightHeader;
			// if (this.isIwdActive) return iwdHeaderTheme;
			// if (this.isWrdActive) return wrdHeaderTheme;
			return null;
		},
		footerTheme() {
			// if (this.is15YearsActive) return fifteenYearFooterTheme;
			// if (this.isMessageActive) return lightFooter;
			// if (this.isIwdActive) return iwdFooterTheme;
			// if (this.isWrdActive) return wrdFooterTheme;
			return null;
		}
	},
	apollo: {
		query: activePageQuery,
		preFetch(config, client) {
			return client.query({
				query: activePageQuery
			}).then(() => {
				return Promise.all([
					client.query({ query: experimentQuery, variables: { id: 'home_legacy' } })
				]);
			});
		},
		result({ data }) {
			// Check for contentful homepage content, else use non contentful homepage
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

			// returns the contentful content of the uiSetting key ui-homepage-monthly-good
			// which controls when the contentful page layout should be active
			const uiHomepageMonthlyGoodSetting = this.pageData?.page?.settings?.find(item => item.key === 'ui-homepage-monthly-good') ?? null; // eslint-disable-line max-len
			const isUiHomepageMonthlyGoodSettingEnabled = settingEnabled(
				uiHomepageMonthlyGoodSetting,
				'active',
				'startDate',
				'endDate'
			);
			if (this.pageData && isUiHomepageMonthlyGoodSettingEnabled) {
				this.isContentfulHomepageActive = true;
			}

			// Fetch legacy homepage experiment data (GROW-442)
			const legacyHomeExp = this.apollo.readFragment({
				id: 'Experiment:home_legacy',
				fragment: experimentVersionFragment,
			}) || {};
			// Fire Event for EXP-GROW-442
			if (legacyHomeExp.version && legacyHomeExp.version !== 'unassigned') {
				this.$kvTrackEvent(
					'homepage',
					'EXP-GROW-442',
					legacyHomeExp.version,
				);
			}
			if (legacyHomeExp.version === 'a') {
				// Always show the legacy default homepage in this case
				this.isContentfulHomepageActive = false;
				this.isLenderPreferencesActive = false;
			} else {
				// Otherwise show the new default homepage
				this.isLenderPreferencesActive = true;
			}
		}
	}
};
</script>
