<template>
	<div class="featured-row-wrapper">
		<div class="featured-cards-display-window">
			<div class="grid-loan-card">
				<div class="row featured-hero-loan">
					<div class="column small-12 large-6">
						<loan-card-image
							:loan-id="loan.id"
							:name="loan.name"
							:retina-image-url="loan.image.retina"
							:standard-image-url="loan.image.default"
							:is-visitor="isVisitor"
							:is-favorite="loan.userProperties.favorited"
							:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
							:loan-image-hash="loan.image.hash"

							@track-loan-card-interaction="trackInteraction"
							@favorite-toggled="toggleFavorite"
						/>
					</div>
					<div class="column small-12 large-6">
						<div class="borrower-info-wrapper">
							<div class="name">
								<router-link
									:to="`/lend/${loan.id}`"
									v-kv-track-event="['Lending', 'click-Read more', 'Name', loan.id, 'true']">
									<span
										@click="$emit('track-interaction', {
											interactionType: 'viewBorrowerPage',
											interactionElement: 'borrowerName'
										})"
									>{{ loan.name }}</span>
								</router-link>
							</div>

							<div class="country">
								<!-- eslint-disable-next-line max-len -->
								{{ loan.geocode.country.name }} <span v-if="loan.activity.name">/ {{ loan.activity.name }}</span>
							</div>

							<div class="use">
								{{ loanUse }}

								<div v-if="showReadMore">
									<!-- eslint-disable-next-line max-len -->
									<router-link :to="`/lend/${loan.id}`" v-kv-track-event="['Lending', 'click-Read more', 'Read more', loan.id, 'true']">
										<div
											@click="$emit('track-interaction', {
												interactionType: 'viewBorrowerPage',
												interactionElement: 'readMore'
											})"
										>Read more</div>
									</router-link>
								</div>
							</div>

							<div class="why-special">
								<div v-if="showFundraisingThermometer" class="fundraising-thermometer">
									<fundraising-status
										:amount-left="amountLeft"
										:is-expiring-soon="false"
										:is-funded="false"
										:percent-raised="percentRaised"
										:single-line="true"
									/>
								</div>
								<div v-else>
									<div class="bold">This loan is special because:</div>
									{{ loan.whySpecial }}
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
									:lend-increment-button-version="lendIncrementButtonVersion"

									@click.native="trackInteraction({
										interactionType: 'addToBasket',
										interactionElement: 'Lend25'
									})"
								/>

								<matching-text
									:matching-text="loan.matchingText"
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
import numeral from 'numeral';

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
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
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
		lendIncrementButtonVersion: {
			type: String,
			default: ''
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
	},
	data() {
		return {
			featuredCategoryIds: null,
			loanUseMaxLength: 100,
			showFundraisingThermometer: false,
		};
	},
	computed: {
		borrowerCountLanguage() {
			if (this.loan.borrowerCount > 1) {
				return ' a member ';
			}
			return ' ';
		},
		helpedLanguage() {
			if (this.loan.status === 'fundraising'
			|| this.loan.status === 'inactive'
			|| this.loan.status === 'reviewed') {
				return 'helps';
			}
			return 'helped';
		},
		loanUse() {
			// eslint-disable-next-line max-len
			return `A loan of ${numeral(this.loan.loanAmount).format('$0,0')} ${this.helpedLanguage} ${this.borrowerCountLanguage} ${this.loanUseTruncated()}`;
		},
		showReadMore() {
			return !!(this.loanUse.length > this.loanUseMaxLength);
		},
	},
	methods: {
		loanUseTruncated() {
			const lowerCaseUse = this.loan.use.toString().charAt(0).toLowerCase() + this.loan.use.toString().slice(1);

			// eslint-disable-next-line max-len
			const convertedUse = (this.loan.use.substring(0, this.loan.name.length) === this.loan.name) ? this.loan.use : lowerCaseUse;

			if (this.loan.use.length === 0) {
				return 'For the borrower\'s privacy, this loan has been made anonymous.';
			} else if (this.loan.use.length > this.loanUseMaxLength) {
				return `${convertedUse.substring(0, this.loanUseMaxLength)}...`;
			}

			return convertedUse;
		},
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
	created() {
		// CASH-684 : Experiment : Featured hero loan fundraising thermometer
		this.experimentVersion = this.experimentData.featured_hero_loan_fundraising_thermometer;

		if (this.experimentVersion === 'variant-a') {
			this.$kvTrackEvent('Lending', 'EXP-CASH-684-Mar2019', 'a');
			this.showFundraisingThermometer = false;
		} else if (this.experimentVersion === 'variant-b') {
			this.$kvTrackEvent('Lending', 'EXP-CASH-684-Mar2019', 'b');
			this.showFundraisingThermometer = true;
		}
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
			background-color: $white;
			border: 1px solid $kiva-stroke-gray;

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
					line-height: rem-calc(22);
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
						font-size: rem-calc(22);
						font-weight: $global-weight-highlight;
						line-height: rem-calc(27);

						@include breakpoint(medium down) {
							margin-top: rem-calc(10);
							text-align: center;
						}
					}

					.country {
						color: $kiva-text-light;
						font-weight: $global-weight-highlight;

						@include breakpoint(medium down) {
							text-align: center;
						}
					}

					.use,
					.why-special {
						margin-top: rem-calc(20);
						margin-bottom: rem-calc(20);
					}

					.why-special .bold {
						font-weight: $global-weight-bold;
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
