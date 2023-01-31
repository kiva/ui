<template>
	<div>
		<template v-for="tag in callouts">
			<div
				:key="tag"
				class="
				tw-rounded-full
				tw-bg-tertiary
				tw-font-medium
				tw-inline-flex
				tw-py-0.5
				tw-px-1
				tw-mr-0.5
				tw-text-small"
			>
				{{ tag }}
			</div>
		</template>
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
