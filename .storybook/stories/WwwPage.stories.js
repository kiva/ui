import Vue from 'vue'
import { boolean, select } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import { MockKvAuth0 } from '@/util/KvAuth0';
import { lightHeader, lightFooter, iwdHeaderTheme, iwdFooterTheme, wrdHeaderTheme, wrdFooterTheme } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

export default {
	title: 'WwwFrame/WwwPage',
	component: WwwPage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		WwwPage
	},
	mixins: [apolloStoryMixin],
	provide: {
		kvAuth0: MockKvAuth0
	},
	template: `
		<www-page>
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page>
	`,
});

export const GreyBackground = () => ({
	components: {
		WwwPage
	},
	mixins: [apolloStoryMixin],
	provide: {
		kvAuth0: MockKvAuth0
	},
	props: {
		greyBackground: {
			default: boolean('greyBackground', true)
		},
	},
	template: `
		<www-page :gray-background="greyBackground">
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page>
	`,
});

export const HideSearchInHeader = () => ({
	components: {
		WwwPage
	},
	mixins: [apolloStoryMixin],
	provide: {
		kvAuth0: MockKvAuth0
	},
	props: {
		hideSearchInHeader: {
			default: boolean('hideSearchInHeader', true)
		},
	},
	template: `
		<www-page :hide-search-in-header="hideSearchInHeader">
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page>
	`,
});

export const Themed = () => ({
	components: {
		WwwPage
	},
	mixins: [apolloStoryMixin],
	provide: {
		kvAuth0: MockKvAuth0
	},
	props: {
		headerTheme: {
			type: Object,
			default() { return select('headerTheme', { lightHeader, iwdHeaderTheme, wrdHeaderTheme, none: {} }, lightHeader) }
		},
		footerTheme: {
			type: Object,
			default() { return select('footerTheme', { lightFooter, iwdFooterTheme, wrdFooterTheme, none: {} }, lightFooter) }
		}
	},
	template: `
		<wwwPage
			:header-theme="headerTheme"
			:footer-theme="footerTheme"
		>
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page>
	`,
});

