<template>
	<div class="expandable-loan-card" :class="{ expanded }">
		<div class="expandable-loan-card-close show-for-small-only">
			<button @click.prevent="clearHoverLoan" class="close-button" aria-label="Close">
				<kv-icon name="small-x" />
			</button>
		</div>
		<loan-card-image
			v-if="loan.image.default"
			class="loan-card-image-component"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			:is-favorite="isFavorite"
			:loan-image-hash="loan.image.hash"
			:disable-link="disableImageLink"

			@track-loan-card-interaction="trackInteraction"
			@favorite-toggled="toggleFavorite"
		/>
		<div>
			<div class="expandable-loan-card-bottom">
				<borrower-info-header-expandable
					:country="loan.geocode.country.name"
					:activity="loan.activity.name"
					:name="loan.name"
					:loan-id="loan.id"
					:single-line="true"
					:expanded="expanded"
					class="list-loan-card-borrower-info-header"
				/>
				<fundraising-status
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:expiring-soon-message="expiringSoonMessage"
					:is-funded="loan.status==='funded'"
					:single-line="true"
				/>
				<borrower-info-body
					:amount="loan.loanAmount"
					:borrower-count="loan.borrowerCount"
					:name="loan.name"
					:status="loan.status"
					:use="loan.use"
					:loan-id="loan.id"
					:max-use-length="145"
				/>
				<action-button
					class="expandable-loan-card-action-button"
					:loan-id="loan.id"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
					:is-simple-lend-button="true"

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
import activeLoanMixin from '@/plugins/active-loan-mixin';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfoHeaderExpandable from '@/components/LoanCards/BorrowerInfo/BorrowerInfoHeaderExpandable';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';
import expandableLoanCardMixin from '@/components/LoanCards/ExpandableLoanCard/expandableLoanCardMixin';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		ActionButton,
		BorrowerInfoHeaderExpandable,
		BorrowerInfoBody,
		FundraisingStatus,
		LoanCardImage,
		MatchingText,
		KvIcon,
	},
	mixins: [
		expandableLoanCardMixin,
		activeLoanMixin,
	],
	computed: {
		disableImageLink() {
			/*
			We are using the lack of CSS hover support to gate the visibility of the arrows. That doesn't sync with
			usingTouch unfortunately.
			*/
			return !this.arrowsVisible() && !this.expanded;
		},
	},
	methods: {
		arrowsVisible() {
			/*
			We are using the lack of CSS hover support to gate the visibility of the arrows. That doesn't sync with
			usingTouch unfortunately.
			*/
			if (typeof window === 'undefined' || typeof document === 'undefined') {
				return true;
			}
			const rightArrow = document.querySelector('.arrow.right-arrow');
			if (!rightArrow) {
				return true;
			}
			return window.getComputedStyle(rightArrow).display !== 'none';
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.expandable-loan-card {
	background-color: $white;
	display: flex;
	flex-direction: column;
	height: 100%;
	width: rem-calc(254);
	margin: auto;
	transition: box-shadow linear 0.1s;

	.expandable-loan-card-close {
		display: none;
		position: relative;
		height: 46px;
		width: 100%;

		.close-button {
			width: 3rem;
			position: absolute;
			right: rem-calc(12);
			top: 1rem;
			text-align: right;

			.icon.icon-small-x {
				height: 1rem;
				width: 1rem;
				fill: $subtle-gray;
				transition: fill 0.16s linear;
			}

			&:hover {
				.icon.icon-small-x {
					fill: $charcoal;
				}
			}
		}
	}

	.expandable-loan-card-bottom {
		border: 1px solid $kiva-stroke-gray;
		border-top: none;
		padding: 0.5rem 0.75rem 0.75rem 0.75rem;
		max-height: rem-calc(100);
		transition: max-height ease-out 0.2s;
		overflow-y: hidden;

		.expandable-loan-card-action-button {
			margin-top: rem-calc(20);
		}
	}

	&.expanded {
		box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);

		.expandable-loan-card-bottom {
			max-height: rem-calc(350);
		}

		@include breakpoint(small only) {
			width: 100%;
			height: initial;

			.expandable-loan-card-close {
				display: block;
			}

			.loan-card-image-component {
				margin: 0 0.5rem;
			}
		}
	}
}
</style>
