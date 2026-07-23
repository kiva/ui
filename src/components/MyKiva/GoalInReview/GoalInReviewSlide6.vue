<template>
	<section
		class="tw-w-full tw-bg-eco-green-4 goal-in-review-slide-6"
		data-testid="goal-in-review-slide-6"
	>
		<img
			:src="slide6TopBorder"
			class="tw-block tw-w-full tw-bg-marigold-1"
		>

		<div class="tw-mx-auto tw-max-w-xl tw-px-2 tw-py-6">
			<p class="tw-text-small tw-text-brand-400 tw-mb-2">
				A personal note
			</p>

			<div class="tw-px-3 md:tw-px-0">
				<span class="tw-block tw-text-jumbo tw-text-secondary" aria-hidden="true">"</span>

				<div class="tw-flex tw-flex-col tw-gap-3 tw-text-eco-green-1">
					<p class="tw-text-base">
						You did it! Thank you for turning this goal into reality.
					</p>
					<p class="tw-text-base">
						<!-- eslint-disable max-len -->
						Because you followed through, Kiva can keep providing reliable support to people around the world
						— your commitment, along with the commitment of thousands of other goal-setters, is what makes our
						collective impact possible.
					</p>
					<p class="tw-text-base">
						On behalf of everyone at Kiva: thank you for showing up for others.
					</p>
				</div>

				<span class="tw-block tw-text-jumbo tw-text-secondary tw-text-right" aria-hidden="true">"</span>

				<div class="tw-flex tw-items-center tw-justify-between tw-mt-6">
					<div class="tw-flex tw-items-center tw-gap-2">
						<img
							:src="vishalAvatar"
							alt=""
							class="tw-w-6 tw-h-6 tw-rounded-full"
						>
						<div>
							<p class="tw-font-medium tw-text-white">
								Vishal G
							</p>
							<p class="tw-text-small tw-text-eco-green-2">
								CEO, Kiva
							</p>
						</div>
					</div>

					<p
						v-if="year"
						class="year-pill tw-inline-block tw-rounded-full
						tw-text-brand-400 tw-text-small tw-py-0.5 tw-px-1.5"
					>
						Kiva &middot; {{ year }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import slide6TopBorder from '#src/assets/images/my-kiva/goal-in-review/slide6-top-border.png';
import vishalAvatar from '#src/assets/images/my-kiva/goal-in-review/vishal-quote.png';

defineProps({
	year: {
		type: [Number, String],
		default: null,
	},
});
</script>

<style lang="postcss" scoped>
.goal-in-review-slide-6 {
	background-image: url('/src/assets/images/my-kiva/goal-in-review/slide6-paper.png');
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}

.year-pill {
	background-color: rgb(var(--bg-action), 30%);
}
</style>
