import KivaNewHomeLoanCategorySelector from '@/components/LoanCollections/KivaNewHomeLoanCategorySelector';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import KivaClassicLoanGrid from '@/components/LoanCollections/KivaClassicLoanGrid';

export default {
	title: 'New Home Page/Kiva Multi Category Grid',
	components: {KivaNewHomeLoanCategorySelector, KivaClassicLoanGrid},
	args: {
		showAllButton: true,
		combinedLoanChannelData: [
			{
				"id":32,
				"name":"Refugees and IDPs",
				"url":"https://www.dev.kiva.org/lend/refugees-and-i-d-ps",
				"loans":{
					"values":[
						{
						"id":2414972,
						"__typename":"LoanPartner"
						},
						{
						"id":2411407,
						"__typename":"LoanPartner"
						},
						{
						"id":2428657,
						"__typename":"LoanPartner"
						},
						{
						"id":2422595,
						"__typename":"LoanPartner"
						},
						{
						"id":2424433,
						"__typename":"LoanPartner"
						},
						{
						"id":2411368,
						"__typename":"LoanPartner"
						}
					],
					"__typename":"LoanBasicCollection"
				},
				"shortName": "Refugees and IDPs",
				"__typename":"LoanChannel"
			},
			{
				"id":5,
				"name":"Women",
				"url":"https://www.dev.kiva.org/lend/women",
				"loans":{
					"values":[
						{
						"id":2422935,
						"__typename":"LoanPartner"
						},
						{
						"id":2421997,
						"__typename":"LoanPartner"
						},
						{
						"id":2422009,
						"__typename":"LoanPartner"
						},
						{
						"id":2421968,
						"__typename":"LoanPartner"
						},
						{
						"id":2422012,
						"__typename":"LoanPartner"
						},
						{
						"id":2422036,
						"__typename":"LoanPartner"
						}
					],
					"__typename":"LoanBasicCollection"
				},
				"shortName": "Women",
				"__typename":"LoanChannel"
			},
			{
				"id":96,
				"name":"Covid-19",
				"url":"https://www.dev.kiva.org/lend/covid-19",
				"loans":{
					"values":[
						{
						"id":2421997,
						"__typename":"LoanPartner"
						},
						{
						"id":2422009,
						"__typename":"LoanPartner"
						},
						{
						"id":2421968,
						"__typename":"LoanPartner"
						},
						{
						"id":2422012,
						"__typename":"LoanPartner"
						},
						{
						"id":2422036,
						"__typename":"LoanPartner"
						},
						{
						"id":2422023,
						"__typename":"LoanPartner"
						}
					],
					"__typename":"LoanBasicCollection"
				},
				"shortName": "Covid-19",
				"__typename":"LoanChannel"
			},
			{
				"id":93,
				"name":"Shelter loans for women",
				"url":"https://www.dev.kiva.org/lend/shelter-loans-for-women",
				"loans":{
					"values":[
						{
						"id":2421706,
						"__typename":"LoanPartner"
						},
						{
						"id":2421755,
						"__typename":"LoanPartner"
						},
						{
						"id":2429290,
						"__typename":"LoanPartner"
						},
						{
						"id":2428527,
						"__typename":"LoanPartner"
						},
						{
						"id":2425729,
						"__typename":"LoanPartner"
						},
						{
						"id":2425737,
						"__typename":"LoanPartner"
						}
					],
					"__typename":"LoanBasicCollection"
				},
				"shortName": "Shelter loans for women",
				"__typename":"LoanChannel"
			}
		],
		selectedChannel: {
			id: 32
		},
		showCarousel: true,
		showViewMoreCard: false,
		selectedChannelLoanIds: [
			2414972, 2411407, 2428657,2422595,2424433,2411368
		],
		newHome: true
	}
};

export const DefaultGrid = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { KivaNewHomeLoanCategorySelector, KivaClassicLoanGrid },
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
	methods: {
		handleCategoryClick () {
			console.log('click');
		}
	},
	template: `
		<div class="md:tw-flex md:tw-items-start">
			<kiva-new-home-loan-category-selector
				v-if="combinedLoanChannelData.length > 1"
				:loan-channels="combinedLoanChannelData"
				:selected-channel="selectedChannel.id"
				@handle-category-click="handleCategoryClick"
				:new-home="newHome"
			/>

			<kiva-classic-loan-grid
				:is-visible="showCarousel"
				:loan-ids="selectedChannelLoanIds"
				:selected-channel="selectedChannel"
				:show-view-more-card="showViewMoreCard"
			/>
		</div>
	`,
});

