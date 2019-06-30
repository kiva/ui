<template>
	<div class="detailed-loan-card row collapse">
		<div class="multi-pane columns small-12 medium-7 small-order-1 medium-order-2">
			<div class="borrower-image">
				<div class="borrower-image-content-wrapper">
					Borrower image
				</div>
			</div>
			<transition name="kvfastfade">
				<component
					:is="tabComponent"
					:expandable="false"
					:loan-id="loanId"
					class="content-tab show-for-medium"
				/>
			</transition>
		</div>
		<div class="main-panel columns small-12 medium-5 small-order-2 medium-order-1">
			<div class="info-tab-selector show-for-medium">
				<button
					class="tab-title"
					@click="tabComponent = null"
					:class="{ active: tabComponent === null }"
				>
					<span>Overview</span>
				</button>
				<button
					class="tab-title"
					@click="tabComponent = storyPanel"
					:class="{ active: tabComponent === storyPanel }"
				>
					<span>Story</span>
				</button>
				<button
					class="tab-title"
					@click="tabComponent = detailsPanel"
					:class="{ active: tabComponent === detailsPanel }"
				>
					<span>Details</span>
				</button>
				<button
					class="tab-title"
					@click="tabComponent = partnerPanel"
					:class="{ active: tabComponent === partnerPanel }"
				>
					<span>Partner</span>
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
			<borrower-story-panel :loan-id="loanId" />
			<loan-details-panel :loan-id="loanId" />
			<partner-info-panel :loan-id="loanId" />
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
import BorrowerStoryPanel from './InfoPanels/BorrowerStoryPanel';
import LoanDetailsPanel from './InfoPanels/LoanDetailsPanel';
import PartnerInfoPanel from './InfoPanels/PartnerInfoPanel';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	props: {
		loanId: { type: String, default: '' },
	},
	components: {
		BorrowerStoryPanel,
		KvIcon,
		LoanDetailsPanel,
		PartnerInfoPanel,
	},
	data() {
		return {
			detailsPanel: LoanDetailsPanel,
			partnerPanel: PartnerInfoPanel,
			storyPanel: BorrowerStoryPanel,
			tabComponent: null,
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

.detailed-loan-card {
	position: relative;
	background-color: $white;
	border: 1px solid $kiva-stroke-gray;

	.main-panel.columns {
		padding: 1rem;
	}

	.info-tab-selector {
		display: flex;
		margin-bottom: 0.5rem;

		.tab-title {
			background: transparent;
			border: none;
			border-left: 1px solid $kiva-stroke-gray;
			padding: 0 1rem;
			margin: 0;

			&:first-of-type {
				border-left: none;
				padding-left: 0;
			}

			&:focus {
				outline: none;
			}

			span {
				$speed-curve: 300ms linear;
				text-transform: uppercase;
				transition: border-color $speed-curve, color $speed-curve;
				border-color: rgba($white, 0);
				color: $kiva-text-light;
				font-weight: $global-weight-normal;
			}

			&.active span {
				border-bottom: 0.1rem solid rgba($kiva-textlink, 1);
				color: $kiva-text-dark;
				font-weight: $global-weight-highlight;
			}
		}
	}

	.multi-pane {
		position: relative;

		.content-tab {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
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
			display: block;
			width: 1.5rem;
			height: 1.5rem;
			padding: 0;
			margin: 0;
		}
	}
}
</style>
