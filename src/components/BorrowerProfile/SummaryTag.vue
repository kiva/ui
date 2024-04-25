<template>
	<p
		:class="`${backgroundColor}`"
		class="tw-rounded
		tw-p-1
		tw-mb-0
		tw-mr-2
		tw-text-h4
		tw-inline-flex
		tw-items-center"
	>
		<slot></slot>
	</p>
</template>

<script>
export default {
	name: 'SummaryTag',
	props: {
		backgroundColor: {
			type: String,
			default: 'tw-bg-secondary',
		},
	}
};
</script>
