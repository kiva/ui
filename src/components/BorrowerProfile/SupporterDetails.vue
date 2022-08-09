<template>
	<router-link
		class="
			tw-flex tw-flex-col
			md:tw-flex-row md:tw-items-center
			tw-no-underline hover:tw-no-underline
			tw-mb-1"
		:class="{ 'hover:tw-cursor-default': anonymousSupporterCard }"
		:to="linkPath"
		v-kv-track-event="configureTracking"
		:id="toolTipId"
	>
		<div
			class="
			tw-block md:tw-inline-block
			md:tw-flex-none
			md:tw-mr-2
			tw-max-w-[160px] md:tw-w-[84px] xl:tw-w-12
			tw-mb-1 md:tw-mb-0"
			style="line-height: 0; /* global property affects images within anchors - override required */"
		>
			<borrower-image
				v-if="!this.anonymousSupporterCard && this.hash"
				class="tw-w-full tw-rounded tw-bg-black"
				:alt="name"
				:aspect-ratio="borrowerImageAspect"
				:default-image="{ width: isMobile ? 160 : 96 }"
				:hash="hash"
				:images="[
					// small & medium
					{ width: 160, viewSize: 320 },
					// large
					{ width: 84, viewSize: 734 },
					// xlarge
					{ width: 96, viewSize: 1024 }
				]"
			/>
			<div
				v-else-if="!this.anonymousSupporterCard && !this.hash"
				class="
					tw-w-full
					tw-rounded
					tw-flex
					tw-items-center
					tw-justify-center
					tw-h-[120px] md:tw-h-[84px] xl:tw-h-12
					tw-text-h1"
				:class="randomizedUserClass"
			>
				<!-- First Letter of lender name -->
				<span class="tw-pt-1">
					{{ lenderNameFirstLetter }}
				</span>
			</div>
			<div
				v-else
				class="
					tw-w-full
					tw-rounded
					tw-bg-brand
					tw-flex
					tw-items-center
					tw-justify-center
					tw-h-[120px] md:tw-h-[84px] xl:tw-h-12"
			>
				<!-- Kiva K logo -->
				<!-- eslint-disable max-len -->
				<svg class="" width="25" height="37" viewBox="0 0 25 37" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M8.22861 0.875H0.857178V36.3125H8.22861V0.875Z" fill="white" />
					<path d="M10.1143 23.2751C21.9428 23.2751 24.6857 13.2126 24.6857 11.4626H23.6571C11.8286 11.4626 9.08569 21.5251 9.08569 23.2751H10.1143Z" fill="white" />
					<path d="M9.08569 24.2376C9.08569 26.0751 11.1428 36.3126 23.8285 36.3126H24.8571C24.8571 34.4751 22.8 24.2376 10.1143 24.2376H9.08569Z" fill="white" />
				</svg>
				<!-- eslint-enable max-len -->
			</div>
		</div>

		<div
			class="tw-text-primary"
			:class="{ 'hover:tw-underline hover:tw-text-action': !anonymousSupporterCard }"
		>
			<span
				v-if="name"
				:class="`${ displayType === 'teams' ? 'tw-text-h4' : ''}`"
			>
				{{ name }}
			</span><br>
			<span
				v-if="whereabouts"
				class="tw-text-h4"
			>
				{{ whereabouts }}
			</span>
		</div>

		<kv-tooltip
			class="tooltip"
			:controller="toolTipId"
			:data-testid="`tooltip-id-${toolTipId}`"
			theme="dark"
			v-if="teamTooltipData"
		>
			{{ teamTooltipData.category }}<br>
			{{ teamTooltipData.lendersForTeamMessage }}
		</kv-tooltip>
	</router-link>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvTooltip from '@/components/Kv/KvTooltip';
import BorrowerImage from './BorrowerImage';

export default {
	name: 'SupporterDetails',
	components: {
		BorrowerImage,
		KvTooltip
	},
	props: {
		name: {
			type: String,
			default: ''
		},
		hash: {
			type: String,
			default: ''
		},
		itemData: {
			type: Object,
			default: () => {}
		},
		publicId: {
			type: String,
			default: '',
		},
		whereabouts: {
			type: String,
			default: ''
		},
		displayType: {
			type: String,
			default: ''
		},
		hasAnonymousSupporters: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			anonymousSupporterCard: false,
			isMobile: false,
			userCardStyleOptions: [
				{ color: 'tw-text-action', bg: 'tw-bg-brand-50' },
				{ color: 'tw-text-black', bg: 'tw-bg-brand-100' },
				{ color: 'tw-text-action', bg: 'tw-bg-secondary' },
				{ color: 'tw-text-white', bg: 'tw-bg-action' },
				// { color: 'tw-text-800', bg: 'tw-bg-gray-50' },
				{ color: 'tw-text-brand-50', bg: 'tw-bg-action' },
				{ color: 'tw-text-brand-50', bg: 'tw-bg-black' },
				{ color: 'tw-text-primary-inverse', bg: 'tw-bg-action' },
				// { color: 'tw-text-action', bg: 'tw-bg-gray-50' },
				{ color: 'tw-text-white', bg: 'tw-bg-black' },
			]
		};
	},
	computed: {
		borrowerImageAspect() {
			if (!this.isMobile) {
				return 1;
			}
			return 3 / 4;
		},
		configureTracking() {
			if (this.displayType === 'lenders') {
				return ['Borrower profile', 'click-lender-image', this.name];
			}
			return ['Borrower profile', 'click-team-image', this.name];
		},
		lenderNameFirstLetter() {
			return this.name.substring(0, 1).toUpperCase();
		},
		linkPath() {
			// clear out link if none provided
			if (!this.publicId) return '';
			return this.displayType === 'lenders' ? `/lender/${this.publicId}` : `/team/${this.publicId}`;
		},
		randomizedUserClass() {
			if (this.hash) return 'tw-bg-black';
			const randomStyle = this.userCardStyleOptions[Math.floor(Math.random() * this.userCardStyleOptions.length)];
			return `${randomStyle.color} ${randomStyle.bg} hover:${randomStyle.color}`;
		},
		teamId() {
			return this.itemData?.id ?? null;
		},
		teamTooltipData() {
			const category = this.itemData?.category ?? '';
			const lenderCount = this.itemData?.lenderCount ?? 0;
			const lenderCountForLoan = this.itemData?.lenderCountForLoan ?? 0;
			if (category && lenderCount && lenderCountForLoan) {
				return {
					category,
					lendersForTeamMessage: `${lenderCountForLoan} of ${lenderCount} members`
				};
			}
			return null;
		},
		toolTipId() {
			const lenderElementId = this.publicId || '';
			const teamElementId = `team_${this.teamId}_${this.$vnode.key}`;
			return this.displayType === 'teams' ? teamElementId : lenderElementId;
		}
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
	},
	beforeDestroy() {
		window.removeEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));
	},
	mounted() {
		window.addEventListener('resize', _throttle(() => {
			this.determineIfMobile();
		}, 200));

		if (this.hasAnonymousSupporters) {
			this.anonymousSupporterCard = true;
		}
		this.determineIfMobile();
	},
};
</script>
