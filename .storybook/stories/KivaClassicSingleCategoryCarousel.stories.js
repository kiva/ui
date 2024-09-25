import KivaClassicSingleCategoryCarousel from '#src/components/LoanCollections/KivaClassicSingleCategoryCarousel.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import KvGrid from '@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';

const queryResult = {
	data: {
		lend: {
			loanChannelsById: [
				{
					id: 108,
					name: "Recommended by lenders",
					url: "https://www.dev.kiva.org/lend/recommended-by-lenders",
					description: "Although nothing is guaranteed, loans such as these are favored by experienced lenders because they are the most likely to yield a repayment in one month and to be entirely repaid within a year.",
				}
			],
			loan: {
				id: 1998250,
				distributionModel: 'partner', // direct, partner, both
				geocode: {
					city: "Cranston",
					state: "RI",
					country: {
						name: "Malawi",
						isoCode: "MW"
					}
				},
				image: {
					hash: "d5ad26cd7acc24317edc1c04c6250074"
				},
				name: "Microloan Foundation Malawi",
				sector: {
					name: "Services"
				},
				whySpecial: "It helps Lending Partners withstand negative economic impacts of the COVID-19 pandemic.",
				userProperties: {
					lentTo: null
				},
				use: "this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",
				status: "fundraising",
				loanAmount: "250000.00",
				borrowerCount: 1,
				anonymizationLevel: "none",
				fullLoanUse: "A loan of $250,000 helps this Lending Partner provide loans to women in rural Malawi during the COVID-19 crisis.",
				fundraisingPercent: 0.75,
				unreservedAmount: '600',
				loanFundraisingInfo: {
					fundedAmount: "218950.00",
					reservedAmount: "0.00",
					isExpiringSoon: false
				},
				plannedExpirationDate: "2020-09-10T19:30:13Z",
				matchingText: "LISC",
				matchRatio: 2,
			}
		},
		fundraisingLoans: {
			values: [
				{
					id: 2413188
				},
				{
					id: 2411288
				},
				{
					id: 2406410
				},
				{
					id: 2406459
				},
				{
					id: 2406956
				},
				{
					id: 2408858
				}
			]
		}
	}
};

const args = {
	loanChannelId: 108,
	loanDisplaySettings: {
		loanLimit: 6,
		showViewMoreCard: true
	},
	lendNowButton: true
};

export default {
	title: 'Carousels/Kiva Classic Single Category Carousel',
	component: KivaClassicSingleCategoryCarousel,
	args,
};

export const Default = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
	components: { KivaClassicSingleCategoryCarousel, KvGrid, KvPageContainer },
	setup() { return args; },
	template: `
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12">
					<kiva-classic-single-category-carousel
						:loan-channel-id="loanChannelId"
						:loan-display-settings="loanDisplaySettings"
						:lend-now-button="lendNowButton"
					/>
				</div>
			</kv-grid>
		</kv-page-container>
	`,
});

