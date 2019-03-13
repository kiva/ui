<template>
	<div class="kv-checkbox">
		<label>
			<input
				type="checkbox"
				v-model="checkboxStatus"
				@change="handleChange">
			<slot v-if="hasDefaultSlot"></slot>
			<span v-else-if="label">{{ label }}</span>
		</label>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			checkboxStatus: ''
		};
	},
	computed: {
		hasDefaultSlot() {
			return !!this.$slots.default;
		},
	},
	methods: {
		handleChange() {
			this.$emit('checkbox-toggled', this.checkboxStatus);
		}
	},
};
</script>

