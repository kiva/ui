<template>
	<div class="tw-group">
		<router-link
			:id="teamMenuId"
			to="/teams"
			data-testid="header-lending-teams"
			class="header__button tw-inline-flex"
			v-kv-track-event="['topnav','click', 'lending-teams']"
		>
			<span class="tw-flex">
				Lending Teams
				<kv-material-icon
					v-if="totalTeams"
					class="tw-w-3 tw-h-3 tw-transition-transform tw-duration-300 group-hover:tw-rotate-180"
					:icon="mdiChevronDown"
				/>
			</span>
		</router-link>
		<kv-dropdown
			v-if="totalTeams"
			:controller="teamMenuId"
			class="dropdown-list"
			data-testid="header-lending-teams-dropdown-list"
		>
			<ul v-if="totalTeams === 1">
				<li>
					<a
						v-kv-track-event="[
							'topnav',
							'click',
							'lending-teams',
							'my-team\'s-activity',
							`${teamsData[0].team.teamPublicId}`
						]"
						:href="`/team/${teamsData[0].team.teamPublicId}`"
					>
						My Team's activity
					</a>
				</li>
				<li>
					<a
						v-kv-track-event="[
							'topnav',
							'click',
							'lending-teams',
							'my-team\'s-impact',
							`${teamsData[0].team.teamPublicId}`
						]"
						:href="`/team/${teamsData[0].team.teamPublicId}/impact`"
					>
						My Team's impact
					</a>
				</li>
			</ul>
			<ul v-else style="width: 9rem;">
				<li v-for="{ team } in teamsData" :key="team.id">
					<a
						v-kv-track-event="['topnav', 'click', 'lending-teams', team.name]"
						:href="`/team/${team.teamPublicId}`"
						class="tw-whitespace-nowrap tw-text-ellipsis tw-overflow-hidden"
					>
						{{ team.name }}
					</a>
				</li>
				<li v-if="totalTeams > teamsData.length">
					<a
						v-kv-track-event="[
							'topnav',
							'click',
							'lending-teams',
							'view-all-my-teams'
						]"
						href="/teams/my-teams"
					>
						View all my teams
					</a>
				</li>
			</ul>
		</kv-dropdown>
	</div>
</template>

<script>
import KvDropdown from '@/components/Kv/KvDropdown';
import {
	mdiChevronDown,
} from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'TeamsMenu',
	components: {
		KvDropdown,
		KvMaterialIcon
	},
	data() {
		return {
			mdiChevronDown,
			teamMenuId: 'teams-header-dropdown',
		};
	},
	props: {
		teams: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		teamsData() {
			return this.teams?.values?.slice(0, 5) ?? [];
		},
		totalTeams() {
			return this.teams?.totalCount ?? 0;
		},
	},
};
</script>

<style lang="postcss" scoped>

.header__button {
	@apply tw-items-center tw-flex-shrink-0;
	@apply tw-font-medium tw-text-primary hover:tw-text-action-highlight hover:tw-no-underline focus:tw-no-underline;
	@apply tw-h-8 md:tw-h-9 tw-whitespace-nowrap tw-flex-shrink-0;
}

.dropdown-list {
	@apply tw-px-2 tw-rounded-b;
}

.dropdown-list a {
	@apply tw-font-medium tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1;
}

</style>
