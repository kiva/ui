<template>
	<WwwPage>
		<KvPageContainer>
			<GoalSettingContainer
				:total-loans="totalLoans"
				:categories-loan-count="categoriesLoanCount"
				:tiered-achievements="tieredAchievements"
			/>
		</KvPageContainer>
	</WwwPage>
</template>

<script>
import logReadQueryError from '#src/util/logReadQueryError';
import useBadgeData from '#src/composables/useBadgeData';
import useGoalDataQuery from '#src/graphql/query/useGoalData.graphql';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import { KvPageContainer } from '@kiva/kv-components';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import GoalSettingContainer from '#src/components/GoalSetting/GoalSettingContainer';
import { LAST_YEAR_KEY } from '#src/composables/useGoalData';

export default {
	name: 'GoalSetting',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
		GoalSettingContainer,
	},
	data() {
		return {
			totalLoans: 0,
			categoriesLoanCount: {},
			tieredAchievements: [],
		};
	},
	apollo: {
		preFetch(_, client) {
			return Promise.all([
				client.query({ query: useGoalDataQuery }),
				client.query({
					query: userAchievementProgressQuery,
					variables: { loanIds: [], year: LAST_YEAR_KEY }
				}),
			]).catch(error => {
				logReadQueryError(error, 'GoalSettingPage Prefetch');
			});
		},
	},
	setup() {
		const { getAllCategoryLoanCounts } = useBadgeData();

		return {
			getAllCategoryLoanCounts,
		};
	},
	created() {
		const goalDataResult = this.apollo.readQuery({ query: useGoalDataQuery });
		const achievementsProgressResult = this.apollo.readQuery({
			query: userAchievementProgressQuery,
			variables: { loanIds: [], year: LAST_YEAR_KEY },
		});

		this.totalLoans = goalDataResult.my?.loans.totalCount ?? 0;
		this.tieredAchievements = achievementsProgressResult.userAchievementProgress?.tieredLendingAchievements ?? [];
		this.categoriesLoanCount = this.getAllCategoryLoanCounts(this.tieredAchievements);
	},
};
</script>
