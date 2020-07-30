<template>
	<div class="lend-homepage-loan-card">
		<loan-card-image
			class="lend-homepage-loan-card__image-wrapper"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			:is-favorite="isFavorite"
			:use-default-styles="false"
			@favorite-toggled="toggleFavorite"
		/>
		<div class="lend-homepage-loan-card__data-wrapper">
			<div class="lend-homepage-loan-card__name-row">
				<kv-flag
					v-if="loan.geocode.country.isoCode"
					:country="loan.geocode.country.isoCode" :width="30"
				/>
				<borrower-info-name
					:name="loan.name"
					:loan-id="loan.id"
					class="borrower-name"
					@track-loan-card-interaction="trackInteractionBorrowerInfoName"
				/>
			</div>
			<fundraising-status
				class="lend-homepage-loan-card__fundraising-status"
				:amount-left="amountLeft"
				:percent-raised="percentRaised"
				:expiring-soon-message="expiringSoonMessage"
				:is-funded="isFunded"
				:left-and-to-go-on-top="true"
				:short-meter="true"
			/>
			<borrower-info-body
				class="lend-homepage-loan-card__borrower-info"
				:amount="loan.loanAmount"
				:borrower-count="loan.borrowerCount"
				:name="loan.name"
				:status="loan.status"
				:use="loan.use"
				:loan-id="loan.id"
				:max-use-length="62"
				read-more-link-text="Learn more"
				@track-loan-card-interaction="trackInteraction"
			/>
			<div class="lend-homepage-loan-card__action-row">
				<div
					class="lend-homepage-loan-card__action-button-container"
					:class="{'full-width': isFunded || isExpired}"
				>
					<action-button
						class="action-button"
						:loan-id="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:is-lent-to="loan.userProperties.lentTo"
						:is-funded="isFunded"
						:is-expired="isExpired"
						:is-selected-by-another="isSelectedByAnother"
						:is-simple-lend-button="true"
						:hide-adding-to-basket-text="true"
						:minimal-checkout-button="true"

						@click.native="trackInteraction({
							interactionType: 'addToBasket',
							interactionElement: 'Lend25'
						})"

						@add-to-basket="handleAddToBasket"
					/>
				</div>
				<div class="lend-homepage-loan-card__matching-text-container" :class="{hide: isFunded || isExpired}">
					<matching-text
						:matching-text="loan.matchingText"
						:is-funded="isFunded"
						:is-selected-by-another="isSelectedByAnother"
						:wrap="true"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvFlag from '@/components/Kv/KvFlag';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import MatchingText from '@/components/LoanCards/MatchingText';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';

export default {
	components: {
		BorrowerInfoBody,
		KvFlag,
		LoanCardImage,
		FundraisingStatus,
		ActionButton,
		MatchingText,
		BorrowerInfoName,
	},
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
		isExpired: {
			type: Boolean,
			default: false,
		},
		isFunded: {
			type: Boolean,
			default: false,
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
						country: {}
					},
					image: {}
				};
			}
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
		trackInteractionBorrowerInfoName(args) {
			this.trackInteraction({
				...args,
				interactionElement: `${args.interactionElement}HoverCard`,
			});
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

// These values have to be the same as the values in src/components/Homepage/LendByCategory/LoanCategory.vue
$card-width: rem-calc(305);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.lend-homepage-loan-card {
	margin: 1rem $card-margin 2rem $card-margin;
	background: $white;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-shrink: 0;
	width: $card-width;
	border-radius: 0.65rem;
	box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);

	&__image-wrapper {
		height: rem-calc(168);
		border-radius: 0.65rem 0.65rem 0 0;
		overflow: hidden;
		flex-shrink: 0;

		::v-deep a.borrower-image-link {
			position: relative;
			display: inline-block;
			height: rem-calc(168);
		}

		::v-deep button.favorite-star {
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

	&__data-wrapper {
		padding: rem-calc(5) 0.95rem 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: none;
	}

	&__name-row {
		display: flex;
		align-items: center;

		.kv-flag {
			margin-right: 0.95rem;
		}

		.borrower-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-top: 0.15rem;
			line-height: 1.375rem;
		}
	}

	&__borrower-info {
		text-align: left;
		margin: 0.65rem 0;
	}

	&__fundraising-status {
		margin-top: 0.45rem;

		::v-deep .left-and-to-go-line {
			text-align: left;
			font-size: 1rem;
			height: 1.25rem;
		}
	}

	&__action-row {
		display: flex;
	}

	&__action-button-container {
		width: rem-calc(150);
		flex-shrink: 0;

		&.full-width {
			width: 100%;
		}

		.action-button {
			margin: 0;
			padding: 0.75rem 1rem;
		}

		.action-button:not(.loan-funded-text):not(.loan-expired-text):not(.loan-selected-text) {
			font-size: rem-calc(20);
		}
	}

	&__matching-text-container {
		padding: 0.5rem 0 0 0.65rem;
	}
}
</style>
