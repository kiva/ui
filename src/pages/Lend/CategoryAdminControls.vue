<template>
	<div class="admin-controls">
		<experiment-control-slide
			:categories.sync="defaultCategories"
			:weight="controlWeight"
			:options="possibleCategories"
		/>
		<div class="experiment-controls">
			<label>
				Enable experiment: <input type="checkbox" v-model="experimentEnabled">
			</label>
			<label>
				Start time: <input type="datetime-local">
			</label>
			<label>
				End time: <input type="datetime-local">
			</label>
		</div>
		<experiment-variant-slide v-show="experimentEnabled" :options="possibleCategories" />
		<kv-button v-show="experimentEnabled" class="setting">
			+ Add variant
		</kv-button>
		<kv-button @click.native="save" :disabled="!changed">
			Save
		</kv-button>
	</div>
</template>

<script>
import _clone from 'lodash/clone';
import _isEqual from 'lodash/isEqual';
import KvButton from '@/components/Kv/KvButton';
import ExperimentControlSlide from './ExperimentControlSlide';
import ExperimentVariantSlide from './ExperimentVariantSlide';

export default {
	components: {
		ExperimentControlSlide,
		ExperimentVariantSlide,
		KvButton,
	},
	inject: ['apollo'],
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		possibleCategories: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			defaultCategories: [],
			experimentEnabled: false,
			variants: [],
		};
	},
	computed: {
		controlWeight() {
			if (this.experimentEnabled) {
				return 0; // TODO: calc based on all variants weight
			}
			return 100;
		},
		changed() {
			return !_isEqual(this.categories, this.defaultCategories);
		},
	},
	methods: {
		save() {
			console.log(this.defaultCategories);
		}
	},
	created() {
		this.defaultCategories = _clone(this.categories);
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.admin-controls {
	margin-bottom: 1rem;
}

.experiment-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 1rem;

	label {
		display: flex;
		align-items: center;
		white-space: nowrap;

		input {
			margin: 0 0 0 0.25rem;
		}
	}
}
</style>
