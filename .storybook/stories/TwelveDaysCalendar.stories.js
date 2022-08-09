import TwelveDaysCalendar from '@/pages/Possibility/TwelveDaysCalendar';

export default {
	title: 'Page/12Days',
	component: TwelveDaysCalendar,
	args: {
		adventDay: 3,
		promoEnabled: true,
	}
};

export const TwelveDaysCalendarAd = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TwelveDaysCalendar,
	},
	template: `
		<twelve-days-calendar
			:advent-day="adventDay"
			:promo-enabled="promoEnabled"
		/>
	`,
});
