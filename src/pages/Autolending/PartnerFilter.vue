<template>
	<div>
		<h4 class="tw-mb-2">
			Lending Partners
		</h4>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="partners"
					:items="partnersWithSelected"
					:use-columns="true"
					@update="onChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import _map from 'lodash/map';
import { gql } from 'graphql-tag';
import anyOrSelectedAutolendingFilter from '#src/plugins/any-or-selected-autolending-filter-mixin';
import autoLendingSelectedQuery from '#src/graphql/query/autolending/autoLendingSelected.graphql';
import { queryAllPartners } from '#src/util/autoLendingUtils';
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
		query: autoLendingSelectedQuery,
		preFetch: true,
		result({ data }) {
			this.currentPartnerIds = data?.autolending?.currentProfile?.loanSearchCriteria?.filters?.partner ?? [];
		},
	},
	async mounted() {
		this.partnersToDisplay = await queryAllPartners(this.apollo);
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
						id
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
