<template>
	<section
		class="tw-w-full goal-in-review-borrowers tw-relative
			tw-bg-gradient-to-b tw-from-transparent tw-to-brand-100
			tw-px-2 md:tw-px-4 tw-pt-5 md:tw-pt-2 tw-pb-4 md:tw-pb-6"
		data-testid="goal-in-review-borrowers"
	>
		<p class="tw-text-action tw-text-caption tw-mb-1 kv-fade-up borrowers-eyebrow">
			The people behind your loans
		</p>

		<h1 class="tw-text-display tw-text-eco-green-4 tw-mb-3 kv-fade-up borrowers-headline">
			{{ borrowerCountDisplay }} {{ borrowersLabel }}.
			<span
				class="tw-block md:tw-inline tw-text-marigold md:tw-text-marigold-2"
			>{{ borrowerCountDisplay }} {{ futuresLabel }}.</span>
		</h1>

		<ul
			class="tw-grid tw-grid-cols-3 md:tw-grid-cols-6 tw-gap-0.5 md:tw-gap-x-1 md:tw-gap-y-3
				tw-list-none tw-p-0 tw-m-0"
			data-testid="goal-in-review-borrowers-borrowers"
		>
			<li
				v-for="(card, index) in cards"
				:key="card.id"
				class="tw-flex tw-flex-col tw-gap-1 kv-fade-up borrowers-card"
				:style="cardAnimationDelay(index)"
			>
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

				<p class="tw-truncate tw-text-primary tw-mb-0 tw-text-caption md:tw-text-base data-hj-suppress">
					{{ card.name }}
				</p>
			</li>

			<li
				v-if="moreCount > 0"
				class="kv-fade-up borrowers-card"
				:style="cardAnimationDelay(cards.length)"
				data-testid="goal-in-review-borrowers-more"
			>
				<div
					class="tw-w-full tw-aspect-square tw-rounded-sm tw-bg-gray-300 tw-bg-opacity-low
						md:tw-bg-eco-green-3 md:tw-bg-opacity-low tw-flex tw-items-center tw-justify-center"
				>
					<span
						class="tw-text-label tw-text-action md:tw-text-primary md:tw-text-button-link"
					>+{{ moreCountDisplay }} more</span>
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

// Staggered fade-up: the header lands first, then each card 175ms after the one
// before it.
const cardAnimationDelay = index => ({ animationDelay: `${0.2 + index * 0.175}s` });
</script>

<style lang="postcss" scoped>
/* brand-100 comes from the tw-to-brand-100 token class on the section. These
   gradient position variables keep the top 200px fully transparent so the
   previous screen's hill art shows through, then hard-stop into brand-100. */
.goal-in-review-borrowers {
	--tw-gradient-from-position: 200px;
	--tw-gradient-to-position: 200px;
}

/* Entrance timing. The shared .kv-fade-up effect lives in css/animations.css. */
.borrowers-eyebrow,
.borrowers-headline,
.borrowers-card {
	animation-duration: 0.75s;
}

.borrowers-eyebrow,
.borrowers-headline {
	/* Eyebrow + headline share one start so the header lands as a unit. */
	--kv-fade-up-distance: 24px;
}

.borrowers-card {
	--kv-fade-up-distance: 18px;
}
</style>
