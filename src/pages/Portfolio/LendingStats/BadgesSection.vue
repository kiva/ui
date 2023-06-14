<template>
	<section data-testid="lend-stat-badges" class="stats-section">
		<h2 class="tw-flex tw-gap-2 tw-mb-4">
			<span>My Badges</span>
			<span
				v-if="!isLoading"
				class="tw-text-base tw-bg-brand tw-text-white tw-py-0.5 tw-px-1 tw-self-center"
			>
				{{ badgesObtained }}/{{ totalPossibleBadges }}
			</span>
			<kv-loading-placeholder
				v-else
				class="tw-py-0.5 tw-px-1 tw-self-center"
				:style="{width: '3rem', height: '2rem'}"
			/>
		</h2>
		<!-- Loading Template -->
		<div class="tw-flex" v-if="isLoading">
			<kv-loading-placeholder
				class="tw-h-10 tw-w-12 tw-flex-none tw-mx-auto tw-mr-2"
				:style="{width: '6rem', height: '5rem'}"
			/>
			<div class="tw-w-full">
				<kv-loading-placeholder
					class="tw-mb-2"
					:style="{width: '6.5rem', height: '1.5rem'}"
				/>
				<kv-loading-placeholder
					:style="{width: '3.5rem', height: '1rem'}"
				/>
			</div>
		</div>
		<!-- Badges Template -->
		<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2" v-else>
			<p v-if="completedAchievements.length === 0">
				You haven't earned any badges yet.
			</p>
			<template v-for="(challenge, index) in challengeDataContentful" v-else>
				<div
					:key="index" class="tw-flex tw-w-full"
				>
					<img :src="challenge.badgeSvg" class="tw-h-10 tw-w-12 tw-flex-none tw-mx-auto">
					<div class="tw-w-full">
						<span class="tw-font-medium">{{ challenge.challengeName }}</span>
						<p class="tw-text-secondary tw-text-small">
							{{ challenge.dateTagline }}
						</p>
					</div>
				</div>
			</template>
		</div>
	</section>
</template>

<script>
import { gql } from '@apollo/client';
import { formatMediaAssetArray } from '@/util/contentfulUtils';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'BadgesSection',
	inject: ['apollo'],
	data() {
		return {
			challengeDataContentful: [],
		};
	},
	props: {
		completedAchievements: {
			type: Array,
			default: () => []
		},
		/* total number of possible badges */
		totalPossibleBadges: {
			type: Number,
			default: 0
		},
	},
	components: {
		KvLoadingPlaceholder,
	},
	computed: {
		badgesObtained() {
			return this.completedAchievements.length ?? 0;
		},
		isLoading() {
			return this.totalPossibleBadges === 0;
		},
		/* Challenge keys for completed challenges */
		completedChallengeKeys() {
			return this.completedAchievements.map(achievement => achievement.achievementId).join(',');
		},
	},
	watch: {
		// When this prop has loaded we can load the badges content from contentful
		totalPossibleBadges(next) {
			if (next !== 0) {
				this.loadBadgesContent();
			}
		}
	},
	methods: {
		loadBadgesContent() {
			if (this.completedChallengeKeys !== '') {
				const filterFields = `fields.key[in]=${this.completedChallengeKeys}`;
				this.apollo.query({
					query: gql`query contentfulDefinitions($customFields: String) {
					contentful {
						entries(contentType: "challenge", customFields: $customFields)
					}
				}`,
					variables: {
						customFields: filterFields
					},
				}).then(result => {
					const contentfulData = result.data?.contentful?.entries?.items ?? null;
					if (contentfulData) {
						this.challengeDataContentful = contentfulData.map(item => {
							return {
								...item.fields,
								badgeSvg: formatMediaAssetArray([item.fields.badgeImage])?.[0]?.file?.url,
							};
						});
					}
				});
			}
		}
	},
};
</script>
