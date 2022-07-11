import {
	lightFooter,
	iwdFooterTheme,
	wrdFooterTheme,
	fifteenYearFooterTheme,
	blueFooter
} from '@/util/siteThemes';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import TheFooter from '@/components/WwwFrame/TheFooter';

export default {
	title: 'WwwFrame/TheFooter',
	component: TheFooter,
	args: {
		theme: null,
	},
	argTypes: {
		theme: {
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
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
	components: {
		TheFooter
	},
	template: `
		<the-footer
			:theme="theme"
		/>
	`,
});

export const Themed = Default.bind({});
Themed.args = {
	theme: wrdFooterTheme,
};
