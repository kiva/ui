<template>
	<component
		:is="loanCardType"
		:key="loan.id"
		:loan="loan"
		:items-in-basket="itemsInBasket"
		:is-visitor="isVisitor"
		:lend-increment-button-version="lendIncrementButtonVersion"
		:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
		:is-favorite="isFavorite"
		:expiring-soon-message="expiringSoonMessage"
		:percent-raised="percentRaised"
		:is-funded="isFunded"
		:is-selected-by-another="isSelectedByAnother"
		:amount-left="amountLeft"
		@track-interaction="trackInteraction"
		@toggle-favorite="toggleFavorite"
	/>
</template>

<script>
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import GridMicroLoanCard from '@/components/LoanCards/GridMicroLoanCard';
import ListLoanCard from '@/components/LoanCards/ListLoanCard';
import {
	differenceInMinutes,
	differenceInHours,
	differenceInDays
} from 'date-fns';
import _forEach from 'lodash/forEach';
import loanFavoriteMutation from '@/graphql/mutation/updateLoanFavorite.graphql';

export default {
	components: {
		GridLoanCard,
		GridMicroLoanCard,
		ListLoanCard,
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
			default: null
		},
		categorySetId: {
			type: String,
			default: ''
		},
		rowNumber: {
			type: Number,
			default: null
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
			}
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		lendIncrementButtonVersion: {
			type: String,
			default: ''
		},
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
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
				}
			};

			this.$kvTrackSelfDescribingEvent(loanInteractionTrackData);
		},
		toggleFavorite() {
			// optimistically toggle it locally first
			// Feels like this should happen in the else statement of the .then() block of code
			// So the toggle only occurs if there are not errors.
			this.isFavorite = !this.isFavorite;

			this.apollo.mutate({
				mutation: loanFavoriteMutation,
				variables: {
					loan_id: this.loan.id,
					is_favorite: this.isFavorite
				}
			}).then(data => {
				if (data.errors) {
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
				console.error(error);
			});
		},
	},
};
</script>
