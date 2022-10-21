<template>
	<kv-grid class="tw-grid-cols-12">
		<div class="tw-col-span-12 md:tw-col-span-3">
			<div class="tw-mr-4">
				<p class="tw-text-h3 tw-font-medium tw-mb-2 tw-text-secondary title">
					I want to support
				</p>
				<loan-category-selector-home-exp
					:loan-channels="combinedLoanChannelData"
					:selected-channel="selectedChannel.id"
					@handle-category-click="handleCategoryClick"
				/>
			</div>
		</div>
		<div class="tw-col-span-12 md:tw-col-span-9">
			<kiva-loan-card-category
				:loan-ids="selectedChannelLoanIds"
				:selected-channel="selectedChannel"
				:loan-channels="combinedLoanChannelData"
				:new-home-exp="newHomeExp"
				:show-view-more-card="showViewMoreCard"
			/>
		</div>
	</kv-grid>
</template>

<script>
import gql from 'graphql-tag';
import KivaLoanCardCategory from '@/components/LoanCollections/HomeExp/KivaLoanCardCategory';
import LoanCategorySelectorHomeExp from '@/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'KivaMultiCategoryGrid',
	inject: ['apollo', 'cookieStore'],
	components: {
		LoanCategorySelectorHomeExp,
		KivaLoanCardCategory,
		KvGrid
	},
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
			selectedChannelId: 0,
		};
	},
	computed: {
		combinedLoanChannelData() {
			return this.contentfulLoanChannels.map(channel => {
				const matchedLoanChannel = this.loanChannelData.find(lc => lc.id === channel.id);
				return { ...matchedLoanChannel, ...channel, loans: { ...matchedLoanChannel?.loans } };
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
		selectedChannel() {
			return this.combinedLoanChannelData.find(
				loanChannel => loanChannel.id === this.selectedChannelId
			);
		},
		selectedChannelLoanIds() {
			const selectedChannel = this.combinedLoanChannelData.find(channel => {
				return this.selectedChannel?.id === channel.id;
			});
			return selectedChannel?.loans?.values?.map(loan => loan.id) ?? Array(this.loanQueryLimit).fill(0);
		},
		showViewMoreCard() {
			return this.loanDisplaySettings?.showViewMoreCard ?? false;
		}
	},
	created() {
		// Copy initial loan channel data from contentful and select first channel
		this.loanChannelData = this.contentfulLoanChannels;
		[this.selectedChannelId] = this.loanChannelIds;
	},
	mounted() {
		// Load data for first channel
		this.fetchLoanChannel(this.selectedChannelId);
	},
	methods: {
		handleCategoryClick(payload) {
			this.selectedChannelId = payload.categoryId;
			this.fetchLoanChannel(this.selectedChannelId);
		},
		fetchLoanChannel(id) {
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
					loanChannelIds: [id],
					loanLimit: this.loanQueryLimit
				},
			}).then(result => {
				// Get clone of loanChannelData for modification
				const loanChannelData = [...this.loanChannelData];
				// Get array index of the fetched loan channel for updating the data
				const channelIndex = this.loanChannelIds.indexOf(id);
				// Set new channel data if available, otherwise use existing data
				const loanChannel = result?.data?.lend?.loanChannelsById[0] ?? loanChannelData[channelIndex];
				loanChannelData[channelIndex] = loanChannel;
				this.loanChannelData = loanChannelData;
			});
		}
	}
};
</script>
<style lang="postcss" scoped>
	.title {
		color: #505050;
	}
</style>
