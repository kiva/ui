<template>
	<kv-settings-card
		v-if="savedSearch.name"
		:title="savedSearch.name"
	>
		<template #content>
			<p
				class="tw-text-small tw-mb-2"
			>
				Sorted by {{ sortByText }}
			</p>
			<span>
				<kv-checkbox
					v-model="showAlerts"
					class="tw-mb-2"
				>
					Email me when new loans become available
				</kv-checkbox>
			</span>
			<hr
				class="tw-border-tertiary tw-mb-2"
			>
			<kv-button
				:href="savedSearch.url"
				class="tw-mr-2 tw-mb-2 md:tw-mb-0"
			>
				{{ viewLoansText }}
			</kv-button>
			<kv-button
				variant="secondary"
				@click="deleteSavedSearch(savedSearch.id)"
			>
				Delete Search
			</kv-button>
		</template>
	</kv-settings-card>
</template>

<script>
import gql from 'graphql-tag';
import { sortByNameToDisplay } from '@/util/loanSearch/filters/sortOptions';
import { getInputRange } from '@/api/fixtures/MinMaxRange';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	name: 'SaveSearchItem',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSettingsCard,
		KvButton,
		KvCheckbox
	},
	props: {
		savedSearch: {
			type: Object,
			default: () => {},
		}
	},
	data() {
		return {
			availableLoanCount: 0,
			showAlerts: this.savedSearch?.isAlert,
		};
	},
	computed: {
		sortByText() {
			const sortType = this.savedSearch?.loanSearchCriteria?.sortBy;
			return sortByNameToDisplay?.[sortType] ?? sortType;
		},
		viewLoansText() {
			return this.availableLoanCount > 0 ? `View ${this.availableLoanCount} loans` : 'View loans';
		}
	},
	mounted() {
		this.fetchAvailableLoanCount();
	},
	methods: {
		deleteSavedSearch(id) {
			this.apollo.mutate({
				mutation: gql`mutation deleteSearch($id: Int!) {
				my {
					deleteSavedSearch(id: $id)
				}
			}`,
				variables: {
					id
				},
			}).then(result => {
				const deleteSearchData = result?.data?.my?.deleteSavedSearch;
				this.$emit('delete-saved-search', { id: deleteSearchData ? id : null });
			});
		},
		emailAlert(isAlert) {
			this.apollo.mutate({
				mutation: gql`mutation updateSavedSearch($id: Int!, $savedSearch: SavedSearchUpdateInput!) {
					my {
						updateSavedSearch(id: $id, savedSearch: $savedSearch){
							id
							name
							isAlert
						}
					}
				}`,
				variables: {
					id: this.savedSearch?.id,
					savedSearch: { isAlert }
				}
			});
		},
		fetchAvailableLoanCount() {
			// extract our sortBy property
			const sortType = this.savedSearch?.loanSearchCriteria?.sortBy ?? 'popularity';
			// establish our new query filter object
			const activeFilters = {};
			// extract our saved search loan search criteria
			const lscFilters = this.savedSearch?.loanSearchCriteria?.filters ?? {};
			// TODO: Extend LoanSearchFilters.js methods getSearchableFilters + getInputFilters to handle a full LSC
			// loop through each item from our saved search LSC
			Object.keys(lscFilters).forEach(key => {
				// exclude __typename from new filter object
				if (key === '__typename') return false;
				// establish our new filter value in a modifiable state
				let filterValue = lscFilters[key];
				// check for, + augment new filter value
				if (filterValue !== null) {
					// check for nested min max values
					if (key === 'arrearsRate'
						|| key === 'avgBorrowerCost'
						|| key === 'defaultRate'
						|| key === 'lenderTerm'
						|| key === 'profitability'
						|| key === 'riskRating'
					) {
						// define without including __typename
						filterValue = getInputRange(filterValue);
					}
					// define final filter value
					activeFilters[key] = filterValue;
				}
			});

			// make our loan count query with newly formatted filter object
			this.apollo.query({
				query: gql`query savedSearchLoanCount(
					$sortBy: LoanSearchSortByEnum!,
					$filters: LoanSearchFiltersInput
				) {
					lend {
						loans(sortBy: $sortBy, filters: $filters) {
							totalCount
						}
					}
				}`,
				variables: {
					sortBy: sortType,
					filters: activeFilters
				},
			}).then(({ data }) => {
				this.availableLoanCount = data?.lend?.loans?.totalCount ?? 0;
			});
		}
	},
	watch: {
		showAlerts(next, prev) {
			if (next !== prev) {
				this.emailAlert(next);
			}
		}
	}
};
</script>
