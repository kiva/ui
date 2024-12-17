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
			v-for="badge in completedAchievements"
			:key="badge.id"
			class="tw-flex tw-w-full tw-gap-1"
			:class="{'tw-items-center': !inPortfolio }"
		>
			<img
				:src="getBadgeImgUrl(badge)"
				class="tw-h-10 tw-flex-none tw-mx-auto"
			>
			<div class="tw-w-full">
				<span class="tw-font-medium">
					{{ getBadgeTitle(badge) }}
				</span>
				<p class="tw-text-secondary tw-text-small">
					{{ getBadgeDate(badge) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvLoadingPlaceholder from '#kv-components/KvLoadingPlaceholder';
import { format } from 'date-fns';
import useBadgeData from '#src/composables/useBadgeData';

export default {
	name: 'BadgesList',
	inject: ['apollo'],
	components: {
		KvLoadingPlaceholder,
	},
	props: {
		completedAchievements: {
			type: Array,
			default: () => ([])
		},
		isLoading: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		inPortfolio() {
			return this.$route?.name?.includes('portfolio');
		},
	},
	methods: {
		getBadgeTitle(badge) {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const levelData = getTierBadgeDataByLevel(badge, badge.level);
			return levelData.tierName;
		},
		getBadgeImgUrl(badge) {
			if (badge.level === 0) {
				return badge?.contentfulData?.[0]?.imageUrl ?? '';
			}
			const badgeData = badge?.contentfulData?.find(data => data.level === badge.level);
			return badgeData?.imageUrl ?? '';
		},
		getBadgeDate(badge) {
			const earnedAtDate = badge.earnedAtDate ? Date.parse(badge.earnedAtDate) : new Date();
			return format(earnedAtDate, 'MMM yyyy');
		},
	},
};
</script>
