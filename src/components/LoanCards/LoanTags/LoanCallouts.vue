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
export default {
	name: 'LoanCallouts',
	props: {
		callouts: {
			type: Array,
			required: true
		}
	},
};
</script>

<style scoped>
.loan-callout {
	background: #f1f1f1;
}
</style>
