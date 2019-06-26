<template>
	<div class="detailed-loan-card row collapse">
		<div class="multi-pane columns small-12 medium-7 xlarge-8 small-order-1 medium-order-2">
			<div class="borrower-image">
				<div class="borrower-image-content-wrapper">
					Borrower image
				</div>
			</div>
			<transition name="kvfastfade">
				<component :is="tabComponent" class="content-tab show-for-medium" />
			</transition>
		</div>
		<div class="columns small-12 medium-5 xlarge-4 small-order-2 medium-order-1">
			<div class="info-tab-selector show-for-medium">
				<button @click="tabComponent = null" class="tab-title">
					Overview
				</button>
				<button @click="tabComponent = storyPanel" class="tab-title">
					Story
				</button>
				<button class="tab-title">
					Details
				</button>
				<button class="tab-title">
					Partner
				</button>
			</div>
			<div>
				Name/Location/Sector
			</div>
			<div class="show-for-medium">
				Overview and Read more link (non-mobile)
			</div>
			<div>
				Funding progress
			</div>
			<div class="row">
				<div class="columns small-12 large-expand">
					Lend button
				</div>
				<div class="columns small-12 large-3">
					2x matching
				</div>
			</div>
		</div>
		<div class="columns small-12 small-order-3 hide-for-medium">
			<div>
				Overview toggle panel (mobile)
			</div>
			<div>
				Borrower story toggle panel (mobile)
			</div>
			<div>
				Loan details toggle panel (mobile)
			</div>
			<div>
				Field partner info toggle panel (mobile)
			</div>
			<div>
				Read more link (mobile)
			</div>
		</div>
		<div class="close-button-wrapper">
			<button @click="$emit('close')" class="close-button">
				<kv-icon name="x" />
			</button>
		</div>
	</div>
</template>

<script>
import LoanStoryPanel from './LoanStoryPanel';
// import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
		// KvExpandable,
	},
	data() {
		return {
			storyPanel: LoanStoryPanel,
			tabComponent: null,
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

.detailed-loan-card {
	position: relative;

	.info-tab-selector {
		display: flex;
		justify-content: space-evenly;

		.tab-title {
			background: transparent;
			border: none;
			padding: 0;
			margin: 0;
		}
	}

	.multi-pane {
		position: relative;

		.content-tab {
			position: absolute;
			top: 0;
			left: 0;
		}
	}

	.borrower-image {
		position: relative;
		padding-bottom: 3 / 4 * 100%;

		.borrower-image-content-wrapper {
			text-align: center;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: 0.5rem solid $pale-blue;
		}
	}

	.close-button-wrapper {
		position: absolute;
		top: 0;
		right: 0;

		.close-button {
			background-color: rgba($kiva-bg-darkgray, 0.5);
			border: none;
			padding: 0.5rem;
			margin: 0;
		}

		.icon-x {
			stroke: $white;
			width: 1.5rem;
			height: 1.5rem;
			padding: 0;
			margin: 0;
		}
	}
}
</style>
