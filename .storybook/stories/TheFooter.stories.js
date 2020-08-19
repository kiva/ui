import { lightFooter, iwdFooterTheme, wrdFooterTheme } from '@/util/siteThemes';
import StoryRouter from 'storybook-vue-router';

import TheFooter from '@/components/WwwFrame/TheFooter';

export default {
	title: 'WwwFrame/TheFooter',
	component: TheFooter,
	decorators: [StoryRouter()],
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
				},
			}
		},
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
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
