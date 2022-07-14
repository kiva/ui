<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
	<div
		v-if="lendingRewardOffered"
		class="tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2"
		data-testid="lending-reward-banner"
	>
		<template v-if="promoData.displayName && promoData.pageId">
			<router-link
				:to="`/cc/${promoData.pageId}`"
				class="
					tw-text-white
					hover:tw-no-underline hover:tw-text-white
					active:tw-text-white visited:tw-text-white focus:tw-text-white"
				data-testid="cc-promo-banner"
				v-kv-track-event="['TopNav','click-Promo','Lending Reward Banner']"
			>
				<span class="tw-underline">
					Complete a loan to receive your lending reward from {{ promoData.displayName }}!
				</span>
			</router-link>
		</template>
		<template
			v-else
			v-kv-track-event="['TopNav','click-Promo','Lending Reward Banner']"
		>
			Make a Kiva loan <br class="sm:tw-inline md:tw-hidden">and receive a $25 free credit to lend again.
		</template>
	</div>
	<div
		v-else-if="bonusBalance > 0"
		class="bonus-banner-holder tw-bg-brand tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2"
		data-testid="bonus-banner"
	>
		<router-link
			v-if="promoData && !promoData.pageId"
			to="/lend/freeCreditEligible"
			class="
				tw-text-white
				hover:tw-no-underline hover:tw-text-white
				active:tw-text-white visited:tw-text-white focus:tw-text-white"
			data-testid="free-credit-banner"
			v-kv-track-event="['TopNav','click-Promo','Bonus Banner']"
		>
			Select a borrower to <span class="tw-underline">
				lend your {{ promoData.bonusBalance | numeral('$0.00') }} free credit</span>
		</router-link>
		<router-link
			v-if="promoData && promoData.pageId"
			:to="`/cc/${promoData.pageId}`"
			class="
				tw-text-white
				hover:tw-no-underline hover:tw-text-white
				active:tw-text-white visited:tw-text-white focus:tw-text-white"
			data-testid="cc-promo-banner"
			v-kv-track-event="['TopNav','click-Promo','MVP Bonus Banner']"
		>
			<span class="tw-underline">
				You have {{ promoData.available | numeral('$0.00') }} from {{ promoData.displayName }} to lend!
			</span>
		</router-link>
	</div>
</template>

<script>
import numeral from 'numeral';
import gql from 'graphql-tag';
import { indexIn } from '@/util/comparators';

const promoCampaignInfo = gql`
	query promoCampaign($basketId: String, $promoFundId: String) {
		my {
			userAccount {
				id
				promoBalance
			}
		}
		shop (basketId: $basketId) {
			id
			lendingRewardOffered
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
				totals {
					creditAvailableTotal
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
	name: 'PromoCreditBanner',
	inject: ['apollo', 'cookieStore'],
	props: {
		basketState: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			bonusBalance: 0,
			hasFreeCredits: false,
			lendingRewardOffered: false,
			promoCampaignData: null,
		};
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
	computed: {
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
			const promoCampaignIdFallback = this.promoCampaignData?.promoFund?.id ?? null;
			return this.priorityBasketCredit?.promoFund?.id ?? promoCampaignIdFallback;
		},
		promoFundDisplayName() {
			const promoCampaignNameFallback = this.promoCampaignData?.promoFund?.displayName ?? null;
			return this.priorityBasketCredit?.promoFund?.displayName ?? promoCampaignNameFallback;
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
	methods: {
		fetchManagedAccountCampaign() {
			this.apollo.query({
				query: promoCampaignInfo,
				variables: this.promoFundId ? {
					promoFundId: String(this.promoFundId)
				} : {}
			})
				.then(({ data }) => {
					this.promoCampaignData = data?.shop?.promoCampaign ?? null;
				});
		},
		setPromoState(promotionData) {
			// parse individual promo credit type amounts
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

			const basketPromoBalance = bonusAvailableTotal
				+ freeTrialAvailableTotal
				+ redemptionCodeAvailableTotal
				+ universalCodeAvailableTotal;

			// Parse user promoBalance and creditAvailableTotal from basket
			const userPromoBalance = numeral(promotionData?.my?.userAccount?.promoBalance ?? 0).value();
			// if we have promo balance from the user or the basket proceed with that
			this.bonusBalance = userPromoBalance >= basketPromoBalance
				? userPromoBalance : basketPromoBalance;

			// set other promo credit signifiers
			this.lendingRewardOffered = promotionData.shop?.lendingRewardOffered;
			this.hasFreeCredits = promotionData?.shop?.basket?.hasFreeCredits;
		}
	}
};
</script>
