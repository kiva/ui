<template>
	<KvLightbox
		:class="{'badge-modal': !isJourneyActive}"
		:visible="show"
		:title="title"
		@lightbox-closed="closeLightbox"
	>
		<template v-if="!isJourneyActive" #header>
			<div class="tw-flex tw-gap-0.5 tw-items-center tw-cursor-pointer" @click="backToJourney">
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5"
					:icon="mdiArrowLeft"
				/>
				<p class="tw-font-medium">
					Back
				</p>
			</div>
		</template>
		<component
			:is="contentComponent"
			:key="badge.id"
			:badge="badge"
			:lender="lender"
			:tier="tier"
			:is-earned-section="isEarnedSection"
			@badge-level-clicked="handleBadgeLevelClicked"
		/>
	</KvLightbox>
</template>

<script setup>
import KvLightbox from '@kiva/kv-components/vue/KvLightbox';
import { defineProps, defineAsyncComponent, computed } from 'vue';
import { STATE_JOURNEY, STATE_EARNED, STATE_IN_PROGRESS } from '#src/composables/useBadgeModal';
import { mdiArrowLeft } from '@mdi/js';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';

const BadgeModalContentJourney = defineAsyncComponent(() => import('#src/components/MyKiva/BadgeModalContentJourney'));
const BadgeInProgress = defineAsyncComponent(() => import('#src/components/MyKiva/BadgeInProgress'));
const BadgeCompleted = defineAsyncComponent(() => import('#src/components/MyKiva/BadgeCompleted'));

const emit = defineEmits(['badge-modal-closed', 'badge-level-clicked', 'back-to-journey']);

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
	}
});

const closeLightbox = () => {
	emit('badge-modal-closed', props.isEarnedSection);
};

const handleBadgeLevelClicked = e => {
	emit('badge-level-clicked', e);
};

const backToJourney = () => {
	emit('back-to-journey');
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
		case STATE_IN_PROGRESS: return BadgeInProgress;
		case STATE_JOURNEY: default: return BadgeModalContentJourney;
	}
});
</script>

<style lang="postcss" scoped>
.badge-modal >>> [data-test*=lightbox] > div.tw-flex {
	@apply md:!tw-pt-2.5 md:tw-pb-2.5 tw-pb-0;
}

.badge-modal >>> [data-test*=lightbox] > div.tw-flex > button {
	@apply !tw-h-auto;
}
</style>
