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
	lightHeader, lightFooter, iwdHeaderTheme, iwdFooterTheme, wrdHeaderTheme, wrdFooterTheme
} from '@/util/siteThemes';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import WwwPage from '@/components/WwwFrame/WwwPage';

import TopMessageContentful from './TopMessageContentful';

const activePageQuery = gql`query homepageFrame {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-homepage-takeover")
	}
	general {
		uiExperimentSetting(key: "home_lendbycategory") {
			key
			value
		}
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		TopMessageContentful,
	},
	data() {
		return {
			isLendByCategoryActive: false,
			isIwdActive: false,
			isWrdActive: false,
			isMessageActive: false,
			takeOverContent: '',
		};
	},
	computed: {
		activeHomepage() {
			// dynamically import the homepage we want so we're not bundling unused assets.
			return () => {
				if (this.isWrdActive) {
					return import('@/pages/Homepage/wrd/WRDHomepage');
				}
				if (this.isIwdActive) {
					return import('@/pages/Homepage/iwd/IWDHomepage');
				}
				if (this.isLendByCategoryActive) {
					return import('@/pages/Homepage/LendByCategoryHomepage');
				}
				return import('@/pages/Homepage/DefaultHomepage');
			};
		},
		headerTheme() {
			if (this.isLendByCategoryActive) return lightHeader;
			if (this.isMessageActive) return lightHeader;
			if (this.isIwdActive) return iwdHeaderTheme;
			if (this.isWrdActive) return wrdHeaderTheme;
			return null;
		},
		footerTheme() {
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
				return client.query({
					query: experimentQuery, variables: { id: 'home_lendbycategory' }
				});
			});
		},
		result({ data }) {
			// lend-by-category as homepage experiment - EXP-GROW-138-Jul2020
			const lendByCategoryExperiment = this.apollo.readFragment({
				id: 'Experiment:home_lendbycategory',
				fragment: experimentVersionFragment,
			}) || {};
			this.isLendByCategoryActive = lendByCategoryExperiment.version === 'shown';
			// Fire Event for EXP-GROW-138-Jul2020
			if (lendByCategoryExperiment.version && lendByCategoryExperiment.version !== 'unassigned') {
				this.$kvTrackEvent(
					'Home',
					'EXP-GROW-138-Jul2020',
					lendByCategoryExperiment.version === 'shown' ? 'b' : 'a'
				);
			}
			// GROW-138 (if shown) takes precedence over "take-over settings"
			if (!this.isLendByCategoryActive) {
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
