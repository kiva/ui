<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Borrower story
		</template>
		<p v-html="loanStory"></p>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import InfoPanel from './InfoPanel';
import loanDescriptionQuery from '@/graphql/query/loanDescription.graphql';

export default {
	components: {
		InfoPanel,
	},
	inject: ['apollo'],
	props: {
		expandable: {
			type: Boolean,
			default: true,
		},
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			loanStory: ''
		};
	},
	created() {
		this.apollo.query({
			// TODO: RENAME THIS QUERY
			query: loanDescriptionQuery,
			variables: {
				id: parseInt(this.loanId, 10)
			}
		}).then(({ data }) => {
			console.log(data);
			this.loanStory = _get(data, 'lend.loan.description');
			this.whySpecial = _get(data, 'lend.loan.whySpecial');
			this.partnerName = _get(data, 'lend.loan.LoanPartner.partnerName');
			this.partnerRiskRating = _get(data, 'lend.loan.LoanPartner.partner.riskRating');
		});
	},
	computed: {
		elementId() {
			return `${this.loanId}-borrower-story-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>
