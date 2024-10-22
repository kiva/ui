<template>
	<div>
		<p>
			{{ badge.fields.shareFact }}
		</p>
		<div
			class="tw-flex tw-overflow-x-auto tw-overflow-y-hidden"
			:class="{
				'tw-flex-col tw-py-2 tw-px-2': isMobile,
				'tw-flex-row tw-py-4 tw-px-0': !isMobile,
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
					'tw-cursor-pointer': !!sortedTiers?.[index]?.completedDate,
				}"
				:style="{
					width: '133px',
					marginTop: `${isMobile || position == 0 ? 0 : (position === 1 ? 100 : 200)}px`
				}"
				v-kv-track-event="[
					'portfolio',
					'click',
					'Already earned badge modal',
					badge.fields.challengeName,
					index + 1
				]"
				@click="event => handleBadgeClick(event, index)"
			>
				<div class="tw-relative">
					<component
						v-if="isBadgeImageLoaded && index > 0"
						:is="getLineComponent(positions[index - 1], position)"
						class="tw-absolute"
						:style="getLineStyle(positions[index - 1], position)"
					/>
					<img
						:src="badge.fields.badgeImage.fields.file.url"
						alt="Badge"
						class="tw-h-full tw-z-1 tw-relative"
						@load="isBadgeImageLoaded = true"
					>
				</div>
				<div v-if="isBadgeImageLoaded" class="tw-text-center tw-bg-white tw-z-1 tw-relative">
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
							badge.fields.challengeName,
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
import { defineProps, ref, computed } from 'vue';
import { format } from 'date-fns';
import useIsMobile from '#src/composables/useIsMobile';
import useBadgeModal, { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import KvButton from '@kiva/kv-components/vue/KvButton';

const props = defineProps({
	/**
	 * {
	 *   id: '',
	 *   fields: {
	 *     challengeName: '',
	 *     shareFact: '',
	 *     badgeImage: {
	 *       fields: {
	 *         file: {
	 *           url: '',
	 *         },
	 *       },
	 *     },
	 *   },
	 *   totalProgressToAchievement,
	 *   tiers: [
	 *     {
	 *       target: 2,
	 *       completedDate: null,
	 *     },
	 *   ],
	 * }
	 */
	badge: {
		type: Object,
		required: true,
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const { getTierPositions, getLineComponent, getLineStyle } = useBadgeModal(props.badge);
const isBadgeImageLoaded = ref(false);

const sortedTiers = computed(() => {
	const tiers = [...(props.badge.tiers ?? [])];
	tiers.sort((a, b) => a.target - b.target);
	return tiers;
});

const positions = ref(getTierPositions());

const tierCaption = index => {
	const tier = sortedTiers.value[index];
	if (tier.completedDate) {
		// Date is in format "2024-10-22T18:49:21Z[UTC]"
		return format(new Date(tier.completedDate.replace('[UTC]', '')), 'MMMM do, yyyy');
	}
	if (tier.target) {
		return `${props.badge.totalProgressToAchievement} of ${tier.target} loans`;
	}
};

const showEarnBadge = index => !!sortedTiers.value[index - 1]?.completedDate && !sortedTiers.value[index].completedDate;

const handleBadgeClick = (event, index) => {
	// Prevent analytics being logged when non-completed tier is clicked
	if (!sortedTiers.value[index]?.completedDate) {
		event.stopImmediatePropagation();
	}
};
</script>

<style lang="postcss">
.badge-mobile:not(:last-of-type) {
	@apply tw-mb-1.5;
}
</style>
