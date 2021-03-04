<template>
	<component :is="activeHomepage" :content="pageData" />
</template>

<script>
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import { preFetchAll } from '@/util/apolloPreFetch';
import { settingEnabled } from '@/util/settingsUtils';
import { processPageContentFlat } from '@/util/contentfulUtils';

import WwwPage from '@/components/WwwFrame/WwwPage';

const DefaultHomePage = () => import('@/pages/Homepage/DefaultHomepage');
const LendByCategoryHomepage = () => import('@/pages/Homepage/LendByCategoryHomepage');
const MonthlyGoodHomepage = () => import('@/pages/Homepage/MonthlyGoodHomepage');
// const FifteenYearHomepage = () => import('@/pages/Homepage/15YearHomepage');
// const IWDHomePage = () => import('@/pages/Homepage/iwd/IWDHomepage');
const IWD2021HomePage = () => import('@/pages/Homepage/iwd/IWD2021Homepage');
// const WRDHomePage = () => import('@/pages/Homepage/wrd/WRDHomepage');
const TopMessageContentful = () => import('./TopMessageContentful');

const activePageQuery = gql`query homepageFrame {
	contentful {
		entries(contentType: "page", contentKey: "home-default")
	}
	general {
		legacyHomeExp: uiExperimentSetting(key: "home_legacy") {
			key
			value
		}
	}
}`;

// Get the Contentful Page data from the data of an Apollo query result
const getPageData = data => {
	const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
	return pageEntry ? processPageContentFlat(pageEntry) : null;
};

// Return an import function for the active homepage component
const selectActiveHomepage = (pageData = {}, legacyHomeExp = {}) => {
	// Being in the 'a' variant of the legacy home experiment forces using the legacy homepage
	if (legacyHomeExp.version === 'a') {
		return DefaultHomePage;
	}

	// If the IWD 2021 campaign is active, use that homepage
	const uiHomepageIWD2021Setting = pageData?.page?.settings?.find(item => item.key === 'ui-homepage-iwd-2021') ?? null; // eslint-disable-line max-len
	const isUiHomepageIWD2021SettingEnabled = settingEnabled(
		uiHomepageIWD2021Setting,
		'active',
		'startDate',
		'endDate'
	);
	if (pageData && isUiHomepageIWD2021SettingEnabled) {
		return IWD2021HomePage;
	}

	// If the Monthly Good campaign is active, use that homepage
	const uiHomepageMonthlyGoodSetting = pageData?.page?.settings?.find(item => item.key === 'ui-homepage-monthly-good') ?? null; // eslint-disable-line max-len
	const isUiHomepageMonthlyGoodSettingEnabled = settingEnabled(
		uiHomepageMonthlyGoodSetting,
		'active',
		'startDate',
		'endDate'
	);
	if (pageData && isUiHomepageMonthlyGoodSettingEnabled) {
		return MonthlyGoodHomepage;
	}

	// If nothing else is selected, default to the Lend-By-Category homepage
	return LendByCategoryHomepage;
};

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		DefaultHomePage,
		LendByCategoryHomepage,
		// FifteenYearHomepage,
		// IWDHomePage,
		IWD2021HomePage,
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
			activeHomepage: null,
			pageData: null,
		};
	},
	apollo: {
		query: activePageQuery,
		preFetch(config, client, args) {
			return client.query({
				query: activePageQuery
			}).then(({ data }) => {
				return client.query({
					query: experimentQuery,
					variables: { id: 'home_legacy' },
				}).then(expResult => {
					// Select which homepage to load
					const componentImporter = selectActiveHomepage(getPageData(data), expResult?.data?.experiment);
					return componentImporter();
				}).then(resolvedImport => {
					// Call preFetch for the active homepage
					const component = resolvedImport.default;
					return preFetchAll([component], client, args);
				});
			});
		},
		result({ data }) {
			// Get page data from Contentful
			this.pageData = getPageData(data);

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

			// Set active homepage
			this.activeHomepage = selectActiveHomepage(this.pageData, legacyHomeExp);
		}
	}
};
</script>
