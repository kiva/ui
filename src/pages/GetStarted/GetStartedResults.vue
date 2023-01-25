<template>
	<div class="get-started-results-page tw-bg-primary">
		<kv-progress-bar class="progress-bar" value="100" max="100" />

		<div class="loan-results">
			<template v-if="totalPreferredCount > 0">
				<h1 class="tw-text-center tw-mb-4 tw-mx-auto" style="max-width: 50rem;">
					Out of {{ totalFundRaisingCount | numeral(0,0) }} borrowers, these are your perfect matches.
				</h1>
			</template>
			<template v-else>
				<h1 class="tw-text-center tw-mb-4 tw-mx-auto" style="max-width: 50rem;">
					Sorry, we couldn't find any loans matching your preferences
				</h1>
				<p class="tw-text-center tw-mb-4">
					<!-- eslint-disable-next-line max-len -->
					But here {{ countVerb }} {{ countNumber }} {{ countPeople }} who still {{ countNeed }} your support!
					<router-link
						to="/lend-by-category"
						v-kv-track-event="['Lending', 'click-results-explore-more-loans', 'Explore more loans']"
					>
						Explore more loans
					</router-link>
				</p>
			</template>
			<div class="loan-results__loans">
				<div class="row align-stretch">
					<recommended-loan-card
						class="small-4 columns"
						v-for="loanId in loanIds"
						:key="loanId"
						:loan-id="loanId"
					/>
				</div>
			</div>
		</div>

		<div class="row column edit-preferences-row">
			<section class="edit-preferences section tw-text-center">
				<edit-preferences
					:causes="causeValues"
					:countries="countriesValues"
					:total-count="totalFundRaisingCount"
				/>
			</section>
		</div>

		<div class="row column">
			<section class="how-it-works section tw-text-center">
				<h2 class="tw-mb-4">
					Here's how it works
				</h2>
				<div class="how-it-works__line show-for-large">
					<div class="how-it-works__circle"></div>
					<div class="how-it-works__circle"></div>
					<div class="how-it-works__circle"></div>
				</div>
				<ol class="how-it-works__list row align-justify">
					<li class="how-it-works__li small-12 large-4 columns">
						<kv-responsive-image
							class="how-it-works__img how-it-works__img--loan show-for-large"
							:images="howItWorksImgs.loan"
							loading="lazy"
							alt=""
						/>
						<h3 class="tw-mb-1 md:tw-mb-2">
							Support a loan<br class="xxlu"> today!
						</h3>
						<p>
							Make an impact with as<br class="xxlu"> little as $25.
						</p>
					</li>
					<li class="how-it-works__li small-12 large-4 columns">
						<kv-responsive-image
							class="how-it-works__img how-it-works__img--people show-for-large"
							:images="howItWorksImgs.people"
							loading="lazy"
							alt=""
						/>
						<h3 class="tw-mb-1 md:tw-mb-2">
							Lenders around the world<br class="xxlu"> help fund the loan
						</h3>
						<p>This takes up to thirty days.</p>
					</li>
					<li class="how-it-works__li small-12 large-4 columns">
						<kv-responsive-image
							class="how-it-works__img how-it-works__img--repaid show-for-large"
							:images="howItWorksImgs.repaid"
							loading="lazy"
							alt=""
						/>
						<h3 class="tw-mb-1 md:tw-mb-2">
							Get repaid after your<br class="xxlu"> borrower uses their loan
						</h3>
						<p>You can use the repayments to support more borrowers or withdraw it.</p>
					</li>
				</ol>
			</section>

			<section class="section">
				<frequently-asked-questions />
				<kv-responsive-image
					class="faq__flourish"
					:images="flourishImgs.greenLeft"
					loading="lazy"
					alt=""
				/>
			</section>
		</div>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/vue';
import FrequentlyAskedQuestions from '@/components/GetStarted/FrequentlyAskedQuestions';
import EditPreferences from '@/components/GetStarted/EditPreferences';
import KvProgressBar from '@/components/Kv/KvProgressBar';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import RecommendedLoanCard from '@/components/LoanCards/RecommendedLoanCard';
import logFormatter from '@/util/logFormatter';

const imgRequire = require.context('@/assets/images/lend-by-category-homepage/', true);

