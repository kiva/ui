<template>
	<div class="minimal-loan-card">
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="true"
			@click.native="trackProfileClick"
			:open-in-new-tab="true"
			:use-default-styles="false"
		/>
		<div class="minimal-loan-card-data-wrap">
			<p class="small-text name">{{ loan.name }}</p>
			<!-- loan meter	 -->
			<div class="minimal-fundraising-meter">
				<minimal-fundraising-meter
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:is-funded="loan.status==='funded'"
				/>
			</div>
			<!-- Country -->
			<p class="small-text loan-data">
				<span>{{ loan.geocode.country.name }}</span>
				<span>{{ loan.activity.name }}</span>
			</p>

			<!-- Add to basket text -->
			<div class="minimal-loan-card-action-wrap">
				<a
					:loan-id="loan.id"
					v-if="!itemInBasket"
					@click.prevent="addToBasket()"
					class="card-action"
				>Add to basket
				</a>
				<p
					class="card-action"
					v-else>In your basket
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import numeral from 'numeral';
import _get from 'lodash/get';
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
		partner: {
			type: String,
			default: ''
		},
		gender: {
			type: String,
			default: ''
		}
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
		},
		loanType() {
			const country = _get(this.loan, 'geocode.country.name');
			const sector = _get(this.loan, 'sector.name');
			const partner = _get(this.loan, 'partner.name');
			const gender = _get(this.loan, 'gender.name');
			const activity = _get(this.loan, 'activity.name');
			return `location=${country},sector=${sector},partner=${partner},gender=${gender},activity=${activity}`;
		}
	},
	methods: {
		addToBasket() {
			this.$emit('processing-add-to-basket');
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanid: this.loan.id,
					price: numeral(25).format('0.00'),
				},
			}).then(({ errors }) => {
				this.$emit('add-to-basket', {
					loanId: this.loanId,
					success: !errors,
				});

				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				}

				this.$kvTrackEvent(
					'Lending',
					'lend-button-loan-upsell',
					this.loanType,
					this.cardNumber
				);
			}).catch(() => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			});
		},
		trackProfileClick() {
			this.$kvTrackEvent(
				'Lending',
				'lend-button-loan-profile',
				this.loanType,
				this.cardNumber
			);
		}
	},
};
</script>
<style lang="scss" scoped>
@import "settings";

.minimal-loan-card {
	margin: 1rem;
	background: white;
	display: flex;

	@include breakpoint(medium) {
		width: rem-calc(180);
		border: 1px solid $kiva-stroke-gray;
		margin: rem-calc(10);
		display: inline-flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.borrower-image-wrapper {
		width: 50%;
		height: auto;
		margin: 0;
		padding: 0;

		@include breakpoint(medium) {
			width: 100%;
			max-height: rem-calc(132);
		}
	}
}

.minimal-loan-card-data-wrap {
	position: relative;
	width: 50%;
	padding: 0.25rem 0.875rem 0;

	@media screen and (min-width: 320px) {
		padding-top: 0.5rem;
		font-size: rem-calc(16);
	}

	@include breakpoint(medium) {
		width: 100%;
		padding: 0.875rem 0.875rem;
	}

	.name {
		font-weight: 400;
		color: $kiva-text-dark;
		margin-bottom: 0;
		padding-bottom: 0.125rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media screen and (min-width: 320px) {
			padding-bottom: 0.375rem;
			font-size: rem-calc(16);
		}
	}

	.minimal-fundraising-meter {
		margin: 0 0 0.375rem;
	}

	.loan-data {
		color: $kiva-text-light;
		margin: 0;
		line-height: 1.2;

		span {
			display: block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		@media screen and (min-width: 320px) {
			padding: 0 0 0.375rem;
		}
	}

	.minimal-loan-card-action-wrap {
		position: absolute;
		bottom: 0.25rem;
		padding: 0;

		@media screen and (min-width: 320px) {
			bottom: 0.5rem;
		}

		@include breakpoint(medium) {
			position: relative;
			bottom: auto;
		}

		.card-action {
			display: block;
			font-weight: 400;
			margin-bottom: 0;
			font-size: rem-calc(14);

			@media screen and (min-width: 320px) {
				font-size: rem-calc(16);
			}
		}
	}
}
</style>
