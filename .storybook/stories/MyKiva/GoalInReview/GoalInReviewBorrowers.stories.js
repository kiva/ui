import GoalInReviewBorrowers from '#src/components/MyKiva/GoalInReview/GoalInReviewBorrowers';
import { MAX_BORROWER_CARDS } from '#src/util/goalInReview';
import { sampleGoalLoans } from '../../../mock-data/goalInReviewSampleData';

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewBorrowers',
	component: GoalInReviewBorrowers,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalInReviewBorrowers },
		setup() {
			return { args };
		},
		template: '<GoalInReviewBorrowers v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const Default = story({
	loans: sampleGoalLoans,
	borrowerCount: 14,
});

export const SingleBorrower = story({
	loans: sampleGoalLoans.slice(0, 1),
	borrowerCount: 1,
});

export const FullRow = story({
	loans: sampleGoalLoans.slice(0, 6),
	borrowerCount: 6,
});

export const AtCardLimit = story({
	loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS),
	borrowerCount: MAX_BORROWER_CARDS,
});

export const OneOverCardLimit = story({
	loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS + 1),
	borrowerCount: MAX_BORROWER_CARDS + 1,
});

export const LargeOverflow = story({
	loans: sampleGoalLoans,
	borrowerCount: 1248,
});

export const GroupLoans = story({
	loans: sampleGoalLoans.slice(0, 4),
	borrowerCount: 20,
});

export const LongBorrowerNames = story({
	loans: sampleGoalLoans.map(loan => ({
		...loan,
		name: `${loan.name} Del Carmen Villalobos Hernández`,
	})),
	borrowerCount: 14,
});

export const MissingPhotos = story({
	loans: sampleGoalLoans.slice(0, 6).map((loan, index) => (
		index % 2 === 0 ? { ...loan, image: null } : loan
	)),
	borrowerCount: 6,
});

export const NoLoans = story({
	loans: [],
	borrowerCount: null,
});
