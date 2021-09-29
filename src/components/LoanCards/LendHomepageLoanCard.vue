<template>
	<div class="lend-homepage-loan-card">
		<loan-card-image
			class="lend-homepage-loan-card__image-wrapper"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:disable-link="disableRedirects"
			:is-visitor="isVisitor"
			:is-favorite="isFavorite"
			:use-default-styles="false"
			@favorite-toggled="toggleFavorite"
			@image-click="$emit('image-click', {loanId: loan.id})"
			@track-loan-card-interaction="trackInteractionBorrowerInfoName"
		/>
		<div class="lend-homepage-loan-card__data-wrapper">
			<div class="lend-homepage-loan-card__name-row">
				<kv-flag
					v-if="loan.geocode.country.isoCode"
					:country="loan.geocode.country.isoCode"
					class="lend-homepage-loan-card__flag"
				/>
				<borrower-info-name
					:disable-link="disableRedirects"
					:name="loan.name"
					:loan-id="loan.id"
					class="borrower-name"
					@name-click="$emit('name-click', {loanId: loan.id})"
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
				:disable-link="disableRedirects"
				:name="loan.name"
				:status="loan.status"
				:use="loan.use"
				:loan-id="loan.id"
				:max-use-length="59"
				read-more-link-text="Learn more"
				@read-more-link="$emit('read-more-link', {loanId: loan.id})"
				@track-loan-card-interaction="trackInteraction"
			/>
			<div class="lend-homepage-loan-card__action-row">
				<div
					class="lend-homepage-loan-card__action-button-container"
					:class="{'full-width': isFunded || isExpired}"
				>
					<kv-button
						v-if="showViewLoanCta"
						class="action-button"
						:to="`/lend/${loan.id}`"
						v-kv-track-event="[
							'Lending',
							'click-Read more',
							'View loan',
							loan.id
						]"
					>
						View loan
					</kv-button>
					<action-button
						v-else
						class="action-button"
						:disable-redirects="disableRedirects"
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
						:match-ratio="loan.matchRatio"
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
import KvButton from '@/components/Kv/KvButton';
import KvFlag from '@/components/Kv/KvFlag';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import MatchingText from '@/components/LoanCards/MatchingText';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';

/**
 * LendHomepageLoanCard
 * Should be used with a drop shadow or distinction for the border.
 * To some extent this component is responsive, as long as the max
 * width is set to the effective width of the loan image
 */
export default {
	components: {
		BorrowerInfoBody,
		KvFlag,
		LoanCardImage,
		FundraisingStatus,
		ActionButton,
		KvButton,
		MatchingText,
		BorrowerInfoName,
	},
	props: {
		amountLeft: {
			type: Number,
			default: 0,
		},
		disableRedirects: {
			type: Boolean,
			default: false,
		},
		expiringSoonMessage: {
			type: String,
			default: ''
		},
		showViewLoanCta: {
			type: Boolean,
			default: false,
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

.lend-homepage-loan-card {
	background: $white;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	height: fit-content;
	border-radius: 0.65rem;

	&__image-wrapper {
		border-radius: 0.65rem 0.65rem 0 0;
		overflow: hidden;
		flex-shrink: 0;
		height: 0;
		padding-bottom: 75%;

		::v-deep a.borrower-image-link {
			position: relative;
			display: block;
			height: 100%;

			.borrower-image {
				width: 100%;
				max-width: none;
				height: auto;
			}
		}

		::v-deep button.favorite-star {
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

	&__data-wrapper {
		padding: rem-calc(7) 0.95rem 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: none;
	}

	&__name-row {
		display: flex;
		align-items: center;

		.borrower-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-top: 0.15rem;
			line-height: 1.375rem;
		}
	}

	&__flag {
		width: rem-calc(30);
		flex-shrink: 0;
		margin-right: 0.95rem;
	}

	&__borrower-info {
		text-align: left;
		margin: 0.65rem 0;
		min-height: rem-calc(66);
	}

	&__fundraising-status {
		margin-top: 0.45rem;

		::v-deep .left-and-to-go-line {
			text-align: left;
			font-size: 1rem;
			height: 1.25rem;
			margin-bottom: 0.15rem;
		}
	}

	&__action-row {
		display: flex;
		flex-wrap: wrap;
	}

	&__action-button-container {
		width: rem-calc(150);
		flex-grow: 1;

		&.full-width {
			width: 100%;
		}

		.button.action-button {
			margin: 0;
			padding: 0.95rem 1rem;
			width: 100%;
		}

		.action-button:not(.loan-funded-text):not(.loan-expired-text):not(.loan-selected-text) {
			font-size: rem-calc(20);
		}
	}

	&__matching-text-container {
		flex-grow: 1;
		padding: 0 0 0 0.65rem;
		text-align: center;
		width: rem-calc(110);
	}
}
</style>
