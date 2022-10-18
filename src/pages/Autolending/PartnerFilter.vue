<template>
	<div>
		<h4 class="tw-mb-2">
			Field Partners
		</h4>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="partners"
					:items="partnersWithSelected"
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
import partnerListQuery from '@/graphql/query/autolending/partnerList.graphql';
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from './CheckList';

export default {
	name: 'PartnerFilter',
	inject: ['apollo', 'cookieStore'],
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	data() {
		return {
			partnersToDisplay: [],
			currentPartnerIds: [],
		};
	},
	apollo: {
		query: partnerListQuery,
		preFetch: true,
		result({ data }) {
			// Filter out the "N/A direct to ..." non-partners and sort by name
			const allPartners = _get(data, 'general.partners.values') || [];
			const nonDirectPartners = allPartners.filter(partner => partner.name.indexOf('direct to') === -1);

			this.partnersToDisplay = _sortBy(nonDirectPartners, 'name');
			this.currentPartnerIds = _get(data, 'autolending.currentProfile.loanSearchCriteria.filters.partner') || [];
		},
	},
	computed: {
		partnersWithSelected() {
			return _map(this.partnersToDisplay, ({ id, name }) => {
				return {
					id,
					name,
					selected: this.currentPartnerIds.indexOf(id) > -1,
				};
			});
		},
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changePartners(this.getValues(checked, values, this.currentPartnerIds));
		},
		changePartners(partners) {
			this.apollo.mutate({
				mutation: gql`mutation updatePartners($partners: [Int]) {
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
