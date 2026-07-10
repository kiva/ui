<template>
	<kv-switch
		v-model="model"
		data-testid="bp-rail-details-toggle"
	>
		Show loan details in the sidebar
	</kv-switch>
</template>

<script>
import { KvSwitch } from '@kiva/kv-components';

export default {
	name: 'LoanDetailsRailToggle',
	components: {
		KvSwitch,
	},
	props: {
		modelValue: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue'],
	computed: {
		model: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit('update:modelValue', value);
			},
		},
	},
};
</script>
