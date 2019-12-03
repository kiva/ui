import StoryRouter from 'storybook-vue-router';
import { number, boolean } from '@storybook/addon-knobs';
import TwelveDaysCalendar from '@/pages/Possibility/TwelveDaysCalendar';

export default {
	title: 'Promos|12Days',
	decorators: [StoryRouter()],
};

export const TwelveDaysCalendarAd = () => ({
	components: {
		TwelveDaysCalendar,
	},
	props: {
		adventDay: {
			default: number('adventDay', 3)
		},
		promoEnabled: {
			default: boolean('promoEnabled', true)
		}
	},
	template: `
		<twelve-days-calendar
			:advent-day="adventDay"
			:promo-enabled="promoEnabled"
		/>
	`,
});
