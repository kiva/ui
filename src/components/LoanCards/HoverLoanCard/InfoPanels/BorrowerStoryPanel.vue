<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Borrower story
		</template>
		<p>Lot's of stories and text.</p>
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
			return `${this.loanId}-borrower-story-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	}
};
</script>
