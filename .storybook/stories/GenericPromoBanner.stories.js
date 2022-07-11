import Vue from 'vue'
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)
const decodeHTML = function(html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
}

export default {
	title: 'WwwFrame/Banners/GenericPromoBanner',
	component: GenericPromoBanner,
	args: {
		iconKey: 'present',
		promoBannerContent: {
			kvTrackEvent: [],
			link: 'http://kiva.org',
			richText: decodeHTML('Amazing! Thanks to you, we funded <u>ALL U.S. loans</u> today! Click here to support others who need your help.'),
		}
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		GenericPromoBanner,
	},
	template: `
		<div>
			<generic-promo-banner
				:icon-key="iconKey"
				:promo-banner-content="promoBannerContent"
			/>
			<br/>
			<p class="subheader">Banner text supports basic html tags</p>
		</div>
	`,
});

export const AllIcons = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		GenericPromoBanner,
	},
	data() {
		return {
			icons: [
				"present",
				"kiva-card",
				"monthly-good",
				"iwd-flower",
				"confirmation",
				"info",
				"question",
			]
		}
	},
	template: `
		<div>
			<generic-promo-banner
				v-for="(icon, index) in icons"
				:icon-key="icon"
				:promo-banner-content="promoBannerContent"
				:key="index"
			/>
			<br/>
			<p class="subheader">Banner text supports basic html tags</p>
		</div>
	`,
});
