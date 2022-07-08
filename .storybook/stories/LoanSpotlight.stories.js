import LoanSpotlight from '@/components/Categories/LoanSpotlight';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const queryResultHorizontal = {
	data: {
		lend: {
			loanChannelsById: {
				id: 108,
				loans: {
					values: {
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
				}
			}
		}
	}
};


export default {
	title: 'Components/Loan Spotlight',
	component: LoanSpotlight,
};

// export const VerticalLoanImage = () => ({
// 	mixins: [apolloStoryMixin({ queryResultVertical }), cookieStoreStoryMixin()],
// 	components: { LoanSpotlight },
// 	template: `
// 		<loan-spotlight
// 		:routePath='recommended-by-lenders'
// 		:fallbackRoutePath="women"
// 		 />
// 		`,
// });

export const HorizontalLoanImage = () => ({
	mixins: [apolloStoryMixin({ queryResultHorizontal }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:routeName='recommended-by-lenders'
		:fallbackRouteName="women"
		 />
		`,
});
