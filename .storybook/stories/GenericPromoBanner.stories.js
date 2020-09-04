import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import { text } from '@storybook/addon-knobs';
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
	title: 'Components/Generic Global Promo Banner',
	component: GenericPromoBanner,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		GenericPromoBanner,
	},
	props: {
		iconKey: {
			type: String,
			default: 'present'
		},
		promoBannerContent: {
			type: Object,
			default() {
				return {
					kvTrackEvent: [],
					link: `${text('Link', 'http://kiva.org')}`,
					richText: decodeHTML(`${text('Banner Text', 'Amazing! Thanks to you, we funded <u>ALL U.S. loans</u> today! Click here to support others who need your help.')}`),
				};
			}
		},
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


export const AllIcons = () => ({
	components: {
		GenericPromoBanner,
	},
	props: {
		iconKey: {
			type: String,
			default: 'present'
		},
		promoBannerContent: {
			type: Object,
			default() {
				return {
					kvTrackEvent: [],
					link: `${text('Link', 'http://kiva.org')}`,
					richText: decodeHTML(`${text('Banner Text', 'Amazing! Thanks to you, we funded <u>ALL U.S. loans</u> today! Click here to support others who need your help.')}`),
				};
			}
		},
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
				v-for="icon in icons"
				:icon-key="icon"
				:promo-banner-content="promoBannerContent"
			/>
			<br/>
			<p class="subheader">Banner text supports basic html tags</p>
		</div>
	`,
});
