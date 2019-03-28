<template>
	<div class="basket-add-interstitial row small-collapse">
		<kv-lightbox
			:visible="showInterstitial"
			:no-padding-top="true"
			:no-padding-sides="true"
			:no-padding-bottom="true"
			@lightbox-closed="closeLightbox">
			<h1 class="lightbox-title" slot="title">You're almost there!</h1>
			<div class="lightbox-loan-wrapper row" v-if="loan.loan">
				<div class="loan-preview columns small-12 large-8 xxlarge-7 large-offset-4" v-if="loan.loan">
					<div class="row">
						<div class="loan-image-wrapper columns small-4">
							<div class="loan-image">
								<img :src="loan.loan.image.default" :title="loan.loan.name">
							</div>
						</div>
						<div class="loan-title columns small-8">
							<h3><span>${{ loan.price | numeral('0,0') }}</span> to {{ loan.loan.name }}</h3>
							<loan-reservation
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
						<div class="columns small-6">
							<kv-button
								class="button-keep-exploring secondary smallest"
								@click.native.prevent="closeLightbox">
								Keep exploring
							</kv-button>
						</div>
						<div class="columns small-6">
							<kv-button
								class="button-checkout smallest"
								to="/checkout"
								@click.native="closeLightbox">
								Checkout
							</kv-button>
						</div>
					</div>
				</div>

				<loading-overlay v-if="loading" id="loading-preview-overlay" />
			</div>
			<div class="lightbox-lyml-wrapper" v-if="loan.loan">
				<div class="additional-loans">
					<h2>Similar loans to {{ loan.loan.name }}</h2>
					<l-y-m-l
						v-if="loans"
						:loans="loans"
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
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import LoanReservation from '@/components/Checkout/LoanReservation';
import LYML from '@/components/LoansYouMightLike/lymlContainer';

export default {
	components: {
		KvLightbox,
		KvButton,
		LoanReservation,
		LYML,
		LoadingOverlay
	},
	inject: ['apollo'],
	data() {
		return {
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
			console.log('lightbox closed');
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
					// console.log(data);
					this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
					this.loanCount = this.loans.length;
					this.loanTotals = _get(data, 'shop.basket.totals.loanReservationTotal');
					const addedLoan = _find(this.loans, { id: this.basketInterstitialState.loanId });
					// console.log(addedLoan);
					this.loan = addedLoan;

					this.loadingOffTimeout = window.setTimeout(() => {
						this.loading = false;
					}, 500);
				});
			}
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
	.lightbox-title {
		padding: 1rem 1rem 0.8rem;
		border-bottom: 1px solid $subtle-gray;

		@include breakpoint(medium) {
			padding: 1rem 2rem 0.8rem;
		}
	}

	.lightbox-loan-wrapper {
		padding: 1rem;
		position: relative;

		@include breakpoint(medium) {
			padding: 1rem 2rem;
		}

		.loan-preview {
			min-height: 12rem;
		}

		.loan-image-wrapper {
			@include breakpoint(large) {
				position: absolute;
				left: 2rem;

				.loan-image {
					padding-right: 0.8rem;
				}
			}
		}

		.basket-summary {
			padding: 0.375rem 0;
			margin: 0.625rem 0 0.5rem;
			border-top: 1px solid $subtle-gray;
			font-weight: 400;

			.text-subtotals {
				text-align: right;
			}
		}

		.button-actions {
			padding: 0.375rem 0;

			button,
			a {
				width: 100%;
				padding-left: 1rem;
				padding-right: 1rem;
			}
		}

		#loading-preview-overlay {
			width: auto;
			height: auto;
			left: 1rem;
			right: 1rem;
			bottom: 0;
			top: 0;
		}
	}

	.lightbox-lyml-wrapper {
		padding: 2rem 0;
		background: $platinum;
		border-radius: 0 0 rem-calc(4) rem-calc(4);

		h2 {
			padding: 0 1rem;

			@include breakpoint(medium) {
				padding: 0 2rem;
			}
		}
	}
}

</style>
