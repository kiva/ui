<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Trustee info
		</template>
		<p>Details about the Trustee.</p>
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
			return `${this.loanId}-trustee-info-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>
