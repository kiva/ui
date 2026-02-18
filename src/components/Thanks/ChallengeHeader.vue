<template>
	<kv-page-container data-testid="challenge-header">
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-6 tw-mb-4 hide-for-print">
				<div
					class="
						tw-flex
						tw-flex-col
						tw-items-center
						tw-w-full
						tw-bg-white
						tw-rounded
						tw-px-1.5
						tw-pt-1.5
						tw-pb-2.5
					"
				>
					<div
						class="tw-flex tw-justify-between tw-w-full"
					>
						<p class="tw-text-left tw-font-medium" data-testid="loans-funded">
							{{ loansFunded }}/{{ totalLoans }} loans funded
						</p>
						<div class="tw-flex tw-items-center tw-justify-center tw-relative">
							<kv-progress-circle
								class="tw-w-10 tw-z-2 tw-h-10"
								:stroke-width="20"
								:value="percentageFunded"
								:arc-scale=".8"
								:rotate="36"
								:show-number="false"
							/>
							<div class="tw-absolute">
								<rewards-icon class="tw-h-7 tw-w-6" />
							</div>
						</div>
						<p class="tw-text-right tw-font-medium">
							{{ daysLeft }} remaining
						</p>
					</div>
					<div class="tw-mt-2 tw-mb-6">
						<h3>
							Challenge
							<a :href="teamChallengePath" data-testid="percentage-funded" class="tw-text-eco-green-3">
								{{ percentageFunded }}% complete
							</a>
						</h3>
					</div>
					<div class="tw-flex tw-flex-col tw-items-center">
						<h2 class="tw-text-center tw-mb-2">
							<!-- eslint-disable-next-line max-len -->
							<span>We’ll announce whether the team has won the challenge before the next challenge on the </span><span class="tw-text-brand">20th of March</span><span>. Until then, we’d love your feedback!</span>
						</h2>
						<kv-button
							href="/lp/challengefeedback"
							v-kv-track-event="['Thanks', 'click-teams-give-quick-feedback']"
						>
							Give quick feedback
						</kv-button>
					</div>
				</div>
			</div>
		</kv-grid>
	</kv-page-container>
</template>
<script>
import RewardsIcon from '#src/assets/icons/inline/rewards.svg';
import teamGoalInfo from '#src/plugins/team-goal-mixin';
import {
	KvButton, KvPageContainer, KvGrid, KvProgressCircle,
} from '@kiva/kv-components';

export default {
	name: 'ChallengeHeader',
	mixins: [teamGoalInfo],
	components: {
		KvProgressCircle,
		RewardsIcon,
		KvButton,
		KvPageContainer,
		KvGrid,
	},
	props: {
		teamPublicId: {
			type: String,
			default: '',
		},
	},
	computed: {
		teamChallengePath() {
			return this.teamPublicId ? `/team/challenge/${this.teamPublicId}` : '/teams';
		},
	},
};
</script>
