<template>
	<www-page
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="row-column">
				<h2 class="tw-mb-2 tw-justify-start">
					Saved Searches
				</h2>
			</kv-grid>

			<div>
				<kv-grid class="tw-row-col tw-p-6 tw-m-1">
					<save-search-item
						v-for="(search, index) in savedSearches"
						class="tw-grid tw-grid-col-1 tw-gap-4 tw-rounded tw-border-transparent
						tw-max-w-lg tw-bg-primary"
						:key="index"
						:saved-search="search"
					/>
				</kv-grid>
			</div>
		</kv-page-container>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import SaveSearchItem from '@/components/Settings/SaveSearchItem';
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'SavedSearchBeta',
	components: {
		SaveSearchItem,
		WwwPage,
		TheMyKivaSecondaryMenu,
		KvGrid,
		KvPageContainer,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			totalCount: 0,
			savedSearches: () => [],
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
