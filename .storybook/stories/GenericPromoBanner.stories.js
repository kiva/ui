import GenericPromoBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';

const decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
}

const args = {
	iconKey: 'present',
	promoBannerContent: {
		kvTrackEvent: [],
		link: 'http://kiva.org',
		richText: decodeHTML('Amazing! Thanks to you, we funded <u>ALL U.S. loans</u> today! Click here to support others who need your help.'),
	}
};

export default {
	title: 'WwwFrame/Banners/GenericPromoBanner',
	component: GenericPromoBanner,
	args,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		GenericPromoBanner,
	},
	setup() { return args; },
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

export const AllIcons = (_, { argTypes }) => ({
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
	setup() { return args; },
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
