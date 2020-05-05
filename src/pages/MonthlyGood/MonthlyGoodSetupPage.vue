<template>
	<div>
		<monthly-good-setup-page-control
			v-if="showMGSetupControl"
			:amount="amount"
			:category="category"
			:onetime="onetime"
			:source="source"
		/>
		<monthly-good-setup-page-variant
			v-else
			:amount="amount"
			:category="category"
			:onetime="onetime"
			:source="source"
		/>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

import MonthlyGoodSetupPageControl from '@/pages/MonthlyGood/MonthlyGoodSetupPageControl';
import MonthlyGoodSetupPageVariant from '@/pages/MonthlyGood/MonthlyGoodSetupPageVariant';

const pageQuery = gql`{
	general {
		uiExperimentSetting(key: "mg_setup") {
			key
			value
		}
	}
}`;

export default {
	props: {
		amount: {
			type: Number,
			default: 25
		},
		category: {
			type: String,
			default: 'default'
		},
		onetime: {
			type: String,
			default: 'false'
		},
		source: {
			type: String,
			default: ''
		}
	},
	components: {
		MonthlyGoodSetupPageControl,
		MonthlyGoodSetupPageVariant
	},
	data() {
		return {
			showMGSetupControl: true
		};
	},
	inject: ['apollo'],
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: pageQuery
				}).then(() => {
					// Get the assigned experiment version for braintree pay with experiment
					client.query({ query: experimentAssignmentQuery, variables: { id: 'mg_setup' } })
						.then(resolve).catch(reject);
				}).catch(reject);
			});
		}
	},
	created() {
		// get experiment data from apollo cache
		// GROW-82: Redesigned monthly good receipt page.
		const mgSetupExp = this.apollo.readFragment({
			id: 'Experiment:mg_setup',
			fragment: experimentVersionFragment,
		}) || {};
		if (mgSetupExp.version === 'control') {
			this.$kvTrackEvent('MonthlyGood', 'EXP-GROW-82-May2020', 'a');
		} else if (mgSetupExp.version === 'shown') {
			this.showMGSetupControl = false;
			this.$kvTrackEvent('MonthlyGood', 'EXP-GROW-82-May2020', 'b');
		}
	}
};

</script>
