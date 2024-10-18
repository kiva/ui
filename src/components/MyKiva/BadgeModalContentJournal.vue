<template>
	<div>
		<p>
			{{ description }}
		</p>
		<div
			class="tw-flex tw-overflow-auto"
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
					'tw-self-center': isMobile && position === 1,
					'tw-self-end': isMobile && position === 2
				}"
				:style="{
					height: isMobile ? '112px' : '138px',
					marginTop: `${isMobile || position == 0 ? 0 : (position === 1 ? 100 : 200)}px`,
				}"
			>
				<component
					v-if="isBadgeImageLoaded && index > 0"
					:is="getLineComponent(positions[index - 1], position)"
					class="tw-absolute"
					:style="getLineStyle(positions[index - 1], position)"
				/>
				<img
					:src="badgeImageUrl"
					alt="Badge"
					class="tw-h-full tw-z-1 tw-relative"
					@load="isBadgeImageLoaded = true"
				>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import useIsMobile from '#src/composables/useIsMobile';
import useBadgeModal, { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';

const props = defineProps({
	/**
	 * {
	 *   id: 'badge-id'.
	 *   tiers: [
	 *     {
	 *       target: 2,
	 *       learnMoreUrl: '',
	 *       completedDate: null,
	 *       tierStatement: ""
	 *     }
	 *   ]
	 * }
	 */
	badge: {
		type: Object,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	badgeImageUrl: {
		type: String,
		required: true,
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const { getTierPositions, getLineComponent, getLineStyle } = useBadgeModal(props.badge);
const isBadgeImageLoaded = ref(false);

const positions = ref(getTierPositions());
</script>

<style lang="postcss">
.badge-mobile:not(:last-of-type) {
	@apply tw-mb-7;
}
</style>
