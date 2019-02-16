<template>
	<www-page class="lend-by-category-page">
		<lend-header />

		<featured-hero-loan
			v-if="showFeaturedHeroLoan"
			ref="featured"
			:items-in-basket="itemsInBasket"
			:is-logged-in="isLoggedIn"
			:lend-increment-button-version="lendIncrementExpVersion"
			:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
		/>

		<FeaturedLoans
			v-if="showFeaturedLoans"
			ref="featured"
			:items-in-basket="itemsInBasket"
			:is-logged-in="isLoggedIn"
			:lend-increment-button-version="lendIncrementExpVersion"
			:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
		/>

		<recently-viewed-loans
			:is-micro="true"
			:items-in-basket="itemsInBasket"
			:is-logged-in="isLoggedIn"
			:lend-increment-button-version="lendIncrementExpVersion"
			:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
		/>

		<div>
			<category-row
				class="loan-category-row"
				v-for="(category, index) in categories"
				:key="category.id"
				:loan-channel="category"
				:items-in-basket="itemsInBasket"
				:row-number="index + 1"
				:set-id="categorySetId"
				:is-logged-in="isLoggedIn"
				:lend-increment-button-version="lendIncrementExpVersion"
				:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
			/>
		</div>

		<div class="row pre-footer">
			<div class="column small-12">
				<div v-if="!rowLazyLoadComplete" class="cat-row-loader">
					<loading-overlay id="updating-overlay" />
					<h3 class="text-center">Loading more rows...</h3>
				</div>

				<h2 class="category-name"><router-link
					:to="{ path: '/categories'}"
					class="view-all-link">
					View all categories<span class="view-all-arrow">&rsaquo;</span>
				</router-link></h2>
			</div>
		</div>

		<featured-admin-controls v-if="isAdmin" />

		<div class="row" v-if="isAdmin">
			<div class="columns small-12">
				<category-admin-controls />
			</div>
		</div>
	</www-page>
</template>

<script>
import _drop from 'lodash/drop';
import _each from 'lodash/each';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _uniqBy from 'lodash/uniqBy';
import _without from 'lodash/without';
import WebStorage from 'store2';
import { readJSONSetting } from '@/util/settingsUtils';
import { indexIn } from '@/util/comparators';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import lendByCategoryQuery from '@/graphql/query/lendByCategory/lendByCategory.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import FeaturedLoans from '@/components/LoansByCategory/FeaturedLoans';
import FeaturedHeroLoan from '@/components/LoansByCategory/FeaturedHeroLoan';
import RecentlyViewedLoans from '@/components/LoansByCategory/RecentlyViewedLoans';
import ViewToggle from '@/components/LoansByCategory/ViewToggle';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import LendHeader from '@/pages/Lend/LendHeader';

// Insert Loan Channel Ids here
// They should also be added to the possibleCategories in CategoryAdminControls
// You'll need use the same id when you push data into customCategories
const customCategoryIds = [];

// Row Limiter
// > This controls how may rows are loaded on the server
const ssrRowLimiter = 2;

