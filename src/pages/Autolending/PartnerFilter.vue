<template>
	<lightbox-filter
		plural-name="partners"
		:all-items="validPartners"
		:current-ids="currentIds"
		@change="changePartners"
	/>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import partnerListQuery from '@/graphql/query/autolending/partnerList.graphql';
import LightboxFilter from './LightboxFilter';

export default {
	inject: ['apollo'],
	components: {
		LightboxFilter,
	},
	data() {
		return {
			allPartners: [],
			currentIds: [],
		};
	},
	computed: {
		// Filter out the "N/A direct to ..." non-partners and sort by name
		validPartners() {
			const filtered = _filter(this.allPartners, partner => partner.name.indexOf('direct to') === -1);
			return _sortBy(filtered, 'name');
		},
	},
	apollo: {
		query: partnerListQuery,
		preFetch: true,
		result({ data }) {
			this.allPartners = _get(data, 'general.partners.values') || [];
			this.currentIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.partner') || [];
		},
	},
	methods: {
		changePartners(partners) {
			this.apollo.mutate({
				mutation: gql`mutation($partners: [Int]) {
					autolending @client {
						editProfile(profile: {
							loanSearchCriteria: {
								filters: {
									partner: $partners
								}
							}
						})
					}
				}`,
				variables: {
					partners: partners.length ? partners : null,
				}
			});
		},
	},
};
</script>
