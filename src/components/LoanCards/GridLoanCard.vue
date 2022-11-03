<template>
	<div class="column column-block">
		<h3 v-if="title">
			{{ title }}
		</h3>
		<div class="grid-loan-card tw-bg-primary tw-border tw-border-tertiary">
			<div v-if="showTags" class="tw-mt-1 tw-ml-1 tw-absolute tw-z-1">
				<loan-tag v-if="getTagInfo()" :variation="getTagInfo()" />
			</div>
			<loan-card-image
				:loan-id="loan.id"
				:name="loan.name"
				:retina-image-url="loan.image.retina"
				:standard-image-url="loan.image.default"
				:is-visitor="isVisitor"
				:is-favorite="isFavorite"
				:loan-image-hash="loan.image.hash"

				@track-loan-card-interaction="trackInteraction"
				@favorite-toggled="toggleFavorite"
			/>
			<borrower-info
				:loan-id="loan.id"
				:name="loan.name"
				:amount="loan.loanAmount"
				:use="loan.use"
				:country="loan.geocode.country.name"
				:iso-code="loan.geocode.country.isoCode"
				:state="loan.geocode.state"
				:city="loan.geocode.city"
				:status="loan.status"
				:borrower-count="loan.borrowerCount"
				:loan-length="loan.lenderRepaymentTerm"

				@track-loan-card-interaction="trackInteraction"
			/>

			<div class="loan-card-footer-wrap">
				<fundraising-status
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:expiring-soon-message="expiringSoonMessage"
					:is-funded="loan.status==='funded'"
				/>

				<action-button
					:loan-id="loan.id"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
					:is-amount-lend-button="lessThan25"
					:amount-left="amountLeft"
					:show-now="true"
					class="tw-mt-2 tw-w-full"
					:class="{'tw-mb-2' : !isMatchAtRisk && !isFunded}"
					@click.native="trackInteraction({
						interactionType: 'addToBasket',
						interactionElement: 'Lend25'
					})"

					@add-to-basket="$emit('add-to-basket', $event)"
				/>

				<matching-text
					v-if="!isMatchAtRisk"
					:matching-text="loan.matchingText"
					:match-ratio="loan.matchRatio"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { differenceInDays, parseISO } from 'date-fns';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';
import LoanTag from '@/components/LoanCards/LoanTags/LoanTag';

export default {
	name: 'GridLoanCard',
	components: {
		ActionButton,
		BorrowerInfo,
		FundraisingStatus,
		LoanCardImage,
		MatchingText,
		LoanTag
	},
	inject: ['apollo'],
	props: {
		amountLeft: {
			type: Number,
			default: 0,
		},
		expiringSoonMessage: {
			type: String,
			default: ''
		},
		isFavorite: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
		isMatchAtRisk: {
			type: Boolean,
			default: false
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
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
						country: {},
					},
					image: {},
				};
			}
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
		title: {
			type: String,
			default: ''
		},
		showTags: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		lessThan25() {
			return this.amountLeft < 25 && this.amountLeft !== 0;
		}
	},
	methods: {
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
		trackInteraction(args) {
			this.$emit('track-interaction', args);
			if (args?.interactionType === 'addToBasket' && this.getTagInfo()) {
				this.$kvTrackEvent(
					'loan-card',
					'add-to-basket',
					this.getTagInfo()
				);
			}
		},
		getTagInfo() {
			if (differenceInDays(parseISO(this.loan?.plannedExpirationDate), Date.now()) <= 3) {
				return 'ending-soon';
			} if (this.amountLeft < 100 && this.amountLeft > 0) {
				return 'almost-funded';
			} if (this.loan?.matchingText) {
				return 'matched-loan';
			}
			return null;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.grid-loan-card {
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

	.grid-loan-card {
		width: rem-calc(280);
		@include breakpoint(340px down) {
			min-width: rem-calc(256);
			width: rem-calc(256);
		}
	}
}

.is-in-category-row {
	&.column-block {
		padding: 0 rem-calc(10);
		margin-bottom: 0;

		&:first-of-type {
			padding-left: 0;
		}
	}
}

.is-in-featured {
	&.column-block {
		padding: 0 rem-calc(10);
		margin-bottom: 2.5rem;

		&:first-of-type {
			padding-left: 0;
		}
	}
}
</style>
