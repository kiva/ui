<template>
	<div
		class="kv-controlled-checkbox"
		@click="handleInput"
		@keypress="handleKeyPressContainer"
		:tabindex="tabindex"
	>
		<label class="kv-controlled-checkbox-label">
			<input
				type="checkbox"
				:checked="isChecked"
				aria-hidden="true"
				role="presentation"
				tabindex="-1"
			>
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
		},
		isChecked: {
			type: Boolean,
			default: null,
		},
		tabindex: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		hasDefaultSlot() {
			return !!this.$slots.default;
		},
	},
	methods: {
		handleInput() {
			this.$emit('checkbox-input');
		},
		handleKeyPressContainer(event) {
			if (event.keyCode === 32) {
				this.handleInput();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-controlled-checkbox {
	.kv-controlled-checkbox-label {
		pointer-events: none;
	}
}
</style>
