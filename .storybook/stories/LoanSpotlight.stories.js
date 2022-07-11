import LoanSpotlight from '@/components/Categories/LoanSpotlight';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const loanImageHorizontal = {
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
			loanChannelsById:
				[{
				id: 108,
				loans: {
					values: [{
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
					}]
				}
			}]
	  	}
	}
};

const loanImageVertical = {
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
			loanChannelsById:
				[{
				id: 108,
				loans: {
					values: [{
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
					}]
				}
			}]
	  	}
	}
};

const loanImageAverageSize = {
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
			loanChannelsById: [
				{
					id: 108,
					name: "Recommended by lenders",
					loans: {
						totalCount: 164,
						values: [
							{
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
						]
	  				}
				}
			]
		}
	}
};

export default {
	title: 'Components/Loan Spotlight',
	component: LoanSpotlight,
};

export const SpotlightLoanLoading = () => ({
	mixins: [apolloStoryMixin({ loading: true }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:route-name='recommended-by-lenders'
		:fallback-route-name="women"
		 />
		`,
});

export const SpotlightLoanHorizontal = () => ({
	mixins: [apolloStoryMixin({ queryResult: loanImageHorizontal }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:route-name='recommended-by-lenders'
		:fallback-route-name="women"
		 />
		`,
});

export const SpotlightLoanVertical = () => ({
	mixins: [apolloStoryMixin({ queryResult: loanImageVertical }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:route-name='recommended-by-lenders'
		:fallback-route-name="women"
		 />
		`,
});

export const SpotlightLoanAverageSize= () => ({
	mixins: [apolloStoryMixin({ queryResult: loanImageAverageSize }), cookieStoreStoryMixin()],
	components: { LoanSpotlight },
	template: `
		<loan-spotlight
		:route-name='recommended-by-lenders'
		:fallback-route-name="women"
		 />
		`,
});

