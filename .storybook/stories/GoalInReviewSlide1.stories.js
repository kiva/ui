import GoalInReviewSlide1 from '#src/components/MyKiva/GoalInReview/GoalInReviewSlide1.vue';

export default {
	title: 'MyKiva/Goal In Review/Slide 1',
	component: GoalInReviewSlide1,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalInReviewSlide1 },
		setup() { return { args }; },
		template: `
			<div style="max-width: 1200px; margin: 0 auto;">
				<goal-in-review-slide-1 v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const GoalComplete = story({
	goalStatus: 'completed',
	firstName: 'Alexandra',
	year: 2026,
	amountLent: 1025,
	borrowerCount: 14,
	category: 'Women',
	percentComplete: 100,
});

export const GoalInProgress = story({
	goalStatus: 'in-progress',
	firstName: 'Alexandra',
	year: 2026,
	amountLent: 50,
	borrowerCount: 1,
	category: 'Women',
	percentComplete: 35,
});

export const CompleteWithoutName = story({
	goalStatus: 'completed',
	year: 2026,
	amountLent: 1025,
	borrowerCount: 14,
	category: 'Women',
	percentComplete: 100,
});

export const MissingStats = story({
	goalStatus: 'in-progress',
	firstName: 'Alexandra',
	year: 2026,
	amountLent: null,
	borrowerCount: null,
	category: '',
	percentComplete: null,
});
