<template>
	<info-panel :id="elementId" :expandable="expandable">
		<template #title>
			Borrower story
		</template>
		<p
			v-if="loanStory"
			v-html="loanStory"
		></p>
		<div v-else id="loading-overlay">
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
		<router-link :to="`/lend/${loanId}`">
			Read full story
		</router-link>
	</info-panel>
</template>

<script>
import _get from 'lodash/get';
import InfoPanel from './InfoPanel';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import loanDescriptionQuery from '@/graphql/query/loanDescription.graphql';

export default {
	components: {
		InfoPanel,
		KvLoadingSpinner
	},
	inject: ['apollo'],
	props: {
		expandable: {
			type: Boolean,
			default: true,
		},
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			loanStory: ''
		};
	},
	created() {
		this.apollo.query({
			query: loanDescriptionQuery,
			variables: {
				id: parseInt(this.loanId, 10)
			}
		}).then(({ data }) => {
			this.loanStory = _get(data, 'lend.loan.description');
		});
	},
	computed: {
		elementId() {
			return `${this.loanId}-borrower-story-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

#loading-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	background-color: rgba($platinum, 0.7);

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}

</style>
