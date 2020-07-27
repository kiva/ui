<template>
	<div
		class="hover-loan-card"
		:class="{
			'row-has-detailed-loan': rowHasDetailedLoan,
			'is-detailed': isDetailed,
		}"
	>
		<div
			class="hover-loan-card-wrapper"
		>
			<div class="hover-loan-card-large">
				<loan-card-image
					class="hover-loan-card-image"
					:loan-id="loan.id"
					:name="loan.name"
					:retina-image-url="loan.image.retina"
					:standard-image-url="loan.image.default"
					:is-visitor="isVisitor"
					:use-default-styles="false"
				/>
				<div class="hover-loan-card-data-wrap">
					<div>
						<div class="name-row">
							<kv-flag
								v-if="loan.geocode.country.isoCode"
								:country="loan.geocode.country.isoCode" :width="20"
							/>
							<borrower-info-name
								:name="loan.name"
								:loan-id="loan.id"
								class="name"
								@track-loan-card-interaction="trackInteractionBorrowerInfoName"
							/>
						</div>
						<fundraising-status
							:amount-left="amountLeft"
							:percent-raised="percentRaised"
							:expiring-soon-message="expiringSoonMessage"
							:is-funded="isFunded"
							:left-and-to-go-on-top="true"
							:short-meter="true"
						/>
					</div>
					<borrower-info-body
						class="hover-borrower-info-body"
						:amount="loan.loanAmount"
						:borrower-count="loan.borrowerCount"
						:name="loan.name"
						:status="loan.status"
						:use="loan.use"
						:loan-id="loan.id"
						:max-use-length="73"
						read-more-link-text="Learn more"
						@track-loan-card-interaction="trackInteraction"
					/>
					<div class="action-row">
						<div class="action-button-container" :class="{'full-width': isFunded || isExpired}">
							<action-button
								class="hover-loan-card-action-button"
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
						<div class="matching-text-container" :class="{hide: isFunded || isExpired}">
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
		</div>
	</div>
</template>

<script>
import hoverLoanCardMixin from '@/components/LoanCards/HoverLoanCard/hoverLoanCardMixin';
import categoryRowArrowsVisibleMixin from '@/plugins/category-row-arrows-visible-mixin';
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
		expiringSoonMessage: {
			type: String,
			default: ''
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		cardNumber: {
			type: Number,
			default: null,
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
		preventUpdatingDetailedCard: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		expanded() {
			return true;
			// return !this.rowHasDetailedLoan && this.hover;
		},
		hover() {
			return this.loanIndex === this.hoverLoanIndex;
		},
		isDetailed() {
			return this.loanIndex === this.detailedLoanIndex;
		},
		loanIndex() {
			return this.cardNumber - 1;
		},
		rowHasDetailedLoan() {
			return this.detailedLoanIndex !== null;
		},
		rowHasHoverLoan() {
			return this.hoverLoanIndex !== null;
		},
	},
	mixins: [
		hoverLoanCardMixin,
		categoryRowArrowsVisibleMixin,
	],
	methods: {
		hoverEffectActive() {
			const windowWidth = document.documentElement.clientWidth;
			const arrowsVisible = this.categoryRowArrowsVisible();

			return (arrowsVisible && windowWidth >= 800) || (!arrowsVisible && windowWidth >= 768);
		},
		updateHoverLoanIndex() {
			this.$emit('update-hover-loan-index', this.loanIndex);
			this.trackInteraction({
				interactionType: 'hover-expand',
				interactionElement: 'hover-card'
			});
		},
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
	},
};
</script>

<style lang="scss" scoped>
@import "settings";
@import "components/loan-cards/hover-loan-card";

.hover-loan-card-large {
	@extend .base-portrait-hover-loan-card;

	width: $large-hover-card-width;
	height: $large-hover-card-height;
	// transition: $hover-card-transition-transform, $hover-card-transition-opacity-out;
	transition: $hover-card-transition-transform, $hover-card-transition-opacity-out;
	z-index: 1;

	.hover-loan-card-image {
		@extend .base-portrait-hover-loan-card-image;

		height: $large-hover-card-image-height;
	}

	.hover-loan-card-data-wrap {
		@extend .base-portrait-hover-loan-card-data-wrap;

		height: $large-hover-card-data-height;
		padding: rem-calc(5) 1rem 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.name-row {
			display: flex;
			align-items: center;

			.name {
				font-size: rem-calc(20);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-weight: 500;

				/* Next line prevents a weird visual bug on chrome */
				margin-top: rem-calc(1);
			}
		}

		.hover-borrower-info-body {
			font-size: rem-calc(14);
			line-height: rem-calc(18);
		}

		.action-row {
			display: flex;

			.action-button-container {
				width: rem-calc(126);
				flex-shrink: 0;

				.hover-loan-card-action-button {
					margin: 0;
					font-size: rem-calc(18);
					padding: 0.5rem 1.5rem;

					&.loan-funded-text,
					&.loan-expired-text {
						font-size: 0.875rem;
					}
				}

				&.full-width {
					width: 100%;
				}
			}

			.matching-text-container {
				padding-left: 1rem;
			}
		}
	}

	&.collapsed {
		opacity: 0;
		pointer-events: none;
		transform: scale($width-ratio-small-to-large, $height-ratio-small-to-large);
		// transition: $hover-card-transition-transform, $hover-card-transition-opacity-in;
		transition: $hover-card-transition-transform, $hover-card-transition-opacity-in;

		.hover-loan-card-image {
			transform: scale(1, $large-hover-card-image-scale-y);
		}
	}
}

.hover-loan-card {
	padding: 0 rem-calc($hover-card-right-margin) 0 rem-calc($hover-card-right-margin);

	$transition1: padding-bottom $card-expansion-duration $card-expansion-curve;

	transition: $transition1, $hover-card-transition-transform;

	.hover-loan-card-wrapper {
		position: relative;
		transition: $hover-card-transition-opacity-out;

		.more-details-wrapper {
			position: absolute;
			bottom: rem-calc(-118);
			left: 50%;
			cursor: pointer;
			opacity: 0;
			transform: translate(-50%, rem-calc(-10));
			transition: opacity $chevron-animation-out, transform $chevron-animation-out;
			pointer-events: none;

			.more-details-arrow {
				stroke: $blue;
				width: rem-calc(30);
				height: rem-calc(12);
			}
		}
	}

	&.shift-left {
		transform: translateX(-$hover-card-width-difference / 2);
	}

	&.shift-left-double {
		transform: translateX(-$hover-card-width-difference);
	}

	&.shift-right {
		transform: translateX($hover-card-width-difference / 2);
	}

	&.shift-right-double {
		transform: translateX($hover-card-width-difference);
	}

	&.expanded {
		z-index: 1;

		.hover-loan-card-wrapper {
			.more-details-wrapper {
				opacity: 1;
				transform: translate(-50%, 0);
				pointer-events: initial;

				$transition1: opacity $chevron-animation-in;
				$transition2: transform $chevron-animation-in;

				transition: $transition1, $transition2;
			}
		}
	}

	&.row-has-detailed-loan {
		padding-bottom: rem-calc(9);

		.hover-loan-card-wrapper {
			opacity: 0.4;
		}

		&.is-detailed {
			.hover-loan-card-wrapper {
				opacity: 1;
			}
		}
	}

	&:first-of-type {
		padding-left: 0;
	}
}
</style>
