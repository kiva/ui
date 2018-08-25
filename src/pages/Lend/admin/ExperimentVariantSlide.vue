<template>
	<experiment-slide v-bind="$attrs" v-on="$listeners">
		<h3>{{ variantName }}</h3>
		<label>
			Key: {{ variantName | kebabCase }}
		</label>
		<label>
			Variant name: <input type="text" v-model="variantName">
		</label>
		<label>
			Weight: <input type="number" v-model="variantWeight" min="0" max="100"> %
		</label>
		<kv-button @click.native="$emit('remove')" class="setting">
			Remove
		</kv-button>
	</experiment-slide>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import ExperimentSlide from './ExperimentSlide';

export default {
	components: {
		ExperimentSlide,
		KvButton,
	},
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: '',
		},
		weight: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			variantName: '',
			variantWeight: 0,
		};
	},
	watch: {
		variantName(variantName) {
			if (this.name !== variantName) {
				this.$emit('update:name', variantName);
			}
		},
		variantWeight(variantWeight) {
			const weight = Number(variantWeight) / 100;
			if (this.weight !== weight) {
				this.$emit('update:weight', weight);
			}
		},
		name: {
			handler(name) {
				this.variantName = name;
			},
			immediate: true,
		},
		weight: {
			handler(weight) {
				this.variantWeight = weight * 100;
			},
			immediate: true,
		}
	},
};
</script>
