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
		<div class="variant-panel" v-show="experimentEnabled">
			<experiment-variant-slide v-for="(variant, index) in variants" :key="index" :options="possibleCategories" />
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
import _fromPairs from 'lodash/fromPairs';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _map from 'lodash/map';
import _sum from 'lodash/sum';
import _values from 'lodash/values';
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
			controlName: 'control',
			experimentEnabled: false,
			experimentData: {},
			variants: [{
				name: 'thing',
				weight: 0.5,
				categories: []
			}],
			saving: false,
		};
	},
	computed: {
		categoriesByVariantId() {
			const pairs = _map(this.variants, ({ name, categories }) => [name, categories]);
			return _fromPairs(pairs);
		},
		controlWeight() {
			if (this.experimentEnabled) {
				return 1 - _sum(_values(this.variantWeights));
			}
			return 1;
		},
		changed() {
			const categoriesChanged = !_isEqual(this.setCategories, this.defaultCategories);
			const experimentChanged = !_isEqual(this.experimentData, this.localExperimentObject);
			return categoriesChanged || experimentChanged;
		},
		localExperimentObject() {
			return {
				name: 'CategoryRows',
				enabled: this.experimentEnabled,
				// start_time:
				// end_time:
				variants: this.categoriesByVariantId,
				distribution: {
					[this.controlName]: this.controlWeight,
					...this.variantWeights,
				},
			};
		},
		variantWeights() {
			const pairs = _map(this.variants, ({ name, weight }) => [name, weight]);
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
		setCategories: {
			handler() {
				this.reset();
			},
			immediate: true,
		}
	},
	methods: {
		addVariant() {
			this.variants.push({});
		},
		reset() {
			this.defaultCategories = _cloneDeep(this.setCategories);
		},
		save() {
			this.saving = true;
			this.apollo.mutate({
				mutation: setRowsMutation,
				variables: {
					categories: JSON.stringify(this.defaultCategories)
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

		& /deep/ .line {
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
