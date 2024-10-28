<template>
	<KvLightbox :visible="show" :title="badge.fields.challengeName" @lightbox-closed="closeLightbox">
		<component
			:is="contentComponent"
			:key="badge.id"
			:badge="badge"
			@badge-level-clicked="handleBadgeLevelClicked"
		/>
	</KvLightbox>
</template>

<script setup>
import KvLightbox from '@kiva/kv-components/vue/KvLightbox';
import {
	defineProps,
	inject,
	defineAsyncComponent,
	computed,
} from 'vue';
import { STATE_JOURNEY, STATE_EARNED, STATE_IN_PROGRESS } from '#src/composables/useBadgeModal';

const BadgeModalContentJourney = defineAsyncComponent(() => import('#src/components/MyKiva/BadgeModalContentJourney'));
const BadgeInProgress = defineAsyncComponent(() => import('#src/components/MyKiva/BadgeInProgress'));
const BadgeCompleted = defineAsyncComponent(() => import('#src/components/MyKiva/BadgeCompleted'));

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['badge-modal-closed', 'badge-level-clicked']);

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	state: {
		type: String,
		default: STATE_JOURNEY,
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
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
	 *   tiers: [
	 *     {
	 *       target: 2,
	 *       learnMoreUrl: '',
	 *       completedDate: null,
	 *       tierStatement: ""
	 *     },
	 *   ],
	 * }
	 */
	badge: {
		type: Object,
		required: true,
	},
});

const closeLightbox = () => {
	emit('badge-modal-closed');
	$kvTrackEvent('portfolio', 'click', 'badge-modal-closed');
};

const handleBadgeLevelClicked = e => {
	emit('badge-level-clicked', e);
};

const contentComponent = computed(() => {
	switch (props.state) {
		case STATE_EARNED: return BadgeCompleted;
		case STATE_IN_PROGRESS: return BadgeInProgress;
		case STATE_JOURNEY: default: return BadgeModalContentJourney;
	}
});
</script>
