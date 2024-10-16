<template>
	<div>
		<p>
			{{ description }}
		</p>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-overflow-auto tw-py-2 md:tw-py-4">
			<div
				v-for="(position, index) in positions"
				:key="index"
				class="tw-shrink-0 md:tw-self-auto"
				:class="{
					'md:tw-ml-3': index > 0,
					'md:tw-mr-6': index < positions.length - 1,
					'tw-self-center md:tw-mt-7': position === 1,
					'tw-self-end md:tw-mt-14': position === 2
				}"
			>
				<img
					:src="badgeImageUrl"
					alt="Badge"
					:style="{ height: '140px' }"
				>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	defineProps,
	ref,
	// inject,
} from 'vue';
import useBadgeModal from '#src/composables/useBadgeModal';
// import BadgeContainer from './BadgeContainer.vue';

// const $kvTrackEvent = inject('$kvTrackEvent');
// const emit = defineEmits(['badge-modal-closed']);

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

const { getTierPositions } = useBadgeModal(props.badge);

const positions = ref(getTierPositions());
</script>
