<template>
	<AsyncPortfolioSection
		@visible="fetchUserAchievementProgress"
		class="goal-entrypoint !tw-px-2 !tw-py-3 lg:!tw-px-3 lg:!tw-py-3"
	>
		<div
			class="goal-entrypoint__content tw-flex tw-flex-col tw-justify-center tw-gap-1 tw-z-base"
		>
			<KvLoadingPlaceholder
				v-if="loading"
				class="!tw-w-full !tw-h-2.5"
			/>
			<h3
				v-else
				v-html="title"
				class="goal-entrypoint__title tw-font-medium"
			></h3>
			<p
				class="goal-entrypoint__subtitle"
				v-html="subtitle"
			>
			</p>
			<KvButton
				variant="secondary"
				class="goal-button tw-z-base tw-mt-0.5"
				@click="goToGoalPage"
			>
				{{ goalCopy.BUTTON_SET_GOAL }}
			</KvButton>
		</div>
	</AsyncPortfolioSection>
</template>

<script setup>
import {
	onMounted, computed, inject, ref
} from 'vue';
import logReadQueryError from '#src/util/logReadQueryError';
import { KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import { useRoute, useRouter } from 'vue-router';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import useGoalData, { LAST_YEAR_KEY } from '#src/composables/useGoalData';
import goalCopy from '#src/util/goalCopy';
import {
	GOAL_SIGNUP_DATE_QUERY_PARAM,
	parseGoalSignupDateParam,
} from '#src/util/goalSignupCopyVariant';
import AsyncPortfolioSection from './AsyncPortfolioSection';

const { getCategoryLoansLastYear } = useGoalData();

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const womenLoansLastYear = ref(0);

const goalSignupDateOverride = computed(() => {
	const value = route.query?.[GOAL_SIGNUP_DATE_QUERY_PARAM];
	return parseGoalSignupDateParam(Array.isArray(value) ? value[0] : value);
});

const title = computed(() => (
	goalCopy.titleGoalSignupWomensLastYear(womenLoansLastYear.value, { date: goalSignupDateOverride.value })
));
const subtitle = computed(() => goalCopy.subtitleNoGoalYetEntrypoint(goalSignupDateOverride.value));

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
.goal-entrypoint {
	background-image: url('/src/assets/images/my-kiva/featured-goal-card/mobile-no-goal-state.png');
	background-position: bottom;
	background-repeat: no-repeat;
	background-size: cover;
	box-shadow: inset 0 0 0 4px #fff;
	min-height: 112px;
	overflow: hidden;
}

.goal-entrypoint__content {
	@apply tw-w-full;

	max-width: 14rem;
}

.goal-entrypoint__title {
	font-size: 1.125rem;
	line-height: 1.2;
}

.goal-entrypoint__subtitle {
	font-size: 0.8125rem;
	line-height: 1.25;
}

.goal-button {
	width: min(100%, 14rem);
}

@screen lg {
	.goal-entrypoint {
		background-image: url('/src/assets/images/my-kiva/featured-goal-card/no-goal-state.png');
		background-position: calc(100% + 160px) bottom;
		background-size: auto 100%;
	}

	.goal-entrypoint__content {
		max-width: 28rem;
	}
}
</style>
