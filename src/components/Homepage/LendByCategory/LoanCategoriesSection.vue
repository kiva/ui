<template>
	<div class="loan-category-section-wrapper">
		<div class="category-options"
			v-touch:swipe.left="scrollCategoryNamesRight"
			v-touch:swipe.right="scrollCategoryNamesLeft"
			ref="categoryOptions"
			:style="{ left: scrollPos + 'px' }"
		>
			<kv-loading-spinner v-if="!categoriesLoaded" />

			<ul class="category-options__ul">
				<li
					class="category-options__li"
					v-for="category in prefetchedCategoryInfo"
					:key="category.id + '-link'"
				>
					<kv-cause-selector
						:cause="cleanCategoryName(category.id)"
						:as-radio="true"
						@change="setActiveCategory(category.id)"
						v-kv-track-event="[
							'Lending',
							'click-cause-selector',
							cleanCategoryName(category),
						]"
					/>
				</li>
			</ul>

			<!-- Category name text -->
			<kv-button
				class="text-link category-options__link"
				:class="{'active': category.id === activeCategory}"
				v-for="category in prefetchedCategoryInfo"
				:key="category.id + '-link'"
				@click.prevent.native="setActiveCategory(category.id)"
				v-kv-track-event="[
					'homepage',
					'click-carousel-category',
					cleanCategoryName(category),
				]"
			>
				{{ cleanCategoryName(category) }}
			</kv-button>
			<router-link
				class="category-options__link"
				:to="`/lend-by-category`"
				v-if="prefetchedCategoryInfo.length > 0"
				v-kv-track-event="[
					'homepage',
					'click-carousel-category',
					'more',
				]"
			>
				More
			</router-link>
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

import cookieStore from '@/util/cookieStore';
import { readJSONSetting } from '@/util/settingsUtils';
import logReadQueryError from '@/util/logReadQueryError';
import { isLoanFundraising } from '@/util/loanUtils';

import lendByCategoryHomepageCategories from '@/graphql/query/lendByCategoryHomepageCategories.graphql';
import loanChannelInfoQuery from '@/graphql/query/loanChannelInfo.graphql';
import loanChannelData from '@/graphql/query/loanChannelData.graphql';

import LoanCategory from '@/components/Homepage/LendByCategory/LoanCategory';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvButton from '@/components/Kv/KvButton';

import KvCauseSelector from '@/components/Kv/KvCauseSelector';

const imageRequire = require.context('@/assets/images/cause-selector/', true);

export default {
	components: {
		LoanCategory,
		KvLoadingSpinner,
		KvButton,
		KvCauseSelector
	},
	data() {
		return {
			categoryIds: [52, 96, 93, 89, 87], // fallback category ids
			itemsInBasket: [],
			prefetchedCategoryInfo: [],
			categoriesWithLoans: [],
			activeCategory: null,
			isLoggedIn: false,
			scrollPos: 0,
			categoriesLoaded: false,
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
		minLeftMargin() {
			// min left margin based on width of client and width of category options with 20px padding.
			return -(this.$refs.categoryOptions.clientWidth - document.documentElement.clientWidth + 20);
		},
		isLargeBreakpoint() {
			return document.documentElement.clientWidth < 681;
		},
		categoryImageSrc(category) {
			// not yet working
			console.log('category', category.id);
			// const categoryName = cleanCategoryName(category.id);
			// console.log('categoryName', categoryName);
			// return imageRequire(`./${categoryName}.png`);
			return imageRequire('./technology.png');
		},
		// categoryImage2xSrc() {
		// 	return imageRequire(`./${categoryName}_2x.png`);
		// },
	},
	methods: {
		scrollCategoryNamesLeft() {
			if (this.scrollPos < 0 && this.isLargeBreakpoint) {
				const newLeftMargin = Math.min(0, this.scrollPos + 200);
				this.scrollPos = newLeftMargin;
			}
		},
		scrollCategoryNamesRight() {
			if (this.scrollPos > this.minLeftMargin && this.isLargeBreakpoint) {
				const newLeftMargin = Math.max(this.minLeftMargin, this.scrollPos - 200);
				this.scrollPos = newLeftMargin;
			}
		},
		cleanCategoryName(category) {
			switch (category.id) {
				case 52:
					return 'women';
				case 96:
					return 'COVID-19';
				case 93:
					return 'shelter';
				case 89:
					return 'art';
				case 87:
					return 'agriculture';
				case 102:
					return 'technology';
				case 4:
					return 'education';
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
					basketId: cookieStore.get('kvbskt'),
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
		}
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
}

.loan-category-row {
	margin-top: 4.5rem;
	@include breakpoint(medium) {
		margin-top: 0;
	}
}

.category-options {
	margin: 1.35rem auto 0;
	top: -4.5rem;
	position: absolute;
	white-space: nowrap;
	text-align: center;
	padding: 0 2rem;

	&__ul {
		list-style: none;
		display: flex;
	}

	&__li {
		margin: 0;
		padding: 0;
		margin-right: 2.75rem;
	}

	@include breakpoint(medium) {
		position: initial;
		white-space: initial;
	}

	// for breakpoint under large, don't use flex
	// so that overflow touch scrolling works better
	@include breakpoint(large) {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		min-width: 100%;
	}

	.loading-spinner {
		margin: 0 auto;
	}
}
</style>
