<template>
	<div>
		<h3>
			<a
				:href="currentSlideCategory.url"
				v-kv-track-event="[
					'homepage',
					'click-hero-category',
					cleanCategoryLink(currentSlideCategory),
				]"
			>
				{{ cleanCategoryLink(currentSlideCategory) }}
			</a>
		</h3>
		<kv-carousel
			indicator-style="bar"
			@change="onCarouselSlideChange"
			class="featured-loans-carousel"
			@interact-carousel="onInteractCarousel"
		>
			<template #default>
				<kv-carousel-slide
					v-for="(category, index) in prefetchedCategoryInfo"
					:key="category.id"
				>
					<div v-if="categoryHasFeaturedLoan(category.id)">
						<loan-card-controller
							class="featured-loans-carousel__loan"
							loan-card-type="LendHomepageLoanCard"
							:loan="featuredLoanForCategory(category.id)"
							:items-in-basket="itemsInBasket"
							:category-id="category.id"
							category-set-id="lbc-hp-v1-featured-loans"
							:disable-redirects="disableRedirects"
							:row-number="0"
							:card-number="index + 1"
							:enable-tracking="true"
							:is-visitor="!isLoggedIn"
							:show-view-loan-cta="showViewLoanCta"
							@add-to-basket="handleAddToBasket"
						/>
					</div>
					<div v-else class="featured-loans-carousel__loading-div">
						<kv-loading-spinner />
					</div>
				</kv-carousel-slide>
			</template>
		</kv-carousel>
	</div>
</template>

<script>
import _get from 'lodash/get';

import { readJSONSetting } from '@/util/settingsUtils';
import { isLoanFundraising } from '@/util/loanUtils';

import logReadQueryError from '@/util/logReadQueryError';

import lendByCategoryHomepageCategories from '@/graphql/query/lendByCategoryHomepageCategories.graphql';
import loanChannelInfoQuery from '@/graphql/query/loanChannelInfo.graphql';
import loanChannelData from '@/graphql/query/loanChannelData.graphql';

import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanCardController from '@/components/LoanCards/LoanCardController';

