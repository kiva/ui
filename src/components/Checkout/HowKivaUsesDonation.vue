<template>
	<div ref="content" class="tw-prose tw-text-base">
		<p>
			<!-- eslint-disable-next-line max-len -->
			At Kiva, 100% of every loan supports borrowers — we never take a fee. As a nonprofit, our work is dependent on donations from supporters like you. Every single dollar donated helps Kiva:
		</p>
		<div class="tw-flex tw-flex-col tw-gap-2">
			<div class="item-container tw-not-prose">
				<img :src="supportUrl" alt="donation support">
				<!-- eslint-disable-next-line max-len -->
				<p>Ensure fair and responsible lending practices that deliver real impact for underserved individuals</p>
			</div>
			<div class="item-container tw-not-prose">
				<img :src="globeUrl" alt="global real impact icon">
				<!-- eslint-disable-next-line max-len -->
				<p>Sustain the infrastructure needed to distribute $1M in loans each week to borrowers around the world</p>
			</div>
			<div class="item-container tw-not-prose">
				<img :src="puzzleUrl" alt="donation partners">
				<!-- eslint-disable-next-line max-len -->
				<p>Partner with impact-first organizations operating directly in the communities Kiva serves</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import supportUrl from '#src/assets/images/support.svg?url';
import globeUrl from '#src/assets/images/globe.svg?url';
import puzzleUrl from '#src/assets/images/puzzle.svg?url';
</script>

<style lang="postcss" scoped>
.item-container {
	@apply tw-flex tw-justify-start tw-items-center tw-gap-2;
}

.item-container img {
	@apply tw-w-7 lg:tw-w-8 tw-h-8 tw-inline-block;
}
</style>
