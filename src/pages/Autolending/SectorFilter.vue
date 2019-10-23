<template>
	<lightbox-filter
		plural-name="sectors"
		:all-items="allSectors"
		:current-ids="currentIds"
		@change="changeSectors"
	/>
</template>

<script>
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import sectorListQuery from '@/graphql/query/autolending/sectorList.graphql';
import LightboxFilter from './LightboxFilter';

export default {
	inject: ['apollo'],
	components: {
		LightboxFilter,
	},
	data() {
		return {
			allSectors: [],
			currentIds: [],
		};
	},
	apollo: {
		query: sectorListQuery,
		preFetch: true,
		result({ data }) {
			this.allSectors = _sortBy(_get(data, 'lend.sector') || [], 'name');
			this.currentIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.sector') || [];
		},
	},
	methods: {
		changeSectors(sectors) {
			this.apollo.mutate({
				mutation: gql`mutation($sectors: [Int]) {
					autolending @client {
						editProfile(profile: {
							loanSearchCriteria: {
								filters: {
									sector: $sectors
								}
							}
						})
					}
				}`,
				variables: {
					sectors: sectors.length ? sectors : null,
				}
			});
		},
	},
};
</script>
