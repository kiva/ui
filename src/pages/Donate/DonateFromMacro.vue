<template>
	<www-page
		id="donate-landing"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<!-- Replicate <m-g-covid-hero /> -->
	</www-page>
</template>
<script>
import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	metaInfo: {
		title: 'Donate to help support Kiva today'
	},
	components: {
		WwwPage,
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
		};
	},

};
</script>
