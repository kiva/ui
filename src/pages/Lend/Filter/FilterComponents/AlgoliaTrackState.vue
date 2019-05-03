<template>
	<small class="hide">Showing {{ stateDataHits.length }} Results</small>
</template>

<script>
import _map from 'lodash/map';

export default {
	props: {
		stateDataHits: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			trackedHits: () => [],
		};
	},
	watch: {
		stateDataHits: {
			handler(stateDataHits) {
				this.$nextTick(() => {
					this.trackLoansShown(_map(stateDataHits, 'id'));
				});
			},
		}
	},
	methods: {
		trackLoansShown(hits) {
			// delay event call by 400 ms. Typically the algolia router has updated in 2-300ms (location takes longest)
			setTimeout(() => {
				// only fire this event if the new hits don't match the previously tracked hits
				// > this prevents duplicated calls due to watching the incoming data object
				// > it will also block some tracking calls if there are are changes to filters but not the result set
				if (JSON.stringify(hits) !== JSON.stringify(this.trackedHits)) {
					// check for and use snowplow directly where the 4th param is a property
					if (typeof window !== 'undefined' && typeof snowplow === 'function') {
						window.snowplow('setCustomUrl', window.location.href);
						window.snowplow(
							'trackStructEvent',
							'Lending',
							hits.length ? 'loans-shown' : 'zero-loans-shown',
							hits.length ? 'loan-ids' : undefined,
							hits.length ? hits.join() : undefined
						);
						this.trackedHits = hits;
					}
				}
			}, 400);
		}
	}
};
</script>
