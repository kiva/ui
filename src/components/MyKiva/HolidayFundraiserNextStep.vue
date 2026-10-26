<template>
	<div
		ref="cardElement"
		class="next-step-card tw-w-full tw-h-full tw-relative tw-rounded-lg tw-shadow-lg tw-overflow-hidden
			tw-shrink-0 tw-select-none"
		style="background-color: #c8e2e7;"
	>
		<img
			:src="snowLeft"
			alt=""
			aria-hidden="true"
			class="tw-absolute tw-pointer-events-none"
			style="left: -16px; top: 27px; width: 205px; transform: rotate(-30.16deg);"
		>
		<img
			:src="snowRight"
			alt=""
			aria-hidden="true"
			class="tw-absolute tw-pointer-events-none"
			style="right: -63px; top: 32px; width: 212px; transform: rotate(-120deg);"
		>
		<img
			:src="ribbonBottomLeft"
			alt=""
			aria-hidden="true"
			class="tw-absolute tw-pointer-events-none"
			style="left: -4px; bottom: -4px; width: 115px; transform: scaleY(-1);"
		>
		<img
			:src="ribbonTopRight"
			alt=""
			aria-hidden="true"
			class="tw-absolute tw-pointer-events-none"
			style="right: -8px; top: -4px; width: 115px; transform: scaleY(-1) rotate(180deg);"
		>
		<div
			class="snowfall tw-absolute tw-inset-0 tw-pointer-events-none"
			:class="{ 'snowfall--paused': !isInView }"
			aria-hidden="true"
			data-testid="holiday-snowfall"
		>
			<span
				v-for="(flake, index) in SNOWFLAKES"
				:key="index"
				class="snowflake tw-absolute tw-rounded-full tw-bg-white"
				:style="{
					left: `${flake.left}%`,
					width: `${flake.size}px`,
					height: `${flake.size}px`,
					animationDuration: `${flake.duration}s`,
					animationDelay: `${flake.delay}s`,
					'--sway': `${flake.sway}px`,
				}"
			></span>
		</div>
		<div class="tw-relative tw-z-1 tw-flex tw-flex-col tw-justify-between tw-gap-1.5 tw-h-full tw-p-2">
			<span
				class="tw-inline-flex tw-items-center tw-gap-0.5 tw-self-start tw-rounded-md tw-px-1.5 tw-py-1
					tw-bg-primary-inverse tw-text-primary-inverse tw-text-label"
			>
				<KvMaterialIcon
					:icon="mdiSnowflake"
					class="tw-w-2.5 tw-h-2.5"
				/>
				New Kiva Fundraisers
			</span>
			<div class="tw-flex tw-flex-col tw-gap-2 tw-text-center tw-text-primary">
				<h3 class="tw-text-headline-two">
					Give back this holiday season with Kiva fundraisers
				</h3>
				<p class="tw-text-base">
					Support the causes you care about with the people that mean the most to you.
				</p>
			</div>
			<KvButton
				v-kv-track-event="['portfolio', 'click', 'next-step-holiday-fundraiser']"
				variant="secondary"
				class="tw-w-full"
				:href="HOLIDAY_FUNDRAISER_URL"
			>
				Start a holiday fundraiser
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	onBeforeUnmount,
	inject,
} from 'vue';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiSnowflake } from '@mdi/js';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import { createIntersectionObserver } from '#src/util/observerUtils';
import snowLeft from '#src/assets/images/my-kiva/holiday-fundraiser/snow-left.svg?url';
import snowRight from '#src/assets/images/my-kiva/holiday-fundraiser/snow-right.svg?url';
import ribbonBottomLeft from '#src/assets/images/my-kiva/holiday-fundraiser/ribbon-bottom-left.svg?url';
import ribbonTopRight from '#src/assets/images/my-kiva/holiday-fundraiser/ribbon-top-right.svg?url';

defineOptions({ name: 'HolidayFundraiserNextStep' });

const HOLIDAY_FUNDRAISER_URL = '/gf/configure?occasion=holiday';

// Fixed rather than random so the server and client render the same flakes. Negative delays
// start each flake partway through its fall, so the card is never empty on load.
const SNOWFLAKES = [
	{
		left: 6, size: 5, duration: 11, delay: -2, sway: 8,
	},
	{
		left: 14, size: 3, duration: 14, delay: -9, sway: -6,
	},
	{
		left: 23, size: 6, duration: 12, delay: -5, sway: 10,
	},
	{
		left: 31, size: 4, duration: 15, delay: -12, sway: -8,
	},
	{
		left: 40, size: 5, duration: 10, delay: -1, sway: 6,
	},
	{
		left: 48, size: 3, duration: 13, delay: -7, sway: -10,
	},
	{
		left: 57, size: 6, duration: 11, delay: -4, sway: 8,
	},
	{
		left: 65, size: 4, duration: 14, delay: -11, sway: -6,
	},
	{
		left: 73, size: 5, duration: 12, delay: -3, sway: 10,
	},
	{
		left: 81, size: 3, duration: 15, delay: -8, sway: -8,
	},
	{
		left: 88, size: 6, duration: 10, delay: -6, sway: 6,
	},
	{
		left: 95, size: 4, duration: 13, delay: -10, sway: -10,
	},
];

const $kvTrackEvent = inject('$kvTrackEvent');
const cardElement = ref(null);
const isInView = ref(false);
let disconnectObserver = null;
let inViewObserver = null;

onMounted(() => {
	const { delayUntilVisible, disconnect } = useDelayUntilVisible();
	delayUntilVisible(() => {
		$kvTrackEvent('portfolio', 'view', 'next-step-holiday-fundraiser');
	}, [cardElement.value]);
	disconnectObserver = disconnect;

	inViewObserver = createIntersectionObserver({
		callback: entries => {
			isInView.value = entries.some(entry => entry.isIntersecting);
		},
		targets: [cardElement.value],
	});
	if (!inViewObserver) isInView.value = true;
});

onBeforeUnmount(() => {
	if (disconnectObserver) disconnectObserver();
	if (inViewObserver) inViewObserver.disconnect();
});
</script>

<style lang="postcss" scoped>
/* MyKivaCard's minimum, so this card fills its row rather than setting the row's height */
.next-step-card {
	min-height: 340px;
}

.snowflake {
	top: -8px;
	opacity: 0.8;
	animation-name: snowfall;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
}

.snowfall--paused .snowflake {
	animation-play-state: paused;
}

@keyframes snowfall {
	0% {
		transform: translate(0, 0);
	}

	50% {
		transform: translate(var(--sway), 220px);
	}

	100% {
		transform: translate(0, 440px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.snowfall {
		display: none;
	}
}
</style>
