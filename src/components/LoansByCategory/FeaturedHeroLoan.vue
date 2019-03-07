<template>
	<div class="featured-section-wrapper">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name">Featured: Research-backed impact</h2>
				<p v-if="showCategoryDescription" class="section-description show-for-large">
					{{ loanChannel.description }}
				</p>
			</div>
		</div>
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
								:is-visitor="!isLoggedIn"
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
											@click="$emit('track-loan-card-interaction', {
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
												@click="$emit('track-loan-card-interaction', {
													interactionType: 'viewBorrowerPage',
													interactionElement: 'readMore'
												})"
											>Read more</div>
										</router-link>
									</div>
								</div>

								<div class="why-special">
									<div class="bold">This loan is special because:</div>
									{{ loan.whySpecial }}
								</div>

								<div class="action">
									<action-button
										:loan-id="loan.id"
										:loan="loan"
										:items-in-basket="itemsInBasket"
										:is-lent-to="loan.userProperties.lentTo"
										:is-funded="isFunded"
										:lend-increment-button-version="lendIncrementButtonVersion"

										@click.native="trackInteraction({
											interactionType: 'addToBasket',
											interactionElement: 'Lend25'
										})"
									/>

									<matching-text
										:matching-text="loan.matchingText"
										:is-funded="isFunded"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import numeral from 'numeral';

import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import loanFavoriteMutation from '@/graphql/mutation/updateLoanFavorite.graphql';

import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';

// research-backed impact category
const featuredCategoryIds = [56];

export default {
	components: {
		ActionButton,
		BorrowerInfo,
		LoanCardImage,
		MatchingText,
	},
	inject: ['apollo'],
	props: {
		enableTracking: {
			type: Boolean,
			default: false,
		},
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		lendIncrementButtonVersion: {
			type: String,
			default: ''
		},
		showCategoryDescription: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			featuredCategoryIds,
			isFavorite: null,
			loading: false,
			loan: null,
			loanUseMaxLength: 100,
			loanChannel: null
		};
	},
	computed: {
		amountLeft() {
			const {
				fundedAmount,
				reservedAmount
			} = this.loan.loanFundraisingInfo;
			return this.loan.loanAmount - fundedAmount - reservedAmount;
		},
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
		isFunded() {
			return this.loan.status === 'funded' || this.loan.amountLeft <= 0;
		},
		loanUse() {
			// eslint-disable-next-line max-len
			return `A loan of ${numeral(this.loan.loanAmount).format('$0,0')} ${this.helpedLanguage} ${this.borrowerCountLanguage} ${this.loanUseTruncated()}`;
		},
		showReadMore() {
			return !!(this.loanUse.length > this.loanUseMaxLength);
		},
	},
	mounted() {
		this.isFavorite = this.loan.userProperties.favorited;
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
			// optimistically toggle it locally first
			this.isFavorite = !this.isFavorite;

			this.apollo.mutate({
				mutation: loanFavoriteMutation,
				variables: {
					loan_id: this.loan.id,
					is_favorite: this.loan.userProperties.favorited
				}
			}).then(({ data }) => {
				if (data) {
					const favorite = _get(data, 'loan.favorite');

					if (favorite === null) {
						this.loan.userProperties.favorited = !this.loan.userProperties.favorited;
					}
				}
			});
		},
		trackInteraction(args) {
			if (!this.enableTracking) {
				return;
			}

			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_loan_interaction_event_schema_1_0_0.json#';
			const interactionType = args.interactionType || 'unspecified';
			const interactionElement = args.interactionElement || 'unspecified';
			const loanInteractionTrackData = { schema, data: {} };
			const featureHeroCategory = this.featuredCategoryIds[0];

			loanInteractionTrackData.data.interactionType = interactionType;
			loanInteractionTrackData.data.interactionElement = interactionElement;
			loanInteractionTrackData.data.loanId = this.loan.id;
			loanInteractionTrackData.data.categorySetIdentifier = 'featured-hero-loan';
			loanInteractionTrackData.data.categoryId = featureHeroCategory;
			loanInteractionTrackData.data.row = 0;
			loanInteractionTrackData.data.position = 1;

			this.$kvTrackSelfDescribingEvent(loanInteractionTrackData);
		},
	},
	apollo: {
		query: featuredLoansQuery,
		preFetch: true,
		preFetchVariables() {
			return {
				ids: featuredCategoryIds
			};
		},
		variables() {
			return {
				ids: this.featuredCategoryIds,
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.loan = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]),
					'[0].loans.values[0]'
				);

				this.loanChannel = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]),
					'[0]'
				);

				this.loading = false;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$row-max-width: 58.75rem;

.featured-section-wrapper {
	background-color: $kiva-bg-darkgray;
	margin: 0 auto 2rem;
	padding: 2rem 0;

	@include breakpoint(xxlarge down) {
		padding-left: rem-calc(40);
		padding-right: rem-calc(40);
	}

	.row {
		max-width: $row-max-width;

		.column {
			padding-left: 0;
		}
	}

	.section-name {
		font-weight: $global-weight-highlight;
		margin-bottom: rem-calc(8);
	}

	.section-description {
		@extend .section-name;

		font-weight: $global-weight-normal;
		margin-top: rem-calc(12);
		margin-bottom: rem-calc(20);
	}

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
}
</style>
