<template>
	<div class="detailed-loan-card row collapse">
		<div class="multi-pane columns small-12 medium-7 small-order-1 medium-order-2">
			<loan-card-image
				:loan-id="loan.id"
				:name="loan.name"
				:retina-image-url="retinaImageUrl"
				:standard-image-url="standardImageUrl"
				:is-visitor="true"
				:use-default-styles="false"
				:full-width-image="true"

				@track-loan-card-interaction="trackInteraction"
			/>
			<transition name="kvfastfade">
				<component
					:is="tabComponent"
					:expandable="false"
					:loan-id="loan.id"
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
				<!-- <button
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
				</button> -->
			</div>
			<div class="basic-info-flex-column">
				<div class="name-location-sector">
					<borrower-info-name
						:name="loan.name"
						:loan-id="loan.id"
						class="name"
						@track-loan-card-interaction="trackInteractionBorrowerInfoName"
					/>
					<div class="location-sector-row">
						<kv-flag
							v-if="loan.geocode.country.isoCode"
							class="flag"
							:width="20"
							:country="loan.geocode.country.isoCode"
						/>
						<div>
							{{ `${loan.geocode.city ? `${loan.geocode.city}, ` : ''}` }}{{ loan.geocode.country.name }}
							/ {{ loan.sector.name }}
						</div>
					</div>
				</div>
				<div :class="{collapsed: tabComponent !== null}" class="overview-column show-for-medium">
					<borrower-info-body
						:amount="loan.loanAmount"
						:borrower-count="loan.borrowerCount"
						:name="loan.name"
						:status="loan.status"
						:max-use-length="200"
						:use="loan.use"
						:loan-id="loan.id"
						read-more-link-text="Read full details"
						@track-loan-card-interaction="trackInteraction"
					/>
				</div>
				<div class="fundraising-status-container">
					<fundraising-status-large
						:is-funded="loan.status==='funded'"
						:percent-raised="percentRaised"
						:amount-left="amountLeft"
						:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
						:lender-count="loan.lenders.totalCount"
						:expiring-soon-message="expiringSoonMessage"
						:time-left-message="timeLeftMessage"
					/>
				</div>
				<div class="row">
					<div class="columns small-12 large-expand">
						<action-button
							class="expandable-loan-card-action-button"
							:loan-id="loan.id"
							:loan="loan"
							:items-in-basket="itemsInBasket"
							:is-lent-to="loan.userProperties.lentTo"
							:is-funded="isFunded"
							:is-selected-by-another="isSelectedByAnother"
							:is-simple-lend-button="false"

							@click.native="trackInteraction({
								interactionType: 'addToBasket',
								interactionElement: 'Lend25'
							})"

							@add-to-basket="$emit('add-to-basket', $event)"
						/>
					</div>
					<div class="columns medium-12 large-4 matching-text-wrap">
						<matching-text
							:matching-text="loan.matchingText"
							:is-funded="isFunded"
							:is-selected-by-another="isSelectedByAnother"
							:wrap="true"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="mobile-sections columns small-12 small-order-3 hide-for-medium">
			<info-panel :id="`${loan.id}-overview-panel`" class="overview-panel" :expandable="true">
				<template #title>
					Overview
				</template>
				<borrower-info-body
					:amount="loan.loanAmount"
					:borrower-count="loan.borrowerCount"
					:name="loan.name"
					:status="loan.status"
					:use="loan.use"
					:max-use-length="1000"
					:loan-id="loan.id"
					:disable-link="true"
					read-more-link-text=""
					@track-loan-card-interaction="trackInteraction"
				/>
			</info-panel>
			<borrower-story-panel
				:loan-id="loan.id"
				read-more-link-text=""
				@track-interaction="trackInteraction"
			/>
			<!-- <loan-details-panel :loan-id="loan.id" />
			<partner-info-panel v-if="hasPartner" :loan-id="loan.id" />
			<trustee-info-panel v-if="hasTrustee" :loan-id="loan.id" /> -->
			<div>
				<router-link
					:to="`/lend/${loan.id}`"
					class="featured-text full-details-link"
					v-kv-track-event="[
						'Lending',
						'click-Read full borrower details',
						'Profile Link',
						loan.id
					]"
				>
					Read full borrower details
				</router-link>
			</div>
		</div>
		<div class="close-button-wrapper">
			<button @click="handleClickClose" class="close-button">
				<kv-icon name="x" />
			</button>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import BorrowerStoryPanel from './InfoPanels/BorrowerStoryPanel';
