<template>
	<div class="row list-loan-card tw-overflow-hidden" :class="{ 'tw-rounded': roundedCorners }">
		<div class="list-loan-card-desktop-column show-for-large large-4 xlarge-4 columns">
			<div class="list-loan-card-desktop-column-container row">
				<div class="small-12 columns">
					<div class="list-loan-card-desktop-column-image-wrapper">
						<loan-card-image
							:loan-id="loan.id"
							:name="loan.name"
							:retina-image-url="loan.image.retina"
							:standard-image-url="loan.image.default"
							:is-visitor="isVisitor"
							:is-favorite="isFavorite"
							:class="{ 'tw-rounded-tl': roundedCorners }"

							@track-loan-card-interaction="trackInteraction"
							@favorite-toggled="toggleFavorite"
						/>
					</div>
				</div>
				<div class="small-12 columns">
					<div class="list-loan-card-desktop-column-text-wrapper row">
						<div class="large-12 xxlarge-7 columns" v-if="loan.partnerName">
							<div class="list-loan-card-desktop-column-title">
								Field Partner
							</div>
							<div class="list-loan-card-desktop-column-content">
								{{ loan.partnerName }}
							</div>
						</div>
						<div class="large-12 xxlarge-5 columns">
							<div class="list-loan-card-desktop-column-title">
								Loan Length
							</div>
							<div class="list-loan-card-desktop-column-content">
								{{ loan.lenderRepaymentTerm }} months
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="list-loan-card-body small-12 large-8 xlarge-8 columns">
			<div class="list-loan-card-body-header row align-middle">
				<div class="small-5 medium-4 columns hide-for-large">
					<loan-card-image
						:loan-id="loan.id"
						:name="loan.name"
						:retina-image-url="loan.image.retina"
						:standard-image-url="loan.image.default"
						:is-visitor="isVisitor"
						:is-favorite="isFavorite"
						class="list-loan-card-mobile-borrower-image"
						:class="{ 'tw-rounded': roundedCorners }"

						@track-loan-card-interaction="trackInteraction"
						@favorite-toggled="toggleFavorite"
					/>
				</div>
				<div class="small-7 medium-8 large-5 columns">
					<borrower-info-header
						:country="loan.geocode.country.name"
						:name="loan.name"
						:loan-id="loan.id"
						class="list-loan-card-borrower-info-header"
						@track-loan-card-interaction="trackInteraction"
					/>
				</div>
				<div class="large-7 columns show-for-large tw-py-1">
					<action-button
						:loan-id="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:is-lent-to="loan.userProperties.lentTo"
						:is-funded="isFunded"
						:is-selected-by-another="isSelectedByAnother"
						:is-expired="isExpired"
						:is-amount-lend-button="lessThan25"
						:amount-left="amountLeft"
						:show-now="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						class="tw-mt-0 tw-w-full"
						@click.native="trackInteraction({
							interactionType: 'addToBasket',
							interactionElement: 'Lend25'
						})"

						@add-to-basket="$emit('add-to-basket', $event)"
					/>
					<div v-if="loan.matchingText && !isFunded && !isMatchAtRisk" class="list-loan-card-matching-text">
						<matching-text
							:matching-text="loan.matchingText"
							:match-ratio="loan.matchRatio"
							:is-funded="isFunded"
							:is-selected-by-another="isSelectedByAnother"
							:is-expired="isExpired"
						/>
					</div>
				</div>
			</div>
			<div class="list-loan-card-body-info row">
				<borrower-info-body
					:use="loan.fullLoanUse"
					:loan-id="loan.id"
					class="small-12 columns"
					@track-loan-card-interaction="trackInteraction"
				/>
				<!-- eslint-disable max-len -->
				<div
					class="fundraising-wrapper small-12 medium-10 medium-offset-1 large-8 large-offset-0 xlarge-6 xxlarge-7 columns"
					v-if="!isExpired"
				>
					<!-- eslint-enable max-len -->
					<fundraising-status
						:amount-left="amountLeft"
						:percent-raised="percentRaised"
						:expiring-soon-message="expiringSoonMessage"
						:is-funded="isFunded"
					/>
				</div>
			</div>
			<div class="row hide-for-large">
				<div class="small-12 medium-8 medium-offset-2 columns tw-py-1">
					<action-button
						:loan-id="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:is-lent-to="loan.userProperties.lentTo"
						:is-funded="isFunded"
						:is-selected-by-another="isSelectedByAnother"
						:is-expired="isExpired"
						:is-amount-lend-button="lessThan25"
						:amount-left="amountLeft"
						:show-now="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						class="tw-mt-0 tw-w-full"

						@click.native="trackInteraction({
							interactionType: 'addToBasket',
							interactionElement: 'Lend25'
						})"
					/>
					<div v-if="!isMatchAtRisk" class="small-12 columns">
						<div v-if="loan.matchingText && !isFunded" class="list-loan-card-matching-text">
							<matching-text
								:matching-text="loan.matchingText"
								:match-ratio="loan.matchRatio"
								:is-funded="isFunded"
								:is-selected-by-another="isSelectedByAnother"
								:is-expired="isExpired"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfoHeader from '@/components/LoanCards/BorrowerInfo/BorrowerInfoHeader';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import MatchingText from '@/components/LoanCards/MatchingText';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';

