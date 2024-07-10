<template>
	<div class="hover-loan-card-large tw-bg-primary" :class="{collapsed: !expanded}">
		<loan-card-image
			class="hover-loan-card-image"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			:use-default-styles="false"
			:disable-link="true"

			@favorite-toggled="toggleFavorite"
			@image-click="updateDetailedLoanIndex"
		/>
		<div class="hover-loan-card-data-wrap">
			<div>
				<div class="name-row">
					<kv-flag
						v-if="loan.geocode.country.isoCode"
						:country="loan.geocode.country.isoCode"
						class="flag"
					/>
					<borrower-info-name
						:name="loan.name"
						:loan-id="loan.id"
						class="name tw-text-h3"
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
				class="hover-borrower-info-body tw-text-small tw-font-book"
				:use="loan.fullLoanUse"
				:loan-id="loan.id"
				:max-use-length="100"
				:disable-link="true"
				read-more-link-text="Expand to learn more"
				@read-more-link="updateDetailedLoanIndex"
				@track-loan-card-interaction="trackInteraction"
			/>
			<div class="tw-gap-1 tw-flex tw-w-full">
				<action-button
					class="tw-py-1 tw-px-0 tw-m-0 tw-w-2/4 tw-shrink-0"
					:loan-id="loan.id"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-expired="isExpired"
					:is-selected-by-another="isSelectedByAnother"
					:is-simple-lend-button="true"
					:minimal-checkout-button="true"
					:is-amount-lend-button="lessThan25"
					:amount-left="amountLeft"
					@click.native="trackInteraction({
						interactionType: 'addToBasket',
						interactionElement: 'Lend25'
					})"

					@add-to-basket="handleAddToBasket"
				/>
				<div v-if="!isMatchAtRisk" class="tw-mt-1" :class="{hide: isFunded || isExpired}">
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
import KvFlag from '@/components/Kv/KvFlag';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import hoverLoanCardMixin from '@/components/LoanCards/HoverLoanCard/hoverLoanCardMixin';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import MatchingText from '@/components/LoanCards/MatchingText';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';
import BorrowerInfoBody from '../BorrowerInfo/BorrowerInfoBody';

export default {
	name: 'HoverLoanCardLarge',
	components: {
		BorrowerInfoBody,
		KvFlag,
		LoanCardImage,
		FundraisingStatus,
		ActionButton,
		MatchingText,
		BorrowerInfoName,
	},
	inject: ['apollo'],
	mixins: [
		hoverLoanCardMixin,
	],
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
		expanded: {
			type: Boolean,
			default: false,
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		isMatchAtRisk: {
			type: Boolean,
			default: false
		},
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
		updateDetailedLoanIndex() {
			this.$emit('update-detailed-loan-index');
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
	position: absolute;
	top: $hover-card-large-top-shift;
	left: $hover-card-large-left-shift;
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
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				/* Next line prevents a weird visual bug on chrome */
				margin-top: rem-calc(1);
			}
		}

		.flag {
			width: rem-calc(20);
			margin-right: 0.25rem;
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
</style>
