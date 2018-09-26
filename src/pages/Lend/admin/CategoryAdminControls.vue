<template>
	<div class="admin-controls">
		<h2>Category Rows admin controls</h2>
		<experiment-control-slide
			:categories.sync="defaultCategories"
			:name.sync="controlName"
			:weight="controlWeight"
			:options="possibleCategories"
		/>
		<div class="experiment-controls">
			<label>
				Enable experiment: <input type="checkbox" v-model="experimentEnabled">
			</label>
			<label>
				Start time: <input type="datetime-local" v-model="experimentStart">
			</label>
			<label>
				End time: <input type="datetime-local" v-model="experimentEnd">
			</label>
		</div>
		<div class="variant-panel" v-show="experimentEnabled">
			<experiment-variant-slide
				v-for="(variant, index) in variants"
				:key="index"
				:options="possibleCategories"
				:categories.sync="variant.categories"
				:name.sync="variant.name"
				:weight.sync="variant.weight"
				@remove="removeVariant(variant)"
			/>
			<kv-button @click.native="addVariant" class="setting">
				+ Add variant
			</kv-button>
		</div>
		<div class="bottom-button-row">
			<kv-button @click.native="reset" v-if="changed" class="secondary">
				Reset
			</kv-button>
			<kv-button @click.native="save" :disabled="!changed">
				<span v-if="!saving">
					Save
				</span>
				<span v-else>
					<kv-loading-spinner /> Saving
				</span>
			</kv-button>
		</div>
	</div>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep';
import _filter from 'lodash/filter';
import _fromPairs from 'lodash/fromPairs';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _sum from 'lodash/sum';
import _values from 'lodash/values';
import kebabCase from '@/util/kebabCase';
import { readJSONSetting } from '@/util/settingsUtils';
import categoryAdminQuery from '@/graphql/query/categoryAdminControl.graphql';
import setRowsMutation from '@/graphql/mutation/setCategoryRows.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import ExperimentControlSlide from './ExperimentControlSlide';
import ExperimentVariantSlide from './ExperimentVariantSlide';

export default {
	components: {
		ExperimentControlSlide,
		ExperimentVariantSlide,
		KvButton,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	data() {
		return {
			setCategories: [],
			defaultCategories: [],
			possibleCategories: [],
			controlName: 'Control',
			experimentEnabled: false,
			experimentStart: '',
			experimentEnd: '',
			experimentData: {},
			variants: [],
			saving: false,
		};
	},
	computed: {
		// calc the wieght of the control based on the weights assigned to the variants
		controlWeight() {
			if (this.experimentEnabled) {
				return 1 - _sum(_values(this.variantWeights));
			}
			return 1;
		},
		// Determine if the user has made changes
		changed() {
			const categoriesChanged = !_isEqual(this.setCategories, this.defaultCategories);
			const experimentChanged = !_isEqual(this.experimentData, this.localExperimentObject);
			return categoriesChanged || experimentChanged;
		},
		filteredVariants() {
			return this.experimentEnabled ? _filter(this.variants, ({ name }) => !!name) : [];
		},
		localExperimentObject() {
			const controlKey = kebabCase(this.controlName);
			return {
				name: 'CategoryRows',
				enabled: this.experimentEnabled,
				startTime: this.experimentStart,
				endTime: this.experimentEnd,
				control: {
					key: controlKey,
					name: this.controlName,
				},
				variants: this.variantData,
				distribution: {
					[controlKey]: this.controlWeight,
					...this.variantWeights,
				},
			};
		},
		variantData() {
			const pairs = _map(this.filteredVariants, ({ name, categories }) => {
				return [kebabCase(name), { name, categories }];
			});
			return _fromPairs(pairs);
		},
		variantWeights() {
			const pairs = _map(this.filteredVariants, ({ name, weight }) => [kebabCase(name), weight]);
			return _fromPairs(pairs);
		},
	},
	apollo: {
		query: categoryAdminQuery,
		result({ data }) {
			this.possibleCategories = _map(_get(data, 'lend.loanChannels.values'), category => {
				return {
					label: category.name,
					value: category.id,
				};
			});
			this.setCategories = readJSONSetting(data, 'general.rows.value');
			this.experimentData = readJSONSetting(data, 'general.experiment.value');
		},
	},
	watch: {
		setCategories(categories) {
			this.setFromCategoriesData(categories);
		},
		experimentData(data) {
			this.setFromExperimentData(data);
		},
	},
	methods: {
		addVariant() {
			this.variants.push({});
		},
		removeVariant(variant) {
			this.variants.splice(this.variants.indexOf(variant), 1);
		},
		reset() {
			this.setFromCategoriesData(this.setCategories);
			this.setFromExperimentData(this.experimentData);
		},
		save() {
			this.saving = true;
			this.apollo.mutate({
				mutation: setRowsMutation,
				variables: {
					categories: JSON.stringify(this.defaultCategories),
					experiment: JSON.stringify(this.localExperimentObject),
				},
			}).then(({ errors }) => {
				if (errors) {
					errors.forEach(({ message }) => this.$showTipMsg(message, 'warning'));
				} else {
					return this.apollo.query({
						query: categoryAdminQuery,
						fetchPolicy: 'network-only',
					});
				}
			}).finally(() => {
				this.saving = false;
			});
		},
		setFromCategoriesData(categories) {
			this.defaultCategories = _cloneDeep(categories);
		},
		setFromExperimentData(data) {
			this.controlName = _get(data, 'control.name') || 'Control';
			this.experimentEnabled = _get(data, 'enabled') || false;
			this.experimentStart = _get(data, 'startTime') || '';
			this.experimentEnd = _get(data, 'endTime') || '';
			this.variants = _map(_get(data, 'variants'), ({ categories, name }, key) => {
				return {
					name,
					categories,
					weight: _get(data, `distribution.${key}`),
				};
			});
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.admin-controls {
	margin-bottom: 1rem;

	.button .loading-spinner {
		width: 1.5rem;
		height: 1.5rem;
		vertical-align: bottom;

		& >>> .line {
			background-color: $white;
		}
	}
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

.variant-panel {
	margin-top: 1rem;
}

.bottom-button-row {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-top: 1rem;

	.button {
		margin-left: 1rem;
	}
}
</style>
