<template>
	<KvSideSheet
		:visible="visible"
		:show-back-button="false"
		:show-headline-border="false"
		:headline="computedHeadLine"
		:show-go-to-link="false"
		:kv-track-function="$kvTrackEvent"
		:animation-source-element="triggerButton"
		@side-sheet-closed="handleComponentClosed"
		:width-dimensions="{ default: '100%', lg: '480px', md: '460px', sm:'100%' }"
	>
		<template #default>
			<BadgeModalContentJourney
				:key="selectedBadgeData.id"
				:badge="selectedBadgeData"
				:loans="loans"
				@badge-level-clicked="handleBadgeJourneyLevelClicked"
				@toggle-gradient="($event) => hideBotomGradient = $event"
			/>
			<div
				id="journey-bottom-gradient"
				class="
					tw-w-full tw-bg-red tw-absolute
					tw-left-0 tw-bg-white tw-opacity-50
					tw-pointer-events-none tw-z-sticky
					tw-transition-opacity tw-duration-500
					tw-ease-in-out
				"
				:class="{
					'tw-opacity-0': hideBotomGradient,
					'tw-opacity-full': !hideBotomGradient,
				}"
				style="
					background: linear-gradient(to top, rgb(255 255 255), rgb(255 255 255 / 0%));
					bottom: 81px;
					height: 124px;
				"
			>
			</div>
		</template>
		<template #controls>
			<div
				id="journey-controls"
				class="tw-bg-white tw-border-t tw-w-full tw-border-tertiary"
			>
				<div class="tw-flex tw-justify-end tw-bg-white">
					<kv-button
						class="tw-mb-2 tw-pt-2 tw-px-4 tw-w-full md:tw-w-auto"
						@click="handleContinueJourneyClicked"
					>
						{{ journeyCtaBtn }}
					</kv-button>
				</div>
			</div>
		</template>
	</KvSideSheet>
</template>

<script setup>
import BadgeModalContentJourney from '#src/components/MyKiva/BadgeModalContentJourney';
import {
	ref,
	computed,
	inject,
} from 'vue';

import { KvButton, KvSideSheet } from '@kiva/kv-components';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	selectedBadgeData: {
		type: Object,
		default: () => ({}),
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	allBadgesCompleted: {
		type: Boolean,
		default: false,
	},
	isSelectedJourneyComplete: {
		type: Boolean,
		default: false,
	},
});

const triggerButton = ref(null);
const hideBotomGradient = ref(false);

const emit = defineEmits(['badge-journey-level-clicked', 'continue-journey-clicked', 'sidesheet-closed']);

const computedHeadLine = computed(() => `Your achievements for lending to ${props.selectedBadgeData?.challengeName}`);

const handleComponentClosed = () => {
	hideBotomGradient.value = false;
	emit('sidesheet-closed');
};

const handleContinueJourneyClicked = () => {
	emit('continue-journey-clicked');
};

const handleBadgeJourneyLevelClicked = payload => {
	emit('badge-journey-level-clicked', payload);
};

const journeyCtaBtn = computed(() => {
	if (props.allBadgesCompleted) {
		return 'See all of your impact stats';
	}
	if (props.isSelectedJourneyComplete) {
		return 'See all journeys';
	}
	return 'Continue this journey';
});

</script>
