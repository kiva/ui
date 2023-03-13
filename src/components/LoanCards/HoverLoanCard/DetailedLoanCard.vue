<template>
	<div class="detailed-loan-card row collapse tw-bg-primary tw-border tw-border-secondary">
		<div class="multi-pane columns small-12 xlarge-6 xxlarge-7 small-order-1 xlarge-order-2">
			<loan-card-image
				:loan-id="loan.id"
				:name="loan.name"
				:retina-image-url="retinaImageUrl"
				:standard-image-url="standardImageUrl"
				:disable-link="disableRedirects"
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
					class="content-tab show-for-xlarge"
				/>
			</transition>
		</div>
		<div class="main-panel columns small-12 xlarge-6 xxlarge-5 small-order-2 xlarge-order-1">
			<div class="info-tab-selector show-for-xlarge">
				<button
					v-for="{title, id} in tabs"
					:key="id"
					class="tab-title"
					:class="{ active: isTabComponentActive(id) }"
					@click="setTabComponent(id)"
				>
					<span
						:class="{
							'tw-text-primary': isTabComponentActive(id),
							'tw-text-tertiary': !isTabComponentActive(id),
						}"
						class="tw-uppercase tw-font-book"
					>{{ title }}</span>
				</button>
			</div>
			<div class="basic-info-flex-column">
				<div class="name-location-sector">
					<borrower-info-name
						:name="loan.name"
						:loan-id="loan.id"
						:disable-link="disableRedirects"
						class="tw-text-h2 tw-whitespace-nowrap"
						@track-loan-card-interaction="trackInteractionBorrowerInfoName"
					/>
					<div class="location-sector-row">
						<kv-flag
							v-if="loan.geocode.country.isoCode"
							class="flag"
							:country="loan.geocode.country.isoCode"
						/>
						<div>
							{{ `${loan.geocode.city ? `${loan.geocode.city}, ` : ''}` }}{{ loan.geocode.country.name }}
							/ {{ loan.sector.name }}
						</div>
					</div>
				</div>
				<div :class="{collapsed: tabComponent !== null}" class="overview-column show-for-xlarge">
					<borrower-info-body
						:amount="loan.loanAmount"
						:borrower-count="loan.borrowerCount"
						:name="loan.name"
						:status="loan.status"
						:max-use-length="200"
						:use="loan.fullLoanUse"
						:loan-id="loan.id"
						:disable-link="disableRedirects"
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
				<div class="row" v-if="!hideLendCta">
					<div class="columns small-12 large-expand">
						<action-button
							class="tw-mt-2"
							:loan-id="loan.id"
							:loan="loan"
							:items-in-basket="itemsInBasket"
							:is-lent-to="loan.userProperties.lentTo"
							:is-funded="isFunded"
							:is-selected-by-another="isSelectedByAnother"
							:is-simple-lend-button="false"
							:disable-redirects="disableRedirects"
							:is-amount-lend-button="lessThan25"
							:amount-left="amountLeft"
							:show-now="true"
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
							:match-ratio="loan.matchRatio"
							:is-funded="isFunded"
							:is-selected-by-another="isSelectedByAnother"
							:wrap="true"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="mobile-sections columns small-12 small-order-3 hide-for-xlarge">
			<info-panel
				:id="`${loan.id}-overview-panel`"
				class="overview-panel"
				:expandable="true"
				panel-id="overview"
				@track-interaction="trackInteraction"
			>
				<template #title>
					Overview
				</template>
				<borrower-info-body
					:use="loan.fullLoanUse"
					:loan-id="loan.id"
					:disable-link="true"
					read-more-link-text=""
					@track-loan-card-interaction="trackInteraction"
				/>
			</info-panel>
			<component
				v-for="{ component, id } in mobileSections"
				:key="id"
				:is="component"
				:loan-id="loan.id"
				read-more-link-text=""
				@track-interaction="trackInteraction"
			/>
			<div>
				<router-link
					:to="`/lend/${loan.id}`"
					class="tw-text-h3"
					v-kv-track-event="[
						'Lending',
						'click-Read full borrower details',
						'Profile Link',
						loan.id,
						loan.id
					]"
				>
					Read full borrower details
				</router-link>
			</div>
		</div>
		<div class="close-button-wrapper">
			<button @click="handleClickClose" class="close-button">
				<kv-icon class="icon-small-x" name="small-x" :from-sprite="true" title="Close" />
			</button>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfoName from '@/components/LoanCards/BorrowerInfo/BorrowerInfoName';
