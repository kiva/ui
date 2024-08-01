import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import {
	lightFooter,
	iwdFooterTheme,
	wrdFooterTheme,
	fifteenYearFooterTheme,
	blueFooter
} from '#src/util/siteThemes';
import WwwPageCorporate from '#src/components/WwwFrame/WwwPageCorporate';

const args = {
	footerTheme: null,
	corporateLogoUrl: require('#src/assets/images/logos/visa.svg')
};

export default {
	title: 'WwwFrame/WwwPageCorporate',
	component: WwwPageCorporate,
	args,
	argTypes: {
		footerTheme: {
			control: {
				type: 'select',
				options: {
					'none': null,
					'lightFooter': lightFooter,
					'iwdFooterTheme': iwdFooterTheme,
					'wrdFooterTheme': wrdFooterTheme,
					'fifteenYearFooterTheme': fifteenYearFooterTheme,
					'blueFooter': blueFooter,
				},
			}
		},
	},
};

export const Default = (otherArgs, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		WwwPageCorporate
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	setup() { return { ...args, ...otherArgs } },
	template: `
		<www-page-corporate
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
	footerTheme: lightFooter
};
