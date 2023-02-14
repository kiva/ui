<template>
	<div class="tw-overflow-hidden" style="width: inherit;">
		<div
			class="
				tw-flex
				tw-whitespace-nowrap
				tw-w-full
				tw-h-4
			"
		>
			<span
				v-for="tag in callouts"
				:key="tag"
				:title="tag"
				class="
					loan-callout
					tw-text-ellipsis
					tw-overflow-hidden
					tw-rounded-full
					tw-bg-tertiary
					tw-font-medium
					tw-py-0.5
					tw-px-1
					tw-mr-0.5
					tw-mb-0.5
					tw-text-small
				"
			>
				{{ tag }}
			</span>
		</div>
	</div>
</template>

<script>
import { loanCallouts } from '@/util/loanUtils';

export default {
	name: 'LoanCallouts',
	props: {
		loan: {
			type: Object,
			default: () => ({})
		},
		categoryPageName: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			callouts: [],
		};
	},
	mounted() {
		// Render client-side to prevent call outs from changing on page load due to random selections
		this.callouts = loanCallouts(this.loan, this.categoryPageName);
	},
};
</script>

<style scoped>
.loan-callout {
	max-width: 50%;
	background: #f1f1f1;
}
</style>
