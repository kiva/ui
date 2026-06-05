<template>
	<AsyncPortfolioSection
		@visible="fetchUserAchievementProgress"
		class="tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-justify-between tw-gap-4 !tw-px-2 !tw-py-3
            lg:!tw-p-3"
	>
		<div
			class="tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-gap-3"
		>
			<img
				:src="HandsPlant"
				class="tw-w-10"
			>
			<div
				class="tw-flex tw-flex-col tw-gap-1"
			>
				<KvLoadingPlaceholder
					v-if="loading"
					class="!tw-w-full !tw-h-5"
				/>
				<h3
					v-else
					v-html="title"
					class="tw-text-title tw-text-center md:tw-text-left"
				></h3>
				<p
					class="tw-text-base !tw-font-medium tw-text-center lg:tw-text-left"
				>
					{{ goalCopy.TITLE_HOW_MANY_LOANS_GENERIC }}
				</p>
			</div>
		</div>
		<KvButton
			variant="secondary"
			class="goal-button tw-whitespace-nowrap tw-mt-2 md:tw-mt-0 tw-w-full lg:tw-w-auto"
			@click="goToGoalPage"
		>
			{{ goalCopy.BUTTON_SET_GOAL }}
		</KvButton>
	</AsyncPortfolioSection>
</template>

<script setup>
import {
	onMounted, computed, inject, ref
} from 'vue';
import logReadQueryError from '#src/util/logReadQueryError';
import { KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import { useRouter } from 'vue-router';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import useGoalData, { LAST_YEAR_KEY } from '#src/composables/useGoalData';
import goalCopy, { GOAL_SIGNUP_COPY_NO_GOAL_YET } from '#src/util/goalCopy';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import AsyncPortfolioSection from './AsyncPortfolioSection';

const { getCategoryLoansLastYear } = useGoalData();

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const loading = ref(true);
const router = useRouter();
const womenLoansLastYear = ref(0);

const title = computed(() => {
	if (goalCopy.getGoalSignupCopyVariant() === GOAL_SIGNUP_COPY_NO_GOAL_YET) {
		return goalCopy.CARD_NO_GOAL_YET_EXPERIMENT;
	}
	if (womenLoansLastYear.value === 1) {
		return goalCopy.titleLastYearSingleWoman(womenLoansLastYear.value);
	}
	if (womenLoansLastYear.value > 1) {
		return goalCopy.titleLastYearMultiplePeople(womenLoansLastYear.value, 'women');
	}
	return goalCopy.titleNoHistoryWomensDefault();
});

const goToGoalPage = () => {
	$kvTrackEvent('portfolio', 'click', 'set-goal-portfolio');
	router.push('/goal-setting');
};

const fetchUserAchievementProgress = async () => {
	try {
		const { data } = await apollo.query({
			query: userAchievementProgressQuery,
			variables: { year: LAST_YEAR_KEY },
			fetchPolicy: 'network-only',
		});
		const tieredAchievements = data.userAchievementProgress?.tieredLendingAchievements ?? [];
		womenLoansLastYear.value = getCategoryLoansLastYear(tieredAchievements);
		loading.value = false;
	} catch (error) {
		logReadQueryError(error, 'PortfolioGoalEntrypoint fetchUserAchievementProgress');
		loading.value = false;
	}
};

onMounted(() => {
	$kvTrackEvent('portfolio', 'view', 'set-a-goal-portfolio');
});
</script>

<style lang="postcss" scoped>
.goal-button :deep(span) {
	@apply tw-px-4 tw-py-0.5;
}
</style>
