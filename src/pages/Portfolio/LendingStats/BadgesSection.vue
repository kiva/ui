<template>
	<section data-testid="lend-stat-badges" class="stats-section">
		<h2 class="tw-flex tw-gap-2 tw-mb-4">
			<span>My Badges</span>
			<span class="lent-count tw-text-base tw-bg-brand tw-text-white tw-py-0.5 tw-px-1 tw-self-center">
				{{ badgesObtained }}/{{ totalBadges }}
			</span>
		</h2>
		<div class="tw-flex">
			<template v-for="(achievement, index) in completedAchievements">
				<div v-if="achievement.achievementId === 'iwd-challenge'" :key="index" class="tw-flex tw-mr-3">
					<iwd-challenge-badge class="tw-h-10 tw-w-12 tw-flex-none tw-mx-auto" />
					<div class="tw-w-full">
						<span class="tw-font-medium">Women's Day Challenge</span>
						<p class="tw-text-secondary tw-text-small">
							March 2023
						</p>
					</div>
				</div>
				<div v-if="achievement.achievementId === 'climate-challenge'" :key="index" class="tw-flex">
					<eco-challenge-badge class="tw-h-10 tw-w-12 tw-flex-none tw-mx-auto" />
					<div class="tw-w-full">
						<span class="tw-font-medium">Eco-friendly October Challenge</span>
						<p class="tw-text-secondary tw-text-small">
							October 2022
						</p>
					</div>
				</div>
			</template>
		</div>
	</section>
</template>

<script>
import EcoChallengeBadge from '@/assets/icons/inline/achievements/eco-badge.svg';
import IwdChallengeBadge from '@/assets/icons/inline/achievements/iwd-badge.svg';

export default {
	name: 'BadgesSection',
	props: {
		completedAchievements: {
			type: Array,
			default: () => []
		},
		totalBadges: {
			type: Number,
			default: 0
		},
	},
	computed: {
		badgesObtained() {
			return this.completedAchievements.length ?? 0;
		}
	},
	components: {
		EcoChallengeBadge,
		IwdChallengeBadge,
	},
};
</script>
