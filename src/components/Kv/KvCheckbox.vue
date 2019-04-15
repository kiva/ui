<template>
	<label class="kv-checkbox">
		<input
			v-if="isControlledComponent"
			type="checkbox"
			:checked="isChecked"
			@change="handleChange"
			@input="handleInput"
		>
		<input
			v-else
			type="checkbox"
			v-model="checkboxStatus"
			@change="handleChange"
			@input="handleInput"
		>
		<slot v-if="hasDefaultSlot"></slot>
		<span v-else-if="label">{{ label }}</span>
	</label>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: null
		},
		isChecked: {
			type: Boolean,
			default: null,
		},
	},
	data() {
		return {
			checkboxStatus: false,
		};
	},
	computed: {
		hasDefaultSlot() {
			return !!this.$slots.default;
		},
		isControlledComponent() {
			return this.isChecked !== null;
		},
	},
	methods: {
		handleChange() {
			this.$emit('checkbox-toggled', this.checkboxStatus);
		},
		handleInput() {
			this.$emit('checkbox-input', this.checkboxStatus);
		},
	},
};
</script>

