<template>
	<div class="hover-loan-card-large" :class="{collapsed: !hover}">
		<loan-card-image
			class="hover-loan-card-image"
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			:use-default-styles="false"

			@track-loan-card-interaction="trackInteraction"
			@favorite-toggled="toggleFavorite"
		/>
		<div class="hover-loan-card-data-wrap">
			<div>
				<div class="name-row">
					<kv-flag v-if="loan.geocode.country.isoCode" :country="loan.geocode.country.isoCode" :width="20" />
					<router-link
						:to="`/lend/${loan.id}`"
						class="name"
						v-kv-track-event="['Lending', 'click-Read more', 'Name', loan.id, 'true']"
						v-if="loan.name"
					>
						<span
							@click="$emit('track-loan-card-interaction', {
								interactionType: 'viewBorrowerPage',
								interactionElement: 'borrowerName'
							})"
						>
							{{ loan.name }}
						</span>
					</router-link>
				</div>
				<borrower-info-body
					class="hover-borrower-info-body"
					:amount="loan.loanAmount"
					:borrower-count="loan.borrowerCount"
					:name="loan.name"
					:status="loan.status"
					:use="loan.use"
					:loan-id="loan.id"
					:max-use-length="90"
					read-more-link-text="Read full details"
				/>
			</div>
			<div>
				<fundraising-status
					class="fundraising-status"
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:expiring-soon-message="expiringSoonMessage"
					:is-funded="loan.status==='funded'"
					:left-and-to-go-on-top="true"
					:short-meter="true"
				/>
				<action-button
					class="hover-loan-card-action-button"
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
import KvFlag from '@/components/Kv/KvFlag';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import hoverLoanCardMixin from '@/components/LoanCards/HoverLoanCard/hoverLoanCardMixin';
import BorrowerInfoBody from '../BorrowerInfo/BorrowerInfoBody';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import MatchingText from '@/components/LoanCards/MatchingText';

export default {
	components: {
		BorrowerInfoBody,
		KvFlag,
		LoanCardImage,
		FundraisingStatus,
		ActionButton,
		MatchingText,
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
		hover: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
	},
};
</script>
<style lang="scss" scoped>
@import "settings";

.hover-loan-card-large {
	background: $white;
	flex-shrink: 0;
	transition: transform 0.15s linear, opacity 0.15s linear;
	width: rem-calc(580);
	height: rem-calc(250);
	display: flex;
	justify-content: space-between;
	position: absolute;
	top: calc(-100% / 18);
	left: calc(-2000% / 18);
	border-radius: rem-calc(3);
	transform: scale(1, 1);
	opacity: 1;
	z-index: 1;

	.hover-loan-card-image {
		/* Design width: 332px */
		width: rem-calc(335.17);
		height: rem-calc(250);
		border-radius: rem-calc(3) 0 0 rem-calc(3);
		overflow: hidden;
	}

	.hover-loan-card-data-wrap {
		/* Design width: 248px */
		width: rem-calc(244.83);
		height: rem-calc(250);
		padding: 0.5rem 1rem;
		margin-bottom: 0.75rem;
		border: 1px solid $kiva-stroke-gray;
		border-radius: 0 rem-calc(3) rem-calc(3) 0;
		border-left: none;
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
			}
		}

		.hover-borrower-info-body {
			font-size: rem-calc(14);
			line-height: rem-calc(18);
		}

		.fundraising-status {
			margin-bottom: rem-calc(14);
		}

		.hover-loan-card-action-button {
			margin: 0;
		}
	}

	&.collapsed {
		transform: scale(calc(9 / 29), 0.9);
		opacity: 0;
		pointer-events: none;
	}
}
</style>
