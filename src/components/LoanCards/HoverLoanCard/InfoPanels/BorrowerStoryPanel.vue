<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Borrower story
		</template>
		<p>{{ loanStory }}</p>
		<p>{{ whySpecial }}</p>
		<p>{{ partnerName }}</p>
		<p>{{ partnerRiskRating }}</p>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import InfoPanel from './InfoPanel';
import expandableLoanCardStoryQuery from '@/graphql/query/expandableLoanCardStory.graphql';

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
			type: String,
			default: '',
		},
	},
	data() {
		return {
			loanStory: 'test',
			whySpecial: 'test',
			partnerName: 'test',
			partnerRiskRating: 'test'
		};
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: expandableLoanCardStoryQuery
			}).then(({ data }) => {
				this.loanStory = _get(data, 'lend.loan.description');
				this.whySpecial = _get(data, 'lend.loan.whySpecial');
				this.partnerName = _get(data, 'lend.loan.LoanPartner.partnerName');
				this.partnerRiskRating = _get(data, 'lend.loan.LoanPartner.partner.riskRating');
			});
		}
	},
	computed: {
		elementId() {
			return `${this.loanId}-borrower-story-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	}
};
</script>
