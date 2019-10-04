export default function wwwPageMock() {
	return {
		Query: () => ({
			my: null,
			shop: {
				nonTrivialItemCount: 0,
				lendingRewardOffered: false,
				basket: {
					hasFreeCredits: false,
					totals: {
						redemptionCodeAvailableTotal: '0.00',
					}
				}
			},
			general: {
				featureSetting: (parent, args) => ({ key: args.key, value: '' }),
				promoSetting: (parent, args) => ({ key: args.key, value: '' }),
				uiConfigSetting: (parent, args) => ({ key: args.key, value: '' }),
				userSessionData: null,
				kivaStats: {
					latestDonationCampaign: {
						amount_raised: 0,
						target_amount: 0,
					}
				},
			},
		}),
	};
}
