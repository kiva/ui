import StoryRouter from 'storybook-vue-router';
import { number } from '@storybook/addon-knobs';
import TwelveDaysCalendar from './TwelveDaysCalendar';

export default {
	title: 'Promos|12Days',
	decorators: [StoryRouter()],
};

export const TwelveDaysCalendarAd = () => ({
	components: {
		TwelveDaysCalendar,
	},
	props: {
		currentDay: {
			default: number('currentDay', 3)
		},
	},
	template: `
		<twelve-days-calendar :current-day="currentDay" />
	`,
});
