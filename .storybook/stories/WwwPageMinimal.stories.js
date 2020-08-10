import Vue from 'vue'
import { select } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

import { lightHeader, lightFooter, iwdHeaderTheme, iwdFooterTheme, wrdHeaderTheme, wrdFooterTheme } from '@/util/siteThemes';

import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';

export default {
	title: 'WwwFrame/WwwPageMinimal',
	component: WwwPageMinimal,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		WwwPageMinimal
	},
	mixins: [apolloStoryMixin],
	template: `
		<www-page-minimal>
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page-minimal>
	`,
});

export const Themed = () => ({
	components: {
		WwwPageMinimal
	},
	mixins: [apolloStoryMixin],
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
		<www-page-minimal
			:header-theme="headerTheme"
			:footer-theme="footerTheme"
		>
			<div class="row" style="padding: 1.625rem 0;">
				<div class="small-12 columns"><h1>Lorem ipsum</h1></div>
			</div>
		</www-page-minimal>
	`,
});
