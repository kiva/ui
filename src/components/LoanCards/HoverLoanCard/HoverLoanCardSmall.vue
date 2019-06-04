<template>
	<div class="hover-loan-card-small" :class="{expanded}">
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
		<div class="hover-loan-card-data-wrap">
			<p class="name">
				{{ loan.name }}
			</p>
			<div class="minimal-fundraising-meter">
				<minimal-fundraising-meter
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:is-funded="loan.status==='funded'"
				/>
			</div>
			<p class="small-text loan-data">
				{{ loan.geocode.country.name }} / {{ loan.activity.name }}
			</p>
		</div>
	</div>
</template>
<script>
import numeral from 'numeral';
import _get from 'lodash/get';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MinimalFundraisingMeter from '@/components/LoansYouMightLike/MinimalFundraisingMeter';

export default {
	components: {
		LoanCardImage,
		MinimalFundraisingMeter,
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
			type: Number,
			default: 0
		},
		expanded: {
			type: Boolean,
			default: false,
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

.hover-loan-card-small {
	margin: rem-calc(10);
	width: rem-calc(180);
	background: white;
	display: inline-flex;
	flex-direction: column;
	justify-content: space-between;
	flex-shrink: 0;
	transform: scale(1, 1);
	opacity: 1;
	transition: transform 0.2s linear, opacity 0.2s linear;

	.hover-loan-card-data-wrap {
		position: relative;
		padding: 0.75rem 1rem;
		text-align: center;
		border: 1px solid $kiva-stroke-gray;
		border-top: none;
		height: 90px;

		.name {
			line-height: rem-calc(20);
			color: $kiva-text-dark;
			margin-bottom: 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.minimal-fundraising-meter {
			margin-bottom: rem-calc(14);
		}

		.loan-data {
			color: $kiva-text-light;
			margin: 0;
			line-height: 1.2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	&.expanded {
		transform: scale(3.2, 1.1);
		opacity: 0;
	}
}
</style>