import KvFlag from '@/components/Kv/KvFlag';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import MatchingText from '@/components/LoanCards/MatchingText';
import FundraisingStatusLarge from '@/components/LoanCards/FundraisingStatus/FundraisingStatusLarge';
import BorrowerStoryPanel from './InfoPanels/BorrowerStoryPanel';
import InfoPanel from './InfoPanels/InfoPanel';
import LoanDetailsPanel from './InfoPanels/LoanDetailsPanel';
import PartnerInfoPanel from './InfoPanels/PartnerInfoPanel';
import TrusteeInfoPanel from './InfoPanels/TrusteeInfoPanel';

export default {
	name: 'DetailedLoanCard',
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
		disableRedirects: {
			type: Boolean,
			default: false,
		},
		hideLendCta: {
			type: Boolean,
			default: false,
		}
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
			selectedTab: 'Overview',
		};
	},
	computed: {
		hasPartner() {
			const partnerName = _get(this.loan, 'partnerName');
			return typeof partnerName !== 'undefined' || false;
		},
		hasTrustee() {
			const trusteeName = _get(this.loan, 'trusteeName');
			return typeof trusteeName !== 'undefined' || false;
		},
		retinaImageUrl() {
			// eslint-disable-next-line quotes
			return _get(this.loan, 'image.retina', '').replace(`/w960h600/`, `/w1096h822/`);
		},
		standardImageUrl() {
			// eslint-disable-next-line quotes
			return _get(this.loan, 'image.default', '').replace(`/w480h300/`, `/w548h411/`);
		},
		tabs() {
			const baseTabs = [
				{
					component: null,
					title: 'Overview',
					id: 'Overview',
				},
				{
					component: BorrowerStoryPanel,
					title: 'Story',
					id: 'Story',
				},
				{
					component: LoanDetailsPanel,
					title: 'Details',
					id: 'Details',
				}
			];

			if (this.hasPartner) {
				baseTabs.push({
					component: PartnerInfoPanel,
					title: 'Partner',
					id: 'Partner',
				});
			}

			if (this.hasTrustee) {
				baseTabs.push({
					component: TrusteeInfoPanel,
					title: 'Trustee',
					id: 'Trustee',
				});
			}

			return baseTabs;
		},
		tabIdMap() {
			const tabIdMap = {};
			this.tabs.forEach(({ id, component }) => {
				tabIdMap[id] = component;
			});
			return tabIdMap;
		},
		tabComponent() {
			return this.tabIdMap[this.selectedTab];
		},
		mobileSections() {
			return this.tabs.filter(({ component }) => component);
		},
		lessThan25() {
			return this.amountLeft < 25 && this.amountLeft !== 0;
		}
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
		setTabComponent(tabId) {
			this.trackInteraction({
				interactionType: 'set-tab-component-desktop',
				interactionElement: tabId,
			});
			this.selectedTab = tabId;
		},
		isTabComponentActive(tabId) {
			return this.selectedTab === tabId;
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
	max-width: rem-calc(414);
	border-radius: rem-calc(3);
	overflow: hidden;

	.mobile-sections {
		padding: 0 1rem;

		.info-panel {
			border-bottom: 1px solid $kiva-stroke-gray;
			margin-bottom: 1rem;

			.title-button {
				margin: 0.5rem 0 0.4rem 0;
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
				$speed-curve: 150ms linear;

				text-transform: uppercase;
				transition: border-color $speed-curve, color $speed-curve, text-shadow $speed-curve;
				border-color: rgba($white, 0);
			}

			&.active span {
				border-bottom: rem-calc(1) solid rgba($kiva-textlink, 1);
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
			margin-bottom: 1rem;

			.name {
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.location-sector-row {
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				color: $gray;
				line-height: rem-calc(22);

				.flag {
					width: rem-calc(20);
					margin-right: rem-calc(14);
					align-self: center;
				}
			}
		}

		.fundraising-status-container {
			margin-bottom: 0.5rem;
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
			padding-left: 0;
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
		background-image: linear-gradient(45deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.15));
		position: absolute;
		top: 0;
		right: 0;
		width: rem-calc(100);
		height: rem-calc(100);
		pointer-events: none;
		z-index: 1;

		.close-button {
			border: none;
			padding: 0.5rem;
			margin: 0;
			position: absolute;
			top: 0;
			right: 0;
			pointer-events: initial;
		}

		.icon-small-x {
			fill: $white;
			width: 1.5rem;
			height: 1.5rem;
			padding: 0;
			margin: 0;
		}
	}

	@include breakpoint(xlarge) {
		max-width: $parent-row-max-width - (2 * $row-arrow-width);
		border-radius: 0;
	}
}
</style>
