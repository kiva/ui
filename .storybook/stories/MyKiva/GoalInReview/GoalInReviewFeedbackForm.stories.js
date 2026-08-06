import GoalInReviewFeedbackForm from '#src/components/MyKiva/GoalInReview/GoalInReviewFeedbackForm';

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewFeedbackForm',
	component: GoalInReviewFeedbackForm,
};

const Template = () => ({
	components: { GoalInReviewFeedbackForm },
	template: `
		<div class="tw-bg-eco-green-4 tw-p-4" style="max-width: 640px; margin: 0 auto;">
			<GoalInReviewFeedbackForm />
		</div>
	`,
});

export const Default = Template.bind({});
