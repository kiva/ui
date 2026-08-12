<template>
	<section
		ref="section"
		class="goal-in-review-collective-impact tw-w-full tw-bg-marigold-1 tw-px-2 tw-pt-5 tw-pb-9"
		data-testid="goal-in-review-collective-impact"
	>
		<div class="tw-mx-auto tw-max-w-3xl">
			<p class="tw-text-small tw-text-action tw-mb-1 kv-fade-up">
				Collective impact
			</p>

			<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-4 kv-fade-up">
				Goal Setters create something <span class="tw-text-marigold">bigger.</span>
			</h1>

			<ul
				class="tw-list-none tw-p-0 tw-m-0 md:tw-flex kv-fade-up"
				data-testid="goal-in-review-collective-impact-stats"
			>
				<li
					v-for="stat, idx in stats"
					:key="stat.label"
					class="tw-grid tw-grid-cols-2 tw-items-center tw-gap-2 tw-border-gray-200 tw-py-3 tw-px-3
						md:tw-flex md:tw-flex-1 md:tw-flex-col md:tw-justify-start md:tw-border-t-0 md:tw-px-4"
					:class="idx > 0 ? 'tw-border-t' : ''"
				>
					<div class="tw-text-left md:tw-text-center">
						<p class="tw-text-base tw-text-gray-500">
							{{ stat.label }}
						</p>
						<p class="tw-text-jumbo tw-tabular-nums" :class="stat.numberClass">
							{{ stat.format(displayValues[idx]) }}
						</p>
					</div>
					<div class="tw-text-left md:tw-text-center">
						<p
							v-for="line in stat.lines"
							:key="line.text"
							class="tw-text-base"
							:class="line.bold
								? 'tw-text-h3 tw-text-primary !tw-font-medium'
								: 'tw-text-gray-500'"
						>
							{{ line.text }}
						</p>
					</div>
				</li>
			</ul>

			<p
				class="tw-text-base tw-text-center tw-border-t md:tw-border-t-0 tw-border-gray-200
					tw-pt-3 md:tw-pt-1 kv-fade-up"
			>
				Kiva goal setters create extraordinary impact.
				<span class="tw-text-h3 tw-block !tw-font-medium">And you were part of it!</span>
			</p>
		</div>
	</section>
</template>

<script setup>
import {
	onBeforeUnmount,
	onMounted,
	ref,
} from 'vue';
import { createIntersectionObserver } from '#src/util/observerUtils';

const stats = [
	{
		label: 'Supporting',
		target: 400,
		format: n => `${n}K+`,
		numberClass: 'tw-text-brand',
		lines: [{ text: 'borrowers', bold: true }, { text: 'and counting' }],
	},
	{
		label: 'Reaching',
		target: 62,
		format: n => `${n}`,
		numberClass: 'tw-text-desert-rose',
		lines: [{ text: 'countries', bold: true }, { text: 'around the globe' }],
	},
	{
		label: 'with',
		target: 95,
		format: n => `${n}%`,
		numberClass: 'tw-text-marigold-3',
		lines: [{ text: 'supporting' }, { text: 'women', bold: true }],
	},
];

// Stat numbers tick from 0 up to their target over 2.2s with a cubic ease-out.
const COUNT_UP_DURATION = 2200;
const easeOutCubic = t => 1 - (1 - t) ** 3;

const section = ref(null);
const displayValues = ref(stats.map(stat => stat.target));

let observer = null;
let rafId = null;

const prefersReducedMotion = () => typeof window !== 'undefined'
	&& typeof window.matchMedia === 'function'
	&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const runCountUp = () => {
	if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
		return; // leave the final values in place
	}
	let startTime = null;
	const step = now => {
		if (startTime === null) {
			startTime = now;
		}
		const progress = Math.min((now - startTime) / COUNT_UP_DURATION, 1);
		const eased = easeOutCubic(progress);
		displayValues.value = stats.map(stat => Math.round(stat.target * eased));
		if (progress < 1) {
			rafId = requestAnimationFrame(step);
		}
	};
	displayValues.value = stats.map(() => 0);
	rafId = requestAnimationFrame(step);
};

onMounted(() => {
	// A focused observer that only starts the counter — the fade-up itself is
	// gated by the modal wrapper. Same scroll root + midpoint trigger the modal
	// uses, so the numbers begin counting as the slide fades in.
	observer = createIntersectionObserver({
		targets: [section.value].filter(Boolean),
		callback: entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					runCountUp();
					observer?.unobserve(entry.target);
				}
			});
		},
		options: {
			root: section.value?.closest('#kvLightboxBody'),
			rootMargin: '0px 0px -50% 0px',
			threshold: 0,
		},
	});
});

onBeforeUnmount(() => {
	observer?.disconnect();
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
	}
});
</script>

<style lang="postcss" scoped>
.goal-in-review-collective-impact {
	--kv-fade-up-distance: 40px;
}

.goal-in-review-collective-impact .kv-fade-up {
	animation-duration: 1.2s;
}
</style>
