<template>
	<transition name="kvfade">
		<div
			class="
				section-wrapper
				random-loan-cards
				tw-py-4
				tw-relative
				tw-border-t
				tw-border-tertiary
			"
		>
			<div v-if="randomLoans.length" class="section-container tw-mx-auto tw-my-0">
				<kv-carousel
					v-if="randomLoans.length > 0 && !loading"
					class="tw-w-full tw-overflow-visible md:tw-overflow-hidden"
					data-testid="random-loan-card-carousel"
					:embla-options="{
						loop: false,
					}"
					ref="randomLoansCarousel"
					:multiple-slides-visible="true"
					slides-to-scroll="visible"
					:slide-max-width="singleSlideWidth"
					@interact-carousel="onInteractCarousel"
				>
					<template v-for="(loan, index) in randomLoans" #[`slide${index}`]>
						<kv-classic-loan-card-container
							:key="`loan-card-${index}`"
							:loan-id="loan.id"
							:use-full-width="true"
							:show-tags="true"
							:enable-five-dollars-notes="enableFiveDollarsNotes"
							:enable-huge-amount="enableHugeAmount"
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
import KvClassicLoanCardContainer from '@/components/LoanCards/KvClassicLoanCardContainer';
import { runLoansQuery } from '@/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_CHECKOUT } from '@/util/flssUtils';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	name: 'EmptyBasketCarousel',
	components: {
		KvCarousel,
		KvClassicLoanCardContainer
	},
	props: {
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableHugeAmount: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			randomLoans: [],
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
				if (this.isLargeCard) {
					return '512px';
				}
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
			this.randomLoans = loans ?? [];
			this.$emit('updating-totals', false);
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
	beforeDestroy() {
		window.removeEventListener('resize', this.handleResize);
	}
};
</script>
