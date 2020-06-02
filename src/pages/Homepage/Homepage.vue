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
import { lightHeader, lightFooter } from '@/util/siteThemes';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DefaultHomePage from '@/pages/Homepage/DefaultHomepage';
import IWDHomePage from '@/pages/Homepage/iwd/IWDHomepage';
import TopMessageContentful from './TopMessageContentful';

const activePageQuery = gql`query homepageFrame {
	general {
		iwd_homepage_active: uiConfigSetting(key: "iwd_homepage_active") {
			key
			value
		}
	}
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
		TopMessageContentful,
	},
	data() {
		return {
			isIwdActive: false,
			iwdHeaderTheme: {
				themeKey: 'IWD',
				backgroundColor: '#fff',
				linkColor: '#060f9f',
				linkHoverColor: '#a0e2ba',
				separatorColor: 'transparent'
			},
			iwdFooterTheme: {
				themeKey: 'IWD',
				backgroundColor: '#fff',
				textColor: '#484848',
				linkColor: '#060f9f',
				separatorColor: '#a0e2ba'
			},
			takeOverActive: false,
			takeOverContent: '',
		};
	},
	computed: {
		activeHomepage() {
			if (this.takeOverActive) return TopMessageContentful;
			if (this.isIwdActive) return IWDHomePage;
			return DefaultHomePage;
		},
		headerTheme() {
			if (this.takeOverActive) return lightHeader;
			if (this.isIwdActive) return this.iwdHeaderTheme;
			return null;
		},
		footerTheme() {
			if (this.takeOverActive) return lightFooter;
			if (this.isIwdActive) return this.iwdFooterTheme;
			return null;
		}
	},
	apollo: {
		query: activePageQuery,
		preFetch: true,
		result({ data }) {
			// determine if IWD is active
			this.isIwdActive = _get(data, 'general.iwd_homepage_active.value') === 'true' || false;

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
