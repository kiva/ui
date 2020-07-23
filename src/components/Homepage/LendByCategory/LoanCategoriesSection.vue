<template>
	<div>
		<div>
			<a
				v-for="(category) in prefetchedCategoryInfo"
				:key="category.id + '-link'"
				role="button"
				@click.prevent="setActiveCategory(category.id)"
				:class="{'active': category.id === activeCategory}"
			>
				{{ category.name }}
			</a>
			<router-link
				:to="`/lend-by-category`"
			>
				More
			</router-link>
		</div>

		<div
			class="loan-category-row"
			v-for="(category, index) in prefetchedCategoryInfo"
			v-show="category.id === activeCategory"
			:key="category.id + '-row'"
		>
			<loan-category
				:loan-channel="getCategoryLoans(category.id)"
				:items-in-basket="itemsInBasket"
				:row-number="index + 1"
				:is-logged-in="isLoggedIn"
				:is-visible="category.id === activeCategory"
			/>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';

import logReadQueryError from '@/util/logReadQueryError';
import { readJSONSetting } from '@/util/settingsUtils';

import lendByCategoryHomepageCategories from '@/graphql/query/lendByCategoryHomepageCategories.graphql';
import loanChannelInfoQuery from '@/graphql/query/loanChannelInfo.graphql';
import loanChannelData from '@/graphql/query/loanChannelData.graphql';

import LoanCategory from '@/components/Homepage/LendByCategory/LoanCategory';

export default {
	components: {
		LoanCategory,
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

			// clientCategories: [],
			// rowLazyLoadComplete: false,
			// rightArrowPosition: undefined,
			// leftArrowPosition: undefined,
		};
	},
	apollo: {
		query: lendByCategoryHomepageCategories,
		preFetch(config, client) {
			return client.query({
				query: lendByCategoryHomepageCategories
			}).then(({ data }) => {
				// Get the array of channel objects from settings
				const loanChannelsSetting = readJSONSetting(data, 'general.rows.value') || [];
				// Get all channel ids for the row data
				const channelIds = _map(loanChannelsSetting, 'id');
				// Pre-fetch loan channel information, but no loans
				return 	client.query({
					query: loanChannelInfoQuery,
					variables: {
						ids: channelIds,
					},
					fetchPolicy: 'network-only',
				});
			});
		},
		result({ data }) {
			this.isLoggedIn = _get(data, 'my.userAccount.id') !== undefined || false;

			// Get the array of channel objects from settings,
			// if successful set to categoryIds
			const categorySettingsArray = readJSONSetting(data, 'general.rows.value');
			if (categorySettingsArray) {
				this.categoryIds = categorySettingsArray.map(setting => setting.id);
			}

			this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');

			// Read the SSR ready loan channel info from the cache
			try {
				const categoryData = this.apollo.readQuery({
					query: loanChannelInfoQuery,
					variables: {
						ids: this.categoryIds,
					},
				});
				this.prefetchedCategoryInfo = _get(categoryData, 'data.lend.loanChannelsById') || [];
			} catch (e) {
				logReadQueryError(e, 'LoanCategoriesSection loanChannelInfoQuery');
			}
		}
	},
	created() {
		// set initial active category
		this.setActiveCategory(this.categoryIds[0]);
	},
	computed: {
		allLoanIdsCurrentlyVisible() {
			// returns array of all loan ids in this.categoriesWithLoans
			const loanIds = this.categoriesWithLoans.map(category => {
				return category.loans.values.map(loan => loan.id);
			});
			// reduces array of arrays into single array
			return [].concat(...loanIds);
		}
	},
	methods: {
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
						excludeIds: this.allLoanIdsCurrentlyVisible,
						imgDefaultSize: 'w480h300',
						imgRetinaSize: 'w960h600',
						numberOfLoans: 8,
					}
				}).then(({ data }) => {
					const channelData = _get(data, 'lend.loanChannelsById')
						.filter(channel => channel.id === categoryId);
					const channelLoans = channelData[0];
					this.categoriesWithLoans.push(channelLoans);
				});
			}
		},
		// get category loans for a given category id
		getCategoryLoans(categoryId) {
			return this.categoriesWithLoans.filter(category => category.id === categoryId)[0] || {};
		},
		activateWatchers() {
			// Create an observer for changes to the categories (and their loans)
			this.apollo.watchQuery({
				query: loanChannelInfoQuery,
				variables: {
					ids: this.categoryIds,
				},
			}).subscribe({
				next: ({ data }) => {
					this.prefetchedCategoryInfo = _get(data, 'lend.loanChannelsById') || this.prefetchedCategoryInfo;
				},
			});
			this.apollo.watchQuery({ query: lendByCategoryHomepageCategories }).subscribe({
				next: ({ data }) => {
					this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
				},
			});
		},
	},
	mounted() {
		this.activateWatchers();
	},
};

</script>


<style lang="scss" scoped>
@import 'settings';

//TODO Clean up this CSS
//temp
.active {
	border-bottom: 1px solid green;
}

.loan-category-row {
	margin: 0 0 rem-calc(20);

	@include breakpoint(medium) {
		margin: 0 0 rem-calc(40);
	}

	&:last-of-type {
		margin-bottom: 0;
	}

	@media (hover: none) {
		&:last-of-type {
			margin-bottom: 0;
		}
	}
}

.pre-footer {
	margin-top: 2rem;
	margin-bottom: 2rem;

	.cat-row-loader {
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 5;
		height: 9rem;
		margin: 0 0 3rem;

		// loading overlay overrides
		#updating-overlay {
			background: transparent;
			z-index: 6;
		}

		h3 {
			display: flex;
			align-items: flex-end;
		}
	}

	h2 {
		margin: 0 1.875rem;

		@include breakpoint(medium) {
			margin-left: 1.625rem;
		}
		@include breakpoint(xxlarge) {
			margin-left: 0.625rem;
		}

		@media (hover: none) {
			margin: 0;
		}
	}

	a.view-all-link {
		display: inline;
		position: relative;

		.view-all-arrow {
			position: absolute;
			top: -1rem;
			right: -1.4rem;
			padding: 0 0.3rem;
			font-weight: $global-weight-normal;
			font-size: 2.5rem;

			@include breakpoint(medium) {
				font-size: 3rem;
				right: -1.6rem;
			}
		}

		&:hover {
			text-decoration: none;
			cursor: pointer;
		}
	}
}
</style>
