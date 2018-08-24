<template>
	<experiment-slide v-bind="$attrs" v-on="$listeners">
		<h2>Control <small>(default categories)</small></h2>
		<label>
			Weight: {{ weight | numeral('0.[00000000]%') }}
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
		weight: {
			type: Number,
			default: 0,
		},
	},
};
</script>
