<template>
	<www-page class="lend-by-category-page">
		<div class="message-text text-center message-text-confirmation" v-if="showLendByCategoryMessage">
			<div class="row hide-for-large">
				<div class="column text-right small-2 medium-2"
					style="position: relative;">
					<img class="beta" src="~@/assets/images/beta-icon.svg">
				</div>
				<div class="column text-left small-10 medium-10">
					<p class="message">
						Welcome to Kiva’s new category view!
						Take it for a spin below, or
						<router-link
							to="/lend"
							v-kv-track-event="['Lending', 'click-Lend tab tip promo', 'View all loans']"
						>
							view all loans
						</router-link>
						at any time.
					</p>
				</div>
			</div>
			<div class="row show-for-large">
				<div class="column large-12">
					<p class="message">
						<img class="beta" src="~@/assets/images/beta-icon.svg">
						Welcome to Kiva’s new category view!
						Take it for a spin below, or
						<router-link
							to="/lend"
							v-kv-track-event="['Lending', 'click-Lend tab tip promo', 'View all loans']"
						>
							view all loans
						</router-link>
						at any time.
					</p>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="heading-region column small-12">
				<h1>Make a loan, change a life</h1>
				<p class="page-subhead">Each Kiva loan helps people build a better future for
				themselves and their families. <br class="xxlu">Browse loans by category below, or
					<router-link :to="{ path: '/lend'}">view all loans</router-link>.
				</p>
			</div>
		</div>

		<FeaturedLoans
			v-if="showFeaturedLoans"
			ref="featured"
			:items-in-basket="itemsInBasket"
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
			/>
		</div>

		<div class="row pre-footer">
			<div class="column small-12">
				<router-link :to="{ path: '/categories'}"><h2>View all categories</h2></router-link>
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
import _each from 'lodash/each';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _without from 'lodash/without';
import { readJSONSetting } from '@/util/settingsUtils';
import { indexIn } from '@/util/comparators';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import lendByCategoryQuery from '@/graphql/query/lendByCategory/lendByCategory.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import FeaturedLoans from '@/components/LoansByCategory/FeaturedLoans';

// Insert Loan Channel Ids here
// They should also be added to the ui.category_rows setting
// You'll need use the same id when you push data into customCategories
const customCategoryIds = [];

export default {
	components: {
		CategoryAdminControls: () => import('./admin/CategoryAdminControls'),
		CategoryRow,
		FeaturedAdminControls: () => import('./admin/FeaturedAdminControls'),
		FeaturedLoans,
		WwwPage,
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
			showFeaturedLoans: true,
			showLendByCategoryMessage: false,
			realCategories: [],
			customCategories: [],
		};
	},
	computed: {
		categoryIds() {
			return _map(this.categorySetting, 'id');
		},
		categories() {
			// merge realCategories & customCategories and re-order to match the setting
			const categories = this.realCategories.concat(this.customCategories);
			return categories.sort(indexIn(this.categorySetting, 'id'));
		},
		realCategoryIds() {
			return _without(this.categoryIds, ...customCategoryIds);
		},
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
					// Pre-fetch the assigned version for lbc message
					client.query({ query: experimentQuery, variables: { id: 'lbc_message' } }),
				]);
			}).then(expResults => {
				const version = _get(expResults, '[0].data.experiment.version');
				const variantRows = _get(expData, `variants.${version}.categories`);
				// get the ids for the variant, or the default if that is undefined
				const ids = _map(variantRows || rowData, 'id');

				// Pre-fetch all the data for those channels
				return client.query({
					query: loanChannelQuery,
					variables: {
						ids: _without(ids, ...customCategoryIds),
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

		// Read the loan channels from the cache
		const categoryData = this.apollo.readQuery({
			query: loanChannelQuery,
			variables: {
				ids: this.realCategoryIds,
				// @todo variables for fetching data for custom channels
			},
		});
		this.realCategories = _get(categoryData, 'lend.loanChannelsById') || [];

		// Create an observer for changes to the categories (and their loans)
		const categoryObserver = this.apollo.watchQuery({
			query: loanChannelQuery,
			variables: {
				ids: this.realCategoryIds,
				// @todo variables for fetching data for custom channels
			},
		});

		// Watch for and react to changes to the query
		this.apollo.watchQuery({ query: lendByCategoryQuery }).subscribe({
			next: ({ data }) => {
				this.setRows(data);
				this.isAdmin = !!_get(data, 'my.isAdmin');
				this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
				// Update the categories observer with the new setting, triggering updates
				categoryObserver.setVariables({
					ids: this.realCategoryIds,
					// @todo variables for fetching data for custom channels
				});
			},
		});

		// React to changes to the category data
		categoryObserver.subscribe({
			next: ({ data }) => {
				this.realCategories = _get(data, 'lend.loanChannelsById') || [];
				this.customCategories = [];
				// check for loans before pushing this as we won't want to show an empty row
				// const someLoans = _get(data, 'lend.someLoans.values') || [];
				// if (someLoans.length) {
				// 	this.customCategories.push({
				// 		id: 62,
				// 		name: 'Custom category',
				// 		url: '', // required field
				// 		loans: {
				// 			values: someLoans,
				// 		},
				// 	});
				// }

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
		});

		// Read assigned version of lend-by-category message experiment
		// eslint-disable-next-line max-len
		const lendByCategoryMessageData = this.apollo.readQuery({ query: experimentQuery, variables: { id: 'lbc_message' } });
		this.showLendByCategoryMessage = _get(lendByCategoryMessageData, 'experiment.version') === 'shown';
		if (this.showLendByCategoryMessage) {
			this.$kvTrackEvent(
				'Lending',
				'view-Lend tab tip promo',
				'View all loans',
			);
		}
	},
	mounted() {
		const pageViewTrackData = this.assemblePageViewData(this.categories);
		this.$kvTrackSelfDescribingEvent(pageViewTrackData);
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-by-category-page {
	main {
		background-color: $kiva-bg-lightgray;
	}

	.heading-region {
		margin-bottom: 2rem;
		margin-top: rem-calc(20);

		@include breakpoint(small only) {
			margin-bottom: 1rem;
		}

		p {
			border-bottom: 1px solid $light-gray;
			font-size: rem-calc(21);
			line-height: $global-lineheight;
			margin-right: 0.75rem;
			padding-bottom: 2rem;

			@include breakpoint(xxlarge) {
				margin-right: 0;
			}
		}

		@include breakpoint(small only) {
			h1 {
				font-size: 1.5rem;
			}

			p {
				font-size: 1rem;
				line-height: 1.5rem;
				padding-bottom: 1rem;
			}
		}
	}

	.loan-category-row {
		margin: 0 1rem rem-calc(20);

		&:last-of-type {
			margin-bottom: 0;
		}

		@media (hover: none) {
			margin: 0 0 rem-calc(20) rem-calc(20);

			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}

	.pre-footer {
		margin-bottom: 2rem;
	}

	.message-text {
		top: auto;
		z-index: 1;
		position: relative;

		img.beta {
			@include breakpoint(medium down) {
				top: 35%;
				position: relative;
			}

			vertical-align: middle;
			margin-left: rem-calc(10);
			margin-right: rem-calc(10);
		}

		p.message {
			max-width: 100%;
		}
	}
}
</style>
