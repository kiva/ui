import { object } from '@storybook/addon-knobs';
import StoryRouter from 'storybook-vue-router';

import TheFooter from '@/components/WwwFrame/TheFooter';

export default {
	title: 'WwwFrame/TheFooter',
	component: TheFooter,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		TheFooter
	},
	template: `
		<the-footer />
	`,
});

export const Themed = () => ({
	components: {
		TheFooter
	},
	props: {
		theme: {
			type: Object,
			default() {
				return object('theme', {
					backgroundColor: '#060f9f',
					textColor: 'yellow',
					linkColor: 'hsl(178, 97%, 35%)',
					separatorColor: 'pink'
				});
			}
		}
	},
	template: `
		<the-footer :theme="theme" />
	`,
});

