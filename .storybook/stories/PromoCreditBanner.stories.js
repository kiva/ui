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
						upc: true,
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
		};
	},
	template: `
		<promo-credit-banner />
	`,
});

const queryResultLendingPromo = {
	data: {
		...queryResult.data,
		shop: {
			...queryResult.data.shop,
			promoCampaign: {
				promoFund: {
					id: '34',
					displayName: 'Lending Promo',
				},
				managedAccount: null,
			},
		},
	},
};

export const WithLendingPromoCredit = () => ({
	components: {
		PromoCreditBanner,
	},
	mixins: [apolloStoryMixin({ queryResult: queryResultLendingPromo }), cookieStoreStoryMixin()],
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

const queryResultLendingRewardOffered = {
	data: {
		...queryResult.data,
		shop: {
			...queryResult.data.shop,
			lendingRewardOffered: true,
			promoCampaign: {
				promoFund: {
					id: '34',
					displayName: 'Managed Account Promo',
				},
				managedAccount: {
					campaignInfo: {
						campaignPromoFundId: '34',
						upc: false,
					},
				},
			},
		},
	}
};

export const WithLendingRewardOffered = () => ({
	components: {
		PromoCreditBanner,
	},
	mixins: [apolloStoryMixin({ queryResult: queryResultLendingRewardOffered }), cookieStoreStoryMixin()],
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
		};
	},
	template: `
		<promo-credit-banner />
	`,
});

const managedAccountQueryResult = {
	data: {
		...queryResult.data,
		shop: {
			...queryResult.data.shop,
			promoCampaign: {
				promoFund: {
					id: '56',
					displayName: 'Managed Account Fund',
				},
				managedAccount: {
					campaignInfo: {
						campaignPromoFundId: '56',
						upc: false,
					},
					id: 'ma-3',
					managementType: 'managed',
					pageId: '12345',
					strategicPartner: {
						id: 'sp-3',
						partnerName: 'Managed Account Partner 2',
						partnerContentfulPage: 'managed-account-partner-2',
					},
				},
			},
		},
	},
};

export const WithManagedAccountId = () => ({
	components: {
		PromoCreditBanner,
	},
	mixins: [apolloStoryMixin({ queryResult: managedAccountQueryResult }), cookieStoreStoryMixin()],
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
		};
	},
	template: `<promo-credit-banner />`,
});

const loggedOutQueryResult = {
	data: {
		my: {
			id: null,
			userAccount: null,
		},
		shop: {
			id: '12',
			basket: {
				id: '12',
				hasFreeCredits: false,
				totals: {
					bonusAvailableTotal: 0,
					freeTrialAvailableTotal: 0,
					redemptionCodeAvailableTotal: 0,
					universalCodeAvailableTotal: 0,
				},
				credits: {
					values: [],
				},
			},
			lendingRewardOffered: false,
			promoCampaign: null,
		},
	},
};

export const WithKivaLendingCreditCookie = (args) => {
	// Only include the cookie if hasCookie is true
	// Format matches monolith: URL-encoded JSON with amount and campaign_id
	const cookieValue = args.hasCookie
		? encodeURIComponent(JSON.stringify({ amount: parseFloat(args.creditAmount) || 0, campaign_id: null }))
		: undefined;
	const cookies = cookieValue ? { kiva_lending_credit: cookieValue } : {};

	return {
		components: {
			PromoCreditBanner,
		},
		mixins: [
			apolloStoryMixin({ queryResult: loggedOutQueryResult }),
			cookieStoreStoryMixin({ cookies }),
		],
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
			};
		},
		template: `<promo-credit-banner />`,
	};
};

WithKivaLendingCreditCookie.args = {
	hasCookie: true,
	creditAmount: '25',
};

WithKivaLendingCreditCookie.argTypes = {
	hasCookie: {
		control: { type: 'boolean' },
		description: 'Whether the kiva_lending_credit cookie exists (from monolith)',
	},
	creditAmount: {
		control: { type: 'text' },
		description: 'Amount of lending credit - will be formatted as {"amount":N,"campaign_id":null}',
		if: { arg: 'hasCookie', truthy: true },
	},
};
