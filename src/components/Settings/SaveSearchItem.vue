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
				:href="savedSearchUrl"
				class="tw-mr-2 tw-mb-2 md:tw-mb-0"
			>
				View loans
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
import { gql } from 'graphql-tag';
import { sortByNameToDisplay } from '#src/util/loanSearch/filters/sortOptions';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import { KvButton, KvCheckbox } from '@kiva/kv-components';

export default {
	name: 'SaveSearchItem',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSettingsCard,
		KvButton,
		KvCheckbox
	},
	emits: ['delete-saved-search'],
	props: {
		savedSearch: {
			type: Object,
			default: () => {},
		}
	},
	data() {
		return {
			showAlerts: this.savedSearch?.isAlert,
		};
	},
	computed: {
		savedSearchUrl() {
			// augment url for lend/filter compatibility
			let ssUrl = this.savedSearch?.url ?? '';
			// update url with lend/filter path
			ssUrl = ssUrl.replace('lend', 'lend/filter');
			// remove loanLimit of -1 which is equivalent to not being set
			if (ssUrl.indexOf('loanLimit=-1') > -1) {
				ssUrl = ssUrl.replace(/loanLimit=-1/, '');
			}
			// clear up any duplicate separators
			ssUrl = ssUrl.replace(/\?&/, '?').replace(/&&/, '&');
			// return augmented url
			return ssUrl;
		},
		sortByText() {
			const sortType = this.savedSearch?.loanSearchCriteria?.sortBy;
			return sortByNameToDisplay?.[sortType] ?? sortType;
		},
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
