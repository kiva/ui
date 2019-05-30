<template>
	<div
		class="kv-controlled-checkbox"
		@click="handleInput"
		@keypress="handleKeyPressContainer"
		:tabindex="tabindex"
		role="checkbox"
		:aria-checked="ariaChecked"
	>
		<label class="kv-controlled-checkbox-label">
			<input
				type="checkbox"
				:checked="checked"
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
			default: null,
		},
		checked: {
			type: Boolean,
			required: true,
		},
		tabindex: {
			type: Number,
			default: 0,
		},
	},
	computed: {
		ariaChecked() {
			return this.checked ? 'true' : 'false';
		},
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
		color: $charcoal;
		pointer-events: none;
	}

	&:focus {
		outline: none;
	}
}
</style>
