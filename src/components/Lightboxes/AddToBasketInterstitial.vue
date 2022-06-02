<template>
	<div class="basket-add-interstitial row small-collapse">
		<kv-lightbox
			:visible="showInterstitial"
			@lightbox-closed="closeLightbox"
			title="Thanks for your commitment to make an impact"
		>
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
			<div class="lightbox-lyml-wrapper" v-if="loan.loan && showLoansYouMightLike">
				<div class="additional-loans">
					<h2>Support more loans like {{ loan.loan.name }}</h2>
					<l-y-m-l
						v-if="loans && loan.id"
						:basketed-loans="loans"
						:target-loan="loan"
						:visible="showInterstitial"
						@add-to-basket="handleAddToBasket"
						@processing-add-to-basket="processingAddToBasket"
						@no-rec-loans-found="showLoansYouMightLike = false"
					/>
				</div>
			</div>

			<template #controls>
				<kv-checkbox
					id="user-pref-hide-interstitial"
					:checked="userPrefHideInterstitial"
					@change="handleChangeUserPref"
				>
					Don't show me this again
				</kv-checkbox>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _get from 'lodash/get';
import store2 from 'store2';
import basketAddInterstitial from '@/graphql/query/basketAddInterstitialClient.graphql';
import basketAddInterstitialData from '@/graphql/query/basketAddInterstitialData.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanReservation from '@/components/Checkout/LoanReservation';
import LYML from '@/components/LoansYouMightLike/LymlContainer';
import getCacheKey from '@/util/getCacheKey';

export default {
	name: 'AddToBasketInterstitial',
	serverCacheKey: () => getCacheKey('AddToBasketInterstitial'),
	components: {
		KvButton,
		KvCheckbox,
		KvLightbox,
		KvLoadingSpinner,
		LoanReservation,
		LYML,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			basketInterstitialState: {},
			loan: {},
			loans: () => [],
			loanCount: 0,
			loanTotals: '0.00',
			loading: true,
			showInterstitial: false,
			showLoansYouMightLike: true,
			userPrefHideInterstitial: false,
		};
	},
	computed: {
		basketInterstitialActive() {
			return this.basketInterstitialState.active || false;
		}
	},
	mounted() {
		this.userPrefHideInterstitial = store2('userPrefHideInterstitial') === true; // read from localstorage

		this.apollo.watchQuery({ query: basketAddInterstitial }).subscribe({
			next: ({ data }) => {
				const interstitialState = _get(data, 'basketAddInterstitial');
				this.basketInterstitialState = {
					...this.basketInterstitialState,
					active: interstitialState.active,
					visible: interstitialState.visible,
					loanId: interstitialState.loanId,
				};

				this.showInterstitial = interstitialState.visible && !this.userPrefHideInterstitial;

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
						basketId: this.cookieStore.get('kvbskt'),
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
		handleChangeUserPref(val) {
			this.userPrefHideInterstitial = val;
			store2('userPrefHideInterstitial', this.userPrefHideInterstitial); // store userpref in localstorage

			console.log(`TRACK: Lending, click-hide-add-to-basket-interstitial, ${this.userPrefHideInterstitial ? 'selected' : 'unselected'}`); // eslint-disable-line max-len
			this.$kvTrackEvent(
				'Lending',
				'click-hide-add-to-basket-interstitial',
				this.userPrefHideInterstitial ? 'selected' : 'unselected'
			);
		}
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
	.lightbox-loan-wrapper {
		margin: 1rem -0.875rem;
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
				left: 0;
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
		margin-bottom: 1.5rem;
		margin-left: -1.5rem;
		margin-right: -1.5rem;

		@include breakpoint(medium) {
			margin-left: -2.8125rem;
			margin-right: -2.8125rem;
			padding: 2.25rem 0.875rem;
		}

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
