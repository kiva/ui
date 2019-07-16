<template>
	<div class="detailed-loan-card row collapse">
		<div class="multi-pane columns small-12 medium-7 small-order-1 medium-order-2">
			<div class="borrower-image">
				<div class="borrower-image-content-wrapper">
					<loan-card-image
						:loan-id="loan.id"
						:name="loan.name"
						:retina-image-url="retinaImageUrl"
						:standard-image-url="standardImageUrl"
						:is-visitor="true"
						:use-default-styles="false"

						@track-loan-card-interaction="trackInteraction"
					/>
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
					v-if="hasPartner"
					@click="tabComponent = partnerPanel"
					:class="{ active: tabComponent === partnerPanel }"
				>
					<span>Partner</span>
				</button>
				<button
					class="tab-title"
					v-if="hasTrustee"
					@click="tabComponent = trusteePanel"
					:class="{ active: tabComponent === trusteePanel }"
				>
					<span>Trustee</span>
				</button>
			</div>
			<div class="basic-info-flex-column">
				<div>
					Name/Location/Sector
				</div>
				<div :class="{collapsed: tabComponent !== null}" class="overview-column show-for-medium">
					A loan of $50,000 helps to provide 2,900 families in the Andes with sustainable sphagnum
					moss harvesting training and employment that will double their annual incomes.
					<router-link to="">
						Read full details
					</router-link>
				</div>
				<div>
					Funding progress
				</div>
				<div class="row">
					<div class="columns small-12 large-expand">
						Lend button
					</div>
					<div class="matching-text columns small-12 large-4">
						2x matching
					</div>
				</div>
			</div>
		</div>
		<div class="columns small-12 small-order-3 hide-for-medium">
			<overview-panel :loan-id="loanId" />
			<borrower-story-panel :loan-id="loanId" />
			<loan-details-panel :loan-id="loanId" />
			<partner-info-panel v-if="hasPartner" :loan-id="loanId" />
			<trustee-info-panel v-if="hasTrustee" :loan-id="loanId" />
			<div>
				<router-link to="">
					Read full details
				</router-link>
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
import OverviewPanel from './InfoPanels/OverviewPanel';
import PartnerInfoPanel from './InfoPanels/PartnerInfoPanel';
import TrusteeInfoPanel from './InfoPanels/TrusteeInfoPanel';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import detailedLoanCardFragment from '@/graphql/fragments/detailedLoanCard.graphql';

export default {
	props: {
		loanId: { type: String, default: '' },
	},
	components: {
		BorrowerStoryPanel,
		KvExpandable,
		KvIcon,
		LoanDetailsPanel,
		OverviewPanel,
		PartnerInfoPanel,
		TrusteeInfoPanel,
		LoanCardImage,
	},
	inject: ['apollo'],
	data() {
		return {
			detailsPanel: LoanDetailsPanel,
			partnerPanel: PartnerInfoPanel,
			storyPanel: BorrowerStoryPanel,
			trusteePanel: TrusteeInfoPanel,
			tabComponent: null,
		};
	},
	computed: {
		hasPartner() {
			return true;
		},
		hasTrustee() {
			return false;
		},
		loan() {
			return this.apollo.readFragment({
				id: this.loanId,
				fragment: detailedLoanCardFragment,
			});
		},
		retinaImageUrl() {
			// eslint-disable-next-line quotes
			return this.loan.image.retina.replace(`/w960h600/`, `/w960h720/`);
		},
		standardImageUrl() {
			// eslint-disable-next-line quotes
			return this.loan.image.default.replace(`/w480h300/`, `/w480h360/`);
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.detailed-loan-card {
	position: relative;
	background-color: $white;
	border: 1px solid $kiva-stroke-gray;

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

	.main-panel.columns {
		padding: 1rem;
		display: flex;
		flex-flow: column nowrap;
	}

	.basic-info-flex-column {
		flex-grow: 1;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-end;
	}

	.overview-column {
		transition: flex 300ms ease-out;
		height: auto;
		overflow: hidden;
		flex: 1;

		&.collapsed {
			flex: 0;
		}
	}

	.matching-text {
		white-space: nowrap;
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
