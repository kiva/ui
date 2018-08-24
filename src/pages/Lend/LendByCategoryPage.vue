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
				:row-number="index + 1"
			/>
		</div>

		<div class="row" v-if="isAdmin">
			<div class="columns small-12">
				<category-admin-controls
					:categories="categorySetting"
				/>
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
import lendByCategoryQuery from '@/graphql/query/lendByCategory.graphql';
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
			categories: [],
			experimentEnabled: false,
			variants: [],
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
			const schema = 'https://raw.githubusercontent.com/kiva/snowplow/master/conf/snowplow_category_row_page_load_event_schema_1_0_0.json#';
			const loans = _map(categories, 'loans');
			const pageViewTrackData = { schema, data: {} };

			// @TODO - make following dynamic when identifier data available
			pageViewTrackData.data.categorySetIdentifier = 'default';

			pageViewTrackData.data.categoriesDisplayed = _map(categories, 'id');

			// @TODO - when sorts available, replace below with ~ _map(this.categories, 'sort')
			pageViewTrackData.data.sortsDisplayed = [];
			_times(_size(categories), () => pageViewTrackData.data.sortsDisplayed.push('default'));

			pageViewTrackData.data.loansDisplayed = _map(loans, ({ values }) => _map(values, 'id'));
			return pageViewTrackData;
		}
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				client.query({
					query: lendByCategoryQuery
				}).then(({ data }) => {
					// Get the array of channel objects from settings
					const result = readJSONSetting(data, 'general.setting.value') || [];
					const ids = _map(result, 'id');

					// Pre-fetch all the data for those channels
					client.query({
						query: loanChannelQuery,
						variables: { ids },
					}).then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		// Read the array of channel ids from the cache
		const settingData = this.apollo.readQuery({ query: lendByCategoryQuery });
		this.categorySetting = readJSONSetting(settingData, 'general.setting.value') || [];

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

		// Watch for and react to changes to the setting value
		this.apollo.watchQuery({ query: lendByCategoryQuery }).subscribe({
			next: ({ data }) => {
				this.categorySetting = readJSONSetting(data, 'general.setting.value') || [];
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

		@media (hover: none) {
			margin: 0 0 rem-calc(20) 0.5rem;
		}
	}
}
</style>
