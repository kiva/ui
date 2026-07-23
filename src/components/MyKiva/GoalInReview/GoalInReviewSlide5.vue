<template>
	<section
		class="tw-w-full tw-bg-marigold-1 tw-px-2 tw-pt-5 tw-pb-9"
		data-testid="goal-in-review-slide-5"
	>
		<div class="tw-mx-auto tw-max-w-3xl">
			<p class="tw-text-small tw-text-action tw-mb-1">
				Collective impact
			</p>

			<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-4">
				Goal Setters create something <span class="tw-text-marigold">bigger.</span>
			</h1>

			<ul
				class="tw-list-none tw-p-0 tw-m-0 md:tw-flex"
				data-testid="goal-in-review-slide-5-stats"
			>
				<li
					v-for="stat, idx in stats"
					:key="stat.value"
					class="tw-grid tw-grid-cols-2 tw-items-center tw-gap-2 tw-border-gray-200 tw-py-3 tw-px-3
						md:tw-flex md:tw-flex-1 md:tw-flex-col md:tw-justify-start md:tw-border-t-0 md:tw-px-4"
					:class="idx > 0 ? 'tw-border-t' : ''"
				>
					<div class="tw-text-left md:tw-text-center">
						<p class="tw-text-base tw-text-tertiary">
							{{ stat.label }}
						</p>
						<p class="tw-text-jumbo" :class="stat.numberClass">
							{{ stat.value }}
						</p>
					</div>
					<div class="tw-text-left md:tw-text-center">
						<p
							v-for="line in stat.lines"
							:key="line.text"
							class="tw-text-base"
							:class="line.bold ? 'tw-font-medium tw-text-primary' : 'tw-text-tertiary'"
						>
							{{ line.text }}
						</p>
					</div>
				</li>
			</ul>

			<p class="tw-text-base tw-text-center tw-border-t md:tw-border-t-0 tw-border-gray-200 tw-pt-3 md:tw-pt-1">
				Kiva goal setters create extraordinary impact.
				<span class="tw-block tw-font-medium">And you were part of it!</span>
			</p>
		</div>
	</section>
</template>

<script setup>
const stats = [
	{
		label: 'Supporting',
		value: '400K+',
		numberClass: 'tw-text-brand',
		lines: [{ text: 'borrowers', bold: true }, { text: 'and counting' }],
	},
	{
		label: 'Reaching',
		value: '62',
		numberClass: 'tw-text-desert-rose',
		lines: [{ text: 'countries', bold: true }, { text: 'around the globe' }],
	},
	{
		label: 'with',
		value: '95%',
		numberClass: 'tw-text-marigold-3',
		lines: [{ text: 'supporting' }, { text: 'women', bold: true }],
	},
];
</script>
