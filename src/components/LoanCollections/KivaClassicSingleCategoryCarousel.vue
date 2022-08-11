<template>
	<div v-if="loanChannelId && selectedChannelLoanIds.length > 0">
		<h2 class="tw-mb-2">
			{{ selectedChannel.name }}
		</h2>
		<p class="tw-mb-2">
			{{ selectedChannel.description }}
		</p>
		<kiva-classic-loan-carousel
			:is-visible="showCarousel"
			:loan-ids="selectedChannelLoanIds"
			:selected-channel="selectedChannel"
			:show-view-more-card="showViewMoreCard"
			:lend-now-button="lendNowButton"
			:show-check-back-message="showCheckBackMessage"
		/>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import KivaClassicLoanCarousel from '@/components/LoanCollections/KivaClassicLoanCarousel';

export default {
	name: 'KivaClassicSingleCategoryCarousel',
	inject: ['apollo', 'cookieStore'],
	components: {
		KivaClassicLoanCarousel,
	},
	props: {
		/**
		 * Loan channel id
		* */
		loanChannelId: {
			type: Number,
			default: null,
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
		}
	},
	data() {
		return {
			selectedChannel: {},
			showCarousel: false,
			isUrgencyExpVersionShown: false
		};
	},
	computed: {
		loanQueryLimit() {
			return this.loanDisplaySettings?.loanLimit ?? 1;
		},
		showViewMoreCard() {
			return this.loanDisplaySettings?.showViewMoreCard ?? false;
		},
		showCheckBackMessage() {
			if (this.loanDisplaySettings?.showCheckBackMessage) {
				return this.loanQueryLimit > this.selectedChannelLoanIds.length;
			}
			return false;
		},
		selectedChannelLoanIds() {
			return this.selectedChannel?.loans?.values?.map(loan => loan.id) ?? [];
		},
	},
	mounted() {
		this.fetchLoanChannel();
	},
	methods: {
		fetchLoanChannel() {
			this.apollo.query({
				query: gql`query selectedLoanCategory($loanChannelIds: [Int]!, $loanLimit: Int) {
					lend {
						loanChannelsById(ids: $loanChannelIds){
							id
							name
							url
							description
							loans(limit: $loanLimit) {
								values {
									id
								}
							}
						}
					}
				}`,
				variables: {
					loanChannelIds: this.loanChannelId,
					loanLimit: this.loanQueryLimit
				},
			}).then(result => {
				const loanChannelData = result?.data?.lend?.loanChannelsById ?? [];
				// eslint-disable-next-line prefer-destructuring
				this.selectedChannel = loanChannelData?.[0] ?? {};
				// Make the carousel visible
				this.showCarousel = true;
			});
		},
	}
};
</script>
