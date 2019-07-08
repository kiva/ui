<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Field Partner info
		</template>
		<p>Details about the Field Partner.</p>
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
			type: String,
			default: '',
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-partner-info-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>