export default {
	components: {
		CategoryAdminControls: () => import('./admin/CategoryAdminControls'),
		CategoryRow,
		FeaturedAdminControls: () => import('./admin/FeaturedAdminControls'),
		FeaturedLoans,
		FeaturedHeroLoan,
		RecentlyViewedLoans,
		WwwPage,
		ViewToggle,
		LoadingOverlay,
		LendHeader,
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Loans by category'
	},
	data() {
		return {
			isAdmin: false,
			isLoggedIn: false,
			categorySetting: [],
			categorySetId: '',
			itemsInBasket: [],
			imageEnhancementExperimentVersion: '',
			lendIncrementExpVersion: null,
			showFeaturedLoans: true,
			showFeaturedHeroLoan: false,
			realCategories: [],
			customCategories: [],
			clientCategories: [],
			showRecentlyViewed: false,
			recentLoanIds: [],
			rowLazyLoadComplete: false,
		};
	},
	computed: {
		ssrCategoryIds() {
			return _take(this.realCategoryIds, ssrRowLimiter);
		},
		categoryIds() {
			return _map(this.categorySetting, 'id');
		},
		categories() {
			// merge realCategories & customCategories
			const categories = _uniqBy(this.realCategories.concat(this.customCategories, this.clientCategories), 'id');
			// fiter our any empty categories and categories with 0 loans
			return categories.filter(channel => {
				return channel.loans !== null && channel.loans.values.length;
				// and re-order to match the setting
			}).sort(indexIn(this.categoryIds, 'id'));
		},
		realCategoryIds() {
			return _without(this.categoryIds, ...customCategoryIds);
		}
	},
	methods: {
		assemblePageViewData(categories) {
			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_4.json#';
			const loanIds = [];
			const pageViewTrackData = { schema, data: {} };
			const featuredCategoryIds = _get(this, '$refs.featured.featuredCategoryIds');

			pageViewTrackData.data.categorySetIdentifier = this.categorySetId || 'default';

			if (this.showFeaturedLoans) {
				loanIds.push({
					r: 0, p: 1, c: featuredCategoryIds[0], l: _get(this, '$refs.featured.loan1.id')
				});
				loanIds.push({
					r: 0, p: 2, c: featuredCategoryIds[1], l: _get(this, '$refs.featured.loan2.id')
				});
				loanIds.push({
					r: 0, p: 3, c: featuredCategoryIds[2], l: _get(this, '$refs.featured.loan3.id')
				});
			}

			// Inject Data for Recently viewed if present
			if (this.showRecentlyViewed) {
				if (this.recentLoanIds.length) {
					_each(this.recentLoanIds, (loanId, index) => {
						loanIds.push({
							r: -1, p: index + 1, c: 64, l: loanId
						});
					});
				}
			}

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
		setRows(data) {
			const rowData = readJSONSetting(data, 'general.rows.value') || [];
			const expData = readJSONSetting(data, 'general.rowsExp.value') || {};

			// Read the assigned category rows experiment version from the cache
			const versionData = this.apollo.readQuery({ query: experimentQuery, variables: { id: 'category_rows' } });
			const version = _get(versionData, 'experiment.version');
			const variantRows = _get(expData, `variants.${version}.categories`);

			// Set from the ids for the variant, or the default if that is undefined
			this.categorySetting = variantRows || rowData;
			this.categorySetId = version || _get(expData, 'control.key');
		},
		setCustomRowData(data) { // eslint-disable-line
			this.customCategories = [];
			// check for loans before pushing this as we won't want to show an empty row
			// const otherLoans = _get(data, 'lend.otherLoans.values') || [];
			// if (otherLoans.length) {
			// 	this.customCategories.push({
			// 		id: 65,
			// 		name: 'Other Custom category',
			// 		url: '', // required field
			// 		loans: {
			// 			values: otherLoans,
			// 		},
			// 	});
			// }
		},
		fetchRemainingLoanChannels() {
			const ssrLoanIds = [];
			// pick loan ids from each
			_each(this.categories, category => {
				_each(category.loans.values, loan => {
					ssrLoanIds.push(loan.id);
				});
			});
			// Client Fetch the remaining category rows
			return this.apollo.query({
				query: loanChannelQuery,
				variables: {
					ids: _drop(this.realCategoryIds, ssrRowLimiter),
					excludeIds: ssrLoanIds,
					// @todo variables for fetching data for custom channels
				},
			}).then(({ data }) => {
				// add our remaining loan channels
				this.clientCategories = _get(data, 'lend.loanChannelsById') || [];
			});
		},
		fetchRecentlyViewed() {
			// Setup Recently Viewed Loans data for inclusion in page load loan row analytics
			// Read assignment for Recently Viewed Loans EXP
			const recentlyViewedEXP = this.apollo.readQuery({
				query: experimentQuery,
				variables: { id: 'recently_viewed_loan_row' }
			});
			this.showRecentlyViewed = _get(recentlyViewedEXP, 'experiment.version') === 'variant-a';
			// if Recently Viewed Exp is active look for loans in local storage
			if (this.showRecentlyViewed) {
				// fetch recently viewed from localStorage (currently set in wwwApp on Borrower Profile)
				const recentlyViewed = WebStorage('recentlyViewedLoans');
				// decode, parse then set recently viewed loan data
				try {
					this.recentLoanIds = JSON.parse(atob(recentlyViewed));
				} catch (e) {
					// no-op
				}
			}
		},
		activateWatchers() {
			// Create an observer for changes to the categories (and their loans)
			this.apollo.watchQuery({
				query: loanChannelQuery,
				variables: {
					ids: this.realCategoryIds,
				},
			});
			this.apollo.watchQuery({ query: lendByCategoryQuery }).subscribe({
				next: ({ data }) => {
					this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
				},
			});
		},
	},
	apollo: {
		preFetch(config, client) {
			let rowData;
			let expData;

			return client.query({
				query: lendByCategoryQuery
			}).then(({ data }) => {
				// Get the array of channel objects from settings
				rowData = readJSONSetting(data, 'general.rows.value') || [];
				// Get the category rows experiment object from settings
				expData = readJSONSetting(data, 'general.rowsExp.value') || {};

				return Promise.all([
					// Get the assigned category rows experiment version
					client.query({ query: experimentQuery, variables: { id: 'category_rows' } }),
					// Pre-fetch the assigned featured loans experiment version
					client.query({ query: experimentQuery, variables: { id: 'featured_loans' } }),
					// Pre-fetch the assigned version for lend increment button
					client.query({ query: experimentQuery, variables: { id: 'lend_increment_button_v2' } }),
					// Pre-fetch the assigned version for recently viewed loans
					client.query({ query: experimentQuery, variables: { id: 'recently_viewed_loan_row' } }),
					// experiment: image enhancement
					client.query({ query: experimentQuery, variables: { id: 'image_enhancement' } }),
				]);
			}).then(expResults => {
				const version = _get(expResults, '[0].data.experiment.version');
				const variantRows = _get(expData, `variants.${version}.categories`);
				// get the ids for the variant, or the default if that is undefined
				const ids = _map(variantRows || rowData, 'id');

				// Pre-fetch all the data for SSR targeted channels
				return client.query({
					query: loanChannelQuery,
					variables: {
						// exclude custom rows + limit for ssr
						ids: _take(_without(ids, ...customCategoryIds), ssrRowLimiter)
						// @todo variables for fetching data for custom channels
					},
				});
			});
		}
	},
	created() {
		// Read the page data from the cache
		const baseData = this.apollo.readQuery({ query: lendByCategoryQuery });
		this.setRows(baseData);
		this.isAdmin = !!_get(baseData, 'my.isAdmin');
		this.isLoggedIn = !!_get(baseData, 'my');

		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');

		// Read the assigned feateured loan experiment version from the cache
		const versionData = this.apollo.readQuery({ query: experimentQuery, variables: { id: 'featured_loans' } });
		this.showFeaturedLoans = _get(versionData, 'experiment.version') === 'shown';

		// Read the SSR ready loan channels from the cache
		const categoryData = this.apollo.readQuery({
			query: loanChannelQuery,
			variables: {
				ids: _take(this.realCategoryIds, ssrRowLimiter)
				// @todo variables for fetching data for custom channels
			},
		});
		this.realCategories = _get(categoryData, 'lend.loanChannelsById') || [];
		// If active, update our custom categories prior to render
		// this.setCustomRowData(categoryData);

		// Read assigned version of lend increment button experiment
		const lendIncrementExperimentAssignment = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'lend_increment_button_v2' },
		});
		this.lendIncrementExpVersion = _get(lendIncrementExperimentAssignment, 'experiment.version') || null;
		if (this.lendIncrementExpVersion !== null) {
			this.$kvTrackEvent('Lending', 'EXP-CASH-557', this.lendIncrementExpVersion.replace('variant-', ''));
		}

		// CASH-578 : Experiment : Cloudinary image enhancement
		const imageEnchancementExperimentVersionArray = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'image_enhancement' },
		});

		// eslint-disable-next-line max-len
		this.imageEnhancementExperimentVersion = _get(imageEnchancementExperimentVersionArray, 'experiment.version') || null;

		if (this.imageEnhancementExperimentVersion === 'variant-a') {
			this.$kvTrackEvent('Lending', 'EXP-CASH-578-Mar2019', 'a');
		} else if (this.imageEnhancementExperimentVersion === 'variant-b') {
			this.$kvTrackEvent('Lending', 'EXP-CASH-578-Mar2019', 'b');
		}

		// CASH-350 : Experiment : Featured Hero Loan
		const featuredHeroLoanExperimentVersionArray = this.apollo.readQuery({
			query: experimentQuery,
			variables: { id: 'featured_hero_loan' },
		});

		// eslint-disable-next-line max-len
		this.featuredHeroLoanExperimentVersion = _get(featuredHeroLoanExperimentVersionArray, 'experiment.version') || null;

		if (this.featuredHeroLoanExperimentVersion === 'variant-a') {
			this.showFeaturedLoans = true;
			this.showFeaturedHeroLoan = false;
		} else if (this.featuredHeroLoanExperimentVersion === 'variant-b') {
			this.showFeaturedLoans = false;
			this.showFeaturedHeroLoan = true;
		}
	},
	mounted() {
		this.fetchRecentlyViewed();

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
@import 'global/transitions';

.lend-by-category-page {
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
}
</style>
