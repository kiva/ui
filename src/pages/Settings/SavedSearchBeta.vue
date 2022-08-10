<template>
	<www-page
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<kv-grid>
				<h1 class="tw-mb-2">
					Saved Searches
				</h1>
			</kv-grid>

			<kv-grid class="tw-my-2">
				<save-search-item
					v-for="(search, index) in savedSearches"
					:key="index"
					:saved-search="search"
					@delete-saved-search="fetchSavedSearches(0)"
				/>
			</kv-grid>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import SaveSearchItem from '@/components/Settings/SaveSearchItem';
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'SavedSearchBeta',
	components: {
		SaveSearchItem,
		WwwPage,
		TheMyKivaSecondaryMenu,
		KvGrid,
		KvDefaultWrapper,
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
								isAlert
								url
								loanSearchCriteria{
									sortBy
								}
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
				this.savedSearches = [...savedSearchData?.values];
			});
		},
		deleteSavedSearch(payload) {
			console.log(payload);
		},
	}
};
</script>
