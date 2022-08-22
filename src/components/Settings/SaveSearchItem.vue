<template>
	<kv-settings-card
		v-if="savedSearch.name"
		:title="savedSearch.name"
	>
		<template #content>
			<p
				class="tw-text-small tw-mb-2"
			>
				Sorted by {{ savedSearch.loanSearchCriteria.sortBy }}
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
				View Loans
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
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	name: 'SaveSearchItem',
	data() {
		return {
			showAlerts: this.savedSearch?.isAlert,
			totalCount: 0,
		};
	},
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
			}).then(result => {
				const emailAlertData = result?.data?.my?.updateSaveSearch;
				console.log(emailAlertData);
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
