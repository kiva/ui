<template>
	<div
		ref="cardElement"
		class="next-step-card tw-w-full tw-h-full tw-relative tw-rounded-lg tw-shadow-lg tw-overflow-hidden
			tw-shrink-0 tw-select-none"
	>
		<div
			class="texture tw-absolute tw-inset-0 tw-pointer-events-none"
			:style="{ backgroundImage: `url(${texture})` }"
			aria-hidden="true"
		></div>
		<img
			:src="snowTop"
			alt=""
			aria-hidden="true"
			class="tw-absolute tw-pointer-events-none"
			style="left: 11px; top: 4px; width: 306px;"
		>
		<img
			:src="snowBottom"
			alt=""
			aria-hidden="true"
			class="tw-absolute tw-pointer-events-none"
			style="left: 13px; top: 279px; width: 306px; transform: scaleX(-1);"
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
		<div
			class="tw-relative tw-z-1 tw-flex tw-flex-col tw-items-center tw-justify-between tw-gap-1.5 tw-h-full
				tw-p-2"
		>
			<img
				:src="fundraiserIllustration"
				alt="Example holiday fundraiser page showing lives touched and amount raised"
				width="208"
				height="212"
			>
			<div class="tw-flex tw-flex-col tw-gap-1 tw-w-full">
				<div class="tw-flex tw-flex-col tw-gap-0.5 tw-text-center tw-text-marigold-4">
					<h3 class="tw-text-headline-two">
						Less stuff. More good.
					</h3>
					<p class="tw-text-base">
						Easily create and share fundraisers that support the kind of loans you love.
					</p>
				</div>
				<KvButton
					v-kv-track-event="['portfolio', 'click', 'next-step-holiday-fundraiser']"
					variant="secondary"
					class="tw-w-full"
					:href="HOLIDAY_FUNDRAISER_URL"
					target="_blank"
					rel="noopener"
				>
					Start a holiday fundraiser
				</KvButton>
			</div>
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
import { KvButton } from '@kiva/kv-components';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import { createIntersectionObserver } from '#src/util/observerUtils';
import fundraiserIllustration from '#src/assets/images/my-kiva/holiday-fundraiser/fundraiser-illustration.png';
import texture from '#src/assets/images/my-kiva/holiday-fundraiser/texture.jpg';
import snowTop from '#src/assets/images/my-kiva/holiday-fundraiser/snow-top.svg?url';
import snowBottom from '#src/assets/images/my-kiva/holiday-fundraiser/snow-bottom.svg?url';

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
	background: radial-gradient(173% 111% at 55% 98%, #f3ccc3 10%, #c7dbf0 35%, #b0d9d7 100%);
}

.texture {
	background-size: 118px;
	mix-blend-mode: soft-light;
	opacity: 0.3;
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
