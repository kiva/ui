<template>
	<button class="tw-rounded tw-bg-tertiary tw-p-1 tw-uppercase tw-text-small tw-shrink-0">
		<slot></slot> X
	</button>
</template>

<script>
export default {
	name: 'KvChipClassic',
	props: {
		// eslint-disable-next-line vue/require-default-prop
		items: {
			type: Array,
			required: false,
		},
	},
	methods: {
		onChange(event) {
			this.$emit('change', event);
		},
	}
};
</script>

<style>

</style>
