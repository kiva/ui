<template>
	<input
		type="text"
		v-model="displayValue"
		@blur="isInputActive = false"
		@focus="isInputActive = true"
		placeholder="$"
	>
</template>

<script>
export default {
	props: {
		value: {
			type: Number,
			default: 0,
		}
	},
	data() {
		return {
			isInputActive: false
		};
	},
	computed: {
		displayValue: {
			get() {
				if (this.isInputActive) {
					// Cursor is inside the input field. unformat display value for user
					return this.value.toString();
				}
				// User is not modifying now. Format display value for user interface
				return `$ ${this.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')}`;
			},
			set(modifiedValue) {
				// Recalculate value after ignoring "$" and "," in user input
				let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ''));
				// Ensure that it is not NaN
				if (Number.isNaN(newValue)) {
					newValue = 0;
				}
				// Round to 2 decimal places
				if (!Number.isInteger(newValue)) {
					newValue = parseFloat(newValue.toFixed(2));
				}
				// $emit the event to the parent component
				this.$emit('input', newValue);
			}
		}
	}
};
</script>