export default {
	name: 'FeaturedLoansCarousel',
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvLoadingSpinner,
		LoanCardController
	},
	props: {
		disableRedirects: {
			type: Boolean,
			default: false,
		},
		showViewLoanCta: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			categoryIds: [52, 96, 93, 89, 87], // fallback category ids
			itemsInBasket: [],
			prefetchedCategoryInfo: [],
			isLoggedIn: false,
			currentSlideIndex: 0,
			featuredLoans: [],
			ineligibleLoans: []
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client) {
			// Get the experiment object from settings with category ids
			return client.query({
				query: lendByCategoryHomepageCategories
			}).then(({ data }) => {
				// Get the array of channel objects from settings,
				const categorySettingsArray = readJSONSetting(data, 'general.homepage_category_rows.value');
				if (categorySettingsArray) {
					// if successful set to categoryIds
					const categoryIds = categorySettingsArray.map(setting => setting.id);
					return Promise.all([
						client.query({ query: loanChannelInfoQuery, variables: { ids: categoryIds } }),
						client.query({
							query: loanChannelData,
							variables: {
								ids: [categoryIds[0]],
								imgDefaultSize: 'w480h300',
								imgRetinaSize: 'w960h600',
								numberOfLoans: 3,
							}
						})
					]);
				}
			});
		},
	},
	computed: {
		nextSlideCategory() {
			return this.prefetchedCategoryInfo[this.currentSlideIndex + 1] || this.prefetchedCategoryInfo[0];
		},
		currentSlideCategory() {
			return this.prefetchedCategoryInfo[this.currentSlideIndex] || {};
		},
		loansToExclude() {
			// returns array of all loan ids in this.featuredLoans
			// combined with all loan ids in this.ineligibleloans
			const featuredLoanIds = this.featuredLoans.map(featuredLoan => featuredLoan.loan.id);

			const ineligibleLoanIds = this.ineligibleLoans.map(ineligibleLoan => ineligibleLoan.id);
			// reduces array of arrays into single array
			return featuredLoanIds.concat(ineligibleLoanIds);
		},
	},
	created() {
		// Read the page data from the cache
		let pageData = {};
		try {
			pageData = this.apollo.readQuery({
				query: lendByCategoryHomepageCategories,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
				},
			});
			this.processData(pageData);
		} catch (e) {
			logReadQueryError(e, 'FeaturedLoansCarousel lendByCategoryHomepageCategories');
		}

		// Read the loanChannel info from the cache
		let categoryInfo = {};
		try {
			categoryInfo = this.apollo.readQuery({
				query: loanChannelInfoQuery,
				variables: {
					ids: this.categoryIds,
				},
			});
		} catch (e) {
			logReadQueryError(e, 'FeaturedLoansCarousel loanChannelInfoQuery');
		}
		this.prefetchedCategoryInfo = _get(categoryInfo, 'lend.loanChannelsById') || [];

		const firstChannelId = _get(this.prefetchedCategoryInfo[0], 'id');
		if (firstChannelId) {
			// Read the first 3 prefetched loans from the cache
			let loanInfo = {};
			try {
				loanInfo = this.apollo.readQuery({
					query: loanChannelData,
					variables: {
						ids: [firstChannelId],
						numberOfLoans: 3,
						imgDefaultSize: 'w480h300',
						imgRetinaSize: 'w960h600',
						basketId: this.cookieStore.get('kvbskt'),
					},
				});
				const channelLoans = _get(loanInfo, 'lend.loanChannelsById')[0];

				// process response into eligible and ineligible arrays
				// if there is not an eligible loan, we still fetch the first 2 categories in mounted
				if (channelLoans) {
					this.processAPIResponse(channelLoans);
				}
			} catch (e) {
				logReadQueryError(e, 'FeaturedLoansCarousel loanChannelData');
			}
		}
	},
	mounted() {
		// fetch loans for first category in case prefetch failed to find a loan
		this.fetchLoansForCategory(this.currentSlideCategory);
		// fetch loans for next category
		this.fetchLoansForCategory(this.nextSlideCategory);
		this.activateWatchers();
	},
	methods: {
		// Takes an API response and determines loans which are
		// eligible to be featured and ineligible to be featured
		processAPIResponse(channelLoans) {
			const ineligibleLoans = channelLoans.loans.values
				.filter(loan => !isLoanFundraising(loan));
			const eligibleLoans = channelLoans.loans.values
				.filter(loan => isLoanFundraising(loan));
			const categoryId = channelLoans.id;

			// Keep track of the ineligible loans so we can exclude them later.
			this.ineligibleLoans.push(...ineligibleLoans);

			// if there is an eligible loan, add it to featured
			// store the category id
			if (eligibleLoans[0]) {
				this.featuredLoans.push({
					id: categoryId,
					loan: eligibleLoans[0]
				});
			}

			// fire analytics
			this.trackVisibleFeaturedLoan(categoryId, eligibleLoans);
		},
		categoryHasFeaturedLoan(categoryId) {
			return !!this.featuredLoans.find(loanCat => loanCat.id === categoryId);
		},
		featuredLoanForCategory(categoryId) {
			const category = this.featuredLoans.find(loanCat => loanCat.id === categoryId);
			if (category) {
				return category.loan;
			}
			return {};
		},
		cleanCategoryLink(category) {
			switch (category.id) {
				case 52:
					return 'Loans to women';
				case 96:
					return 'COVID-19 loans';
				case 93:
					return 'Shelter loans';
				case 89:
					return 'Arts loans';
				case 87:
					return 'Agriculture loans';
				default:
					// remove any text contained within square brackets, including the brackets
					return String(category.name).replace(/\s\[.*\]/g, '');
			}
		},
		fetchLoansForCategory(category) {
			// if category does not have a featured loans, get loans
			if (!this.categoryHasFeaturedLoan(category.id)) {
				// fetch query data
				this.apollo.query({
					query: loanChannelData,
					variables: {
						ids: [category.id],
						excludeIds: this.loansToExclude,
						imgDefaultSize: 'w480h300',
						imgRetinaSize: 'w960h600',
						numberOfLoans: 3,
					}
				}).then(({ data }) => {
					const channelLoans = _get(data, 'lend.loanChannelsById')[0];
					// process response into eligible and ineligible arrays
					if (channelLoans) {
						this.processAPIResponse(channelLoans);
						// if a featured loan was not found, call again.
						if (!this.categoryHasFeaturedLoan(category.id)) {
							this.fetchLoansForCategory(category);
						}
					}
				});
			}
		},
		onCarouselSlideChange(slideIndex) {
			// When carousel slide changes, fetch loans for that category
			this.currentSlideIndex = slideIndex;
			// fetch loans for current category
			this.fetchLoansForCategory(this.currentSlideCategory);
			// fetch loans for next category
			this.fetchLoansForCategory(this.nextSlideCategory);
		},
		processData(data) {
			// sets up component data from lendByCategoryHomepageCategories query
			this.isLoggedIn = _get(data, 'my.userAccount.id') !== undefined || false;
			// Get the array of channel objects from settings,
			const categorySettingsArray = readJSONSetting(data, 'general.homepage_category_rows.value');
			if (categorySettingsArray) {
				// if successful set to categoryIds
				this.categoryIds = categorySettingsArray.map(setting => setting.id);
			}
			this.itemsInBasket = _get(data, 'shop.basket.items.values', []).map(itemInBasket => itemInBasket.id);
		},
		activateWatchers() {
			// Create an observer, this will react to changes to the basket and pass that data into the components.
			this.apollo.watchQuery({
				query: lendByCategoryHomepageCategories,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
				},
			}).subscribe({
				next: ({ data }) => {
					this.processData(data);
				},
			});
		},
		onInteractCarousel(interactionType) {
			this.$kvTrackEvent('homepage', 'click-hero-carousel', interactionType);
		},
		trackVisibleFeaturedLoan(categoryId, eligibleLoans) {
			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_4.json#';
			const pageViewTrackData = { schema, data: {} };
			const loanIds = [];

			pageViewTrackData.data.categorySetIdentifier = 'lbc-hp-v1-featured-loans';

			const firstEligibleLoan = eligibleLoans[0];

			loanIds.push({
				r: 0,
				p: this.getLoanPosition(categoryId),
				c: categoryId,
				l: firstEligibleLoan.id
			});

			// assign loan data + fire event
			pageViewTrackData.data.loansDisplayed = loanIds;
			this.$kvTrackSelfDescribingEvent(pageViewTrackData);
		},
		getLoanPosition(categoryId) {
			const categoryRowIndex = this.categoryIds.indexOf(categoryId);
			return categoryRowIndex !== -1 ? categoryRowIndex + 1 : null;
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

h3 {
	margin-left: 3.0625rem;
}

.featured-loans-carousel {
	min-height: rem-calc(610);

	// Overwrite styles for loan card to make it responsive.
	::v-deep .lend-homepage-loan-card {
		margin: 1rem;
	}

	// Increase white space on card
	::v-deep .lend-homepage-loan-card__data-wrapper {
		padding: rem-calc(9) 1.25rem 1.25rem;
	}

	::v-deep .lend-homepage-loan-card__borrower-info {
		margin: 1rem 0 1.5rem;
	}

	::v-deep .lend-homepage-loan-card__action-button-container {
		margin-bottom: 1rem;
	}

	::v-deep .lend-homepage-loan-card__fundraising-status {
		margin-top: 0.65rem;
	}

	::v-deep .fundraising-status.left-and-to-go-on-top .left-and-to-go-line {
		margin-bottom: 0.55rem;
	}

	$card-margin: rem-calc(14);
	$card-half-space: rem-calc(14/2);

	&__loan {
		border-radius: 0.65rem;
		box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);
	}

	&__loading-div {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
}
</style>
