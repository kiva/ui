<template>
	<info-panel
		:id="elementId"
		:expandable="expandable"
		panel-id="borrower-story"
		@track-interaction="trackInteraction"
	>
		<template #title>
			Borrower story
		</template>
		<p
			v-if="loanStory"
			v-html="loanStory"
			class="loan-story"
		></p>
		<div v-else id="loading-overlay">
			<div class="spinner-wrapper">
				<kv-loading-spinner />
			</div>
		</div>
		<router-link
			:to="`/lend/${loanId}`"
			v-if="readMoreLinkText && loanStory"
			@click="$emit('track-interaction', {
				interactionType: 'viewBorrowerPage',
				interactionElement: 'readMoreStoryPanel'
			})"
		>
			{{ readMoreLinkText }}
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
		readMoreLinkText: {
			type: String,
			default: 'Read full story',
		},
	},
	data() {
		return {
			loanStory: ''
		};
	},
	apollo: {
		query: loanDescriptionQuery,
		variables() {
			return {
				id: parseInt(this.loanId, 10),
			};
		},
		result({ data }) {
			this.loanStory = _get(data, 'lend.loan.description');
		},
	},
	computed: {
		elementId() {
			return `${this.loanId}-borrower-story-panel-ex-${this.expandable ? '1' : '0'}`;
		}
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.loan-story {
	padding: rem-calc(5) rem-calc(2);
}

#loading-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 0;
	right: 0;
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

	@include breakpoint(small only) {
		top: -1rem;
	}
}

</style>
