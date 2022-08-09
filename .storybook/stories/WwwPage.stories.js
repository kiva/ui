import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import {
	lightHeader,
	lightFooter,
	iwdHeaderTheme,
	iwdFooterTheme,
	wrdHeaderTheme,
	wrdFooterTheme,
	fifteenYearHeaderTheme,
	fifteenYearFooterTheme,
	blueHeader,
	blueFooter
} from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	title: 'WwwFrame/WwwPage',
	component: WwwPage,
	args: {
		grayBackground: false,
		hideSearchInHeader: false,
		headerTheme: null,
		footerTheme: null
	},
	argTypes: {
		headerTheme: {
			control: {
				type: 'select',
				options: {
					'none': null,
					'lightHeader':lightHeader,
					'iwdHeaderTheme': iwdHeaderTheme,
					'wrdHeaderTheme': wrdHeaderTheme,
					'fifteenYearHeaderTheme': fifteenYearHeaderTheme,
					'blueHeader': blueHeader,
				},
			}
		},
		footerTheme: {
			control: {
				type: 'select',
				options: {
					'none': null,
					'lightFooter':lightFooter,
					'iwdFooterTheme': iwdFooterTheme,
					'wrdFooterTheme': wrdFooterTheme,
					'fifteenYearFooterTheme': fifteenYearFooterTheme,
					'blueFooter': blueFooter,
				},
				selected: 'none'
			}
		},
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		WwwPage
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin ],
	template: `
		<www-page
			:gray-background="grayBackground"
			:hide-search-in-header="hideSearchInHeader"
			:header-theme="headerTheme"
			:footer-theme="footerTheme"
		>
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page>
	`,
});


export const GrayBackground = Default.bind({});
GrayBackground.args = {
	grayBackground: true,
};

export const HideSearchInHeader = Default.bind({});
HideSearchInHeader.args = {
	hideSearchInHeader: true,
};

export const Themed = Default.bind({});
Themed.args = {
	headerTheme: lightHeader,
	footerTheme: lightFooter
};

