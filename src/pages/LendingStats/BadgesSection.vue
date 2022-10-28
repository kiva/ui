<template>
	<section data-testid="lend-stat-badges" class="stats-section">
		<h2 class="tw-flex tw-gap-2 tw-mb-4">
			<span>My Badges</span>
			<span class="lent-count tw-text-base tw-bg-brand tw-text-white tw-py-0.5 tw-px-1 tw-self-center">
				{{ badgesObtained }}/{{ totalBadges }}
			</span>
		</h2>
		<div class="tw-flex" v-if="achievementId === 'climate-challenge'">
			<eco-challenge-badge class="tw-h-10 tw-w-10 tw-mr-2 tw-flex-none tw-mx-auto" />
			<div class="tw-w-full">
				<span class="tw-font-medium">Eco-friendly October Challenge</span>
				<p class="tw-text-secondary tw-text-small">
					October 2022
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import EcoChallengeBadge from '@/assets/icons/inline/eco-challenge/badge.svg';

export default {
	name: 'BadgesSection',
	props: {
		badgesObtained: {
			type: Number,
			default: 0
		},
		totalBadges: {
			type: Number,
			default: 0
		},
		// TODO: refactor for multiple badges
		achievementId: {
			type: String,
			default: ''
		}
	},
	components: {
		EcoChallengeBadge,
	},
};
</script>