import InfoPanel from './InfoPanels/InfoPanel';
import LoanDetailsPanel from './InfoPanels/LoanDetailsPanel';
import PartnerInfoPanel from './InfoPanels/PartnerInfoPanel';
import TrusteeInfoPanel from './InfoPanels/TrusteeInfoPanel';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';
import KvFlag from '@/components/Kv/KvFlag';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import MatchingText from '@/components/LoanCards/MatchingText';
import FundraisingStatusLarge from '@/components/LoanCards/FundraisingStatus/FundraisingStatusLarge';

export default {
	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {}
					},
					image: {},
					lenders: {},
				};
			}
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
		amountLeft: {
			type: Number,
			default: 0,
		},
		expiringSoonMessage: {
			type: String,
			default: '',
		},
		timeLeftMessage: {
			type: String,
			default: '',
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isFunded: {
			type: Boolean,
			default: false
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
	},
	components: {
		BorrowerInfoBody,
		BorrowerStoryPanel,
		InfoPanel,
		KvExpandable,
		KvIcon,
		LoanDetailsPanel,
		PartnerInfoPanel,
		TrusteeInfoPanel,
		LoanCardImage,
		BorrowerInfoName,
		KvFlag,
		ActionButton,
		MatchingText,
		FundraisingStatusLarge
	},
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
		retinaImageUrl() {
			// eslint-disable-next-line quotes
			return _get(this.loan, 'image.retina', '').replace(`/w960h600/`, `/w1096h822/`);
		},
		standardImageUrl() {
			// eslint-disable-next-line quotes
			return _get(this.loan, 'image.default', '').replace(`/w480h300/`, `/w548h411/`);
		},
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
		trackInteractionBorrowerInfoName(args) {
			this.trackInteraction({
				...args,
				interactionElement: `${args.interactionElement}DetailedCard`,
			});
		},
		handleClickClose() {
			this.trackInteraction({
				interactionType: 'click-close',
				interactionElement: 'detailed-loan-card'
			});
			this.$emit('close-detailed-loan-card');
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

$parent-row-max-width: 63.75rem;
$row-arrow-width: 2.5rem;

.detailed-loan-card.row {
	position: relative;
	background-color: $white;
	border: 1px solid $kiva-stroke-gray;
	max-width: $parent-row-max-width - (2 * $row-arrow-width);

	.mobile-sections {
		padding: 0 1rem;

		.info-panel {
			border-bottom: 1px solid $kiva-stroke-gray;
			margin-bottom: 1rem;

			.title-button {
				margin-bottom: 1rem;
			}
		}

		.overview-panel .borrower-info-body {
			line-height: $paragraph-lineheight;
			margin-bottom: $paragraph-margin-bottom;
		}
	}

	.info-tab-selector {
		display: flex;
		margin: 0.25rem 0 0.5rem;

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
		padding: 0.5rem 1rem 1.5rem;
		display: flex;
		flex-flow: column nowrap;
	}

	.basic-info-flex-column {
		flex-grow: 1;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-end;

		.name-location-sector {
			margin-bottom: rem-calc(12);

			.name {
				display: block;
				font-size: rem-calc(28);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-weight: 500;
				line-height: rem-calc(51);
			}

			.location-sector-row {
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				color: $gray;
				line-height: rem-calc(22);

				.flag {
					margin-right: rem-calc(14);
				}
			}
		}

		.fundraising-status-container {
			margin-bottom: 1rem;
		}
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

	.lend-increment-container.action-button {
		margin-top: 0.875rem;
	}

	.lend-increment-dropdown {
		min-width: rem-calc(80);
	}

	.lend-increment-button {
		white-space: nowrap;
	}

	.matching-text-wrap {
		margin: auto;
		text-align: center;

		@include breakpoint(large) {
			text-align: unset;
		}
	}

	.matching-text {
		color: $subtle-gray;
	}

	.multi-pane {
		position: relative;

		.content-tab {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 0.5rem 1rem;
			overflow-y: scroll;
		}
	}

	.full-details-link {
		margin-bottom: 1.25rem;
		display: inline-block;
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
