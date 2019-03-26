<template>
	<div class="column column-block">

		<h3 v-if="title">{{ title }}</h3>

		<div class="grid-micro-loan-card">
			<div class="row small-collapse">
				<div class="columns small-4">
					<loan-card-image
						:loan-id="loan.id"
						:name="loan.name"
						:retina-image-url="loan.image.retina"
						:standard-image-url="loan.image.default"
						:is-visitor="true"
						:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
						:loan-image-hash="loan.image.hash"

						@track-loan-card-interaction="trackInteraction"
					/>
				</div>
				<div class="columns small-8">
					<borrower-info
						:loan-id="loan.id"
						:name="loan.name"
						:amount="loan.loanAmount"
						:use="loan.use"
						:hide-loan-use="true"
						:country="loan.geocode.country.name"
						:status="loan.status"
						:borrower-count="loan.borrowerCount"
						:loan-length="loan.lenderRepaymentTerm"

						@track-loan-card-interaction="trackInteraction"
					/>
				</div>

				<div class="loan-card-footer-wrap">
					<fundraising-status
						:amount-left="amountLeft"
						:percent-raised="percentRaised"
						:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
						:expiring-soon-message="expiringSoonMessage"
						:is-funded="loan.status==='funded'"
						:hide-text="true"
					/>

					<action-button
						:loan-id="loan.id"
						:items-in-basket="itemsInBasket"
						:is-lent-to="loan.userProperties.lentTo"
						:is-funded="isFunded"
						:loan="loan"

						@click.native="trackInteraction({
							interactionType: 'addToBasket',
							interactionElement: 'Lend25'
						})"
					/>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
import {
	differenceInMinutes,
	differenceInHours,
	differenceInDays
} from 'date-fns';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import MatchingText from '@/components/LoanCards/MatchingText';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';

export default {
	components: {
		LoanCardImage,
		BorrowerInfo,
		FundraisingStatus,
		MatchingText,
		ActionButton,
	},
	inject: ['apollo'],
	props: {
		cardNumber: {
			type: Number,
			default: null
		},
		categoryId: {
			type: Number,
			default: null
		},
		categorySetId: {
			type: String,
			default: ''
		},
		isVisitor: {
			type: Boolean,
			default: true
		},
		enableTracking: {
			type: Boolean,
			default: false,
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {},
					},
					image: {},
				};
			}
		},
		rowNumber: {
			type: Number,
			default: null
		},
		title: {
			type: String,
			default: ''
		},
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
		},
	},
	data() {
		return {};
	},
	computed: {
		amountLeft() {
			const {
				fundedAmount,
				reservedAmount
			} = this.loan.loanFundraisingInfo;
			return this.loan.loanAmount - fundedAmount - reservedAmount;
		},
		isFunded() {
			return this.loan.status === 'funded' || this.amountLeft <= 0;
		},
		percentRaised() {
			return (this.loan.loanAmount - this.amountLeft) / this.loan.loanAmount;
		},
		expiringSoonMessage() {
			if (!this.loan.loanFundraisingInfo.isExpiringSoon) {
				return '';
			}
			const days = differenceInDays(this.loan.plannedExpirationDate, Date.now());
			if (days >= 2) {
				return `Only ${days} days left! `;
			}
			const hours = differenceInHours(this.loan.plannedExpirationDate, Date.now());
			if (hours >= 2) {
				return `Only ${hours} hours left! `;
			}
			const mins = differenceInMinutes(this.loan.plannedExpirationDate, Date.now());
			if (mins >= 2) {
				return `Only ${mins} minutes left! `;
			}
			return 'Expiring now!';
		},
	},
	methods: {
		trackInteraction(args) {
			if (!this.enableTracking) {
				return;
			}

			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_loan_interaction_event_schema_1_0_0.json#';
			const interactionType = args.interactionType || 'unspecified';
			const interactionElement = args.interactionElement || 'unspecified';
			const loanInteractionTrackData = { schema, data: {} };

			loanInteractionTrackData.data.interactionType = interactionType;
			loanInteractionTrackData.data.interactionElement = interactionElement;
			loanInteractionTrackData.data.loanId = this.loan.id;
			loanInteractionTrackData.data.categorySetIdentifier = this.categorySetId;
			loanInteractionTrackData.data.categoryId = this.categoryId;
			loanInteractionTrackData.data.row = this.rowNumber;
			loanInteractionTrackData.data.position = this.cardNumber;

			this.$kvTrackSelfDescribingEvent(loanInteractionTrackData);
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.grid-micro-loan-card {
	background-color: $white;
	border: 1px solid $kiva-stroke-gray;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: rem-calc(280);
	max-width: rem-calc(480);
	margin: auto;

	&:hover {
		box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
	}
}

.grid-micro-loan-card div .borrower-image-wrapper {
	background: transparent;
	height: auto;
	width: auto;
	padding: 1.25rem 0 0 1.25rem;

	a.borrower-image-link {
		position: initial;
		display: block;

		img.borrower-image {
			display: block;
			position: relative;
			top: auto;
			left: auto;
			width: auto;
			height: auto;
		}
	}
}

.grid-micro-loan-card div .borrower-info-wrapper {
	text-align: left;
	margin-top: 0;
	padding: 1.25rem 1.25rem 0 0.8rem;
	max-height: 5.7rem;
	overflow: hidden;

	a.name {
		display: block;
		font-size: 1rem;
		max-height: 2.8rem;
		overflow: hidden;
	}

	.loan-use {
		display: none;
	}
}

.grid-micro-loan-card div .loan-card-footer-wrap {
	flex-grow: 0;
	padding: rem-calc(20) rem-calc(20) rem-calc(16);
	text-align: center;
	width: 100%;

	.left-and-to-go-line {
		display: none;
	}

	a.action-button,
	button.action-button {
		margin: 0.75rem 0;
	}

	div.action-button {
		margin: 1.25rem 0 0.5rem 0;
	}

	.matching-text {
		display: none;
	}
}

.column.is-in-category-row {
	flex: 0 0 auto;

	&.column-block {
		padding: 0 rem-calc(10);
		margin-bottom: 0;

		&:first-of-type {
			padding-left: 0;
		}
	}

	.grid-micro-loan-card {
		width: rem-calc(280);
		@include breakpoint(340px down) {
			min-width: rem-calc(256);
			width: rem-calc(256);
		}
	}
}
</style>
