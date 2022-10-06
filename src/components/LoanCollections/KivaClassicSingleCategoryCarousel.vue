<template>
	<div>
		<div>
			<h2 class="tw-mb-2 tw-inline">
				{{ name }}
			</h2>
			<kv-pill class="tw-ml-4.5" v-if="climateChallenge">
				<template #icon>
					<icon-climate-challenge class="tw-h-3 tw-w-2 tw-mr-0.5" />
				</template>
				<template #text>
					Climate challenge
				</template>
			</kv-pill>
		</div>
		<p class="tw-text-subhead">
			{{ description }}
		</p>
		<div>
			<kiva-classic-loan-carousel
				:is-visible="true"
				:loan-ids="selectedChannelLoanIds"
				:selected-channel="channelData"
				:show-view-more-card="showViewMoreCard"
				:lend-now-button="lendNowButton"
				:show-check-back-message="showCheckBackMessage"
			/>
		</div>
	</div>
</template>

<script>
import IconClimateChallenge from '@/assets/icons/inline/eco-challenge/globe-leaf.svg';
import KivaClassicLoanCarousel from '@/components/LoanCollections/KivaClassicLoanCarousel';
import KvPill from '@/components/Kv/KvPill';

import {
	getLoanChannel,
} from '@/util/loanChannelUtils';
import loanChannelQueryMapMixin from '@/plugins/loan-channel-query-map';

export default {
	name: 'KivaClassicSingleCategoryCarousel',
	inject: ['apollo', 'cookieStore'],
	components: {
		IconClimateChallenge,
		KivaClassicLoanCarousel,
		KvPill,
	},
	props: {
		/** prefetched selected channel
		 * if this data is passed in, it will be used instead of fetching the channel data
		 * */
		prefetchedSelectedChannel: {
			type: Object,
			default: null
		},
		/**
		 * Loan channel id
		* */
		loanChannelId: {
			type: Number,
			default: null,
		},
		/**
		 * Loan channel description
		 * is overwritten by api call but allows prop to display instantly
		* */
		loanChannelDescription: {
			type: String,
			default: '',
		},
		/**
		 * Loan channel name
		 * is overwritten by api call but allows prop to display instantly
		 *
		* */
		loanChannelName: {
			type: String,
			default: '',
		},
		/**
		 * Additional display settings
		 * Possible Options:
		 * loanLimit: integer that controls how many loans will be loaded for channel
		 * showViewMoreCard: boolean to display or hide card
		* */
		loanDisplaySettings: {
			type: Object,
			default: () => {}
		},
		/** Prop to pass down to components to the loan card */
		lendNowButton: {
			type: Boolean,
			default: false
		},
		climateChallenge: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			selectedChannel: {},
		};
	},
	mixins: [
		loanChannelQueryMapMixin,
	],
	computed: {
		loanQueryLimit() {
			return this.loanDisplaySettings?.loanLimit ?? 1;
		},
		showViewMoreCard() {
			if (this.loanDisplaySettings?.showViewMoreCard) {
				return this.loanQueryLimit === this.selectedChannelLoanIds.length;
			}
			return false;
		},
		showCheckBackMessage() {
			if (this.loanDisplaySettings?.showCheckBackMessage) {
				return this.loanQueryLimit > this.selectedChannelLoanIds.length;
			}
			return false;
		},
		selectedChannelLoanIds() {
			return this.channelData?.loans?.values?.map(loan => loan.id) ?? [];
		},
		name() {
			// return optional prop value or value from api
			return this.loanChannelName || this.channelData?.name;
		},
		description() {
			// return optional prop value or value from api
			return this.loanChannelDescription || this.channelData?.description;
		},
		channelData() {
			if (!this.prefetchedSelectedChannel) {
				return this.selectedChannel;
			}
			return this.prefetchedSelectedChannel;
		}
	},
	mounted() {
		// if channel data is not passed in, fetch it
		if (!this.prefetchedSelectedChannel) {
			this.fetchLoanChannelFLSS();
		}
	},
	methods: {
		async fetchLoanChannelFLSS() {
			const channelUrl = this.loanChannelQueryMap.find(c => c.id === this.loanChannelId)?.url;
			const loanQueryVars = {
				ids: [this.loanChannelId],
				offset: 0,
				limit: this.loanDisplaySettings?.loanLimit ?? 1,
				basketId: this.cookieStore.get('kvbskt'),
			};
			const channelData = await getLoanChannel(
				this.apollo,
				this.loanChannelQueryMap,
				channelUrl,
				loanQueryVars
			);
			const loanChannelData = channelData?.data?.lend?.loanChannelsById ?? [];
			this.selectedChannel = loanChannelData?.[0];
		},
	},

};
</script>
