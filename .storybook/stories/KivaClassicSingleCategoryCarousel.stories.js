import KivaClassicSingleCategoryCarousel from '#src/components/LoanCollections/KivaClassicSingleCategoryCarousel.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import { KvGrid, KvPageContainer } from '@kiva/kv-components';
import loanData from '../mock-data/loan-data-mock';

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
			loan: loanData[0],
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

