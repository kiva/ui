<template>
	<div
		class="card-container"
		:class="{
			'goal-card-bg': !userHasGoal,
		}"
	>
		<div :class="{'tw-mx-auto tw-relative achievement-card-bg': userHasGoal}">
			<span
				:class="{'tw-absolute tw-top-1 tw-left-1': userHasGoal}"
				class="
              tw-inline-flex tw-items-center tw-gap-1
              tw-mb-2 tw-rounded-md
              tw-bg-eco-green-1 tw-px-1.5 tw-py-1"
				title="Your lending reach"
			>
				<KvMaterialIcon
					class="tw-w-2 tw-h-2 tw-shrink-0"
					:icon="mdiCheckCircleOutline"
				/>
				<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
					My goal
				</span>
			</span>
			<img
				v-if="userHasGoal"
				:src="achievementGoalImg"
				class="tw-rounded tw-w-full tw-h-full tw-object-cover tw-object-top"
			>
		</div>
		<div class="tw-flex tw-flex-col" :class="{'tw-gap-1': userHasGoal}">
			<div v-if="!userHasGoal" class="tw-mx-auto">
				<GoalCardCareImg />
			</div>
			<h3>{{ title }}</h3>
			<template v-if="userHasGoal">
				<div class="tw-flex tw-items-baseline tw-gap-3">
					<div>
						<h5 class="tw-mb-1">
							{{ currentGoalProgress }} / {{ loansToReachGoal }} Loans
						</h5>
						<kv-progress-bar
							style="width: 98px;"
							aria-label="Percent the loan has funded"
							:value="currentGoalProgress"
							:max="loansToReachGoal"
						/>
					</div>
					<KvButton
						class="tw-flex-grow"
						v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
					>
						Continue
					</KvButton>
				</div>
			</template>
			<template v-else>
				<p class="tw-text-small tw-pb-2">
					How many more people will you help this year?
				</p>
				<KvButton
					v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
					@click="$emit('open-goal-modal')"
				>
					Set a goal
				</KvButton>
			</template>
		</div>
	</div>
</template>

<script setup>

import { computed } from 'vue';
import {
	KvMaterialIcon, KvButton, KvProgressBar
} from '@kiva/kv-components';
import { mdiCheckCircleOutline } from '@mdi/js';
import { formatRichTextContent } from '#src/util/contentfulUtils';
import GoalCardCareImg from '#src/assets/images/my-kiva/goal-card-care.svg';

const props = defineProps({
	heroSlides: {
		type: Array,
		default: () => [],
	},
	heroTieredAchievements: {
		type: Array,
		default: () => [],
	},
	userGoal: {
		type: Object,
		default: () => ({}),
	}
});

defineEmits(['open-goal-modal']);

// Placeholder for current progress, replace with actual progress data when available
const currentGoalProgress = computed(() => 3);

// Placeholder for goal loans, replace with actual goal data when available
const loansToReachGoal = computed(() => props.userGoal?.target || 0);

const userHasGoal = computed(() => !!props.userGoal);

const title = computed(() => {
	if (userHasGoal.value) {
		return 'Works towards your goal';
	}

	return 'Set your first impact goal!';
});

const getContentfulKey = category => {
	switch (category) {
		case 'us-economic-equality':
			return 'us-equality';
		case 'basic-needs':
			return 'fundamental-needs';
		case 'refugees':
			return 'refugee-equality';
		default: return category;
	}
};

const achievementGoalImg = computed(() => {
	const key = `my-kiva-${getContentfulKey(props.userGoal?.category)}-journey`;

	const richText = props.heroSlides.find(slide => slide?.fields?.key === key);
	const formattedRichText = formatRichTextContent(richText);

	const backgroundImage = formattedRichText?.richText?.content.find(
		item => item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
	);

	return backgroundImage?.data?.target?.fields?.file?.url || '';
});

</script>

<style lang="postcss" scoped>

.card-container {
  @apply tw-w-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
    tw-overflow-hidden tw-bg-white tw-shrink-0 tw-gap-1;

	@screen md {
		width: 336px;
	}
}

.goal-card-bg::before {
	content: '';
	width: 400px;
	height: 500px;
	background: url('/static/src/assets/images/my-kiva/goal-card-bg.jpg') lightgray;
	transform: rotate(17deg);
	left: 40%;

	@apply tw-absolute tw-bg-cover tw-bg-center tw-bg-no-repeat tw-z-base tw-right-0 tw-bg-blend-overlay;
}

.goal-card-bg > * {
	@apply tw-relative tw-z-1;
}

.achievement-card-bg {
	width: 100%;
	height: 236px;

	@screen md {
		width: 304px;
	}
}
</style>
