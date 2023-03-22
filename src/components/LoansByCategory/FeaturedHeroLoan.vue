<template>
	<div class="featured-row-wrapper">
		<div class="featured-cards-display-window">
			<div class="grid-loan-card tw-bg-primary tw-border tw-border-tertiary">
				<div class="row featured-hero-loan">
					<div class="column small-12 large-6">
						<loan-card-image
							:loan-id="loan.id"
							:name="loan.name"
							:retina-image-url="loan.image.retina"
							:standard-image-url="loan.image.default"
							:is-visitor="isVisitor"
							:is-favorite="loan.userProperties.favorited"
							@track-loan-card-interaction="trackInteraction"
							@favorite-toggled="toggleFavorite"
						/>
					</div>
					<div class="column small-12 large-6">
						<div class="borrower-info-wrapper">
							<borrower-info-name :name="loan.name" :loan-id="loan.id" class="name tw-text-h3" />
							<div class="country tw-text-secondary tw-font-medium">
								<!-- eslint-disable-next-line max-len -->
								{{ loan.geocode.country.name }} <span v-if="loan.activity.name">/ {{ loan.activity.name }}</span>
							</div>

							<div class="use">
								<span>{{ loanUse }}</span>
								<div v-if="showReadMore">
									<!-- eslint-disable-next-line max-len -->
									<router-link :to="`/lend/${loan.id}`" v-kv-track-event="['Lending', 'click-Read more', 'Read more', loan.id, loan.id]">
										<div
											@click="$emit('track-interaction', {
												interactionType: 'viewBorrowerPage',
												interactionElement: 'readMore'
											})"
										>
											Read more
										</div>
									</router-link>
								</div>
							</div>

							<div class="fundraising-thermometer-wrapper">
								<div class="fundraising-thermometer">
									<fundraising-status
										:amount-left="amountLeft"
										:expiring-soon-message="expiringSoonMessage"
										:is-expiring-soon="false"
										:is-funded="false"
										:percent-raised="percentRaised"
										:single-line="false"
									/>
								</div>
							</div>

							<div class="action">
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
									:enable-five-dollars-notes="enableFiveDollarsNotes"
									@click.native="trackInteraction({
										interactionType: 'addToBasket',
										interactionElement: 'Lend25'
									})"
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
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus/FundraisingStatus';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';

export default {
	name: 'FeaturedHeroLoan',
	components: {
		ActionButton,
		FundraisingStatus,
		LoanCardImage,
		MatchingText,
		BorrowerInfoName,
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
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			featuredCategoryIds: null,
			loanUseMaxLength: 100,
		};
	},
	computed: {
		loanUse() {
			const use = this.loan?.fullLoanUse ?? '';
			return use.length > this.loanUseMaxLength ? `${use.slice(0, this.loanUseMaxLength)}...` : use;
		},
		showReadMore() {
			return !!(this.loanUse.length > this.loanUseMaxLength);
		},
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
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$row-max-width: 58.75rem;

.featured-row-wrapper {
	align-items: center;
	display: flex;
	justify-content: center;
	margin: 0 auto;
	max-width: $row-max-width;
	position: relative;

	.featured-cards-display-window {
		&:hover {
			box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
		}

		overflow: hidden;
		width: 100%;
		z-index: 10;

		.grid-loan-card {
			.featured-hero-loan {
				height: 100%;
				margin: rem-calc(20);
				width: inherit;

				.column {
					padding-left: 0;

					@include breakpoint(small only) {
						padding-right: 0;
					}
				}

				.borrower-info-wrapper {
					flex-grow: 1;
					padding: 0 rem-calc(20);
					text-align: left;
					margin-top: 0;

					@include breakpoint(medium down) {
						padding: 0;
					}

					@include breakpoint(small only) {
						margin-top: rem-calc(20);
					}

					.name {
						@include breakpoint(medium down) {
							margin-top: rem-calc(10);
							text-align: center;
						}
					}

					.country {
						@include breakpoint(medium down) {
							text-align: center;
						}
					}

					.use,
					.fundraising-thermometer-wrapper {
						margin-top: rem-calc(20);
						margin-bottom: rem-calc(20);

						.fundraising-thermometer {
							text-align: center;
						}
					}

					.action {
						text-align: center;

						@include breakpoint(medium up) {
							max-width: rem-calc(330);
						}

						@include breakpoint(large) {
							text-align: left;
						}
					}
				}
			}
		}
	}
}
</style>
