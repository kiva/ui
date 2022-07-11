import MonthlyGoodUpdateForm from '@/components/Forms/MonthlyGoodUpdateForm';

export default {
	title: 'Forms/MonthlyGoodUpdateForm',
	component: MonthlyGoodUpdateForm,
	args: {
		donation: 3.75,
		dayOfMonth: 20,
		mgAmount: 10.25,
		category: 'women',
		disabled: false,
	},
	argTypes: {
		category: {
			control: {
				type: 'select',
				options: [
					'default', 'women', 'agriculture', 'refugees', 'education', 'eco_friendly', 'us_borrowers', 'disaster_relief_covid'
				],
			}
		},
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		MonthlyGoodUpdateForm
	},
	template: `
		<monthly-good-update-form
			:donation="donation"
			:day-of-month="dayOfMonth"
			:category="category"
			:mg-amount="mgAmount"
			:disabled="disabled"
		/>
	`,
});
