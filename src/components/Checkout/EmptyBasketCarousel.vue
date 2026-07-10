<template>
	<transition name="kvfade">
		<div
			v-if="suggestedLoans.length"
			class="
				section-wrapper
				suggested-loan-cards
				tw-py-4
				tw-relative
				tw-border-t
				tw-border-tertiary
			"
		>
			<div class="section-container tw-mx-auto tw-my-0">
				<kv-carousel
					v-if="suggestedLoans.length > 0 && !loading"
					class="tw-w-full tw-overflow-visible md:tw-overflow-hidden"
					data-testid="random-loan-card-carousel"
					:embla-options="{
						loop: false,
					}"
					ref="suggestedLoansCarousel"
					:multiple-slides-visible="true"
					slides-to-scroll="visible"
					:slide-max-width="singleSlideWidth"
					@interact-carousel="onInteractCarousel"
				>
					<template v-for="(loan, index) in suggestedLoans" #[`slide${index}`] :key="`loan-card-${index}`">
						<kv-classic-loan-card-container
							:loan-id="loan?.id"
							:use-full-width="true"
							:show-tags="true"
							:enable-five-dollars-notes="enableFiveDollarsNotes"
							:ai-pills="loan?.aiPills"
							@updating-totals="$emit('updating-totals', $event)"
							@add-to-basket="addToBasket(index)"
							class="tw-h-full"
						/>
					</template>
				</kv-carousel>
			</div>
		</div>
	</transition>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import { runLoansQuery } from '#src/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_CHECKOUT } from '#src/util/flssUtils';
import { withAiPills } from '#src/util/aiLoanPIillsUtils';
import { KvCarousel } from '@kiva/kv-components';

export default {
	name: 'EmptyBasketCarousel',
	components: {
		KvCarousel,
		KvClassicLoanCardContainer
	},
	emits: ['updating-totals', 'refreshtotals'],
	props: {
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			suggestedLoans: [],
			loading: false,
			windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
			handleResize: _throttle(this.isWindowWidth, 200)
		};
	},
	inject: ['apollo'],
	computed: {
		singleSlideWidth() {
			if (this.windowWidth <= 733) {
				return '100%';
			}
			if (this.windowWidth > 733 && this.windowWidth < 1024) {
				return '328px';
			}
			if (this.windowWidth >= 1024) {
				return '328px';
			}
			return '336px';
		},
	},
	methods: {
		async loadLoans() {
			this.$emit('updating-totals', true);
			const { loans } = await runLoansQuery(
				this.apollo,
				{ pageLimit: 15 },
				FLSS_ORIGIN_CHECKOUT
			);
			// Show loans and clear loading first; AI pills load after so they don't block the carousel.
			this.suggestedLoans = loans ?? [];
			this.$emit('updating-totals', false);

			this.suggestedLoans = await withAiPills(this.apollo, this.suggestedLoans);
		},
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
		},
		addToBasket(index) {
			this.$kvTrackEvent('basket', 'basket-loan-upsell', 'loan-type', index, index);
			this.$emit('refreshtotals');
		},
		isWindowWidth() {
			this.windowWidth = window.innerWidth;
		}
	},
	mounted() {
		window.addEventListener('resize', this.handleResize);
		// we're doing this all client side
		this.loadLoans();
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
};
</script>