export default {
	name: 'ListLoanCard',
	components: {
		LoanCardImage,
		FundraisingStatus,
		MatchingText,
		ActionButton,
		BorrowerInfoHeader,
		BorrowerInfoBody,
	},
	props: {
		isVisitor: {
			type: Boolean,
			default: true
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
		title: {
			type: String,
			default: ''
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
		isFunded: {
			type: Boolean,
			default: false,
		},
		isMatchAtRisk: {
			type: Boolean,
			default: false
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false,
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		amountLeft: {
			type: Number,
			default: 0,
		},
		expiringSoonMessage: {
			type: String,
			default: '',
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
		roundedCorners: {
			type: Boolean,
			default: false
		},
		enableFiveDollarsNotes: {
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
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.list-loan-card {
	background-color: $white;
	border: 1px solid $kiva-stroke-gray;
	transition: box-shadow 0.15s linear;

	.list-loan-card-desktop-column {
		padding: 0;
		background: $platinum;

		.list-loan-card-desktop-column-container {
			height: 100%;

			.list-loan-card-desktop-column-text-wrapper {
				margin: 0;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
				font-size: rem-calc(14);

				.list-loan-card-desktop-column-title {
					float: left;
					font-weight: 500;
					color: $gray;
					margin-right: 0.25rem;
				}

				.list-loan-card-desktop-column-content {
					float: left;
				}
			}
		}
	}

	.list-loan-card-body {
		.list-loan-card-body-header {
			.list-loan-card-mobile-borrower-image,
			.list-loan-card-borrower-info-header {
				margin: 0.5rem 0;
			}

			.list-loan-card-borrower-info-header {
				overflow: hidden;
				text-overflow: ellipsis;

				.country {
					margin-bottom: 0;
				}
			}
		}

		.list-loan-card-matching-text {
			text-align: center;
			margin: 0.4rem 0 0.5rem;
		}

		.list-loan-card-body-info {
			margin-top: 1rem;

			.fundraising-wrapper {
				margin-top: 1.5rem;

				.left-and-to-go-line {
					text-align: center;
				}
			}
		}
	}

	&.row {
		margin: 1rem 0;
	}

	&:hover {
		box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
	}

	@include breakpoint(large) {
		.list-loan-card-body {
			margin-bottom: 1rem;

			.list-loan-card-body-header {
				.list-loan-card-borrower-info-header {
					margin: 1rem 0;
				}
			}

			.list-loan-card-matching-text {
				margin: 0.4rem 0 0;
			}

			.list-loan-card-body-info {
				margin-top: 0.5rem;
			}
		}
	}

	@include breakpoint(xxlarge) {
		.list-loan-card-desktop-column {
			.list-loan-card-desktop-column-text-wrapper {
				.list-loan-card-desktop-column-title,
				.list-loan-card-desktop-column-content {
					float: none;
				}
			}
		}
	}
}
</style>
