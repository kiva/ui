import PromoCreditBanner from '#src/components/WwwFrame/PromotionalBanner/Banners/PromoCreditBanner.vue';

const args = {
	basketState: {
		shop: {
			nonTrivialItemCount: 1,
			basket: {
				id: 12,
				hasFreeCredits: true,
				credits: {
					values: {
						id: 12,
						available: true,
						creditType: 'bonus_credit',
						promoFund: {
							id: 12,
							displayName: 'test',
						}
					}
				},
				totals: {
					bonusAvailableTotal: 124312.23,
					freeTrialAvailableTotal: 2432.342,
					redemptionCodeAvailableTotal: 24.241,
					universalCodeAvailableTotal: 234
				}

			}
		},
		my: {
			userAccount: {
				id: 1017469,
				balance: "0.00",
				promoBalance: "10.00",
			},
			lender: {
				image: {
					id: 726677,
					url: "https://www.kiva.org/img/s140/726677.webp",
				},
			},
			isBorrower: false,
			mostRecentBorrowedLoan: null,
			trustee: null,
		}
	}
};

export default {
	title: 'WwwFrame/Banners/PromoCreditBanner',
	component: PromoCreditBanner,
	args,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		PromoCreditBanner
	},
	setup() { return args; },
	template: `
		<promo-credit-banner :basket-state="basketState" />
	`,
});
