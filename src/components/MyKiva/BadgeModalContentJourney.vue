<template>
	<div>
		<p>
			{{ badgeWithVisibleTiers.description }}
		</p>
		<div
			class="tw-flex tw-overflow-x-auto tw-overflow-y-hidden"
			:class="{
				'tw-flex-col tw-py-2 tw-px-2': isMobile,
				'tw-flex-row tw-py-4 tw-px-0.5': !isMobile,
			}"
		>
			<div
				v-for="(position, index) in positions"
				:key="index"
				class="badge tw-shrink-0 tw-relative"
				:class="{
					'badge-mobile': isMobile,
					'tw-ml-3': !isMobile && index > 0,
					'tw-mr-6': !isMobile && index < positions.length - 1,
					'tw-mb-0 tw-self-auto': !isMobile,
					'tw-self-start': isMobile && position === 0,
					'tw-self-center': isMobile && position === 1,
					'tw-self-end': isMobile && position === 2,
				}"
				:style="{
					marginTop: `${isMobile || position == 0 ? 0 : (position === 1 ? 100 : 200)}px`,
					zIndex: positions.length - index,
					width: '133px',
				}"
			>
				<div class="tw-relative tw-text-center tw-bg-white tw-cursor-pointer" @click="handleBadgeClick(index)">
					<BadgeContainer :status="getBadgeStatus(index)" :shape="getBadgeShape(badgeWithVisibleTiers.id)">
						<component
							v-if="index > 0"
							:is="getLineComponent(positions[index - 1], position)"
							class="tw-absolute"
							:style="getLineStyle(positions[index - 1], position)"
						/>
						<img
							:src="badgeWithVisibleTiers.contentfulData[index].imageUrl"
							alt="Badge"
							style="height: 133px; width: 133px;"
						>
					</BadgeContainer>
					<div
						v-if="showEarnBadge(index)"
						class="tw-absolute tw-flex tw-items-center tw-justify-center tw-rounded-full tw-min-w-3
							tw-min-h-3 tw-font-medium tw-bg-gray-200 tw-text-center tw-z-2 tw-px-0.5
							tw-aspect-square tw-text-small"
						:style="getNumberCircleStyles()"
					>
						{{ badgeWithVisibleTiers.achievementData.totalProgressToAchievement }}
					</div>
				</div>
				<div class="tw-text-center tw-bg-white tw-z-1 tw-relative">
					<div class="tw-font-medium">
						{{ getTierName(index) }}
					</div>
					<div class="tw-text-small">
						{{ tierCaption(index) }}
					</div>
					<KvButton
						class="tw-mt-1 tw-whitespace-nowrap"
						:class="{
							'tw-invisible': index !== positions.length - 1 && !showEarnBadge(index),
							'tw-hidden': (!isMobile || index === positions.length - 1) && !showEarnBadge(index),
						}"
						@click="handleBadgeClick(index)"
					>
						Earn badge
					</KvButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { format } from 'date-fns';
import useIsMobile from '#src/composables/useIsMobile';
import useBadgeModal,
{
	MOBILE_BREAKPOINT,
	BADGE_COMPLETED,
	BADGE_IN_PROGRESS,
	BADGE_LOCKED,
	getBadgeShape,
} from '#src/composables/useBadgeModal';
import { KvButton } from '@kiva/kv-components';
import useBadgeData from '#src/composables/useBadgeData';
import BadgeContainer from './BadgeContainer';

const props = defineProps({
	badge: {
		type: Object,
		required: true,
	},
});

const { getBadgeWithVisibleTiers, getTierBadgeDataByLevel } = useBadgeData();

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const badgeWithVisibleTiers = computed(() => getBadgeWithVisibleTiers(props.badge));

const {
	getTierPositions,
	getLineComponent,
	getLineStyle,
	getNumberCircleStyles,
} = useBadgeModal(badgeWithVisibleTiers.value);

const emit = defineEmits(['badge-level-clicked']);

const positions = ref(getTierPositions());

const tierCaption = index => {
	const tier = badgeWithVisibleTiers.value.achievementData.tiers[index];
	if (tier.completedDate) {
		return format(new Date(tier.completedDate), 'MMMM do, yyyy');
	}
	if (tier.target) {
		return `${badgeWithVisibleTiers.value.achievementData.totalProgressToAchievement} of ${tier.target} loans`;
	}
};

const showEarnBadge = index => {
	return (
		!badgeWithVisibleTiers.value.achievementData.tiers[index - 1]
		|| !!badgeWithVisibleTiers.value.achievementData.tiers[index - 1]?.completedDate
	) && !badgeWithVisibleTiers.value.achievementData.tiers[index].completedDate;
};

const getBadgeStatus = index => {
	const tier = badgeWithVisibleTiers.value.achievementData.tiers[index] ?? {};
	if (tier.completedDate) {
		return BADGE_COMPLETED;
	}
	if (showEarnBadge(index)) {
		return BADGE_IN_PROGRESS;
	}
	return BADGE_LOCKED;
};

const getTierName = index => {
	const levelData = getTierBadgeDataByLevel(badgeWithVisibleTiers.value, index + 1);
	return levelData.tierName;
};

const handleBadgeClick = index => {
	if (getBadgeStatus(index) !== BADGE_LOCKED) {
		emit('badge-level-clicked', {
			challengeName: badgeWithVisibleTiers.value.challengeName,
			tier: badgeWithVisibleTiers.value.achievementData.tiers[index]
		});
	}
};
</script>

<style lang="postcss">
.badge-mobile:not(:last-of-type) {
	@apply tw-mb-1.5;
}
</style>
