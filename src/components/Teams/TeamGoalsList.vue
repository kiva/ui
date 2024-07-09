<template>
	<div class="tw-bg-secondary tw-py-3" v-if="activeGoals.length > 0">
		<kv-page-container>
			<kv-grid
				class="tw-grid-cols-12"
			>
				<div class="tw-col-span-12">
					<div class="tw-flex tw-mb-2">
						<div class="tw-flex-none tw-mr-1">
							<TwoHands class="tw-w-10 tw-h-10 tw-text-primary" />
						</div>
						<div>
							<h2>{{ activeGoals.length }} teams with active challenges!</h2>
							<p>
								Don’t see your team on this list? <a
									v-kv-track-event="[
										'teams',
										'click',
										'team waitlist'
									]"
									href="lp/team-challenge-waitlist"
								>Let us know if you’re interested!</a>
							</p>
						</div>
					</div>

					<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2">
						<team-goal
							v-for="goal in activeGoals"
							:key="goal.id"
							:goal="goal"
						/>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>

import TwoHands from '@/assets/icons/inline/two-hands-heart.svg';
import TeamGoal from '@/components/Teams/TeamGoal';
import teamsGoals from '@/graphql/query/teamsGoals.graphql';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'TeamGoalsList',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvPageContainer,
		KvGrid,
		TeamGoal,
		TwoHands,
	},
	data() {
		return {
			activeGoals: [],
		};
	},
	apollo: {
		query: teamsGoals,
		preFetch: true,
		result(result) {
			const teams = _groupBy(result?.data?.goals?.values ?? [], 'teamId');
			this.activeGoals = _map(teams, goals => {
				return _orderBy(goals, [g => new Date(g.startDate)], 'desc')[0];
			});
		}
	},
};
</script>
