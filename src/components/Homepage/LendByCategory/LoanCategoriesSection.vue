<template>
	<div>
		<span
			v-for="(category) in categories"
			:key="category.id + '-link'"
		>
			<a
				role="button"
				@click.prevent="setActiveCategory(category.id)"
				:class="{'active': category.id === activeCategory}"
			>
				{{ category.name }}
			</a>
		</span>
		<div
			class="loan-category-row"
			v-for="(category, index) in categories"
			v-show="category.id === activeCategory"
			:key="category.id + '-row'"
		>
			<loan-category
				:loan-channel="category"
				:items-in-basket="itemsInBasket"
				:row-number="index + 1"
				:is-logged-in="isLoggedIn"
				:is-visible="category.id === activeCategory"
				ref="categoryRow"
			/>
		</div>
		<div class="row pre-footer">
			<div class="column small-12">
				<div v-if="!rowLazyLoadComplete" class="cat-row-loader">
					<loading-overlay id="updating-overlay" />
					<h3 class="text-center">
						Loading more rows...
					</h3>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _drop from 'lodash/drop';
import _each from 'lodash/each';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _uniqBy from 'lodash/uniqBy';
// import cookieStore from '@/util/cookieStore';
import logReadQueryError from '@/util/logReadQueryError';
import { readJSONSetting } from '@/util/settingsUtils';
import { indexIn } from '@/util/comparators';
// import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import lendByCategoryHomepageCategories from '@/graphql/query/lendByCategoryHomepageCategories.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';

import LoanCategory from '@/components/Homepage/LendByCategory/LoanCategory';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

// Row Limiter
// > This controls how may rows are loaded on the server
const ssrRowLimiter = 2;

export default {
	components: {
		LoanCategory,
		LoadingOverlay,
	},
	inject: ['apollo', 'kvAuth0'],
	data() {
		return {
			categorySetting: [],
			itemsInBasket: [],
			prefetchedCategories: [],
			clientCategories: [],
			rowLazyLoadComplete: false,
			rightArrowPosition: undefined,
			leftArrowPosition: undefined,
			isLoggedIn: false,
			activeCategory: ''
		};
	},
	apollo: {
		query: lendByCategoryHomepageCategories,
		preFetch(config, client) {
			return client.query({
				query: lendByCategoryHomepageCategories
			}).then(({ data }) => {
				// Get the array of channel objects from settings
				const rowData = readJSONSetting(data, 'general.rows.value') || [];
				// Get all channel ids for the row data
				const ids = _map(rowData, 'id');

				// Pre-fetch all the data for SSR targeted channels
				return 	client.query({
					query: loanChannelQuery,
					variables: {
						ids: _take(ids, ssrRowLimiter),
						imgDefaultSize: 'w480h300',
						imgRetinaSize: 'w960h600',
					},
				});
			});
		},
		result({ data }) {
			console.log('data results', data);
			this.isLoggedIn = _get(data, 'my.userAccount.id') !== undefined || false;

			// Get the array of channel objects from settings
			this.categorySetting = readJSONSetting(data, 'general.rows.value') || [];

			this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');

			// set initial active category
			this.activeCategory = this.categorySetting[0].id || null;

			// Read the SSR ready loan channels from the cache
			try {
				const categoryData = this.apollo.readQuery({
					query: loanChannelQuery,
					variables: {
						ids: _take(this.categoryIds, ssrRowLimiter),
						imgDefaultSize: 'w480h300',
						imgRetinaSize: 'w960h600',
					},
				});
				this.prefetchedCategories = _get(categoryData, 'lend.loanChannelsById') || [];
			} catch (e) {
				logReadQueryError(e, 'LendByCategory loanChannelQuery');
			}
		}
	},
	computed: {
		categoryIds() {
			return _map(this.categorySetting, 'id');
		},
		categories() {
			// merge prefetchedCategories & clientCategories
			const categories = _uniqBy(this.prefetchedCategories.concat(this.clientCategories), 'id');
			return categories
				// fiter our any empty categories and categories with 0 loans
				.filter(channel => _get(channel, 'loans.values.length') > 0)
				// and re-order to match the setting
				.sort(indexIn(this.categoryIds, 'id'));
		},
	},
	methods: {
		setActiveCategory(categoryId) {
			this.activeCategory = categoryId;
		},
		assemblePageViewData(categories) {
			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_4.json#';
			const loanIds = [];
			const pageViewTrackData = { schema, data: {} };

			pageViewTrackData.data.categorySetIdentifier = 'control';

			_each(categories, (category, catIndex) => {
				_each(category.loans.values, (loan, loanIndex) => {
					loanIds.push({
						r: catIndex + 1,
						p: loanIndex + 1,
						c: category.id,
						l: loan.id
					});
				});
			});
			pageViewTrackData.data.loansDisplayed = loanIds;
			return pageViewTrackData;
		},
		fetchRemainingLoanChannels() {
			// const ssrLoanIds = [];
			// pick loan ids from each
			// _each(this.categories, category => {
			// 	_each(category.loans.values, loan => {
			// 		ssrLoanIds.push(loan.id);
			// 	});
			// });
			// Client Fetch the remaining category rows
			return this.apollo.query({
				query: loanChannelQuery,
				variables: {
					ids: _drop(this.categoryIds, ssrRowLimiter),
					// excludeIds: ssrLoanIds,
					imgDefaultSize: 'w480h300',
					imgRetinaSize: 'w960h600',
					// @todo variables for fetching data for custom channels
				},
			}).then(({ data }) => {
				console.log('lend', data);
				// add our remaining loan channels
				this.clientCategories = _get(data, 'lend.loanChannelsById') || [];
			});
		},
		activateWatchers() {
			// Create an observer for changes to the categories (and their loans)
			this.apollo.watchQuery({
				query: loanChannelQuery,
				variables: {
					ids: this.categoryIds,
					imgDefaultSize: 'w480h300',
					imgRetinaSize: 'w960h600',
				},
			}).subscribe({
				next: ({ data }) => {
					this.prefetchedCategories = _get(data, 'lend.loanChannelsById') || this.prefetchedCategories;
				},
			});
			this.apollo.watchQuery({ query: lendByCategoryHomepageCategories }).subscribe({
				next: ({ data }) => {
					this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
				},
			});
		},
		setRightArrowPosition() {
			if (this.$refs.categoryRow && this.$refs.categoryRow.length) {
				this.rightArrowPosition = this.$refs.categoryRow
					.find(row => row.hasRightArrow)
					.getRightArrowPosition();
			}
		},
		setLeftArrowPosition() {
			if (this.$refs.categoryRow && this.$refs.categoryRow.length) {
				this.leftArrowPosition = this.$refs.categoryRow
					.find(row => row.hasLeftArrow)
					.getLeftArrowPosition();
			}
		},
		handleResize() {
			this.setRightArrowPosition();
			this.setLeftArrowPosition();
		},
	},

	mounted() {
		this.fetchRemainingLoanChannels().then(() => {
			this.rowLazyLoadComplete = true;

			this.activateWatchers();

			const pageViewTrackData = this.assemblePageViewData(this.categories);
			this.$kvTrackSelfDescribingEvent(pageViewTrackData);
		});
	},
};

</script>


<style lang="scss" scoped>
@import 'settings';

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
