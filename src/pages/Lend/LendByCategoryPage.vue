<template>
	<www-page class="lend-by-category-page">
		<div class="row">
			<div class="small-12 columns heading-region">
				<h1>Make a loan, change a life</h1>
				<p>Each Kiva loan helps people build a better
				future for themselves and their families.</p>
			</div>
		</div>

		<div>
			<category-row
				class="loan-category-row"
				v-for="category in categoryIdSet"
				:key="category.id"
				:loan-channel="category.id"
			/>
			<loading-overlay v-if="loading" />
		</div>

		<div class="row" v-if="isAdmin">
			<div class="columns small-12">
				<category-admin-controls
					:categories="categoryIdSet"
					:possible-categories="possibleCategories"
				/>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import lendByCategoryQuery from '@/graphql/query/lendByCategory.graphql';
import categoriesByIdQuery from '@/graphql/query/categoriesById.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import CategoryRow from '@/components/LoansByCategory/CategoryRow';
import CategoryAdminControls from './CategoryAdminControls';
import LoadingOverlay from './LoadingOverlay';

export default {
	components: {
		CategoryAdminControls,
		CategoryRow,
		LoadingOverlay,
		WwwPage,
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Loans by category'
	},
	data() {
		return {
			isAdmin: true,
			isVisitor: true,
			itemsInBasket: [],
			loading: false,
			rows: [],
			categoryIdSet: [],
			possibleCategories: [],
			experimentEnabled: false,
			variants: [],
		};
	},
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				client.query({
					query: lendByCategoryQuery
				}).then(({ data }) => {
					let result;
					try {
						result = JSON.parse(JSON.parse(_get(data, 'general.setting.value')));
					} catch (e) {
						result = [];
					}
					const ids = _map(result, 'id');
					client.query({
						query: categoriesByIdQuery,
						variables: { ids },
					}).then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		const baseData = this.apollo.readQuery({ query: lendByCategoryQuery });
		this.possibleCategories = _map(_get(baseData, 'lend.loanChannels.values'), category => {
			return {
				label: category.name,
				value: category.id,
			};
		});

		try {
			this.categoryIdSet = JSON.parse(JSON.parse(_get(baseData, 'general.setting.value')));
		} catch (e) {
			// @todo - do we need an actual arror handler here?
			// console.log(e);
		}

		const categoryData = this.apollo.readQuery({
			query: categoriesByIdQuery,
			variables: { ids: _map(this.categoryIdSet, 'id') },
		});
		this.rows = _get(categoryData, 'lend.loanChannelsById');
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
		margin-top: rem-calc(20);
		padding: rem-calc(10);

		@include breakpoint(large) {
			p {
				max-width: 75%;
			}
		}
	}

	.loan-category-row {
		margin: 0 1rem rem-calc(20);
		@include breakpoint(medium down) {
			margin: 0 0.5rem rem-calc(20);
		}
	}
}
</style>
