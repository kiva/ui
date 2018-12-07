<template>
	<div class="minimal-loan-card">
		<!-- Image -->
		<!-- is-visitor set to false is hiding the loan favorite star on borrower images -->
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			v-kv-track-event="['basket', 'basket-loan-profile', 'basket-loan-profile']"
		/>

		<div class="minimal-loan-card-data-wrap">
			<p
				:loan-id="loan.id"
				:name="loan.name"
				class="small-text name"
			>{{ loan.name }}</p>

			<!-- loan meter	 -->
			<minimal-fundraising-meter
				:amount-left="amountLeft"
				:percent-raised="percentRaised"
				:is-funded="loan.status==='funded'"
			/>
			<!-- reserved-amount="reservedAmount" -->
			<!-- Country -->
			<p
				class="small-text loan-data"
				:country="loan.geocode.country.name"
				:sector="loan.activity.name">
				{{ loan.geocode.country.name }} <br> {{ loan.activity.name }}
			</p>
			<!-- Add to basket text -->
			<a
				:loan-id="loan.id"
				v-if="!inBasket"
				@click.prevent="addToBasket()"
				class="card-action"
				v-kv-track-event="['basket', 'basket-loan-upsell', 'loan-type', parseInt(cardNumber)]"
			>Add to basket
			</a>
			<p
				v-else>In your basket
			</p>

		</div>
	</div>
</template>
<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MinimalFundraisingMeter from '@/components/LoansYouMightLike/MinimalFundraisingMeter';
import shopBasketUpdate from '@/graphql/query/checkout/shopBasketUpdate.graphql';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import numeral from 'numeral';
import _forEach from 'lodash/forEach';

export default {
	components: {
		LoanCardImage,
		MinimalFundraisingMeter,
		shopBasketUpdate,
		updateLoanReservation,
	},
	data() {
		return {
			inBasket: false,
		};
	},
	inject: ['apollo'],
	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {}
					},
					image: {}
				};
			}
		},
		cardNumber: {
			type: String,
			default: ''
		},
		isVisitor: {
			type: Boolean,
			default: true
		},
		country: {
			type: String,
			default: ''
		},
		sector: {
			type: String,
			default: ''
		},
	},
	computed: {
		amountLeft() {
			const { fundedAmount, reservedAmount } = this.loan.loanFundraisingInfo;
			return numeral(this.loan.loanAmount).subtract(fundedAmount).subtract(reservedAmount).value();
		},
		isFunded() {
			return this.loan.status === 'funded' || this.amountLeft <= 0;
		},
		percentRaised() {
			return numeral(numeral(this.loan.loanAmount).subtract(this.amountLeft))
				.divide(this.loan.loanAmount).value();
		}
	},
	methods: {
		addToBasket() {
			this.$emit('setUpdatingTotals', true);
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanid: this.loan.id,
					price: numeral(25).format('0.00'),
				},
			}).then(({ errors }) => {
				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				}
			}).catch(() => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			}).finally(() => {
				this.$emit('refreshtotals');
				this.inBasket = true;
			});
		}
	},
};
</script>
<style lang="scss" scoped>
@import "settings";

.minimal-loan-card {
	width: rem-calc(180);
	height: rem-calc(296);
	border: 1px solid $kiva-stroke-gray;
	display: inline-block;
	margin: rem-calc(10);
}

.minimal-loan-card-data-wrap {
	padding: 15px;
}

.name {
	font-weight: 400;
	color: $kiva-text-dark;
	margin-bottom: 10px;
}

.loan-data {
	color: $kiva-text-light;
	padding: 13px 0;
	margin-bottom: 0;
}

.card-action {
	margin-bottom: 15px;
	font-weight: 400;
}
</style>
