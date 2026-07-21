import { ref } from 'vue';

import GoalInReviewModal from '#src/components/MyKiva/GoalInReview/GoalInReviewModal';
import { buildSampleGoalInReviewData } from './goalInReviewSampleData';

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

export const Default = story({
	show: true,
	data: buildSampleGoalInReviewData(2026),
});
