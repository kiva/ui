<template>
	<div>
		<h3>
			<a :href="currentSlideCategory.url">
				{{ cleanCategoryLink(currentSlideCategory) }}
			</a>
		</h3>
		<kv-carousel
			indicator-style="bar"
			@change="onCarouselSlideChange"
			class="featured-loans-carousel"
		>
			<template slot="default" slot-scope="props">
				<kv-carousel-slide
					:transition-name="props.transitionName"
					v-for="category in prefetchedCategoryInfo"
					:key="category.id"
				>
					<div v-if="categoryHasFeaturedLoan(category.id)">
						<loan-card-controller
							loan-card-type="LendHomepageLoanCard"
							:loan="featuredLoanForCategory(category.id)"
							:items-in-basket="itemsInBasket"
							:category-id="category.id"
							:enable-tracking="true"
							:is-visitor="!isLoggedIn"
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

import cookieStore from '@/util/cookieStore';
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
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvLoadingSpinner,
		LoanCardController
	},
	props: {
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
	inject: ['apollo'],
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
					basketId: cookieStore.get('kvbskt'),
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
						basketId: cookieStore.get('kvbskt'),
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
					basketId: cookieStore.get('kvbskt'),
				},
			}).subscribe({
				next: ({ data }) => {
					this.processData(data);
				},
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

h3 {
	margin-left: 3.0625rem;
}

.featured-loans-carousel {
	height: 0;
	padding-bottom: 110%;

	// Overwrite styles for loan card to make it responsive.
	::v-deep .lend-homepage-loan-card {
		width: 93%;
	}

	::v-deep .lend-homepage-loan-card__image-wrapper {
		height: 12rem;
	}

	// Increase white space on card
	::v-deep .lend-homepage-loan-card__data-wrapper {
		padding: rem-calc(9) 1.25rem 2rem;
	}

	::v-deep .lend-homepage-loan-card__borrower-info {
		margin: 1rem 0 1.5rem;
	}

	::v-deep .lend-homepage-loan-card__fundraising-status {
		margin-top: 0.65rem;
	}

	::v-deep .fundraising-status.left-and-to-go-on-top .left-and-to-go-line {
		margin-bottom: 0.55rem;
	}
}

.featured-loans-carousel__loading-div {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}
</style>
