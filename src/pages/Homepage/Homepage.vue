<template>
	<www-page id="homepage"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<component :is="activeHomepage" />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DefaultHomePage from '@/pages/Homepage/DefaultHomepage';
import IWDHomePage from '@/pages/Homepage/iwd/IWDHomepage';

const iwdSwitchQuery = gql`{
	general {
		iwd_homepage_active: uiConfigSetting(key: "iwd_homepage_active") {
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
		IWDHomePage,
	},
	data() {
		return {
			isIwdActive: false,
			iwdHeaderTheme: {
				backgroundColor: '#fff',
				linkColor: '#060f9f',
				linkHoverColor: '#a0e2ba',
				separatorColor: 'transparent'
			},
			iwdFooterTheme: {
				backgroundColor: '#fff',
				textColor: '#484848',
				linkColor: '#060f9f',
				separatorColor: '#a0e2ba'
			},
		};
	},
	computed: {
		activeHomepage() {
			return this.isIwdActive ? IWDHomePage : DefaultHomePage;
		},
		headerTheme() {
			return this.activeHomepage !== DefaultHomePage ? this.iwdHeaderTheme : null;
		},
		footerTheme() {
			return this.activeHomepage !== DefaultHomePage ? this.iwdFooterTheme : null;
		}
	},
	apollo: {
		query: iwdSwitchQuery,
		preFetch: true,
		result({ data }) {
			console.log(data);
			this.isIwdActive = _get(data, 'general.iwd_homepage_active.value');
		}
	}
};
</script>
