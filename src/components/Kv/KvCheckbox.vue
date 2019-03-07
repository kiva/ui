<template>
	<div class="kv-checkbox">
		<label>
			<input
				type="checkbox"
				v-model="checkboxStatus"
				@change="handleChange">
			<span v-if="label">{{ label }}</span>
		</label>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			checkboxStatus: ''
		};
	},
	methods: {
		handleChange() {
			this.$emit('checkbox-toggled', this.checkboxStatus);
		}
	},
};
</script>

