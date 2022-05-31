<template>
	<div class="loan-category-section-wrapper">
		<div class="category-options">
			<kv-loading-spinner v-if="!categoriesLoaded" />
			<kv-carousel
				class="loan-category-section__carousel"
				:autoplay="false"
				slides-to-scroll="visible"
				indicator-style="none"
				:embla-options="{
					loop: false,
				}"
				@interact-carousel="onInteractCarouselCategories"
			>
				<kv-carousel-slide
					class="loan-category-section__carousel-slide"
					v-for="category in prefetchedCategoryInfo"
					:key="category.id + '-link'"
				>
					<!-- <kv-cause-selector
						class="loan-category-section__cause-selector"
						:cause="cleanCategoryName(category)"
						:as-radio="true"
						@change="setActiveCategory(category.id)"
						v-kv-track-event="[
							'homepage',
							'click-carousel-selector',
							cleanCategoryName(category),
						]"
					/> -->
					<kv-button
						class="text-link category-options__link"
						:class="{'active': category.id === activeCategory}"
						@click.native="setActiveCategory(category.id)"
						v-kv-track-event="[
							'homepage',
							'click-carousel-category',
							cleanCategoryName(category),
						]"
					>
						{{ cleanCategoryName(category) }}
					</kv-button>
				</kv-carousel-slide>
			</kv-carousel>
		</div>

		<div
			class="loan-category-row"
			v-for="category in prefetchedCategoryInfo"
			v-show="category.id === activeCategory"
			:key="category.id + '-row'"
		>
			<loan-category
				:loans="getCategoryLoans(category.id)"
				:loan-channel="category"
				:items-in-basket="itemsInBasket"
				:is-logged-in="isLoggedIn"
				:is-visible="category.id === activeCategory"
				:key="category.id + '-category'"
				:row-number="getCategoryRowNumber(category.id)"
			/>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';

import { readJSONSetting } from '@/util/settingsUtils';
import logReadQueryError from '@/util/logReadQueryError';
import { isLoanFundraising } from '@/util/loanUtils';

import lendByCategoryHomepageCategories from '@/graphql/query/lendByCategoryHomepageCategories.graphql';
import loanChannelInfoQuery from '@/graphql/query/loanChannelInfo.graphql';
import loanChannelData from '@/graphql/query/loanChannelData.graphql';

import KvButton from '@/components/Kv/KvButton';
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
// import KvCauseSelector from '@/components/Kv/KvCauseSelector';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanCategory from '@/components/Homepage/LendByCategory/LoanCategory';

