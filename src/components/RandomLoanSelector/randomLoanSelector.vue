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
			style="min-height: 23rem;"
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
					:slide-max-width="carouselCardWidth"
					@interact-carousel="onInteractCarousel"
				>
					<template v-for="(loan, index) in randomLoans" #[`slide${index}`]>
						<minimal-loan-card
							:key="index"
							:class="`minimal-loancard-${index}`"
							:loan="loan"
							category-set-id="random-loans"
							:card-number="index"
							@refreshtotals="$emit('refreshtotals')"
							@updating-totals="$emit('updating-totals', $event)"
						/>
					</template>
				</kv-carousel>
			</div>
		</div>
	</transition>
</template>

<script>
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import emptyBasketData from '@/graphql/query/checkout/emptyBasketData.graphql';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	components: {
		KvCarousel,
		MinimalLoanCard,
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			carouselCardWidth: '240px',
			randomLoans: [],
			loading: false,
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	inject: ['apollo'],
	mounted() {
		// we're doing this all client side
		this.loadLoans();
	},
	methods: {
		loadLoans() {
			this.$emit('updating-totals', true);
			this.apollo.query({
				query: emptyBasketData,
			}).then(({ data }) => {
				this.randomLoans = data?.lend?.randomLoans?.values ?? [];
				this.$emit('updating-totals', false);
			});
		},
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
		},
	},
};
</script>
