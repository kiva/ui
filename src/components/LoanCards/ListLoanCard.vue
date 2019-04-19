<template>
	<div class="list-loan-card row">
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
							:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
							:loan-image-hash="loan.image.hash"

							@track-loan-card-interaction="trackInteraction"
							@favorite-toggled="toggleFavorite"
						/>
					</div>
				</div>
				<div class="small-12 columns">
					<div class="list-loan-card-desktop-column-text-wrapper row">
						<div class="large-12 xxlarge-7 columns">
							<div class="list-loan-card-desktop-column-title">Field Partner</div>
							<div class="list-loan-card-desktop-column-content">{{ loan.partnerName }}</div>
						</div>
						<div class="large-12 xxlarge-5 columns">
							<div class="list-loan-card-desktop-column-title">Loan Length</div>
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
						:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
						:loan-image-hash="loan.image.hash"
						class="list-loan-card-mobile-borrower-image"

						@track-loan-card-interaction="trackInteraction"
						@favorite-toggled="toggleFavorite"
					/>
				</div>
				<div class="small-7 medium-8 large-5 xlarge-6 xxlarge-7 columns">
					<borrower-info-header
						:country="loan.geocode.country.name"
						:name="loan.name"
						:loan-id="loan.id"
						class="list-loan-card-borrower-info-header"
					/>
				</div>
				<div class="large-7 xlarge-6 xxlarge-5 columns show-for-large">
					<action-button
						:loan-id="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:is-lent-to="loan.userProperties.lentTo"
						:is-funded="isFunded"
						:is-selected-by-another="isSelectedByAnother"
						:is-expired="isExpired"
						class="list-loan-card-action-button"

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
						:is-expired="isExpired"
					/>
				</div>
			</div>
			<div class="list-loan-card-body-info row">
				<borrower-info-body
					:amount="loan.loanAmount"
					:borrower-count="loan.borrowerCount"
					:name="loan.name"
					:status="loan.status"
					:use="loan.use"
					:loan-id="loan.id"
					class="small-12 columns"
				/>
				<!-- eslint-disable-next-line -->
				<div class="fundraising-wrapper small-12 medium-10 medium-offset-1 large-8 large-offset-0 xlarge-6 xxlarge-7 columns">
					<fundraising-status
						v-if="!isExpired"
						:amount-left="amountLeft"
						:percent-raised="percentRaised"
						:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
						:expiring-soon-message="expiringSoonMessage"
						:is-funded="isFunded"
					/>
				</div>
			</div>
			<div class="row hide-for-large">
				<div class="small-12 medium-8 medium-offset-2 columns">
					<action-button
						:loan-id="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:is-lent-to="loan.userProperties.lentTo"
						:is-funded="isFunded"
						:is-selected-by-another="isSelectedByAnother"
						:is-expired="isExpired"
						class="list-loan-card-action-button"

						@click.native="trackInteraction({
							interactionType: 'addToBasket',
							interactionElement: 'Lend25'
						})"
					/>
					<div class="small-12 columns">
						<matching-text
							:matching-text="loan.matchingText"
							:is-funded="isFunded"
							:is-selected-by-another="isSelectedByAnother"
							:is-expired="isExpired"
						/>
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
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import MatchingText from '@/components/LoanCards/MatchingText';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';

export default {
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
		imageEnhancementExperimentVersion: {
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
	margin-top: 1rem;
	margin-bottom: 1rem;

	.list-loan-card-desktop-column {
		padding: 0;
		background: $tab-pill-background;

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

			.list-loan-card-action-button {
				margin-top: rem-calc(20);
				margin-bottom: 0;
			}
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

			.list-loan-card-body-info {
				margin-top: 0;
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
