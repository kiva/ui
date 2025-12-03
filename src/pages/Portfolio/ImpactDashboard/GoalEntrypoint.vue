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
					class="tw-text-center md:tw-text-left"
				></h3>
				<p
					class="tw-text-base !tw-font-medium tw-text-center lg:tw-text-left"
				>
					How many loans will you make this year?
				</p>
			</div>
		</div>
		<KvButton
			variant="secondary"
			class="goal-button tw-whitespace-nowrap tw-mt-2 md:tw-mt-0 tw-w-full lg:tw-w-auto"
			@click="goToGoalPage"
		>
			Set 2026 goal
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
import useBadgeData from '#src/composables/useBadgeData';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import useGoalData, { SAME_AS_LAST_YEAR_LIMIT } from '#src/composables/useGoalData';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import AsyncPortfolioSection from './AsyncPortfolioSection';

const { getAllCategoryLoanCounts } = useBadgeData();

const { getWomenLoansLastYear } = useGoalData({ });

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();
const loading = ref(true);
const categoriesLoanCount = ref({});
const womenLoansLastYear = ref(0);

const title = computed(() => {
	return womenLoansLastYear.value > SAME_AS_LAST_YEAR_LIMIT
	// eslint-disable-next-line max-len
		? `Last year, you helped <span class="tw-text-eco-green-3">${womenLoansLastYear.value} women</span> shape their futures!`
		: 'Lenders like you help <span class="tw-text-eco-green-3">3 women</span> a year!';
});

const goToGoalPage = () => {
	$kvTrackEvent('portfolio', 'click', 'set-goal-portfolio');
	router.push('/goal-setting');
};

const fetchUserAchievementProgress = async () => {
	try {
		const { data } = await apollo.query({
			query: userAchievementProgressQuery,
			variables: { loanIds: [] },
		});

		const tieredAchievements = data.userAchievementProgress?.tieredLendingAchievements ?? [];
		categoriesLoanCount.value = getAllCategoryLoanCounts(tieredAchievements);
		womenLoansLastYear.value = getWomenLoansLastYear(categoriesLoanCount.value);
		loading.value = false;
	} catch (error) {
		logReadQueryError(error, 'PortfolioGoalEntrypoint fetchUserAchievementProgress');
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
