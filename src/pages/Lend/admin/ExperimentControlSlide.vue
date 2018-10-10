<template>
	<experiment-slide v-bind="$attrs" v-on="$listeners">
		<h3>{{ controlName }} <small>(default categories)</small></h3>
		<label>
			Key: {{ controlName | changeCase('param') }}
		</label>
		<label>
			name: <input type="text" v-model="inputName" :placeholder="defaultName">
		</label>
		<label>
			Weight: {{ weight | numeral('0.[00000000]%') }}
		</label>
	</experiment-slide>
</template>

<script>
import ExperimentSlide from './ExperimentSlide';

const defaultName = 'Control';

export default {
	components: {
		ExperimentSlide,
	},
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: defaultName,
		},
		weight: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			inputName: '',
			defaultName,
		};
	},
	computed: {
		controlName() {
			return this.inputName === '' ? this.defaultName : this.inputName;
		}
	},
	watch: {
		name: {
			handler(name) {
				if (name !== this.controlName) {
					if (name === defaultName) {
						this.inputName = '';
					} else {
						this.inputName = name;
					}
				}
			},
			immediate: true,
		},
		controlName(controlName) {
			if (controlName !== this.name) {
				this.$emit('update:name', controlName);
			}
		},
	}
};
</script>
