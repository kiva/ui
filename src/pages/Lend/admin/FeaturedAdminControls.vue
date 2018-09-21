<template>
	<div class="row featured-admin-controls">
		<div class="columns small-12">
			<h2>Featured Loans admin controls</h2>
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
				<label class="full-width">
					Show Featured Loans section to <input
						type="number"
						v-model="groupWeight"
						:disabled="!experimentEnabled"
						min="0"
						max="100"
					>% of visitors. Hidden from {{ controlWeight | numeral('0.[00000000]%') }} of visitors.
				</label>
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
	</div>
</template>

<script>
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { readJSONSetting } from '@/util/settingsUtils';
import expDataQuery from '@/graphql/query/featuredLoansControl.graphql';
import setExpMutation from '@/graphql/mutation/setFeaturedLoans.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvButton,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	data() {
		return {
			experimentEnabled: false,
			experimentStart: '',
			experimentEnd: '',
			experimentData: {},
			groupWeight: 0,
			saving: false,
		};
	},
	computed: {
		changed() {
			return !_isEqual(this.experimentData, this.localExperimentObject);
		},
		controlWeight() {
			return 1 - this.weight;
		},
		localExperimentObject() {
			return {
				name: 'FeaturedLoans',
				enabled: this.experimentEnabled,
				startTime: this.experimentStart,
				endTime: this.experimentEnd,
				control: {
					key: 'control',
					name: 'Control',
				},
				distribution: {
					control: this.controlWeight,
					shown: this.weight,
				},
			};
		},
		weight() {
			return Number(this.groupWeight) / 100;
		},
	},
	apollo: {
		query: expDataQuery,
		result({ data }) {
			this.experimentData = readJSONSetting(data, 'general.experiment.value');
		},
	},
	watch: {
		experimentData(data) {
			this.setFromExperimentData(data);
		},
	},
	methods: {
		reset() {
			this.setFromExperimentData(this.experimentData);
		},
		save() {
			this.saving = true;
			this.apollo.mutate({
				mutation: setExpMutation,
				variables: {
					experiment: JSON.stringify(this.localExperimentObject),
				},
			}).then(({ errors }) => {
				if (errors) {
					errors.forEach(({ message }) => this.$showTipMsg(message, 'warning'));
				} else {
					return this.apollo.query({
						query: expDataQuery,
						fetchPolicy: 'network-only',
					});
				}
			}).finally(() => {
				this.saving = false;
			});
		},
		setFromExperimentData(data) {
			this.experimentEnabled = _get(data, 'enabled') || false;
			this.experimentStart = _get(data, 'startTime') || '';
			this.experimentEnd = _get(data, 'endTime') || '';
			this.groupWeight = Number(_get(data, 'distribution.shown') || 0) * 100;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.featured-admin-controls {
	.experiment-controls {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	label {
		display: flex;
		align-items: center;
		white-space: nowrap;
		margin-bottom: 0.5rem;

		&.full-width {
			flex-basis: 100%;
		}

		input {
			width: auto;
			margin: 0 0.25rem;
			min-width: 5rem;
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

	.button .loading-spinner {
		width: 1.5rem;
		height: 1.5rem;
		vertical-align: bottom;

		& /deep/ .line {
			background-color: $white;
		}
	}
}
</style>
