<template>
	<div class="loan-category-section-wrapper">
		<div class="category-options"
			v-touch:swipe.left="scrollCategoryNamesRight"
			v-touch:swipe.right="scrollCategoryNamesLeft"
			ref="categoryOptions"
			:style="{ left: scrollPos + 'px' }"
		>
			<kv-loading-spinner v-if="!categoriesLoaded" />
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
					'true'
				]"
			>
				{{ cleanCategoryName(category) }}
			</kv-button>
			<router-link
				class="category-options__link"
				:to="`/lend-by-category`"
				v-if="prefetchedCategoryInfo.length > 0"
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
			/>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';

import cookieStore from '@/util/cookieStore';
import { readJSONSetting } from '@/util/settingsUtils';

import lendByCategoryHomepageCategories from '@/graphql/query/lendByCategoryHomepageCategories.graphql';
import loanChannelInfoQuery from '@/graphql/query/loanChannelInfo.graphql';
import loanChannelData from '@/graphql/query/loanChannelData.graphql';

import LoanCategory from '@/components/Homepage/LendByCategory/LoanCategory';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		LoanCategory,
		KvLoadingSpinner,
		KvButton
	},
	inject: ['apollo'],
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
					return 'arts';
				case 87:
					return 'agriculture';
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

					// TODO
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
					.filter(loan => this.testFundedStatus(loan));
			}
			return filteredLoansArray;
		},
		// TODO
		// This method is very similar to the one in:
		// src/components/LoansByCategory/FeaturedHeroLoanWrapper.vue
		testFundedStatus(loan) {
			// check status, store if funded
			if (_get(loan, 'status') !== 'fundraising') {
				return false;
			}
			// check fundraising information, store if funded
			const loanAmount = numeral(_get(loan, 'loanAmount'));
			const fundedAmount = numeral(_get(loan, 'loanFundraisingInfo.fundedAmount'));
			const reservedAmount = numeral(_get(loan, 'loanFundraisingInfo.reservedAmount'));
			// loan amount vs funded amount
			if (loanAmount.value() === fundedAmount.value()) {
				return false;
			}
			// loan amount vs funded + reserved amount
			if (loanAmount.value() === (fundedAmount.value() + reservedAmount.value())) {
				return false;
			}
			// all clear
			return true;
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
	},
	mounted() {
		// TODO
		// Get these queries in preFetch without causing an invariant error.
		this.apollo.query({
			query: lendByCategoryHomepageCategories,
			variables: {
				basketId: cookieStore.get('kvbskt'),
			},
		}).then(({ data }) => {
			this.processData(data);
		}).then(() => {
			return this.apollo.query({
				query: loanChannelInfoQuery,
				variables: {
					ids: this.categoryIds,
				},
			});
		}).then(({ data }) => {
			this.prefetchedCategoryInfo = _get(data, 'lend.loanChannelsById') || [];
			this.categoriesLoaded = true;
			// set initial active category
			this.setActiveCategory(this.categoryIds[0]);
			this.activateWatchers();
		});
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

	&__link {
		color: $charcoal;
		font-weight: $global-weight-normal;
		font-size: $featured-text-font-size;
		line-height: 1.5rem;
		text-transform: capitalize;
		margin-right: 1rem;

		@include breakpoint(medium) {
			margin-bottom: 1rem;
			display: inline-block;
		}

		@include breakpoint(large) {
			margin-right: 0;
		}

		&.active,
		&:hover {
			text-decoration: none;
			color: $kiva-green;
		}

		&.active {
			font-weight: $global-weight-bold;
			border-bottom: 3px solid $kiva-green;
		}
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
