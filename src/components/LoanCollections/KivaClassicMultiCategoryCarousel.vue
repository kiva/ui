<template>
	<div>
		<kiva-classic-loan-category-selector
			v-if="combinedLoanChannelData.length > 1"
			:loan-channels="combinedLoanChannelData"
			:selected-channel="selectedChannel.id"
			@handle-category-click="handleCategoryClick"
		/>
		<kiva-classic-loan-carousel
			:is-visible="showCarousel"
			:loan-ids="selectedChannelLoanIds"
			:selected-channel="selectedChannel"
			:show-view-more-card="showViewMoreCard"
		/>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import KivaClassicLoanCarousel from '@/components/LoanCollections/KivaClassicLoanCarousel';
import KivaClassicLoanCategorySelector from '@/components/LoanCollections/KivaClassicLoanCategorySelector';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

const LEND_URGENCY_EXP = 'lend_urgency';

export default {
	name: 'KivaClassicMultiCategoryCarousel',
	inject: ['apollo', 'cookieStore'],
	components: {
		KivaClassicLoanCarousel,
		KivaClassicLoanCategorySelector,
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
		}
	},
	data() {
		return {
			loanChannelData: [],
			selectedChannel: {},
			showCarousel: false,
			isUrgencyExpVersionShown: false
		};
	},
	computed: {
		loanChannelsWithUrgencyExperiment() {
			if (this.isUrgencyExpVersionShown) {
				// if urgency experiment, insert ending soon as first loan channel
				return [{ id: 3, shortName: 'Ending Soon' }, ...this.contentfulLoanChannels];
			}
			return this.contentfulLoanChannels;
		},
		combinedLoanChannelData() {
			return this.loanChannelsWithUrgencyExperiment.map(channel => {
				const matchedLoanChannel = this.loanChannelData.find(lc => lc.id === channel.id);
				return { ...matchedLoanChannel, ...channel };
			});
		},
		loanChannelIds() {
			return this.loanChannelsWithUrgencyExperiment.map(channelSetting => {
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
	apollo: {
		preFetch(_, client) {
			return client.query({ query: experimentAssignmentQuery, variables: { id: LEND_URGENCY_EXP } });
		},
	},
	created() {
		// run urgency experiment if we are on the homepage
		if (this.$route.name === 'homepage') {
			const urgencyExperiment = this.apollo.readFragment({
				id: `Experiment:${LEND_URGENCY_EXP}`,
				fragment: experimentVersionFragment,
			}) || {};
			this.isUrgencyExpVersionShown = urgencyExperiment.version === 'shown';

			// Fire Event for Exp ACK-291 Urgency Experiment
			if (urgencyExperiment.version && urgencyExperiment.version !== 'unassigned') {
				this.$kvTrackEvent(
					'Lending',
					'EXP-ACK-291-May2022',
					this.isUrgencyExpVersionShown ? 'b' : 'a'
				);
			}
		}
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
							# description
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
		},
	}
};
</script>
