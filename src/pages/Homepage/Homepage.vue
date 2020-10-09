<template>
	<www-page id="homepage"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<component :is="activeHomepage" :content="takeOverContent" />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { settingEnabled } from '@/util/settingsUtils';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import {
	lightHeader,
	lightFooter,
	iwdHeaderTheme,
	iwdFooterTheme,
	wrdHeaderTheme,
	wrdFooterTheme,
	fifteenYearHeaderTheme,
	fifteenYearFooterTheme,
} from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DefaultHomePage from '@/pages/Homepage/DefaultHomepage';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';
import FifteenYearHomepage from '@/pages/Homepage/15YearHomepage';
// import IWDHomePage from '@/pages/Homepage/iwd/IWDHomepage';
// import WRDHomePage from '@/pages/Homepage/wrd/WRDHomepage';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import TopMessageContentful from './TopMessageContentful';

const activePageQuery = gql`query homepageFrame {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-homepage-takeover")
	}
	general {
		lenderPreferencesExp: uiExperimentSetting(key: "home_lenderpreferences") {
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
		FifteenYearHomepage,
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
			isIwdActive: false,
			isWrdActive: false,
			isMessageActive: false,
			takeOverContent: '',
		};
	},
	computed: {
		activeHomepage() {
			if (this.is15YearsActive) return FifteenYearHomepage;
			if (this.isLenderPreferencesActive) return LendByCategoryHomepage;
			if (this.isMessageActive) return TopMessageContentful;
			// if (this.isIwdActive) return IWDHomePage;
			// if (this.isWrdActive) return WRDHomePage;
			return DefaultHomePage;
		},
		headerTheme() {
			if (this.is15YearsActive) return fifteenYearHeaderTheme;
			if (this.isLenderPreferencesActive) return lightHeader;
			if (this.isMessageActive) return lightHeader;
			if (this.isIwdActive) return iwdHeaderTheme;
			if (this.isWrdActive) return wrdHeaderTheme;
			return null;
		},
		footerTheme() {
			if (this.is15YearsActive) return fifteenYearFooterTheme;
			if (this.isMessageActive) return lightFooter;
			if (this.isIwdActive) return iwdFooterTheme;
			if (this.isWrdActive) return wrdFooterTheme;
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
					client.query({ query: experimentQuery, variables: { id: 'home_lenderpreferences' } })
				]);
			});
		},
		result({ data }) {
			// Explicit lender preferences experiment - EXP-GROW-166-Aug2020
			const lenderPreferencesExp = this.apollo.readFragment({
				id: 'Experiment:home_lenderpreferences',
				fragment: experimentVersionFragment,
			}) || {};
			this.isLenderPreferencesActive = lenderPreferencesExp.version === 'shown';
			this.is15YearsActive = lenderPreferencesExp.version === 'kiva15';
			// Fire Event for EXP-GROW-166-Aug2020
			if (lenderPreferencesExp.version && lenderPreferencesExp.version !== 'unassigned') {
				this.$kvTrackEvent(
					'homepage',
					'EXP-GROW-166-Aug2020',
					lenderPreferencesExp.version === 'shown' ? 'b' : 'a'
				);
			}

			// GROW-166 (if shown) takes precedence over "take-over settings"
			if (!this.isLenderPreferencesActive) {
				// determine if take-over setting is active
				const contentSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-homepage-takeover'); // eslint-disable-line max-len
				if (_get(contentSetting, 'fields')) {
					const isContentEnabled = settingEnabled(
						contentSetting.fields,
						'active',
						'startDate',
						'endDate'
					);
					if (isContentEnabled) {
						const takeOverKey = _get(contentSetting, 'fields.dataObject.takeOverKey');

						switch (takeOverKey) {
							case 'WRD':
								this.isWrdActive = true;
								break;
							case 'IWD':
								this.isIwdActive = true;
								break;
							case 'BLM':
								this.isMessageActive = true;
								break;
							default:
								break;
						}
						const activeContent = _get(contentSetting, 'fields.content[0]');
						if (activeContent) {
							this.takeOverContent = documentToHtmlString(activeContent.fields.bodyCopy);
						}
					}
				}
			}
		}
	}
};
</script>
