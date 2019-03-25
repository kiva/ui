<template>
	<div class="basket-add-interstitial">
		<kv-lightbox
			:visible="showInterstitial"
			:no-padding-top="true"
			:no-padding-sides="true"
			:no-padding-bottom="true"
			@lightbox-closed="closeLightbox">
			<h1 class="lightbox-title" slot="title">You're almost there!</h1>
			<div class="lightbox-loan-wrapper" v-if="loan.loan">
				<div class="loan-preview" v-if="loan.loan">
					<div class="loan-image">
						<img :src="loan.loan.image.url" :title="loan.loan.name">
					</div>
					<div class="loan-title">
						<h3><span>${{ loan.price }}</span> to {{ loan.loan.name }}</h3>
						<loan-reservation
							:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
							:is-funded="loan.isFunded"
							:expiry-time="loan.expiryTime"
						/>
					</div>
					<div class="basket-summary">
						<span>{{ loanCount }} Loans in basket</span>
						<span>Subtotal ${{ loanTotals }}</span>
					</div>
					<div class="actions">
						<button>Keep Exploring</button>
						<button>Checkout</button>
					</div>
				</div>
			</div>
			<div class="lightbox-lyml-wrapper" v-if="loan.loan">
				<div class="additional-loans">
					<h2>Similar loans to {{ loan.loan.name }}</h2>
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
import LoanReservation from '@/components/Checkout/LoanReservation';

export default {
	components: {
		KvLightbox,
		LoanReservation
	},
	inject: ['apollo'],
	data() {
		return {
			showInterstitial: false,
			basketInterstitialState: {},
			loan: {},
			loanCount: 0,
			loanTotals: '0.00'
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
					console.log(data);
					const loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });
					this.loanCount = loans.length;
					this.loanTotals = _get(data, 'shop.basket.totals.loanReservationTotal');
					const addedLoan = _find(loans, { id: this.basketInterstitialState.loanId });
					console.log(addedLoan);
					this.loan = addedLoan;
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.basket-add-interstitial {
	.lightbox-title {
		padding: 1rem 2rem 0.8rem;
		border-bottom: 1px solid $subtle-gray;
	}

	.lightbox-loan-wrapper {
		padding: 1rem 2rem 2rem;
	}

	.lightbox-lyml-wrapper {
		padding: 2rem;
		background: $platinum;
		border-radius: 0 0 rem-calc(4) rem-calc(4);
	}
}

</style>