export default {
	name: 'GetStartedResults',
	inject: ['apollo', 'cookieStore'],
	components: {
		FrequentlyAskedQuestions,
		EditPreferences,
		KvProgressBar,
		KvResponsiveImage,
		RecommendedLoanCard,
	},
	data() {
		return {
			loanIds: [],
			totalPreferredCount: 0,
			totalFundRaisingCount: 0,
			howItWorksImgs: {
				loan: [
					['small', imgRequire('./how-it-works-loan.png')],
					['small retina', imgRequire('./how-it-works-loan_2x.png')],
				],
				repaid: [
					['small', imgRequire('./how-it-works-repaid.png')],
					['small retina', imgRequire('./how-it-works-repaid_2x.png')],
				],
				people: [
					['small', imgRequire('./loan-not-donation.png')],
					['small retina', imgRequire('./loan-not-donation_2x.png')],
				],
			},
			flourishImgs: {
				greenLeft: [
					['small', imgRequire('./flourish-green-left.png')],
					['large', imgRequire('./flourish-green-left.png')],
					['large retina', imgRequire('./flourish-green-left_2x.png')],
				],
			},
			causeValues: [],
			countriesValues: []
		};
	},
	metaInfo: {
		title: 'Results - Get Started'
	},
	computed: {
		countVerb() {
			return this.loanIds.length === 1 ? 'is' : 'are';
		},
		countNumber() {
			switch (this.loanIds.length) {
				case 1:
					return 'one';
				case 2:
					return 'two';
				default:
					return 'three';
			}
		},
		countPeople() {
			return this.loanIds.length === 1 ? 'person' : 'people';
		},
		countNeed() {
			return this.loanIds.length === 1 ? 'needs' : 'need';
		},
	},
	apollo: {
		preFetch: true,
		preFetchVariables({ cookieStore }) {
			return {
				limit: 3,
				visitorId: cookieStore.get('uiv') || null
			};
		},
		variables() {
			return {
				limit: 3,
				visitorId: this.cookieStore.get('uiv') || null
			};
		},
		query: gql`query getStartedResults($limit: Int, $visitorId: String) {
			general {
				lendingPreferences(visitorId: $visitorId) {
					id
					loans(limit: $limit) {
						totalCount
						values {
							id
						}
					}
					causes {
						values {
							id
							name
						}
					}
					countries {
						values {
							isoCode
						}
					}
				}
			}
			lend {
				loans(limit: $limit) {
					totalCount
					values {
						id
					}
				}
			}
		}`,
		result(result) {
			if (result.error) {
				logFormatter('GetStartedResults: Error finding loan recommendations', 'error', { result });
				this.$showTipMsg('There was a problem finding your loan recommendations', 'error');
				try {
					Sentry.withScope(scope => {
						scope.setTag('wizard_stage', 'results');
						Sentry.captureException(result.error);
					});
				} catch (e) {
					// no-op
				}
			}

			let loanValues = result.data?.general?.lendingPreferences?.loans?.values || [];
			this.totalPreferredCount = result.data?.general?.lendingPreferences?.loans?.totalCount || 0;
			this.totalFundRaisingCount = result.data?.lend?.loans?.totalCount || 0;
			this.causeValues = result.data?.general?.lendingPreferences?.causes?.values || [];
			this.countriesValues = result.data?.general?.lendingPreferences?.countries?.values || [];

			if (this.totalPreferredCount === 0) {
				loanValues = result.data?.lend?.loans?.values || [];
			}

			this.loanIds = loanValues.filter(loan => !!loan.id).map(loan => loan.id);
		},
	},
	mounted() {
		this.$kvTrackEvent('Lending', 'view-results-count', this.totalPreferredCount);
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loan-results {
	padding-top: 1.5rem;

	@include breakpoint(large up) {
		padding-top: 6rem;
	}

	&__loans {
		overflow: auto;
		padding-bottom: 2rem;

		.row {
			@mixin row-max-width($card-width, $gutter) {
				max-width: rem-calc((3 * $card-width) + (4 * $gutter));
			}

			flex-flow: row nowrap;
			padding: 0 0.5rem;
			width: 245%;
			@include row-max-width(230, 16);

			@include breakpoint(medium up) {
				@include row-max-width(350, 16);
			}

			@include breakpoint(large up) {
				padding: 0 rem-calc(10);
				width: 135%;
				@include row-max-width(384, 20);
			}

			@include breakpoint(xxlarge up) {
				width: auto;
			}
		}

		@include breakpoint(medium down) {
			.columns {
				padding: 0 0.5rem;
			}
		}
	}
}

.page-content {
	padding-top: 9rem;
}

// utils
.section {
	padding: 2.5rem 0;

	@include breakpoint(large) {
		padding: 5rem 0;
	}
}

.faq__flourish {
	position: absolute;
	width: 20%;
	max-width: 17rem;
	top: auto;
	left: -7%;
	pointer-events: none;
	bottom: 0%;

	@include breakpoint(large) {
		height: rem-calc(470);
		overflow: hidden;
	}
}

.how-it-works {
	position: relative;

	&__list {
		list-style: none;
		margin-top: 1rem;
		margin-bottom: 0;
		text-align: left;
		position: relative;

		&::before {
			content: "";
			display: inline-block;
			height: 58%;
			width: 1px;
			background: $kiva-stroke-gray;
			position: absolute;
			top: rem-calc(6);
			left: rem-calc(-1.5);
			min-height: rem-calc(155);
		}

		@include breakpoint(large) {
			text-align: center;

			&::before {
				content: none;
			}
		}

		@include breakpoint(medium down) {
			padding-left: rem-calc(10);
			margin-left: rem-calc(15);
		}
	}

	&__li {
		margin-bottom: 1rem;
		position: relative;

		&::before {
			content: '';
			display: inline-block;
			height: rem-calc(17);
			width: rem-calc(17);
			background: $white;
			border-radius: 50%;
			border: 1px solid $kiva-stroke-gray;
			position: absolute;
			top: 0;
			left: rem-calc(-20);
		}

		@include breakpoint(large) {
			&::before {
				content: none;
			}
		}
	}

	&__img {
		margin: 0 auto 4rem;

		&--loan {
			width: rem-calc(96);
			height: rem-calc(78);
		}

		&--repaid {
			width: rem-calc(68);
			height: rem-calc(78);
		}

		&--people {
			width: rem-calc(67);
			height: rem-calc(78);
		}
	}

	&__line {
		border-bottom: 1px solid $kiva-stroke-gray;
		position: absolute;
		top: rem-calc(256);
		width: 70%;
		left: 50%;
		margin-left: -35%;

		@include breakpoint(xlarge) {
			top: rem-calc(280);
		}
	}

	&__circle {
		height: rem-calc(17);
		width: rem-calc(17);
		border-radius: 50%;
		border: 1px solid $kiva-stroke-gray;
		background-color: $white;
		position: absolute;
		top: -8.5px;
		left: 50%;
		margin-left: -8.5px;

		&:first-child {
			left: 0;
		}

		&:last-child {
			right: -8.5px;
			left: auto;
		}
	}
}

.edit-preferences-row {
	margin-top: 3rem;
	max-width: rem-calc(1190);
}
</style>
