<template>
	<www-page class="lend-by-category-page">
		<div class="row">
			<div class="heading-region column small-12">
				<h1 @click="isAdmin=!isAdmin">Make a loan, change a life</h1>
				<p class="page-subhead">Each Kiva loan helps people build a better future for
				themselves and their families. <br class="xxlu">Browse loans by category below, or
					<router-link :to="{ path: '/lend'}">view all loans</router-link>.
				</p>
			</div>
		</div>

		<div>
			<category-row
				class="loan-category-row"
				v-for="category in categoryIdSet"
				:key="category.id"
				:loan-channel="category.id"
			/>
		</div>

		<div class="row" v-if="isAdmin">
			<div class="columns small-12">
				<category-admin-controls
					:categories="categoryIdSet"
				/>
			</div>
		</div>
	</www-page>
</template>

<script>
import _map from 'lodash/map';
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
			categoryIdSet: [],
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
		// Read the array of channel objects from the cache
		const baseData = this.apollo.readQuery({ query: lendByCategoryQuery });
		this.categoryIdSet = readJSONSetting(baseData, 'general.setting.value') || [];

		// Watch for changes to the setting value
		this.apollo.watchQuery({ query: lendByCategoryQuery }).subscribe({
			next: ({ data }) => {
				this.categoryIdSet = readJSONSetting(data, 'general.setting.value') || [];
			},
		});
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
		@media (hover: none) {
			margin-left: rem-calc(8);
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
		@include breakpoint(medium down) {
			margin: 0 0.5rem rem-calc(20);
		}
	}
}
</style>
