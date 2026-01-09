import PromoCreditBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const queryResult = {
	data: {
		my: {
			id: '1017469',
			userAccount: {
				id: '1017469',
				promoBalance: '10.00',
			},
		},
		shop: {
			id: '12',
			basket: {
				id: '12',
				hasFreeCredits: true,
				totals: {
					bonusAvailableTotal: 15,
					freeTrialAvailableTotal: 0,
					redemptionCodeAvailableTotal: 0,
					universalCodeAvailableTotal: 0,
				},
				credits: {
					values: [
						{
							id: '12',
							available: 15,
							creditType: 'bonus_credit',
							promoFund: {
								id: '12',
								displayName: 'Test Partner',
							},
						},
					],
				},
			},
			lendingRewardOffered: false,
			promoCampaign: {
				promoFund: {
					id: '12',
					displayName: 'Test Partner',
				},
				managedAccount: {
					campaignInfo: {
						campaignPromoFundId: '12',
						upc: false,
					},
					id: 'ma-1',
					managementType: 'managed',
					pageId: null,
					strategicPartner: {
						id: 'sp-1',
						partnerName: 'Test Partner',
						partnerContentfulPage: 'test-partner',
					},
				},
			},
		},
	},
};

export default {
	title: 'WwwFrame/Banners/PromoCreditBanner',
	component: PromoCreditBanner,
};

export const Default = () => ({
	components: {
		PromoCreditBanner,
	},
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
	provide: {
		$renderConfig: {
			useCDNCaching: false,
			cdnNotedLoggedIn: false,
		},
	},
	data() {
		return {
			$renderConfig: {
				useCDNCaching: false,
				cdnNotedLoggedIn: false,
			},
			$route: {
				query: {
					fromContext: '/impact-dashboard'
				}
			}
		};
	},
	template: `
		<promo-credit-banner />
	`,
});
