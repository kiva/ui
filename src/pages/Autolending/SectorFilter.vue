<template>
	<div>
		<h4 class="tw-mb-2">
			Sectors
		</h4>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="sectors"
					:items="sectorsWithSelected"
					:use-columns="true"
					@change="onChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import { gql } from '@apollo/client';
import sectorListQuery from '@/graphql/query/autolending/sectorList.graphql';
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from './CheckList';

export default {
	name: 'SectorFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	data() {
		return {
			allSectors: [],
			currentSectorIds: [],
		};
	},
	apollo: {
		query: sectorListQuery,
		preFetch: true,
		result({ data }) {
			this.allSectors = _sortBy(_get(data, 'lend.sector') || [], 'name');
			this.currentSectorIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.sector') || [];
		},
	},
	computed: {
		sectorsWithSelected() {
			return _map(this.allSectors, ({ id, name }) => {
				return {
					id,
					name,
					selected: this.currentSectorIds.indexOf(id) > -1,
				};
			});
		},
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changeSectors(this.getValues(checked, values, this.currentSectorIds));
		},
		changeSectors(sectors) {
			this.apollo.mutate({
				mutation: gql`mutation updateSectors($sectors: [Int]) {
					autolending @client {
						id
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
