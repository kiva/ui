import { ref } from 'vue';

import GoalInReviewModal from '#src/components/MyKiva/GoalInReview/GoalInReviewModal';
import { buildSampleGoalInReviewData } from '../../../mock-data/goalInReviewSampleData';

export default {
	title: 'MyKiva/GoalInReview/GoalInReviewModal',
	component: GoalInReviewModal,
	parameters: {
		layout: 'fullscreen',
	},
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalInReviewModal },
		setup() {
			const showModal = ref(args.show);
			const closeModal = () => {
				showModal.value = false;
			};
			const openModal = () => {
				showModal.value = true;
			};
			return {
				args,
				closeModal,
				openModal,
				showModal,
			};
		},
		template: `
			<div class="tw-min-h-screen tw-bg-stone-1 tw-p-4">
				<h1 class="tw-text-title tw-mb-3">Sample MyKiva page content</h1>
				<div class="tw-h-20 tw-rounded tw-bg-eco-green-3 tw-mb-3"></div>
				<div class="tw-h-32 tw-rounded tw-bg-white"></div>
				<button class="tw-mt-3 tw-rounded tw-bg-brand tw-px-2 tw-py-1 tw-text-white" @click="openModal">
					Open recap
				</button>
				<GoalInReviewModal :show="showModal" :data="args.data" @close="closeModal" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

const currentYear = new Date().getFullYear();
const completeData = buildSampleGoalInReviewData(currentYear);

export const CompletedGoal = story({
	show: true,
	data: completeData,
});

export const InProgressGoal = story({
	show: true,
	data: {
		...completeData,
		goalSummary: { ...completeData.goalSummary, status: 'in-progress' },
		loanStats: { totalLent: 50, borrowers: 1, percentComplete: 35 },
	},
});

const lastYearData = buildSampleGoalInReviewData(currentYear - 1);

export const NextYearCompleted = story({
	show: true,
	data: lastYearData,
});

export const NextYearInProgress = story({
	show: true,
	data: { ...lastYearData, goalSummary: { ...lastYearData.goalSummary, status: 'in-progress' } },
});

export const CompleteWithoutName = story({
	show: true,
	data: {
		...completeData,
		firstName: '',
	},
});

export const MissingStats = story({
	show: true,
	data: {
		...completeData,
		goalSummary: { ...completeData.goalSummary, category: '' },
		loanStats: { totalLent: null, borrowers: null, percentComplete: null },
	},
});
