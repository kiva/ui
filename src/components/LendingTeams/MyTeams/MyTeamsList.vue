<template>
	<div>
		<div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
			<h3 class="tw-text-h3">
				My Teams
				<template v-if="!loading">
					({{ totalCount }})
				</template>
			</h3>
			<router-link
				to="/teams"
				class="tw-text-base tw-text-link"
				v-kv-track-event="['my-teams', 'click', 'all-teams-link']"
			>
				All teams
			</router-link>
		</div>

		<template v-if="loading && teams.length === 0">
			<div
				v-for="n in 3"
				:key="n"
				class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg"
			>
				<div class="tw-flex tw-flex-row tw-items-center">
					<kv-loading-placeholder class="tw-flex-none tw-mr-1" :style="{height: '3rem', width: '3rem'}" />
					<div class="tw-flex-1 tw-min-w-0">
						<kv-loading-placeholder class="tw-mb-1" :style="{width: '70%', height: '1.25rem'}" />
					</div>
					<kv-loading-placeholder class="tw-flex-none tw-ml-1" :style="{width: '1.5rem', height: '1.5rem'}" />
				</div>
			</div>
		</template>

		<div
			v-if="!loading && teams.length === 0"
			class="tw-py-4"
		>
			<h3 class="tw-text-h3 tw-mb-2 tw-text-secondary">
				You haven't joined any teams yet.
			</h3>
			<p class="tw-text-secondary tw-mb-2">
				Joining a lending team gives you a chance to:
			</p>
			<ul class="tw-list-disc tw-ml-4 tw-mb-4 tw-text-secondary">
				<li>Connect with other lenders on team message boards</li>
				<li>Join forces to get loans funded faster</li>
				<li>Discover the impact a group of individuals can have when working together</li>
			</ul>
			<div class="tw-text-center">
				<kv-button
					variant="primary"
					to="/teams"
					v-kv-track-event="['my-teams', 'click', 'browse-teams']"
				>
					Browse Teams
				</kv-button>
			</div>
		</div>

		<team-card
			v-for="team in teams"
			:key="team.id"
			:team="team"
		/>

		<div
			v-if="teams.length < totalCount"
			class="tw-mb-3 tw-text-center"
		>
			<kv-button
				variant="secondary"
				@click="loadMore"
				:state="loading ? 'loading' : ''"
				v-kv-track-event="['my-teams', 'click', 'load-more-teams']"
			>
				More Teams
			</kv-button>
		</div>

		<div v-if="!loading && teams.length > 0" class="tw-mt-4">
			<h3 class="tw-text-h3 tw-mb-2">
				About Teams
			</h3>
			<p class="tw-text-base">
				Lending teams are self-organized groups where members connect and rally around shared lending
				goals.
				<router-link
					to="/teams"
					class="tw-text-link"
					v-kv-track-event="[
						'my-teams',
						'click',
						'learn-more-link'
					]"
				>
					Learn more
				</router-link>
			</p>
		</div>
	</div>
</template>

<script>
import { KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import TeamCard from '#src/components/LendingTeams/MyTeams/TeamCard';
import myTeamsPageQuery from '#src/graphql/query/myTeamsPage.graphql';
import teamDefaultImage from '#src/assets/images/team_s135.png';

export default {
	name: 'MyTeamsList',
	components: {
		KvButton,
		KvLoadingPlaceholder,
		TeamCard,
	},
	inject: ['apollo'],
	data() {
		return {
			teams: [],
			offset: 0,
			limit: 20,
			totalCount: 0,
			loading: true,
			teamDefaultImage,
		};
	},
	created() {
		this.fetchTeams();
	},
	methods: {
		fetchTeams() {
			this.loading = true;
			this.apollo.query({
				query: myTeamsPageQuery,
				variables: {
					offset: this.offset,
					limit: this.limit,
				},
			}).then(({ data }) => {
				const teamsData = data?.my?.teams;
				this.totalCount = teamsData?.totalCount ?? 0;
				const newTeams = (teamsData?.values ?? []).map(teamLender => ({
					id: teamLender.team.id,
					teamLenderId: teamLender.id,
					name: teamLender.team.name,
					teamPublicId: teamLender.team.teamPublicId,
					imageUrl: teamLender.team.image?.url ?? this.teamDefaultImage,
				}));
				this.teams = [...this.teams, ...newTeams];
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},
		loadMore() {
			this.offset += this.limit;
			this.fetchTeams();
		},
	},
};
</script>
