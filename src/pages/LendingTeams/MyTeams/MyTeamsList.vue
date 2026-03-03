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

		<div
			v-for="team in teams"
			:key="team.id"
			class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg"
		>
			<div class="tw-flex tw-flex-row tw-items-center">
				<img
					:src="team.imageUrl"
					:alt="`${team.name} logo`"
					class="tw-w-6 tw-h-6 tw-mr-1 tw-rounded-xs tw-flex-none"
					width="48"
					height="48"
				>

				<div class="tw-flex-1 tw-min-w-0">
					<router-link
						:to="`/team/${team.teamPublicId}`"
						class="tw-font-medium tw-truncate tw-block"
						v-kv-track-event="['my-teams', 'click', 'team-name', team.teamPublicId]"
					>
						{{ team.name }}
					</router-link>
				</div>

				<button
					:id="`team-actions-${team.id}`"
					class="tw-flex-none tw-ml-1 tw-p-0.5 tw-rounded hover:tw-bg-tertiary"
					:aria-label="`Actions for ${team.name}`"
					aria-expanded="false"
				>
					<kv-material-icon
						class="tw-w-3 tw-h-3"
						:icon="mdiDotsVertical"
					/>
				</button>

				<kv-dropdown
					:controller="`team-actions-${team.id}`"
					class="dropdown-list"
				>
					<ul>
						<li>
							<a
								:href="`/team/${team.teamPublicId}/messages`"
								v-kv-track-event="['my-teams', 'click', 'team-action-messages', team.teamPublicId]"
							>
								Jump to message board
							</a>
						</li>
						<li>
							<a
								:href="`/team/${team.teamPublicId}`"
								v-kv-track-event="['my-teams', 'click', 'team-action-overview', team.teamPublicId]"
							>
								Go to overview
							</a>
						</li>
						<li>
							<a
								:href="`/teams/my-teams/update-preferred?preferredTeamId=${team.id}`"
								v-kv-track-event="['my-teams', 'click', 'team-action-preferred', team.teamPublicId]"
							>
								Set as preferred team
							</a>
						</li>
						<li>
							<a
								:href="`/teams/quit/process?team_id=${team.id}`"
								v-kv-track-event="['my-teams', 'click', 'team-action-quit', team.teamPublicId]"
							>
								Quit team
							</a>
						</li>
					</ul>
				</kv-dropdown>
			</div>
		</div>

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
import { mdiDotsVertical } from '@mdi/js';
import { KvButton, KvLoadingPlaceholder, KvMaterialIcon } from '@kiva/kv-components';
import KvDropdown from '#src/components/Kv/KvDropdown';
import myTeamsPageQuery from '#src/graphql/query/myTeamsPage.graphql';
import teamDefaultImage from '#src/assets/images/team_s135.png';

export default {
	name: 'MyTeamsList',
	components: {
		KvButton,
		KvDropdown,
		KvLoadingPlaceholder,
		KvMaterialIcon,
	},
	inject: ['apollo'],
	data() {
		return {
			teams: [],
			offset: 0,
			limit: 20,
			totalCount: 0,
			loading: true,
			mdiDotsVertical,
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

<style lang="postcss" scoped>
.dropdown-list {
	@apply tw-px-2 tw-rounded-b;
}

.dropdown-list a {
	@apply tw-font-medium tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1;
}
</style>
