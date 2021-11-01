<template>
	<component :is="currentActivePromo" :bonus-balance="bonusBalance" :promo-data="promoData" />
</template>

<script>
import numeral from 'numeral';
import gql from 'graphql-tag';
import { indexIn } from '@/util/comparators';
import BonusBanner from './Banners/BonusBanner';
import LendingRewardsBanner from './Banners/LendingRewardsBanner';

const promoCampaignInfo = gql`
	query promoCampaign($basketId: String, $promoFundId: String) {
		shop (basketId: $basketId) {
			id
			basket {
				id
				hasFreeCredits
				credits {
					values {
						id
						available
						promoFund {
							id
						}
					}
				}
			}
			promoCampaign (promoFundId: $promoFundId) {
				promoFund {
					id
					displayName
				}
				managedAccount {
					id
					managementType
					pageId
				}
			}
		}
	}
`;

export default {
	inject: ['apollo'],
	props: {
		basketState: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			bonusBalance: 0,
			lendingRewardOffered: false,
			promoCampaignData: null,
		};
	},
	computed: {
		currentActivePromo() {
			if (this.lendingRewardOffered) {
				return LendingRewardsBanner;
			}
			if (this.bonusBalance > 0) { // TODO: skip if on a checkout/basket page
				return BonusBanner;
			}
			return null;
		},
		hasFreeCredits() {
			return this.basketState?.shop?.basket?.hasFreeCredits ?? false;
		},
		priorityBasketCredit() {
			// get credits list
			const basketCredits = this.basketState?.shop?.basket?.credits?.values ?? [];
			if (!basketCredits.length) return false;
			// establish precedence for credit types
			const sortBy = ['universal_code', 'redemption_code', 'bonus_credit', 'kiva_credit'];
			// copy and sort the credits
			const creditsArrayCopy = basketCredits.map(credit => credit);
			creditsArrayCopy.sort(indexIn(sortBy, 'creditType'));
			// return the 1st credit for presentation
			return creditsArrayCopy.length ? creditsArrayCopy[0] : null;
		},
		creditAvailable() {
			return this.priorityBasketCredit?.available ?? null;
		},
		promoFundId() {
			return this.priorityBasketCredit?.promoFund?.id ?? null;
		},
		promoFundDisplayName() {
			return this.priorityBasketCredit?.promoFund?.displayName ?? null;
		},
		managedAccountPageId() {
			return this.promoCampaignData?.managedAccount?.pageId ?? null;
		},
		promoData() {
			return {
				bonusBalance: this.bonusBalance,
				available: this.creditAvailable,
				displayName: this.promoFundDisplayName,
				pageId: this.managedAccountPageId,
			};
		}
	},
	watch: {
		basketState: {
			handler(basketState) {
				if (basketState && Object.entries(basketState).length) {
					this.setPromoState(basketState);
				}
			},
			immediate: true,
			deep: true,
		}
	},
	created() {
		if (this.basketState && Object.entries(this.basketState).length) {
			this.setPromoState(this.basketState);
		}
	},
	mounted() {
		// verify promoCampaign information
		this.fetchManagedAccountCampaign();
	},
	methods: {
		fetchManagedAccountCampaign() {
			// TODO: Create an array of queries if multiple credits have an associated promo fund
			// extended promotion information from managed account
			if (this.promoFundId && this.hasFreeCredits && this.creditAvailable) {
				this.apollo.query({
					query: promoCampaignInfo,
					variables: {
						promoFundId: String(this.promoFundId)
					}
				})
					.then(({ data }) => {
						this.promoCampaignData = data?.shop?.promoCampaign ?? null;
					});
			}
		},
		setPromoState(promotionData) {
			const promoBalance = numeral(promotionData.my?.userAccount?.promoBalance).value();
			const bonusAvailableTotal = numeral(
				promotionData.shop?.basket?.totals?.bonusAvailableTotal
			).value();
			const freeTrialAvailableTotal = numeral(
				promotionData.shop?.basket?.totals?.freeTrialAvailableTotal
			).value();
			const redemptionCodeAvailableTotal = numeral(
				promotionData.shop?.basket?.totals?.redemptionCodeAvailableTotal
			).value();
			const universalCodeAvailableTotal = numeral(
				promotionData.shop?.basket?.totals?.universalCodeAvailableTotal
			).value();

			// prefer promoBalance from the user account if it's larger
			const promoBalancePrecedence = promoBalance >= bonusAvailableTotal ? promoBalance : bonusAvailableTotal;

			this.bonusBalance = promoBalancePrecedence
				+ freeTrialAvailableTotal
				+ redemptionCodeAvailableTotal
				+ universalCodeAvailableTotal;

			this.lendingRewardOffered = promotionData.shop?.lendingRewardOffered;
		}
	}
};
</script>
