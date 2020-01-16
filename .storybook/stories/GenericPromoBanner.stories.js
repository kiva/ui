import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import { select, text } from '@storybook/addon-knobs';
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';

const iconKeySelect = {
	browse: "browse-toggle",
	corporate: "corporate-engagement",
	curved: "curved-arrow",
	dedicate: "dedicate-heart",
	distribution: "distribution",
	edit: "edit",
	email: "email",
	filter: "filter",
	filters: "filters-toggle",
	filters: "filters",
	globe: "globe",
	grants: "grants",
	grid: "grid",
	half: "half-star",
	handshake: "handshake",
	iwd: "iwd-flower",
	kiva: "kiva-card",
	kiva: "kiva-promise",
	leaf: "leaf",
	leaves: "leaves",
	line: "line-graph",
	list: "list",
	lock: "lock",
	magnify: "magnify-glass",
	map: "map",
	match: "match",
	nearme: "nearme",
	new: "new-kiva-logo",
	paypal: "paypal",
	pdf: "pdf",
	pencil: "pencil",
	present: "present",
	refresh: "refresh",
	secure: "secure-lock",
	slideshow: "slideshow-dot",
	small: "small-x",
	sort: "sort",
	star: "star",
	tags: "tags-checkmark",
	triangle: "triangle",
	woman: "woman",
	x: "x",
};

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

const decodeHTML = function(html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
}

export default {
	title: 'Promos/Generic Global Promo Banner',
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		GenericPromoBanner,
	},
	props: {
		iconKey: {
			type: String,
			default: select('Icon Key', iconKeySelect, 'present')
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
