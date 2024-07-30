<template>
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
		<div
			v-else
			v-for="(challenge, index) in challengeDataContentful"
			:key="index"
			class="tw-flex tw-w-full tw-gap-1"
			:class="{'tw-items-center': !inPortfolio }"
		>
			<img :src="challenge.badgeSvg" class="tw-h-10 tw-flex-none tw-mx-auto">
			<div class="tw-w-full">
				<span class="tw-font-medium">{{ challenge.challengeName }}</span>
				<p class="tw-text-secondary tw-text-small">
					{{ challenge.dateTagline }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { formatMediaAssetArray } from '@/util/contentfulUtils';
import { gql } from '@apollo/client';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'BadgesList',
	inject: ['apollo'],
	components: {
		KvLoadingPlaceholder,
	},
	props: {
		completedAchievements: {
			type: Array,
			default: () => []
		},
		totalPossibleBadges: {
			type: Number,
			default: 0
		},
		isLoading: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			challengeDataContentful: [],
		};
	},
	computed: {
		/* Challenge keys for completed challenges */
		completedChallengeKeys() {
			return this.completedAchievements.map(achievement => achievement.achievementId).join(',');
		},
		inPortfolio() {
			return this.$route?.name?.includes('portfolio');
		},
	},
	watch: {
		// When this prop has loaded we can load the badges content from contentful
		totalPossibleBadges: {
			handler(next) {
				if (next !== 0) {
					this.loadBadgesContent();
				}
			},
			immediate: true
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
