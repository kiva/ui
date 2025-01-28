<template>
	<async-lender-section @visible="fetchUserAchievements">
		<section
			v-if="completedBadges.length > 0"
			class="tw-bg-gray-100"
		>
			<div
				class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8 tw-pt-4"
				style="max-width: 1200px;"
			>
				<h2 class="data-hj-suppress">
					{{ badgesTitle }}
				</h2>
				<!-- eslint-disable-next-line max-len -->
				<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center lg:tw-justify-start tw-gap-3 md:tw-gap-8 lg:tw-gap-3.5 tw-my-4">
					<BadgeCard
						v-for="badge in showedBadges"
						:key="badge.id"
						:badge="badge"
						@click="handleBadgeClicked"
					/>
				</div>
			</div>
		</section>
		<BadgeModal
			v-if="selectedBadgeData"
			:show="showBadgeModal"
			:badge="selectedBadgeData"
			:state="state"
			:tier="tier"
			:is-earned-section="true"
			@badge-modal-closed="handleBadgeModalClosed"
		/>
	</async-lender-section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { defaultBadges } from '#src/util/achievementUtils';
import useBadgeData from '#src/composables/useBadgeData';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import { STATE_EARNED } from '#src/composables/useBadgeModal';
import AsyncLenderSection from './AsyncLenderSection';
import BadgeCard from './BadgeCard';

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

const showBadgeModal = ref(false);
const selectedBadgeData = ref();
const state = ref(STATE_EARNED);
const tier = ref(null);

const sortedTieredBadges = computed(() => {
	const tieredBadges = [];
	defaultBadges.forEach(element => {
		const filteredBadges = completedBadges.value
			.filter(badge => badge.id === element)
			.sort((a, b) => b.level - a.level);

		if (filteredBadges.length > 0) {
			tieredBadges.push(filteredBadges[0]);
		}
	});
	return tieredBadges;
});

const sortedEventBadges = computed(() => {
	return completedBadges.value
		.filter(b => b.achievementData?.tiers?.length === 0)
		.sort((a, b) => new Date(a.earnedAtDate) - new Date(b.earnedAtDate));
});

const showedBadges = computed(() => {
	return [
		...sortedTieredBadges.value,
		...sortedEventBadges.value
	];
});

const badgesTitle = computed(() => (props.lenderInfo?.name ? `${props.lenderInfo.name}'s achievements` : 'Achievements')); // eslint-disable-line max-len

const fetchUserAchievements = async () => {
	await Promise.all([
		fetchAchievementData(apollo, props.publicId),
		fetchContentfulData(apollo),
	]);
};

const handleBadgeClicked = badge => {
	const selectedTier = badge.achievementData?.tiers?.find(tierEl => tierEl.level === badge.level) ?? null;
	tier.value = selectedTier;
	selectedBadgeData.value = badge;
	showBadgeModal.value = true;
};

const handleBadgeModalClosed = () => {
	selectedBadgeData.value = undefined;
	showBadgeModal.value = false;
};
</script>
