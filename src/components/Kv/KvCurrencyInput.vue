<template>
	<kv-text-input
		type="text"
		ref="kvCurrencyInputRef"
		v-model="displayValue"
		@blur="isInputActive = false"
		@focus="isInputActive = true"
		placeholder="$"
		:id="id"
	/>
</template>

<script>
import numeral from 'numeral';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'KvCurrencyInput',
	components: {
		KvTextInput
	},
	props: {
		value: {
			type: Number,
			default: 0,
		},
		id: {
			type: String,
			default: '',
		},
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
				return numeral(this.value).format('$0,0.00');
			},
			set(modifiedValue) {
				// Recalculate value after ignoring "$" and "," in user input
				// ensure value is a number
				let newValue = numeral(modifiedValue).value() || 0;
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
