<template>
	<www-page>
		<kv-page-container>
			<kv-grid class="tw-pt-4 md:tw-pt-6 lg:tw-pt-8">
				<h1 class="tw-mb-2">
					Saved searches
				</h1>
			</kv-grid>
			<kv-grid class="md:tw-pt-6 lg:tw-pt-8">
				<div
					v-for="(search, index) in savedSearches"
					:key="index"
				>
					{{ search.name }}
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'SavedSearchBeta',
	components: {
		WwwPage,
		KvGrid,
		KvPageContainer,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			totalCount: 0,
			savedSearches: () => []
		};
	},
	created() {
		this.fetchSavedSearches();
	},
	methods: {
		fetchSavedSearches(offset = 0) {
			this.apollo.query({
				query: gql`query savedSearches($offset: Int) {
					my { 
						savedSearches(offset: $offset){ 
							totalCount
							values {
								id
								name
							} 
						}
					}
					
				}`,
				variables: {
					offset
				},
			}).then(result => {
				const savedSearchData = result?.data?.my?.savedSearches;
				this.totalCount = savedSearchData?.totalCount ?? 0;
				this.savedSearches = [...savedSearchData.values];
			});
		}
	}
};
</script>
