<template>
	<div class="basket-add-interstitial row small-collapse">
		<kv-lightbox
			:visible="showInterstitial"
			:no-padding-top="true"
			:no-padding-sides="true"
			:no-padding-bottom="true"
			@lightbox-closed="closeLightbox"
		>
			<h1 class="lightbox-title" slot="title">
				Thank you for making an impact
			</h1>
			<div class="lightbox-loan-wrapper">
				<div class="loan-preview columns small-12 large-8 large-offset-4" v-if="loan.loan">
					<div class="row">
						<div class="loan-image-wrapper columns small-4">
							<div class="loan-image">
								<img :src="loan.loan.image.default" :title="loan.loan.name">
							</div>
						</div>
						<div class="loan-title columns small-8">
							<h3><span>${{ loan.price | numeral('0,0') }}</span> to {{ loan.loan.name }}</h3>
							<loan-reservation
								:activate-timer="activateTimer"
								class="popup-reservation-text"
								:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
								:is-funded="loan.isFunded"
								:expiry-time="loan.expiryTime"
							/>
						</div>
					</div>
					<div class="basket-summary row small-collapse">
						<span class="text-loans-in-basket columns small-6">
							{{ loanCount }} <span v-if="loanCount > 1">loans</span><span v-else>loan</span> in basket
						</span>
						<span class="text-subtotals columns small-6">Subtotal ${{ loanTotals | numeral('0,0') }}</span>
					</div>
					<div class="button-actions row">
						<div class="columns small-12 medium-6">
							<kv-button
								class="button-keep-exploring secondary smaller"
								v-kv-track-event="[
									'Lending',
									'Add-to-basket Interstitial',
									'keep-exploring-button-click']"
								@click.native.prevent="closeLightbox"
							>
								Find more loans
							</kv-button>
						</div>
						<div class="columns small-12 medium-6">
							<kv-button
								class="button-checkout smaller"
								to="/basket"
								v-kv-track-event="[
									'Lending',
									'Add-to-basket Interstitial',
									'checkout-button-click']"
								@click.native="closeLightbox"
							>
								Checkout
							</kv-button>
						</div>
					</div>
				</div>

				<div v-show="loading" class="loading-overlay" id="loading-preview-overlay">
					<div class="spinner-wrapper">
						<kv-loading-spinner />
					</div>
				</div>
			</div>
			<div class="lightbox-lyml-wrapper" v-if="loan.loan">
				<div class="additional-loans">
					<h2>Support more loans like {{ loan.loan.name }}</h2>
					<l-y-m-l
						v-if="loans && loan.id"
						:basketed-loans="loans"
						:target-loan="loan"
						@add-to-basket="handleAddToBasket"
						@processing-add-to-basket="processingAddToBasket"
					/>
				</div>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _get from 'lodash/get';
