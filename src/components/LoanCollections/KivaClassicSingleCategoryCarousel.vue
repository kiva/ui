<template>
	<div v-if="loanChannelId">
		<h2 class="tw-mb-2">
			{{ name }}
		</h2>
		<p class="tw-mb-2">
			{{ description }}
		</p>
		<div>
			<kiva-classic-loan-carousel
				:is-visible="true"
				:loan-ids="selectedChannelLoanIds"
				:selected-channel="selectedChannel"
				:show-view-more-card="showViewMoreCard"
				:lend-now-button="lendNowButton"
				:show-check-back-message="showCheckBackMessage"
			/>
		</div>
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
		}
	},
	data() {
		return {
			selectedChannel: {},
		};
	},
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
			return this.selectedChannel?.loans?.values?.map(loan => loan.id) ?? [];
		},
		name() {
			// return optional prop value or value from api
			return this.loanChannelName || this.selectedChannel?.name;
		},
		description() {
			// return optional prop value or value from api
			return this.loanChannelDescription || this.selectedChannel?.description;
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
			});
		},
	}
};
</script>
