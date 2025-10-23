<template>
	<div
		class="card-container tw-h-full"
		:class="{
			'goal-card-bg': !userHasGoal && !loading,
		}"
	>
		<kv-loading-placeholder v-if="loading" class="achievement-card-bg" />
		<div v-else :class="{'tw-mx-auto tw-relative achievement-card-bg': userHasGoal}">
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
		<div class="tw-flex tw-flex-col tw-grow" :class="{'tw-gap-1': userHasGoal}">
			<div v-if="!userHasGoal && !loading" class="tw-mx-auto">
				<GoalCardCareImg />
			</div>
			<h3 v-if="!loading">
				{{ title }}
			</h3>
			<kv-loading-placeholder v-else class="!tw-h-3 tw-w-full tw-max-w-16 tw-mb-1" />
			<template v-if="userHasGoal">
				<div class="tw-flex tw-items-end tw-gap-3">
					<div v-if="!loading">
						<h5 class="tw-mb-1">
							{{ goalProgress }} / {{ loansToReachGoal }} Loans
						</h5>
						<kv-progress-bar
							style="width: 98px;"
							aria-label="Percent the loan has funded"
							:value="goalProgress"
							:max="loansToReachGoal"
						/>
					</div>
					<div v-else>
						<kv-loading-placeholder class="!tw-h-2 !tw-w-8 tw-mb-1" />
						<kv-loading-placeholder class="!tw-h-1.5 tw-w-13 tw-max-w-sm" />
					</div>
					<KvButton
						class="tw-flex-grow"
						v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
						@click="handleContinueClick"
					>
						Continue
					</KvButton>
				</div>
			</template>
			<template v-else>
				<p v-if="!loading" class="tw-text-small tw-pb-2 tw-grow">
					How many more people will you help this year?
				</p>
				<kv-loading-placeholder v-else class="!tw-h-1 tw-mb-1" />
				<KvButton
					v-if="!loading"
					v-kv-track-event="['portfolio', 'click', 'set-a-goal']"
					@click="$emit('open-goal-modal')"
				>
					Set a goal
				</KvButton>
				<kv-loading-placeholder v-else class="!tw-h-4 tw-mb-1" />
			</template>
		</div>
	</div>
</template>

<script setup>

import { computed, onMounted, inject } from 'vue';
import {
	KvMaterialIcon, KvButton, KvProgressBar, KvLoadingPlaceholder
} from '@kiva/kv-components';
import { mdiCheckCircleOutline } from '@mdi/js';
import { formatRichTextContent } from '#src/util/contentfulUtils';
import GoalCardCareImg from '#src/assets/images/my-kiva/goal-card-care.svg';
import {
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY
} from '#src/composables/useBadgeData';
import { useRouter } from 'vue-router';

const props = defineProps({
	heroSlides: {
		type: Array,
		default: () => [],
	},
	userGoal: {
		type: Object,
		default: undefined,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	goalProgress: {
		type: Number,
		default: 0,
	},
});

defineEmits(['open-goal-modal']);

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const loansToReachGoal = computed(() => props.userGoal?.target || 0);

const userHasGoal = computed(() => !!props.userGoal?.category);

const title = computed(() => {
	if (userHasGoal.value) return 'Work towards your goal';
	return 'Set your first impact goal!';
});

const getContentfulKey = category => {
	switch (category) {
		case ID_US_ECONOMIC_EQUALITY:
			return 'us-equality';
		case ID_BASIC_NEEDS:
			return 'fundamental-needs';
		case ID_WOMENS_EQUALITY:
			return 'women';
		default: return category;
	}
};

const getGoalCategoryUrl = category => {
	switch (category) {
		case 'us-economic-equality':
			return 'U.S. entrepreneurs';
		case 'basic-needs':
			return 'loans for basic needs';
		case 'eco-friendly':
			return 'eco-friendly loans';
		default: return category;
	}
};

const ctaHref = computed(() => {
	const string = `Your goal: Support ${props.userGoal?.target} ${getGoalCategoryUrl(props.userGoal?.category)}`;
	const encodedString = encodeURIComponent(string);
	return `/lend/filter?header=${encodedString}`;
});

const achievementGoalImg = computed(() => {
	const contentfulCategory = getContentfulKey(props.userGoal?.category) || '';
	if (!contentfulCategory) return '';
	const key = `my-kiva-${contentfulCategory}-journey`;

	const richText = props.heroSlides.find(slide => slide?.fields?.key === key);
	let backgroundImage = null;
	if (richText) {
		const formattedRichText = formatRichTextContent(richText);

		backgroundImage = formattedRichText?.richText?.content.find(
			item => item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
		);
	}

	return backgroundImage?.data?.target?.fields?.file?.url || '';
});

const handleContinueClick = () => {
	$kvTrackEvent('portfolio', 'click', 'continue-towards-goal');
	router.push(ctaHref.value);
};

onMounted(() => {
	$kvTrackEvent('portfolio', 'view', 'goal-set', props.userGoal?.category, props.goalProgress);
});

</script>

<style lang="postcss" scoped>
.card-container {
	@apply tw-w-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;

	@screen md {
		width: 336px;
	}
}

.goal-card-bg::before {
	content: '';
	width: 400px;
	height: 500px;
	background: url('/src/assets/images/my-kiva/goal-card-bg.jpg') lightgray;
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
