import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
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

import WwwPageCorporate from '@/components/WwwFrame/WwwPageCorporate';

export default {
	title: 'WwwFrame/WwwPageCorporate',
	component: WwwPageCorporate,
	decorators: [StoryRouter()],
	args: {
		headerTheme: null,
		footerTheme: null,
		corporateLogoUrl: require('@/assets/images/logos/visa.svg')
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
			}
		},
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		WwwPageCorporate
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<www-page-corporate
			:header-theme="headerTheme"
			:footer-theme="footerTheme"
			:corporate-logo-url="corporateLogoUrl"
		>
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page-corporate>
	`,
});

export const Themed = Default.bind({});
Themed.args = {
	headerTheme: lightHeader,
	footerTheme: lightFooter
};
