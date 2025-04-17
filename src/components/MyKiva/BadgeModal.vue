<template>
	<KvLightbox
		:visible="show"
		:title="title"
		@lightbox-closed="closeLightbox"
	>
		<component
			:is="contentComponent"
			:key="badge.id"
			:badge="badge"
			:lender="lender"
			:tier="tier"
			:is-earned-section="isEarnedSection"
			:loans="loans"
			@badge-level-clicked="handleBadgeLevelClicked"
		/>
	</KvLightbox>
</template>

<script setup>
import { KvLightbox, KvLoadingPlaceholder } from '@kiva/kv-components';
import {
	defineProps,
	defineAsyncComponent,
	computed,
	defineComponent,
	h,
} from 'vue';
import { STATE_JOURNEY, STATE_EARNED } from '#src/composables/useBadgeModal';

const ModalLoader = defineComponent(() => {
	return () => {
		return h(KvLoadingPlaceholder, { style: 'height: 200px; width: 100%; min-width: 300px' });
	};
});

const BadgeModalContentJourney = defineAsyncComponent({
	loader: () => import('#src/components/MyKiva/BadgeModalContentJourney'),
	loadingComponent: ModalLoader,
	delay: 100,
});
const BadgeCompleted = defineAsyncComponent({
	loader: () => import('#src/components/MyKiva/BadgeCompleted'),
	loadingComponent: ModalLoader,
	delay: 100,
});

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
	badge: {
		type: Object,
		required: true,
	},
	tier: {
		type: Object,
		default: () => ({}),
	},
	isEarnedSection: {
		type: Boolean,
		default: () => false,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
});

const closeLightbox = () => {
	emit('badge-modal-closed', props.isEarnedSection);
};

const handleBadgeLevelClicked = e => {
	emit('badge-level-clicked', e);
};

const isJourneyActive = computed(() => {
	return props.state === STATE_JOURNEY;
});

const title = computed(() => {
	if (isJourneyActive.value) {
		return props.badge?.challengeName ?? '';
	}
	return '';
});

const contentComponent = computed(() => {
	switch (props.state) {
		case STATE_EARNED: return BadgeCompleted;
		case STATE_JOURNEY: default: return BadgeModalContentJourney;
	}
});
</script>
