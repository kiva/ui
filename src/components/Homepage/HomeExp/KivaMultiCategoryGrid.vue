<template>
	<div class="row">
		<div class="small-12 large-3 medium-3">
			<div class="md:tw-items-start">
				<div class="tw-mr-4">
					<p class="tw-text-h3 tw-font-medium tw-mb-2 tw-text-secondary">
						I want to support
					</p>
					<loan-category-selector-home-exp
						v-if="combinedLoanChannelData.length > 1"
						:loan-channels="combinedLoanChannelData"
						:selected-channel="currentSelectedChannel.id"
						@handle-category-click="handleCategoryClick"
					/>
				</div>
			</div>
		</div>
		<div class="small-12 large-9 medium-9">
			<kiva-loan-card-category
				v-if="combinedLoanChannelData.length > 1"
				:loan-ids="selectedChannelLoanIds"
				:selected-channel="currentSelectedChannel"
				:loan-channels="combinedLoanChannelData"
			/>
		</div>
	</div>
</template>

<script>
import KivaLoanCardCategory from '@/components/LoanCollections/HomeExp/KivaLoanCardCategory';
import LoanCategorySelectorHomeExp from '@/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp';

export default {
	name: 'KivaMultiCategoryGrid',
	components: { LoanCategorySelectorHomeExp, KivaLoanCardCategory },
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
		selectedChannel: {
			type: Object,
			default: () => {}
		},
		combinedLoanChannelData: {
			type: Array,
			default: () => []
		},
		selectedChannelLoanIds: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			currentSelectedChannel: this.selectedChannel,
		};
	},
	methods: {
		handleCategoryClick(payload) {
			this.currentSelectedChannel = this.combinedLoanChannelData.find(
				loanChannel => loanChannel.id === payload.categoryId
			);
		},
	}
};
</script>
