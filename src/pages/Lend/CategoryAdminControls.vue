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
import _isEqual from 'lodash/isEqual';
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
			saving: false,
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
	watch: {
		categories: {
			handler() {
				this.reset();
			},
			immediate: true,
		}
	},
	methods: {
		reset() {
			this.defaultCategories = _cloneDeep(this.categories);
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
