<template>
	<www-page class="lend-by-category-page">
		<div class="row">
			<div class="heading-region column small-12">
				<h1>Make a loan, change a life</h1>
				<p class="page-subhead">Each Kiva loan helps people build a better future for
				themselves and their families. <br class="xxlu">Browse loans by category below, or
					<router-link :to="{ path: '/lend'}">view all loans</router-link>.
				</p>
			</div>
		</div>

		<div>
			<category-row
				class="loan-category-row"
				v-for="(category, index) in categories"
				:key="category.id"
				:loan-channel="category"
				:items-in-basket="itemsInBasket"
				:row-number="index + 1"
				:set-id="categorySetId"
			/>
		</div>

		<div class="row pre-footer">
			<div class="column small-12">
				<router-link :to="{ path: '/categories'}"><h2>View all categories</h2></router-link>
			</div>
		</div>

		<div class="row" v-if="isAdmin">
			<div class="columns small-12">
				<category-admin-controls />
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
// @TODO following 2 imports unnecessary once category sort data available
import _size from 'lodash/size';
import _times from 'lodash/times';
import { readJSONSetting } from '@/util/settingsUtils';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
import lendByCategoryQuery from '@/graphql/query/lendByCategory/lendByCategory.graphql';
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';

export default {
	components: {
		CategoryAdminControls: () => import('./admin/CategoryAdminControls'),
		CategoryRow,
		WwwPage,
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Loans by category'
	},
	data() {
		return {
			isAdmin: false,
			categorySetting: [],
			categorySetId: '',
			categories: [],
			itemsInBasket: [],
		};
	},
	computed: {
		categoryIds() {
			return _map(this.categorySetting, 'id');
		}
	},
	methods: {
		assemblePageViewData(categories) {
			// eslint-disable-next-line max-len
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_1.json#';
			const loans = _map(categories, 'loans');
			const pageViewTrackData = { schema, data: {} };

			pageViewTrackData.data.categorySetIdentifier = this.categorySetId || 'default';
			pageViewTrackData.data.categoriesDisplayed = _map(categories, 'id');

			// @TODO - when sorts available, replace below with ~ _map(this.categories, 'sort')
			pageViewTrackData.data.sortsDisplayed = [];
			_times(_size(categories), () => pageViewTrackData.data.sortsDisplayed.push('default'));

			pageViewTrackData.data.loansDisplayed = _map(loans, ({ values }) => _map(values, 'id'));
			return pageViewTrackData;
		},
		setRows(data) {
			const rowData = readJSONSetting(data, 'general.rows.value') || [];
			const expData = readJSONSetting(data, 'general.experiment.value') || {};

			// Read the assigned experiment version from the cache
			const versionData = this.apollo.readQuery({ query: experimentQuery });
			const version = _get(versionData, 'experiment.version');
			const variantRows = _get(expData, `variants.${version}.categories`);

			// Set from the ids for the variant, or the default if that is undefined
			this.categorySetting = variantRows || rowData;
			this.categorySetId = version || _get(expData, 'control.key');
		},
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				client.query({
					query: lendByCategoryQuery
				}).then(({ data }) => {
					// Get the array of channel objects from settings
					const rowData = readJSONSetting(data, 'general.rows.value') || [];
					// Get the experiment object from settings
					const expData = readJSONSetting(data, 'general.experiment.value') || {};

					// Get the assigned experiment version
					client.query({ query: experimentQuery }).then(expResult => {
						const version = _get(expResult, 'data.experiment.version');
						const variantRows = _get(expData, `variants.${version}.categories`);
						// get the ids for the variant, or the default if that is undefined
						const ids = _map(variantRows || rowData, 'id');

						// Pre-fetch all the data for those channels
						client.query({
							query: loanChannelQuery,
							variables: { ids },
						}).then(resolve).catch(reject);
					}).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		// Read the page data from the cache
		const baseData = this.apollo.readQuery({ query: lendByCategoryQuery });
		this.setRows(baseData);
		this.isAdmin = !!_get(baseData, 'my.isAdmin');
		this.itemsInBasket = _map(_get(baseData, 'shop.basket.items.values'), 'id');

		// Read the loan channels from the cache
		const categoryData = this.apollo.readQuery({
			query: loanChannelQuery,
			variables: { ids: this.categoryIds },
		});
		this.categories = _get(categoryData, 'lend.loanChannelsById') || [];

		// Create an observer for changes to the categories (and their loans)
		const categoryObserver = this.apollo.watchQuery({
			query: loanChannelQuery,
			variables: { ids: this.categoryIds },
		});

		// Watch for and react to changes to the query
		this.apollo.watchQuery({ query: lendByCategoryQuery }).subscribe({
			next: ({ data }) => {
				this.setRows(data);
				this.isAdmin = !!_get(data, 'my.isAdmin');
				this.itemsInBasket = _map(_get(data, 'shop.basket.items.values'), 'id');
				// Update the categories observer with the new setting, triggering updates
				categoryObserver.setVariables({ ids: this.categoryIds });
			},
		});

		// React to changes to the category data
		categoryObserver.subscribe({
			next: ({ data }) => {
				this.categories = _get(data, 'lend.loanChannelsById') || [];
			},
		});
	},
	mounted() {
		const pageViewTrackData = this.assemblePageViewData(this.categories);
		this.$kvTrackSelfDescribingEvent(pageViewTrackData);
	},
};
</script>

<style lang="scss" >
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
}
</style>