export default {
	name: 'LoanCategoriesSection',
	components: {
		KvButton,
		KvCarousel,
		KvCarouselSlide,
		// KvCauseSelector,
		KvLoadingSpinner,
		LoanCategory,
	},
	data() {
		return {
			categoryIds: [52, 96, 93, 89, 87, 4, 102, 25], // fallback category ids
			itemsInBasket: [],
			prefetchedCategoryInfo: [],
			categoriesWithLoans: [],
			activeCategory: null,
			isLoggedIn: false,
			scrollPos: 0,
			categoriesLoaded: false,
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
					return client.query({ query: loanChannelInfoQuery, variables: { ids: categoryIds } });
				}
			});
		},
	},
	computed: {
		allFetchedLoanIds() {
			// returns array of all loan ids in this.categoriesWithLoans
			// includes loans that have been filtered out for fundraising etc.
			// We can then exclude them in followup queries.
			const loanIds = this.categoriesWithLoans.map(category => {
				return category.loans.values.map(loan => loan.id);
			});
			// reduces array of arrays into single array
			return [].concat(...loanIds);
		},
	},
	methods: {
		cleanCategoryName(category) {
			switch (category.id) {
				case 52:
					return 'women';
				case 96:
				case 106:
					return 'COVID-19';
				case 93:
					return 'shelter';
				case 89:
					return 'arts';
				case 87:
					return 'agriculture';
				case 102:
				case 104:
					return 'technology';
				case 4:
				case 88:
					return 'education';
				case 25:
				case 105:
					return 'health';
				case 32:
				case 107:
					return 'refugees';
				default:
					// remove any text contained within square brackets, including the brackets
					return String(category.name).replace(/\s\[.*\]/g, '');
			}
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
		// sets category as active and fetches loans for that channel
		setActiveCategory(categoryId) {
			this.activeCategory = categoryId;
			// if category does not have loans, get loans
			if (!this.categoriesWithLoans.find(category => category.id === categoryId)) {
				// fetch query data
				this.apollo.query({
					query: loanChannelData,
					variables: {
						ids: [categoryId],
						excludeIds: this.allFetchedLoanIds, // exclude loans that have already been fetched
						imgDefaultSize: 'w480h300',
						imgRetinaSize: 'w960h600',
						numberOfLoans: 8,
					}
				}).then(({ data }) => {
					const channelLoans = _get(data, 'lend.loanChannelsById')[0];
					this.categoriesWithLoans.push(channelLoans);

					if (data) {
						this.trackCategoryRow(channelLoans);
					}

					// TODO: future work
					// if we have less than 8 loans left after filtering:
					// this.getCategoryLoans(categoryId)
					// fetch more loans
				});
			}
		},
		// get filtered loans for a given category id
		getCategoryLoans(categoryId) {
			let filteredLoansArray = [];

			const allLoansForCategory = this.categoriesWithLoans
				.filter(category => category.id === categoryId)[0] || {};

			if (allLoansForCategory.loans) {
				filteredLoansArray = allLoansForCategory.loans.values
					.filter(loan => isLoanFundraising(loan));
			}
			return filteredLoansArray;
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
		trackCategoryRow(categoryData) {
			const pageViewTrackData = {
				// eslint-disable-next-line max-len
				schema: 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_4.json#',
				data: {}
			};
			const loanIds = [];
			// dynamic row identifer
			pageViewTrackData.data.categorySetIdentifier = `lbc-hp-v1-category-${categoryData.id}`;
			// loan collection
			const categoryLoans = _get(categoryData, 'loans.values');
			// Formatting and pushing Loan Category info into loanIds
			categoryLoans.forEach((loan, loanIndex) => {
				loanIds.push({
					r: this.getCategoryRowNumber(categoryData.id),
					p: loanIndex + 1,
					c: categoryData.id,
					l: loan.id
				});
			});
			// assign loan data
			pageViewTrackData.data.loansDisplayed = loanIds;
			// pass formatted data in this call
			this.$kvTrackSelfDescribingEvent(pageViewTrackData);
		},
		getCategoryRowNumber(categoryId) {
			const categoryRowIndex = this.categoryIds.indexOf(categoryId);
			return categoryRowIndex !== -1 ? categoryRowIndex + 1 : null;
		},
		onInteractCarouselCategories(interaction) {
			this.$kvTrackEvent('homepage', 'click-category-horizontal-scroll', interaction);
		}
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
			logReadQueryError(e, 'LoanCategoriesSection lendByCategoryHomepageCategories');
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
			logReadQueryError(e, 'LoanCategoriesSection loanChannelInfoQuery');
		}
		this.prefetchedCategoryInfo = _get(categoryInfo, 'lend.loanChannelsById') || [];
		this.categoriesLoaded = true;
	},
	mounted() {
		// set initial active category
		this.setActiveCategory(this.categoryIds[0]);
		this.activateWatchers();
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.loan-category-section-wrapper {
	position: relative;

	.loan-category-row {
		margin-top: 1rem;
		@include breakpoint(medium) {
			margin-top: 0;
		}
	}

	.category-options {
		max-width: rem-calc(797px);
		margin: 0 auto;

		&__link {
			color: $charcoal;
			font-weight: $global-weight-normal;
			font-size: $featured-text-font-size;
			line-height: 1.5rem;
			text-transform: capitalize;

			&.active,
			&:hover,
			&:focus {
				text-decoration: none;
				color: $kiva-green;
			}

			&.active {
				font-weight: $global-weight-bold;
				border-bottom: 3px solid $kiva-green;
			}
		}

		.loading-spinner {
			margin: 0 auto;
		}
	}

	.loan-category-section {
		&__carousel-slide {
			width: auto;
			padding: 0.5rem 1.5rem 0;
			margin: 0.5rem 0 1rem;
		}

		&__cause-selector {
			margin: 1rem 1.25rem;
		}
	}
}
</style>
