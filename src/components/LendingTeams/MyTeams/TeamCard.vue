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

			<div class="tw-flex-1 tw-min-w-0 tw-overflow-hidden">
				<router-link
					:to="`/team/${team.teamPublicId}`"
					class="tw-font-medium tw-truncate tw-block"
					v-kv-track-event="['my-teams', 'click', 'team-name', team.teamPublicId]"
				>
					{{ team.name }}
				</router-link>
			</div>
			<!-- @todo Dropdown menu displays beneath team cards below it -->
			<kv-utility-menu
				class="tw-rounded-full"
				menu-position="right-aligned"
				button-radius-class="tw-rounded-full"
				analytics-category="my-teams"
			>
				<ul>
					<li>
						<a
							:href="`/team/${team.teamPublicId}/messages`"
							class="utility-menu-link tw-rounded-t"
							v-kv-track-event="['my-teams', 'click', 'team-action-messages', team.teamPublicId]"
						>
							<kv-material-icon :icon="mdiMessageOutline" />
							<span style="padding-top: 0.15rem;">Jump to message board</span>
						</a>
					</li>
					<li>
						<a
							:href="`/team/${team.teamPublicId}`"
							class="utility-menu-link"
							v-kv-track-event="['my-teams', 'click', 'team-action-overview', team.teamPublicId]"
						>
							<kv-material-icon :icon="mdiEyeOutline" />
							<span style="padding-top: 0.15rem;">Go to overview</span>
						</a>
					</li>
					<li>
						<a
							:href="`/teams/my-teams/update-preferred?preferredTeamId=${team.id}`"
							class="utility-menu-link"
							v-kv-track-event="['my-teams', 'click', 'team-action-preferred', team.teamPublicId]"
						>
							<kv-material-icon :icon="mdiStarOutline" />
							<span style="padding-top: 0.15rem;">Set as preferred team</span>
						</a>
					</li>
					<li>
						<a
							:href="`/teams/quit/process?team_id=${team.id}`"
							class="utility-menu-link tw-rounded-b"
							v-kv-track-event="['my-teams', 'click', 'team-action-quit', team.teamPublicId]"
						>
							<kv-material-icon :icon="mdiExitToApp" />
							<span style="padding-top: 0.15rem;">Quit team</span>
						</a>
					</li>
				</ul>
			</kv-utility-menu>
		</div>
	</div>
</template>

<script>
import { KvMaterialIcon, KvUtilityMenu } from '@kiva/kv-components';
import {
	mdiMessageOutline, mdiEyeOutline, mdiStarOutline, mdiExitToApp
} from '@mdi/js';

export default {
	name: 'TeamCard',
	components: {
		KvMaterialIcon,
		KvUtilityMenu,
	},
	props: {
		team: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mdiExitToApp,
			mdiEyeOutline,
			mdiMessageOutline,
			mdiStarOutline,
		};
	},
};
</script>

<style lang="postcss" scoped>
.utility-menu-link {
	@apply tw-flex tw-items-center tw-gap-1 tw-cursor-pointer;
	@apply tw-py-1 tw-px-1.5 hover:tw-bg-secondary tw-text-primary hover:tw-text-action-highlight tw-font-medium;
	@apply tw-no-underline active:tw-no-underline;
	@apply visited:tw-no-underline hover:tw-no-underline focus:tw-no-underline;
}
</style>
