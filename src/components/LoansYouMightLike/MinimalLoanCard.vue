<template>
	<div
		class="minimal-loan-card tw-bg-primary tw-border-tertiary tw-border tw-rounded tw-overflow-hidden"
		style="width: 240px;"
	>
		<!-- Image -->
		<!-- is-visitor set to false is hiding the loan favorite star on borrower images -->
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			v-kv-track-event="['basket', 'basket-loan-profile', 'basket-loan-profile']"
			:open-in-new-tab="true"
		/>
		<div class="minimal-loan-card-data-wrap tw-mt-1.5 tw-mx-2">
			<p
				:loan-id="loan.id"
				:name="loan.name"
				:title="loan.name"
				class="name tw-whitespace-nowrap tw-overflow-hidden tw-text-ellipsis tw-mb-1"
			>
				{{ loan.name }}
			</p>
			<!-- loan meter	 -->
			<fundraising-status-meter
				class="minimal-fundraising-meter-margins"
				:amount-left="amountLeft"
				:percent-raised="percentRaised"
				:is-funded="loan.status==='funded'"
				:short-meter="true"
			/>
			<!-- Country -->
			<p
				class="loan-data tw-text-secondary tw-mt-1.5"
				:country="loan.geocode.country.name"
				:sector="loan.activity.name"
			>
				{{ loan.geocode.country.name }} <br> {{ loan.activity.name }}
			</p>
		</div>
		<!-- Add to basket text -->
		<div class="minimal-loan-card-action-wrap tw-mt-3 tw-mb-2 tw-mx-2">
			<button
				:loan-id="loan.id"
				v-if="!itemInBasket"
				@click="addToBasket()"
				class="card-action tw-text-link"
				v-kv-track-event="[
					'basket',
					'basket-loan-upsell',
					'loan-type',
					parseInt(cardNumber),
					parseInt(cardNumber)
				]"
			>
				Add to basket
			</button>
			<p
				class="card-action"
				v-else
			>
				In your basket
			</p>
		</div>
	</div>
</template>
<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import _includes from 'lodash/includes';
import * as Sentry from '@sentry/vue';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatusMeter from '@/components/LoanCards/FundraisingStatus/FundraisingStatusMeter';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';

export default {
	components: {
		LoanCardImage,
		FundraisingStatusMeter,
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
					_forEach(errors, error => {
						this.$showTipMsg(error.message, 'error');
						try {
							this.$kvTrackEvent(
								'Lending',
								'Add-to-Basket',
								`Failed: ${error.message.substring(0, 40)}...`
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
						} catch (e) {
							// no-op
						}
					});
					this.$emit('updating-totals', false);
				} else {
					// If no errors, update the basket + loan info
					this.$emit('refreshtotals');
				}
			}).catch(error => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(error);
			});
		}
	},
};
</script>
