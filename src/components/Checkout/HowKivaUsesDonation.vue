<template>
	<div ref="content" class="tw-prose tw-text-base">
		<p>
			At Kiva, 100% of every loan supports borrowers — we never take a fee.
		</p>
		<div class="tw-flex tw-flex-col tw-gap-2">
			<div class="item-container tw-not-prose">
				<img
					:src="imageRequire(`./support.svg`)" alt="donation support"
				>
				<!-- eslint-disable-next-line max-len -->
				<p>Ensure fair and responsible lending practices that deliver real impact for underserved individuals</p>
			</div>
			<div class="item-container tw-not-prose">
				<img
					:src="imageRequire(`./globe.svg`)" alt="global real impact icon"
				>
				<!-- eslint-disable-next-line max-len -->
				<p>Sustain the infrastructure needed to distribute $1M in loans each week to borrowers around the world</p>
			</div>
			<div class="item-container tw-not-prose">
				<img
					:src="imageRequire(`./puzzle.svg`)" alt="donation partners"
				>
				<!-- eslint-disable-next-line max-len -->
				<p>Partner with impact-first organizations operating directly in the communities Kiva serves</p>
			</div>
		</div>
	</div>
</template>
<script>
const imageRequire = require.context('@/assets/images/', true);

export default {
	name: 'HowKivaUsesDonation',
	data() {
		return {
			imageRequire
		};
	}
};
</script>

<style lang="postcss" scoped>
.item-container {
	@apply tw-flex tw-justify-start tw-items-center tw-gap-2;
}

.item-container img {
	@apply tw-w-7 lg:tw-w-8 tw-h-8 tw-inline-block;
}

</style>
