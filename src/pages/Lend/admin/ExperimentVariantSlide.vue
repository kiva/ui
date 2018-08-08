<template>
	<experiment-slide v-bind="$attrs" v-on="$listeners">
		<h2>{{ variantName }}</h2>
		<label>
			Variant name: <input type="text" v-model="variantName">
		</label>
		<label>
			Weight: <input type="number" v-model="variantWeight" min="0" max="100"> %
		</label>
	</experiment-slide>
</template>

<script>
import ExperimentSlide from './ExperimentSlide';

export default {
	components: {
		ExperimentSlide,
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
			variantName: this.name,
			variantWeight: this.weight,
		};
	},
};
</script>
