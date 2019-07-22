<template>
	<component
		class="loan-card-controller"
		:amount-left="amountLeft"
		:card-number="cardNumber"
		:experiment-data="experimentData"
		:expiring-soon-message="expiringSoonMessage"
		:is-favorite="isFavorite"
		:is-funded="isFunded"
		:is-selected-by-another="isSelectedByAnother"
		:is-visitor="isVisitor"
		:items-in-basket="itemsInBasket"
		:key="loan.id"
		:loan="loan"
		:percent-raised="percentRaised"
		:title="title"
		:is="loanCardType"

		@track-interaction="trackInteraction"
		@toggle-favorite="toggleFavorite"
		@add-to-basket="handleAddToBasket"
		@processing-add-to-basket="processingAddToBasket"

		:expanded="expanded"
		:category-id="categoryId"
		:category-set-id="categorySetId"
		:row-number="rowNumber"
		:right-arrow-position="rightArrowPosition"
		:left-arrow-position="leftArrowPosition"

		:detailed-loan-index="detailedLoanIndex"
		:hover-loan-index="hoverLoanIndex"
		:shift-increment="shiftIncrement"
		:time-left-message="timeLeftMessage"

		@update-detailed-loan-index="updateDetailedLoanIndex"
		@update-hover-loan-index="updateHoverLoanIndex"
		@close-detailed-loan-card="handleCloseDetailedLoanCard"
	/>
	<!--
		Blocks of attributes above:
		1) Props for implemented loan cards
		2) Events for implemented loan cards
		3) Props for ExpandableLoanCard experiment
		4) Props for HoverLoanCard experiment
		5) Events for HoverLoanCard experiment
	-->
</template>

<script>
import AdaptiveMicroLoanCard from '@/components/LoanCards/AdaptiveMicroLoanCard';
import FeaturedHeroLoan from '@/components/LoansByCategory/FeaturedHeroLoan';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import ExpandableLoanCardCollapsed from '@/components/LoanCards/ExpandableLoanCard/ExpandableLoanCardCollapsed';
import ExpandableLoanCard from '@/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard';
import GridMicroLoanCard from '@/components/LoanCards/GridMicroLoanCard';
import ListLoanCard from '@/components/LoanCards/ListLoanCard';
import HoverLoanCard from '@/components/LoanCards/HoverLoanCard/HoverLoanCard';
import DetailedLoanCard from '@/components/LoanCards/HoverLoanCard/DetailedLoanCard';
import {
	differenceInMinutes,
	differenceInHours,
	differenceInDays
} from 'date-fns';
import _forEach from 'lodash/forEach';
import loanFavoriteMutation from '@/graphql/mutation/updateLoanFavorite.graphql';

export default {
	components: {
		AdaptiveMicroLoanCard,
		FeaturedHeroLoan,
		GridLoanCard,
		ExpandableLoanCard,
		ExpandableLoanCardCollapsed,
		GridMicroLoanCard,
		ListLoanCard,
		HoverLoanCard,
		DetailedLoanCard,
	},
	props: {
		loanCardType: {
			type: String,
			required: true,
		},
		enableTracking: {
			type: Boolean,
			default: false,
		},
		categoryId: {
			type: Number,
			default: null,
		},
		categorySetId: {
			type: String,
			default: '',
		},
		rowNumber: {
			type: Number,
			default: null,
		},
		cardNumber: {
			type: Number,
			default: null,
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
			},
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		experimentData: {
			type: Object,
			default: () => {},
		},
		title: {
			type: String,
			default: '',
		},
		expanded: {
			type: Boolean,
			default: false,
		},
		rightArrowPosition: {
			type: Number,
			default: undefined,
		},
		leftArrowPosition: {
			type: Number,
			default: undefined,
		},
		detailedLoanIndex: {
			type: Number,
			default: null,
		},
		hoverLoanIndex: {
			type: Number,
			default: null,
		},
		shiftIncrement: {
			type: Number,
			default: 0,
		},
	},
	inject: ['apollo'],
	computed: {
		amountLeft() {
			const {
				fundedAmount,
				reservedAmount
			} = this.loan.loanFundraisingInfo;
			return this.loan.loanAmount - fundedAmount - reservedAmount;
		},
		isFunded() {
			return this.loan.status === 'funded';
		},
		isSelectedByAnother() {
			return this.amountLeft <= 0 && !this.isFunded;
		},
		isExpired() {
			return this.loan.status === 'expired';
		},
		percentRaised() {
			return (this.loan.loanAmount - this.amountLeft) / this.loan.loanAmount;
		},
		timeLeftMessage() {
			const days = differenceInDays(this.loan.plannedExpirationDate, Date.now());
			if (days >= 6) {
				return `${days} days left`;
			}
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
		expiringSoonMessage() {
			const days = differenceInDays(this.loan.plannedExpirationDate, Date.now());
			// Send empty message if expiration is greater than 6 days
			// > This matches the wwwApp implmentation
			if (days >= 6) {
				return '';
			}
			return this.timeLeftMessage;
		},
	},
	data() {
		return {
			isFavorite: this.loan.userProperties.favorited,
		};
	},
	watch: {
		// watch for dynamic changes to the loan status to support algolia
		'loan.userProperties.favorited': {
			handler() {
				this.isFavorite = this.loan.userProperties.favorited;
			},
			deep: true
		}
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
			const loanInteractionTrackData = {
				schema,
				data: {
					interactionType,
					interactionElement,
					loanId: this.loan.id,
					categorySetIdentifier: this.categorySetId,
					categoryId: this.categoryId,
					row: this.rowNumber,
					position: this.cardNumber,
				},
			};

			this.$kvTrackSelfDescribingEvent(loanInteractionTrackData);
		},
		toggleFavorite() {
			// optimistically toggle it locally first
			this.isFavorite = !this.isFavorite;

			this.apollo.mutate({
				mutation: loanFavoriteMutation,
				variables: {
					loan_id: this.loan.id,
					is_favorite: this.isFavorite
				},
			}).then(data => {
				if (data.errors) {
					this.isFavorite = !this.isFavorite;
					_forEach(data.errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					this.$kvTrackEvent(
						'Lending',
						'Loan Favorite Toggled',
						this.isFavorite === true ? 'Favorite Loan Added'
							: 'Loan Favorite Removed', this.isFavorite
					);
					if (this.isFavorite === true) {
						// eslint-disable-next-line max-len
						this.$showTipMsg('This loan has been saved to your "Starred loans" list, which is accessible under the "Lend" menu in the header.', 'confirm');
					}
				}
				// Catch other errors
			}).catch(error => {
				this.isFavorite = !this.isFavorite;
				console.error(error);
			});
		},
		// the async processing phase triggered upon clicking add to basket
		processingAddToBasket() {
			this.$emit('processing-add-to-basket');
		},
		// the final outcome of adding a loan to basket
		// payload is { loanId: ######, success: true/false }
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		updateDetailedLoanIndex(detailedLoanIndex) {
			this.$emit('update-detailed-loan-index', detailedLoanIndex);
		},
		updateHoverLoanIndex(hoverLoanIndex) {
			this.$emit('update-hover-loan-index', hoverLoanIndex);
		},
		handleCloseDetailedLoanCard() {
			this.$emit('close-detailed-loan-card');
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.loan-card-controller {
	&.column.is-in-category-row {
		flex: 0 0 auto;

		&.column-block {
			padding: 0 rem-calc(10);
			margin-bottom: 0;

			&:first-of-type {
				padding-left: 0;
			}
		}
	}
}
</style>
