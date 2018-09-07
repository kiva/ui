<template>
	<div
		class="column column-block"
		@track-loan-card-interaction="trackInteraction($event)"
	>

		<h3 v-if="title">{{ title }}</h3>

		<div class="grid-loan-card">
			<loan-card-image
				:loan-id="loan.id"
				:name="loan.name"
				:retina-image-url="loan.image.retina"
				:standard-image-url="loan.image.default"
				:is-visitor="isVisitor"
				:is-favorite="isFavorite"

				@favorite-toggled="toggleFavorite"
			/>
			<borrower-info
				:loan-id="loan.id"
				:name="loan.name"
				:amount="loan.loanAmount"
				:use="loan.use"
				:country="loan.geocode.country.name"
				:status="loan.status"
				:borrower-count="loan.borrowerCount"
				:loan-length="loan.lenderRepaymentTerm"
			/>

			<div class="loan-card-footer-wrap">
				<fundraising-status
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
					:expiring-soon-message="expiringSoonMessage"
					:is-funded="loan.status==='funded'"
				/>

				<action-button
					:loan-id="loan.id"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"

					@click.native="trackInteraction({
						interactionType: 'addToBasket',
						interactionElement: 'Lend25'
					})"
				/>

				<matching-text
					:matching-text="loan.matchingText"
					:is-funded="isFunded"/>
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
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import MatchingText from '@/components/LoanCards/MatchingText';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import _get from 'lodash/get';
import loanFavoriteMutation from '@/graphql/mutation/updateLoanFavorite.graphql';

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
		isInCategoryRow: {
			type: Boolean,
			default: false
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
	},
	data() {
		return {
			isFavorite: this.loan.userProperties.favorited,
		};
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
		}
	},
	methods: {
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
		trackInteraction(args) {
			if (!this.isInCategoryRow) {
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

<style lang="scss" scoped>
@import 'settings';

.grid-loan-card {
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

.loan-card-footer-wrap {
	flex-grow: 0;
	padding: rem-calc(20) rem-calc(20) rem-calc(16);
	text-align: center;
	width: 100%;
}

.is-in-category-row,
.is-in-featured {
	flex: 0 0 auto;

	&.column-block {
		padding: 0 rem-calc(10);

		&:first-of-type {
			padding-left: 0;
		}
	}

	.grid-loan-card {
		width: rem-calc(280);
		@include breakpoint(340px down) {
			min-width: rem-calc(256);
			width: rem-calc(256);
		}
	}
}
</style>
