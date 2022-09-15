<template>
	<div class="md:tw-flex md:tw-items-start">
		<div class="tw-mr-4">
			<p class="tw-text-h3 tw-font-medium tw-mb-2 tw-text-secondary">
				I want to support
			</p>
			<loan-category-selector-home-exp
				v-if="combinedLoanChannelData.length > 1"
				:loan-channels="combinedLoanChannelData"
				:selected-channel="selectedChannel.id"
				@handle-category-click="handleCategoryClick"
			/>
		</div>
		<kiva-classic-loan-carousel
			:new-home-exp="newHomeExp"
			:is-visible="showCarousel"
			:loan-ids="selectedChannelLoanIds"
			:selected-channel="selectedChannel"
			:show-view-more-card="showViewMoreCard"
		/>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import KivaClassicLoanCarousel from '@/components/LoanCollections/KivaClassicLoanCarousel';
import LoanCategorySelectorHomeExp from '@/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp';

export default {
	name: 'KivaMultiCategoryGrid',
	inject: ['apollo', 'cookieStore'],
	components: { LoanCategorySelectorHomeExp, KivaClassicLoanCarousel },
	props: {
		/**
		 * Array of loan channel data in an object
		 * ex. [{ id: 52, shortName: 'some short name' }]
		* */
		contentfulLoanChannels: {
			type: Array,
			default: () => [],
		},
		/**
		 * Additional display settings
		 * Possible Options:
		 * loanLimit: integer that controls how many loans will be loaded for ALL channels
		* */
		loanDisplaySettings: {
			type: Object,
			default: () => {}
		},
		newHomeExp: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loanChannelData: [],
			selectedChannel: {},
			showCarousel: false,
		};
	},
	computed: {
		combinedLoanChannelData() {
			return this.contentfulLoanChannels.map(channel => {
				const matchedLoanChannel = this.loanChannelData.find(lc => lc.id === channel.id);
				return { ...matchedLoanChannel, ...channel };
			});
		},
		loanChannelIds() {
			return this.contentfulLoanChannels.map(channelSetting => {
				return channelSetting.id;
			});
		},
		loanQueryLimit() {
			return this.loanDisplaySettings?.loanLimit ?? 1;
		},
		selectedChannelLoanIds() {
			const selectedChannel = this.combinedLoanChannelData.find(channel => {
				return this.selectedChannel?.id === channel.id;
			});
			return selectedChannel?.loans?.values?.map(loan => loan.id) ?? [];
		},
		showViewMoreCard() {
			return this.loanDisplaySettings?.showViewMoreCard ?? false;
		}
	},
	mounted() {
		this.fetchLoanChannel();
	},
	methods: {
		handleCategoryClick(payload) {
			this.selectedChannel = this.combinedLoanChannelData.find(
				loanChannel => loanChannel.id === payload.categoryId
			);
		},
		fetchLoanChannel() {
			this.apollo.query({
				query: gql`query selectedLoanCategory($loanChannelIds: [Int]!, $loanLimit: Int) {
					lend {
						loanChannelsById(ids: $loanChannelIds){
							id
							name
							url
							loans(limit: $loanLimit) {
								values {
									id
								}
							}
						}
					}
				}`,
				variables: {
					loanChannelIds: this.loanChannelIds,
					loanLimit: this.loanQueryLimit
				},
			}).then(result => {
				// Set All Active Loan Channels Data
				const loanChannels = result?.data?.lend?.loanChannelsById ?? [];
				this.loanChannelData = loanChannels;
				// Activate the first channel available
				const initialChannel = this.combinedLoanChannelData[0];
				this.selectedChannel = initialChannel;
				// Make the carousel visible
				this.showCarousel = true;
			});
		}
	}
};
</script>
