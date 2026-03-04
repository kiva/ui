<template>
	<div class="tw-mb-4 tw-bg-primary tw-rounded tw-p-2 tw-drop-shadow-lg">
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
</template>

<script>
import { mdiDotsVertical } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import KvDropdown from '#src/components/Kv/KvDropdown';

export default {
	name: 'TeamCard',
	components: {
		KvDropdown,
		KvMaterialIcon,
	},
	props: {
		team: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mdiDotsVertical,
		};
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
