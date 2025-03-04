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

			<kv-grid class="tw-my-2 tw-relative">
				<save-search-item
					v-for="(search, index) in savedSearches"
					:key="index"
					:saved-search="search"
					@delete-saved-search="handleDeletion"
				/>
				<kv-section-modal-loader :loading="loading" bg-color="secondary" size="large" />
				<div
					v-if="!loading && showLoadMoreButton"
					class="tw-my-2 tw-text-center"
				>
					<kv-button
						variant="secondary"
						class="tw-m-4 tw-center"
						@click="loadMore"
					>
						Load more
					</kv-button>
				</div>
			</kv-grid>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import { gql } from 'graphql-tag';
import mySavedSearches from '#src/graphql/query/mySavedSearches.graphql';
import SaveSearchItem from '#src/components/Settings/SaveSearchItem';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';
import KvSectionModalLoader from '#src/components/Kv/KvSectionModalLoader';
import { KvButton, KvGrid } from '@kiva/kv-components';

const pageQuery = gql`query savedSearchPage {
	my {
		id
		savedSearches {
			totalCount
		}
	}
}`;

export default {
	name: 'SavedSearch',
	components: {
		KvButton,
		KvDefaultWrapper,
		KvGrid,
		KvSectionModalLoader,
		SaveSearchItem,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			limit: 10,
			loading: true,
			offset: 0,
			savedSearches: [],
			totalCount: 0,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.totalCount = data?.my?.savedSearches?.totalCount ?? 0;
		},
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
			this.loading = true;
			this.apollo.query({
				query: mySavedSearches,
				variables: {
					offset,
					limit: this.limit
				},
			}).then(result => {
				const savedSearchData = result?.data?.my?.savedSearches;
				const fetchedSavedSearches = [...(savedSearchData?.values ?? [])];
				const existingSavedSearches = this.savedSearches;
				this.savedSearches = [...existingSavedSearches, ...fetchedSavedSearches];
				this.loading = false;
			});
		},
		handleDeletion(payload) {
			// remove the deleted saved search from our savedSearches array
			this.savedSearches = this.savedSearches.filter(search => {
				return search?.id !== payload?.id;
			});
		},
		loadMore() {
			this.offset = this.limit + this.offset;
			this.fetchSavedSearches(this.offset);
		},
	}
};
</script>
