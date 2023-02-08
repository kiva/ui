<template>
	<div class="tw-overflow-hidden" style="width:inherit;">
		<div
			class="
				tw-text-ellipsis
				tw-overflow-hidden
				tw-inline-block
				tw-whitespace-nowrap
				tw-w-full
				tw-h-4
				"
		>
			<template v-for="tag in callouts">
				<span
					:key="tag"
					class="
                callout
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
			</template>
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
