<template>
	<async-lender-section @visible="fetchUserAchievements">
		<section v-if="completedAchievements.length > 0">
			<h2
				v-if="!isLoading"
				class="data-hj-suppress"
			>
				{{ badgesTitle }}
			</h2>
			<kv-loading-placeholder
				v-else
				style="height: 30px; width: 250px;"
			/>
			<badges-list
				class="tw-my-4"
				:completed-achievements="completedAchievements"
				:total-possible-badges="totalPossibleBadges"
				:is-loading="isLoading"
			/>
		</section>
	</async-lender-section>
</template>

<script>
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';
import BadgesList from '#src/pages/Portfolio/LendingStats/BadgesList';
import KvLoadingPlaceholder from '#kv-components/KvLoadingPlaceholder';
import AsyncLenderSection from './AsyncLenderSection';

const userAchievementProgressQuery = gql`query userAchievementProgress( $publicId: String!) {
	userAchievementProgress(publicId: $publicId) {
		id
		lendingAchievements {
			id
			milestoneProgress {
				id
				milestoneStatus
			}
		}
	}
}`;

export default {
	name: 'LenderBadges',
	inject: ['apollo', 'cookieStore'],
	components: {
		BadgesList,
		KvLoadingPlaceholder,
		AsyncLenderSection,
	},
	props: {
		lenderInfo: {
			type: Object,
			default: () => ({})
		},
		publicId: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isLoading: true,
			allAchievements: [],
		};
	},
	computed: {
		lenderName() {
			return this.lenderInfo?.name ?? '';
		},
		badgesTitle() {
			return this.lenderInfo?.name
				? `${this.lenderInfo.name}'s badges`
				: 'Badges';
		},
		completedAchievements() {
			return this.allAchievements.filter(
				achievement => achievement.milestoneProgress?.[0]?.milestoneStatus === 'COMPLETE'
			);
		},
		totalPossibleBadges() {
			return this.allAchievements?.length ?? 0;
		},
	},
	methods: {
		async fetchUserAchievements() {
			try {
				const { data } = await this.apollo.query({
					query: userAchievementProgressQuery,
					variables: {
						publicId: this.publicId,
					},
				});

				this.allAchievements = data?.userAchievementProgress?.lendingAchievements ?? [];
				this.isLoading = false;
			} catch (e) {
				logReadQueryError(e, 'LenderBadges userAchievementsProgress');
			}
		},
	},
};
</script>
