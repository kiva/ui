<template>
	<div>
		<p>
			{{ badge.description }}
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
					'tw-cursor-pointer': !!badge.achievementData.tiers[index].completedDate,
				}"
				:style="{
					marginTop: `${isMobile || position == 0 ? 0 : (position === 1 ? 100 : 200)}px`
				}"
				v-kv-track-event="[
					'portfolio',
					'click',
					'Already earned badge modal',
					badge.challengeName,
					index + 1
				]"
				@click="event => handleBadgeClick(event, index)"
			>
				<div class="tw-relative tw-text-center">
					<component
						v-if="index > 0"
						:is="getLineComponent(positions[index - 1], position)"
						class="tw-absolute"
						:style="getLineStyle(positions[index - 1], position)"
					/>
					<BadgeContainer :status="getBadgeStatus(index)" :shape="getBadgeShape()" class="tw-z-1">
						<img
							:src="badge.contentfulData[index].imageUrl"
							alt="Badge"
							style="height: 133px; width: 133px;"
						>
					</BadgeContainer>
					<div
						v-if="showEarnBadge(index)"
						class="tw-absolute tw-rounded-full tw-min-w-3 tw-h-3 tw-font-medium tw-bg-gray-200
							tw-text-center tw-px-0.5 tw-z-2"
						:style="getNumberCircleStyles()"
					>
						{{ badge.achievementData.totalProgressToAchievement }}
					</div>
				</div>
				<div class="tw-text-center tw-bg-white tw-z-1 tw-relative">
					<div class="tw-font-medium">
						Level {{ index + 1 }}
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
						v-kv-track-event="[
							'portfolio',
							'click',
							'Earn a badge - within badge journey map modal',
							badge.challengeName,
							index + 1
						]"
					>
						Earn badge
					</KvButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { format } from 'date-fns';
import useIsMobile from '#src/composables/useIsMobile';
import useBadgeModal,
{
	MOBILE_BREAKPOINT,
	BADGE_COMPLETED,
	BADGE_IN_PROGRESS,
	BADGE_LOCKED
} from '#src/composables/useBadgeModal';
import KvButton from '@kiva/kv-components/vue/KvButton';
import BadgeContainer from './BadgeContainer';

const props = defineProps({
	badge: {
		type: Object,
		required: true,
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const {
	getTierPositions,
	getLineComponent,
	getLineStyle,
	getBadgeShape,
	getNumberCircleStyles,
} = useBadgeModal(props.badge);

const emit = defineEmits(['badge-level-clicked']);

const positions = ref(getTierPositions());

const tierCaption = index => {
	const tier = props.badge.achievementData.tiers[index];
	if (tier.completedDate) {
		return format(new Date(tier.completedDate), 'MMMM do, yyyy');
	}
	if (tier.target) {
		return `${props.badge.achievementData.totalProgressToAchievement} of ${tier.target} loans`;
	}
};

const showEarnBadge = index => {
	return (
		!props.badge.achievementData.tiers[index - 1] || !!props.badge.achievementData.tiers[index - 1]?.completedDate
	) && !props.badge.achievementData.tiers[index].completedDate;
};

const getBadgeStatus = index => {
	const tier = props.badge.achievementData.tiers[index] ?? {};
	if (tier.completedDate) {
		return BADGE_COMPLETED;
	}
	if (showEarnBadge(index)) {
		return BADGE_IN_PROGRESS;
	}
	return BADGE_LOCKED;
};

const handleBadgeClick = (event, index) => {
	// Prevent analytics being logged when non-completed tier is clicked
	if (!props.badge.achievementData.tiers[index]?.completedDate && getBadgeStatus(index) !== BADGE_LOCKED) {
		event.stopImmediatePropagation();
		emit('badge-level-clicked', props.badge.achievementData.tiers[index]);
	}
};
</script>

<style lang="postcss">
.badge-mobile:not(:last-of-type) {
	@apply tw-mb-1.5;
}
</style>
