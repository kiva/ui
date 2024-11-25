<template>
	<async-lender-section @visible="fetchUserAchievements">
		<section v-if="completedBadges.length > 0">
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
				:completed-achievements="completedBadges"
				:is-loading="isLoading"
			/>
		</section>
	</async-lender-section>
</template>

<script setup>
import BadgesList from '#src/pages/Portfolio/LendingStats/BadgesList';
import KvLoadingPlaceholder from '#kv-components/KvLoadingPlaceholder';
import { computed, ref, inject } from 'vue';
import useBadgeData from '#src/composables/useBadgeData';
import AsyncLenderSection from './AsyncLenderSection';

const props = defineProps({
	lenderInfo: {
		type: Object,
		default: () => ({})
	},
	publicId: {
		type: String,
		required: true,
	},
});

const apollo = inject('apollo');

const {
	fetchAchievementData,
	fetchContentfulData,
	completedBadges,
} = useBadgeData(apollo);
const isLoading = ref(true);
const badgesTitle = computed(() => (props.lenderInfo?.name ? `${props.lenderInfo.name}'s badges` : 'Badges'));

const fetchUserAchievements = async () => {
	await Promise.all([
		fetchAchievementData(apollo, props.publicId),
		fetchContentfulData(apollo),
	]);
	isLoading.value = false;
};
</script>