import cookieStore from '@/util/cookieStore';
import basketAddInterstitial from '@/graphql/query/basketAddInterstitialClient.graphql';
import basketAddInterstitialData from '@/graphql/query/basketAddInterstitialData.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import LoanReservation from '@/components/Checkout/LoanReservation';
import LYML from '@/components/LoansYouMightLike/lymlContainer';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvLightbox,
		KvButton,
		LoanReservation,
		LYML,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	data() {
		return {
			activateTimer: true,
			showInterstitial: false,
			basketInterstitialState: {},
			loan: {},
			loans: () => [],
			loanCount: 0,
			loanTotals: '0.00',
			loading: true,
		};
	},
	computed: {
		basketInterstitialActive() {
			return this.basketInterstitialState.active || false;
		}
	},
	mounted() {
		this.apollo.watchQuery({ query: basketAddInterstitial }).subscribe({
			next: ({ data }) => {
				const interstitialState = _get(data, 'basketAddInterstitial');
				this.showInterstitial = interstitialState.active ? interstitialState.visible : false;
				this.basketInterstitialState = Object.assign({}, this.basketInterstitialState, {
					active: interstitialState.active,
					visible: interstitialState.visible,
					loanId: interstitialState.loanId,
				});
				// check for loan id + fetch loan
				if (interstitialState.loanId !== 0) {
					this.fetchLoan();
				}
			},
		});
	},
	methods: {
		closeLightbox() {
			this.clearInterstitial();

			this.loadingOnTimeout = window.setTimeout(() => {
				this.loading = true;
			}, 500);
		},
		clearInterstitial() {
			this.apollo.mutate({
				mutation: updateAddToBasketInterstitial,
				variables: {
					active: this.basketInterstitialActive,
					visible: false,
					loanId: 0
				}
			});
		},
		fetchLoan() {
			if (this.basketInterstitialState.loanId) {
				this.apollo.query({
					query: basketAddInterstitialData,
					variables: {
						basketId: cookieStore.get('kvbskt'),
					},
					fetchPolicy: 'network-only',
				}).then(({ data }) => {
					// all loans in basket
					this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
					this.loanCount = this.loans.length;
					this.loanTotals = _get(data, 'shop.basket.totals.loanReservationTotal');
					const addedLoan = _find(this.loans, { id: this.basketInterstitialState.loanId });

					// newly added loan
					this.loan = addedLoan;

					this.loadingOffTimeout = window.setTimeout(() => {
						this.loading = false;
					}, 500);
				});
			}
		},
		// the async processing phase triggered upon clicking add to basket
		processingAddToBasket() {
			this.$emit('processing-add-to-basket');
			this.loading = true;
		},
		// the final outcome of adding a loan to basket
		// payload is { loanId: ######, success: true/false }
		handleAddToBasket(payload) {
			this.loading = false;
			this.$emit('add-to-basket', payload);
			if (payload.success) {
				// update basket items + totals
				this.fetchLoan();
			}
		},
	},
	destroyed() {
		clearTimeout(this.loadingOnTimeout);
		clearTimeout(this.loadingOffTimeout);
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.basket-add-interstitial {
	.lightbox-title {
		padding: 1rem 2.5rem 0.8rem 1rem;
		border-bottom: 1px solid $subtle-gray;
		font-size: 1.75rem;

		@include breakpoint(medium) {
			padding: 1rem 2rem 0.8rem;
		}
	}

	.lightbox-loan-wrapper {
		padding: 0.5rem;
		position: relative;
		min-height: 12rem;

		@include breakpoint(medium) {
			padding: 1rem;
		}

		.loan-preview {
			min-height: 12rem;
		}

		.loan-image-wrapper {
			@include breakpoint(large) {
				position: absolute;
				left: 1rem;
			}
		}

		.loan-title .popup-reservation-text {
			font-size: 1rem;
		}

		.basket-summary {
			padding: 0.375rem 0;
			margin: 0.625rem 0 0.5rem;
			border-top: 1px solid $subtle-gray;
			font-weight: 400;
			color: $kiva-text-light;

			.text-subtotals {
				text-align: right;
			}
		}

		.button-actions {
			padding: 0.375rem 0;
			flex-direction: column-reverse;

			@include breakpoint(medium) {
				flex-direction: row;
			}

			button,
			a {
				width: 100%;
				padding-left: 1rem;
				padding-right: 1rem;
			}
		}
	}

	.lightbox-lyml-wrapper {
		padding: 1.5rem 0;
		background: $platinum;
		border-radius: 0 0 rem-calc(4) rem-calc(4);

		h2 {
			padding: 0 1rem;
			font-size: 1.25rem;
			font-weight: 500;

			@include breakpoint(medium) {
				padding: 0 2rem;
			}
		}
	}
}
</style>

<style lang="scss">
.basket-add-interstitial .kv-lightbox-wrap .kv-lightbox .lightbox-content .close-lightbox {
	top: 1.5rem;
}

#loading-preview-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	background-color: rgba(white, 0.7);

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}
</style>
