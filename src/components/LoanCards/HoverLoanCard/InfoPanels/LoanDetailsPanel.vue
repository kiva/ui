<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Loan Details
		</template>
		<p>Details about the loan.</p>
	</info-panel>
</template>

<script>
import InfoPanel from './InfoPanel';

export default {
	components: {
		InfoPanel,
	},
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
	computed: {
		elementId() {
			return `${this.loanId}-loan-details-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>
