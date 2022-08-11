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
				<div
					v-if="showLoadMoreButton"
				>
					<kv-button
						variant="secondary"
						class="tw-m-4 tw-center"
						@click="loadMore"
					/>
				</div>
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
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'SavedSearchBeta',
	components: {
		SaveSearchItem,
		WwwPage,
		TheMyKivaSecondaryMenu,
		KvButton,
		KvGrid,
		KvDefaultWrapper,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			totalCount: 0,
			savedSearches: [],
			offset: 0,
			limit: 40 // TODO: Limit is curretntly 40 because of an error via (totalCount) API

		};
	},
	created() {
		this.fetchSavedSearches();
	},
	computed: {
		showLoadMoreButton() {
			return this.totalCount > this.savedSearches.length;
		}

	},
	methods: {
		fetchSavedSearches(offset = 0) {
			this.apollo.query({
				query: gql`query savedSearches($offset: Int, $limit: Int) {
					my { 
						savedSearches(offset: $offset, limit: $limit){ 
							totalCount
							values {
								id
								name
								isAlert
								url
							} 
						}
					}
					
				}`,
				variables: {
					offset,
					limit: this.limit
				},
			}).then(result => {
				const savedSearchData = result?.data?.my?.savedSearches;
				this.totalCount = savedSearchData?.totalCount ?? 0;
				const fetchedSavedSearches = [...savedSearchData?.values];
				const existingSavedSearches = this.savedSearches;
				this.savedSearches = [...existingSavedSearches, ...fetchedSavedSearches];
			});
		},
		loadMore() {
			this.offset = this.limit + this.offset;
			this.fetchSavedSearches(this.offset);
		}
	}
};
</script>
