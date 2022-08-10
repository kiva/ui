import LoanSpotlight from '@/components/Categories/LoanSpotlight';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const loanHorizontal = {
	id: 2389631,
	description: "Koffi is 34 years old, married and has two children. He sells food products from his shop and gets his supply from the market. <br /><br />He is requesting a loan to develop his business by buying a sufficient quantity of rice, oil and spaghetti. His goal is to increase his income to better support his family.",
	lenderRepaymentTerm: 7,
	anonymizationLevel: "none",
	geocode: {
		city: "Amlame",
		country: {
			name: "Togo"
		}
	},
	image: {
		id: 4854968,
		default: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w520h390/908f90aaffcfb81085c7338ad9318cdd.jpg",
		retina: "https://www-dev-kiva-org-0.freetls.fastly.net/img/w1040h780/908f90aaffcfb81085c7338ad9318cdd.jpg"
	}
}

const loanVertical = {
	id: 2385862,
	description: 'Nunila is a trustworthy and hardworking person and is grateful for the opportunity to work with her community. Her general store has been able to serve the various needs of her neighbors. At this time, she wants to stock her store with cassava flour, wheat, corn, eggs, milk, and cheese. <br /><br />With her current loan, Nunila will purchase the merchandise most consumed in this season (Paraguay is now entering winter), in addition to various grocery products and charcoal to restock her store. <br /><br />Others in her group sell cosmetics, are clothing stylists or sell clothing.',
	lenderRepaymentTerm: 7,
	anonymizationLevel: "none",
	geocode: {
		city: "Aregua",
		country: {
			name: "Paraguay"
		}
	},
	image: {
		id: 4848710,
		default: "https://www-dev-kiva-org.freetls.fastly.net/img/w520h390/965a9b447b84def27a8878f29c501252.jpg",
		retina: "https://www-dev-kiva-org.freetls.fastly.net/img/w1040h780/965a9b447b84def27a8878f29c501252.jpg"
	}
}

const loanAverage = {
	id: 2387011,
	description: "Atsupe is a young, 27-year-old woman who is married and has 3 children. She sells food and gets her supplies at the market.<br /><br />She is requesting a loan to develop her business by buying a large number of bags of cassava flour and rice.<br /><br />She wants to satisfy her customers and earn some money for her family.",								lenderRepaymentTerm: 7,
	anonymizationLevel: "none",
	geocode: {
		city: "Tokoin",
		country: {
			name: "Togo"
		}
	},
	image: {
		id: 4850338,
		"default": "https://www-dev-kiva-org-0.freetls.fastly.net/img/w520h390/9812ee5ad81803cfe79d30fc2b4c9527.jpg",
		"retina": "https://www-dev-kiva-org-0.freetls.fastly.net/img/w1040h780/9812ee5ad81803cfe79d30fc2b4c9527.jpg"
	}
}

function getLoan(loanData) {
	const result = {
		data: {
			lend: {
				loanChannels: {
					values:
						[{
							url: "https://www.dev.kiva.org/lend/recommended-by-lenders",
							id: 108,
							name: "Recommended by lenders",
							loans: {
								totalCount: 174
							}
						}]
				},
				loanChannelsById: [{
					id: 108,
					loans: {
						values: [loanData]
					}
				}]
			}
		}
	}
	return result;
}

export default {
	title: 'Components/Loan Spotlight',
	component: LoanSpotlight,
	args: {
		categorySlug: 'recommended-by-lenders',
		fallbackCategorySlug: 'women'
	}
};

export const SpotlightLoanLoading = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ loading: true }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:category-slug="categorySlug"
		:fallback-category-slug="fallbackCategorySlug"
		 />
		`,
});

export const SpotlightLoanHorizontal = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ queryResult: getLoan(loanHorizontal) }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:category-slug="categorySlug"
		:fallback-category-slug="fallbackCategorySlug"
		 />
		`,
});

export const SpotlightLoanVertical = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ queryResult: getLoan(loanVertical) }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:category-slug="categorySlug"
		:fallback-category-slug="fallbackCategorySlug"
		 />
		`,
});

export const SpotlightLoanAverageSize= (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ queryResult: getLoan(loanAverage) }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:category-slug="categorySlug"
		:fallback-category-slug="fallbackCategorySlug"
		 />
		`,
});

export const SpotlightLoanDoubleAverage = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ queryResult: getLoan(loanAverage) }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<div style="width: 100%; max-width: 1200px; display:flex">
			<div>
				<loan-spotlight
				:category-slug="categorySlug"
				:fallback-category-slug="fallbackCategorySlug"
				/>
			</div>
			<div>
				<loan-spotlight
				:category-slug="categorySlug"
				:fallback-category-slug="fallbackCategorySlug"
				/>
			</div>
		</div>
	`,

});

export const SpotlightLoanInsideGrid= (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin({ queryResult: getLoan(loanAverage) }), cookieStoreStoryMixin()],
	components: { LoanSpotlight, KvGrid, KvPageContainer  },
	template: `
	<kv-page-container>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 lg:tw-col-span-6">
				<loan-spotlight
				:category-slug="categorySlug"
				:fallback-category-slug="fallbackCategorySlug"
				/>
			</div>
			<div class="tw-col-span-12 lg:tw-col-span-6 tw-bg-secondary tw-p-5">
				Other Content
			</div>
		 </kv-grid>
	</kv-page-container>
	`,
});

