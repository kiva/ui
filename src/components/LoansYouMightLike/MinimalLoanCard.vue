<template>
	<div class="minimal-loan-card">
		<!-- Image -->
		<!-- is-visitor set to false is hiding the loan favorite star on borrower images -->
		<div>
			<loan-card-image
				:loan-id="loan.id"
				:name="loan.name"
				:retina-image-url="loan.image.retina"
				:standard-image-url="loan.image.default"
				:is-visitor="isVisitor"
				v-kv-track-event="['basket', 'basket-loan-profile', 'basket-loan-profile']"
				:open-in-new-tab="true"
			/>
			<div class="minimal-loan-card-data-wrap">
				<p
					:loan-id="loan.id"
					:name="loan.name"
					:title="loan.name"
					class="small-text name"
				>{{ loan.name }}</p>
				<!-- loan meter	 -->
				<minimal-fundraising-meter
					class="minimal-fundraising-meter-margins"
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:is-funded="loan.status==='funded'"
				/>
				<!-- Country -->
				<p
					class="small-text loan-data"
					:country="loan.geocode.country.name"
					:sector="loan.activity.name">
					{{ loan.geocode.country.name }} <br> {{ loan.activity.name }}
				</p>
			</div>
		</div>
		<!-- Add to basket text -->
		<div class="minimal-loan-card-action-wrap">
			<a
				:loan-id="loan.id"
				v-if="!itemInBasket"
				@click.prevent="addToBasket()"
				class="card-action"
				v-kv-track-event="['basket', 'basket-loan-upsell', 'loan-type', parseInt(cardNumber)]"
			>Add to basket
			</a>
			<p
				class="card-action"
				v-else>In your basket
			</p>
		</div>
	</div>
</template>
<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import _includes from 'lodash/includes';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MinimalFundraisingMeter from '@/components/LoansYouMightLike/MinimalFundraisingMeter';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';

export default {
	components: {
		LoanCardImage,
		MinimalFundraisingMeter,
		updateLoanReservation,
	},
	inject: ['apollo'],
	props: {
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
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
			type: Number,
			default: 0
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
		itemInBasket() {
			return _includes(this.itemsInBasket, this.loan.id);
		},
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
			this.$emit('updating-totals', true);
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
				} else {
					// If no errors, update the basket + loan info
					this.$emit('refreshtotals');
				}
			}).catch(() => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			});
		}
	},
};
</script>
<style lang="scss" scoped>
@import "settings";

.minimal-loan-card {
	width: rem-calc(180);
	border: 1px solid $kiva-stroke-gray;
	margin: rem-calc(10);
	display: inline-flex;
	flex-direction: column;
	justify-content: space-between;
	background: white;

	&:first-child,
	&:last-child {
		margin-left: 0;
	}
}

.minimal-loan-card-data-wrap {
	padding-left: rem-calc(15);
	padding-right: rem-calc(15);
	padding-top: rem-calc(15);
}

.minimal-loan-card-action-wrap {
	padding-left: rem-calc(15);
	padding-right: rem-calc(15);
	padding-bottom: rem-calc(12);
}

.minimal-fundraising-meter-margins {
	margin: rem-calc(9) 0;
}

.name {
	font-weight: 400;
	color: $kiva-text-dark;
	margin-bottom: 0;
	padding-bottom: rem-calc(6);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.loan-data {
	color: $kiva-text-light;
	margin-top: rem-calc(12);
	margin-bottom: rem-calc(9);
	line-height: 1.3;
}

.card-action {
	font-weight: 400;
	margin-bottom: 0;
}
</style>
