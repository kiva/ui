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
				v-if="!anonymousSupporterCard && hash"
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
				v-else-if="!anonymousSupporterCard && !hash"
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
				<img :src="kivaKUrl">
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
			v-if="teamTooltipData && !isMobile"
		>
			{{ teamTooltipData.category }}<br>
			{{ teamTooltipData.lendersForTeamMessage }}
		</kv-tooltip>
	</router-link>
</template>

<script>
import { getCurrentInstance } from 'vue';
import _throttle from 'lodash/throttle';
import KvTooltip from '#src/components/Kv/KvTooltip';
import BorrowerImage from './BorrowerImage';
import kivaKUrl from '#src/assets/images/kiva_k.svg?url';

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
			kivaKUrl,
			anonymousSupporterCard: false,
			isMobile: false,
			userCardStyleOptions: [
				{ color: 'tw-text-action', bg: 'tw-bg-brand-50' },
				{ color: 'tw-text-black', bg: 'tw-bg-brand-100' },
				{ color: 'tw-text-white', bg: 'tw-bg-action' },
				{ color: 'tw-text-brand-50', bg: 'tw-bg-action' },
				{ color: 'tw-text-brand-50', bg: 'tw-bg-black' },
				{ color: 'tw-text-primary-inverse', bg: 'tw-bg-action' },
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
			return this.name?.substring(0, 1)?.toUpperCase() ?? '';
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
			const teamElementId = `team_${this.teamId}_${getCurrentInstance().vnode.key}`;
			return this.displayType === 'teams' ? teamElementId : lenderElementId;
		}
	},
	methods: {
		determineIfMobile() {
			this.isMobile = document.documentElement.clientWidth < 735;
		},
	},
	beforeUnmount() {
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
