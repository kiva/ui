<template>
	<section
		class="tw-w-full tw-bg-brand-100 tw-px-2 tw-py-4 md:tw-px-4 md:tw-py-7.5"
		data-testid="goal-in-review-slide-2"
	>
		<p class="tw-text-action tw-mb-1">
			The people behind the loans
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-3">
			{{ borrowerCountDisplay }} {{ borrowersLabel }}.
			<span class="tw-text-marigold">{{ borrowerCountDisplay }} {{ futuresLabel }}.</span>
		</h1>

		<ul
			class="borrower-grid tw-grid tw-gap-x-1 tw-gap-y-3 tw-list-none tw-p-0 tw-m-0"
			data-testid="goal-in-review-slide-2-borrowers"
		>
			<li v-for="card in cards" :key="card.id" class="tw-flex tw-flex-col tw-gap-0.5">
				<BorrowerImage
					v-if="card.imageHash"
					class="tw-w-full tw-rounded-sm"
					:alt="card.name"
					:aspect-ratio="1"
					:default-image="{ width: 152, faceZoom: 50 }"
					:hash="card.imageHash"
					:images="[
						{ width: 152, faceZoom: 50, viewSize: 734 },
						{ width: 116, faceZoom: 50 },
					]"
				/>
				<div v-else class="tw-w-full tw-aspect-square tw-rounded-sm tw-bg-eco-green-3 tw-bg-opacity-low"></div>

				<p class="tw-truncate tw-text-primary tw-mb-0 data-hj-suppress">
					{{ card.name }}
				</p>
			</li>

			<li v-if="moreCount > 0" data-testid="goal-in-review-slide-2-more">
				<div
					class="tw-w-full tw-aspect-square tw-rounded-sm tw-bg-eco-green-3 tw-bg-opacity-low
						tw-flex tw-items-center tw-justify-center"
				>
					<span class="tw-text-primary tw-font-medium">+{{ moreCountDisplay }} more</span>
				</div>
			</li>
		</ul>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import numeral from 'numeral';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import { getBorrowerCards } from '#src/util/goalInReview';

const props = defineProps({
	loans: {
		type: Array,
		default: () => [],
	},
	borrowerCount: {
		type: [Number, String],
		default: null,
	},
});

const grid = computed(() => getBorrowerCards(props.loans, props.borrowerCount));

const cards = computed(() => grid.value.cards);
const moreCount = computed(() => grid.value.moreCount);
const moreCountDisplay = computed(() => numeral(moreCount.value).format('0,0'));

const totalBorrowers = computed(() => Number(props.borrowerCount) || cards.value.length);

const borrowerCountDisplay = computed(() => numeral(totalBorrowers.value).format('0,0'));
const borrowersLabel = computed(() => (totalBorrowers.value === 1 ? 'borrower' : 'borrowers'));
const futuresLabel = computed(() => (totalBorrowers.value === 1 ? 'future' : 'futures'));
</script>

<style lang="postcss" scoped>
.borrower-grid {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

@screen md {
	.borrower-grid {
		grid-template-columns: repeat(6, minmax(0, 152px));
	}
}
</style>
