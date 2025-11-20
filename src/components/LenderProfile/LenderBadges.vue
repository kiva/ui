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
				<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center lg:tw-justify-start tw-gap-6 md:tw-gap-8 tw-my-4">
					<BadgeCard
						v-for="badge in showedBadges"
						:key="badge.id"
						:badge="badge"
						@click="handleBadgeClicked"
					/>
				</div>
			</div>
		</section>
		<JourneySideSheet
			v-if="showSideSheet"
			class="badge-journey"
			:visible="showSideSheet"
			:selected-badge-data="selectedBadgeData"
			@sidesheet-closed="handleSideSheetClosed"
		/>
		<BadgeModal
			v-if="showBadgeModal"
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
import { formatPossessiveName } from '#src/util/stringParserUtils';
import { defaultBadges } from '#src/util/achievementUtils';
import useBadgeData from '#src/composables/useBadgeData';
import { STATE_EARNED } from '#src/composables/useBadgeModal';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import AsyncLenderSection from './AsyncLenderSection';
import BadgeCard from './BadgeCard';
import JourneySideSheet from '../Badges/JourneySideSheet';

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
const showSideSheet = ref(false);

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

const badgesTitle = computed(() => (
	props.lenderInfo?.name
		? `${formatPossessiveName(props.lenderInfo.name)} achievements`
		: 'Achievements'
));

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
	if (tier.value) {
		showSideSheet.value = true;
	} else {
		showBadgeModal.value = true;
	}
};

const handleBadgeModalClosed = () => {
	showBadgeModal.value = false;
	selectedBadgeData.value = undefined;
};

const handleSideSheetClosed = () => {
	showSideSheet.value = false;
	selectedBadgeData.value = undefined;
	tier.value = null;
};
</script>

<style lang="postcss" scoped>
:deep(.badge-journey div#journey-controls) {
	display: none;
}

:deep(.badge-journey div#journey-bottom-gradient) {
	bottom: 0 !important;
}
</style>
