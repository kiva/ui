import KivaClassicLoanCarousel from '@/components/LoanCollections/KivaClassicLoanCarousel';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import LoanCategorySelectorHomeExp from '@/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp';

export default {
	title: 'New Home Page/Kiva Multi Category Grid',
	components: {LoanCategorySelectorHomeExp, KivaClassicLoanCarousel},
	args: {
		showAllButton: true,
		combinedLoanChannelData: [{
			"id":32,
			"name":"Refugees and IDPs",
			"url":"https://www.dev.kiva.org/lend/refugees-and-i-d-ps",
			"shortName": "Refugees and IDPs",
			"__typename":"LoanChannel"
		},
		{
			"id":5,
			"name":"Women",
			"url":"https://www.dev.kiva.org/lend/women",
			"shortName": "Women",
			"__typename":"LoanChannel"
		},
		{
			"id":6,
			"name":"Health",
			"url":"https://www.dev.kiva.org/lend/women",
			"shortName": "Health",
			"__typename":"LoanChannel"
		}],
		selectedChannel: {
			id: 5,
			url: 'women'
		},
		showCarousel: true,
		showViewMoreCard: false,
		selectedChannelLoanIds: [
			2414972, 2411407, 2428657, 2422009, 2421968, 2422012
		],
		newHomeExp: true,
		loanLimit: 6,
	}
};

export const DefaultGrid = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { LoanCategorySelectorHomeExp, KivaClassicLoanCarousel },
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
	methods: {
		handleCategoryClick (payload) {
			this.selectedChannel = this.combinedLoanChannelData.find(
				loanChannel => loanChannel.id === payload.categoryId
			);
		}
	},
	template: `
		<div class="md:tw-flex md:tw-items-start">
			<div class="tw-mr-4">
				<p class="tw-text-h3 tw-font-medium tw-mb-2 tw-text-secondary">I want to support</p>
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
	`,
});

