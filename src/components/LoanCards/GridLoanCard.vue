<template>
	<div class="column column-block">

		<h3 v-if="title">{{ title }}</h3>

		<div class="grid-loan-card">
			<loan-card-image
				:loan-id="loan.id"
				:name="loan.name"
				:retina-image-url="loan.image.retina"
				:standard-image-url="loan.image.default"
				:is-visitor="isVisitor"
				:is-favorite="isFavorite"
				:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
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
				:status="loan.status"
				:borrower-count="loan.borrowerCount"
				:loan-length="loan.lenderRepaymentTerm"

				@track-loan-card-interaction="trackInteraction"
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
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"

					@click.native="trackInteraction({
						interactionType: 'addToBasket',
						interactionElement: 'Lend25'
					})"

					@add-to-basket="$emit('add-to-basket', $event)"
				/>

				<matching-text
					:matching-text="loan.matchingText"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';

export default {
	components: {
		ActionButton,
		BorrowerInfo,
		FundraisingStatus,
		LoanCardImage,
		MatchingText,
	},
	inject: ['apollo'],
	props: {
		amountLeft: {
			type: Number,
			default: 0,
		},
		experimentData: {
			type: Object,
			default: () => {},
		},
		expiringSoonMessage: {
			type: String,
			default: ''
		},
		imageEnhancementExperimentVersion: {
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
	},
	methods: {
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		}
	},
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
