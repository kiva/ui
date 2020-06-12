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
import {
	lightHeader, lightFooter, iwdHeaderTheme, iwdFooterTheme, wrdHeaderTheme, wrdFooterTheme
} from '@/util/siteThemes';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DefaultHomePage from '@/pages/Homepage/DefaultHomepage';
import IWDHomePage from '@/pages/Homepage/iwd/IWDHomepage';
import WRDHomePage from '@/pages/Homepage/wrd/WRDHomepage';

import TopMessageContentful from './TopMessageContentful';

const activePageQuery = gql`query homepageFrame {
	contentful {
		entries(contentType: "uiSetting", contentKey: "ui-homepage-top")
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		DefaultHomePage,
		IWDHomePage,
		WRDHomePage,
		TopMessageContentful,
	},
	data() {
		return {
			isIwdActive: false,
			isWrdActive: true,
			takeOverActive: false,
			takeOverContent: '',
		};
	},
	computed: {
		activeHomepage() {
			if (this.takeOverActive) return TopMessageContentful;
			if (this.isIwdActive) return IWDHomePage;
			// ! TODO
			// ! TODO make isWrdActive dynamic based on a contentful setting
			// ! TODO
			if (this.isWrdActive) return WRDHomePage;
			return DefaultHomePage;
		},
		headerTheme() {
			if (this.takeOverActive) return lightHeader;
			if (this.isIwdActive) return iwdHeaderTheme;
			if (this.isWrdActive) return wrdHeaderTheme;
			return null;
		},
		footerTheme() {
			if (this.takeOverActive) return lightFooter;
			if (this.isIwdActive) return iwdFooterTheme;
			if (this.isWrdActive) return wrdFooterTheme;
			return null;
		}
	},
	apollo: {
		query: activePageQuery,
		preFetch: true,
		result({ data }) {
			// isIwdActive used to be set based on an experiment query
			// if something like this is to be implemented in the future it
			// should be based on contentful, like isWrdActive.
			this.isIwdActive = false;

			// determine if take-over message content is active
			const contentSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-homepage-top'); // eslint-disable-line max-len
			if (!contentSetting || !contentSetting.fields) {
				this.takeOverActive = false;
			} else {
				const isContentEnabled = settingEnabled(
					contentSetting.fields,
					'active',
					'startDate',
					'endDate'
				);
				if (isContentEnabled) {
					const activeContent = _get(contentSetting, 'fields.content[0]');
					if (activeContent) {
						this.takeOverActive = true;
						this.takeOverContent = documentToHtmlString(activeContent.fields.bodyCopy);
					}
				}
			}
		}
	}
};
</script>
