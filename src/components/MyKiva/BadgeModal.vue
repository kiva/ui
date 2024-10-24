<template>
	<KvLightbox :visible="show" :title="badge.fields.challengeName" @lightbox-closed="closeLightbox">
		<component :is="contentComponent" :key="badge.id" :badge="badge" />
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

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['badge-modal-closed']);

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	state: {
		type: String,
		default: STATE_JOURNEY,
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

const contentComponent = computed(() => {
	switch (props.state) {
		// TODO: update with upcoming modal content components
		case STATE_EARNED: return BadgeModalContentJourney;
		case STATE_IN_PROGRESS: return BadgeModalContentJourney;
		case STATE_JOURNEY: default: return BadgeModalContentJourney;
	}
});
</script>
