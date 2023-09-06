<template>
	<www-page>
		<kv-page-container>
			<kv-grid
				class="tw-grid-cols-12"
			>
				<div
					class="tw-col-span-12"
				>
					<h1
						class="tw-text-h1 tw-mt-4 tw-mb-2"
					>
						Lending Teams
					</h1>
					<h2
						class="tw-text-h3 tw-mb-4"
					>
						Connect with Kiva's Lender Community
					</h2>
					<h3
						class="tw-text-base tw-mb-4"
					>
						Lending teams are self-organized groups built around common interests, school
						affiliation or location. Join as many teams as you'd like, and rally around
						shared lending goals by counting each of your loans at checkout toward the
						team's impact. To get started, simply join an existing team or create a new
						one and invite your friends!
					</h3>
					<div
						class="tw-flex tw-flex-wrap tw-mb-4 tw-gap-1"
					>
						<kv-button
							variant="primary"
							to="/teams/create"
							class="tw-w-full md:tw-w-fit"
							v-kv-track-event="[
								'teams',
								'click',
								'teams-menu',
								'start-team'
							]"
						>
							Start Team
						</kv-button>
						<kv-button
							variant="secondary"
							to="/teams/my-teams"
							class="tw-w-full md:tw-w-fit"
							v-kv-track-event="[
								'teams',
								'click',
								'teams-menu',
								'my-teams'
							]"
						>
							My Teams
						</kv-button>
						<kv-button
							variant="secondary"
							to="/teams/playbook"
							class="tw-w-full md:tw-w-fit"
							v-kv-track-event="[
								'teams',
								'click',
								'teams-menu',
								'team-playbook'
							]"
						>
							Team Playbook
						</kv-button>
						<kv-button
							variant="secondary"
							href="/kiva-community-guidelines"
							class="tw-w-full md:tw-w-fit"
							v-kv-track-event="[
								'teams',
								'click',
								'teams-menu',
								'community-guidelines'
							]"
						>
							Community Guidelines
						</kv-button>
					</div>
				</div>
				<div
					class="tw-col-span-12 md:tw-col-span-8"
				>
					<team-listing />
				</div>
				<team-leaderboards />
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import TeamListing from './TeamListing';
import TeamLeaderboards from './TeamLeaderboards';

export default {
	name: 'LendingTeams',
	components: {
		WwwPage,
		KvPageContainer,
		KvButton,
		KvGrid,
		TeamListing,
		TeamLeaderboards
	},
};
</script>
