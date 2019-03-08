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
		:amount-left="amountLeft"
		@track-interaction="trackInteraction"
	/>
</template>

<script>
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import GridMicroLoanCard from '@/components/LoanCards/GridMicroLoanCard';
import {
	differenceInMinutes,
	differenceInHours,
	differenceInDays
} from 'date-fns';
import _get from 'lodash/get';
import loanFavoriteMutation from '@/graphql/mutation/updateLoanFavorite.graphql';

export default {
	components: {
		GridLoanCard,
		GridMicroLoanCard,
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
			this.isFavorite = !this.isFavorite;

			this.apollo.mutate({
				mutation: loanFavoriteMutation,
				variables: {
					loan_id: this.loan.id,
					is_favorite: this.isFavorite
				}
			}).then(({ data }) => {
				if (data) {
					// @todo - provide a better soft-landing if mutation failed
					const favorite = _get(data, 'loan.favorite');

					if (favorite === null) {
						this.isFavorite = !this.isFavorite;
					}
				}
			});
		},
	},
};
</script>
