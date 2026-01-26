<template>
	<div
		v-if="isUserDataLoading"
		class="tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2"
		data-testid="banner-placeholder"
		style="display: var(--ui-data-promo-credit-banner-display, block);"
	>
		&nbsp;
	</div>
	<div
		v-else-if="showUpcCampaignBanner"
		class="tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2"
		data-testid="upc-campaign-banner"
	>
		<a
			:href="upcCampaignLink"
			class="
					tw-text-white
					hover:tw-text-white
					active:tw-text-white visited:tw-text-white focus:tw-text-white"
			data-testid="impact-dashboard-promo-banner"
			v-kv-track-event="['TopNav','click-Promo','UPC Campaign Banner']"
		>
			You have Kiva credit from {{ partnerName }} to lend
		</a>
	</div>
	<div
		v-else-if="isFromImpactDashboard"
		class="tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2"
		data-testid="lending-reward-banner-impact-dashboard"
	>
		<a
			:href="impactDashboardLink"
			class="
					tw-text-white
					tw-no-underline hover:tw-no-underline hover:tw-text-white
					active:tw-text-white visited:tw-text-white focus:tw-text-white"
			data-testid="impact-dashboard-promo-banner"
			v-kv-track-event="['TopNav','click-Promo','Lending Reward Banner']"
		>

			Please go back to your first Kiva tab or <span class="tw-underline">
				click here</span> to use your {{ bonusBalanceFormatted }} promo credit.
		</a>
	</div>
	<div
		v-else-if="lendingRewardOffered"
		class="tw-bg-brand tw-text-white tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2"
		data-testid="lending-reward-banner"
	>
		<template v-if="promoFundDisplayName && managedAccountPageId">
			<router-link
				:to="`/cc/${managedAccountPageId}`"
				class="
					tw-text-white
					tw-no-underline hover:tw-no-underline hover:tw-text-white
					active:tw-text-white visited:tw-text-white focus:tw-text-white"
				data-testid="cc-promo-banner"
				v-kv-track-event="['TopNav','click-Promo','Lending Reward Banner']"
			>
				<span class="tw-underline">
					Complete a loan to receive your lending reward from {{ promoFundDisplayName }}!
				</span>
			</router-link>
		</template>
		<template
			v-else
		>
			Make a Kiva loan <br class="sm:tw-inline md:tw-hidden">and receive a $25 free credit to lend again.
		</template>
	</div>
	<div
		v-else-if="bonusBalance > 0"
		class="bonus-banner-holder tw-text-center tw-py-1 md:tw-py-1.5 tw-px-2
			tw-flex tw-gap-2 tw-justify-center tw-items-center"
		:class="{'tw-items-center' : isScrolled,
			'tw-bg-brand-500': !managedAccountPageId,
			'tw-bg-brand': managedAccountPageId
		}"
		data-testid="bonus-banner"
	>
		<HeartBox v-if="!managedAccountPageId" class="tw-w-4.5 tw-h-4.5" />
		<a
			v-if="!managedAccountPageId"
			href="/lend/filter"
			class="
				tw-text-white
				tw-no-underline hover:tw-no-underline hover:tw-text-white
				active:tw-text-white visited:tw-text-white focus:tw-text-white"
			data-testid="free-credit-banner"
			v-kv-track-event="['TopNav','click-Promo','Bonus Banner']"
		>
			<div v-if="!isScrolled">
				<h3>You’ve got {{ $filters.numeral(bonusBalance, '$0') }} to give!</h3>
				<h4>While funds last</h4>
			</div>
			<span v-else class="tw-underline tw-text-h5">
				Use your {{ $filters.numeral(bonusBalance, '$0') }} gift today while funds last!
			</span>
		</a>
		<router-link
			v-if="managedAccountPageId"
			:to="`/cc/${managedAccountPageId}`"
			class="
				tw-text-white
				tw-no-underline hover:tw-no-underline hover:tw-text-white
				active:tw-text-white visited:tw-text-white focus:tw-text-white"
			data-testid="cc-promo-banner"
			v-kv-track-event="['TopNav','click-Promo','MVP Bonus Banner']"
		>
			<span class="tw-underline">
				You have {{ $filters.numeral(creditAvailable, '$0.00') }} from {{ promoFundDisplayName }} to lend!
			</span>
		</router-link>
	</div>
</template>

<script>
import numeral from 'numeral';
import { gql } from 'graphql-tag';
import { indexIn } from '#src/util/comparators';
import {
	isFromImpactDashboard,
	userPromoBalanceFragment,
	basketPromoAvailableFragment,
	bonusBalance,
} from '#src/util/promoCredit';
import HeartBox from '#src/assets/images/heart-box.svg';
import { showConfetti } from '#src/util/animation/confettiUtils';
import { setPromoCreditBannerCookie } from '#src/util/promoCreditCookie';

const userPromoCredits = gql`
	query userPromoCredits($basketId: String) {
		my {
			id
			...UserPromoBalance
		}
		shop (basketId: $basketId) {
			id
			lendingRewardOffered
			basket {
				id
				credits {
					values {
						id
						available
						promoFund {
							id
							displayName
						}
					}
				}
			}
			...BasketPromoAvailable
		}
	}
	${userPromoBalanceFragment}
	${basketPromoAvailableFragment}
`;

const promoCampaignInfo = gql`
	query promoCampaign($basketId: String, $promoFundId: String) {
		shop (basketId: $basketId) {
			id
			promoCampaign (promoFundId: $promoFundId) {
				promoFund {
					id
					displayName
				}
				managedAccount {
					campaignInfo {
						campaignPromoFundId
						upc
					}
					id
					managementType
					pageId
					strategicPartner {
						id
						partnerName
						partnerContentfulPage
					}
				}
			}
		}
	}
`;
export default {
	name: 'PromoCreditBanner',
	inject: {
		apollo: { default: null },
		cookieStore: { default: null },
	},
	data() {
		return {
			bonusBalance: 0,
			lendingRewardOffered: false,
			promoCampaignData: null,
			priorityBasketCredit: null,
			isUserDataLoading: false,
			isScrolled: false,
		};
	},
	components: {
		HeartBox,
	},
	apollo: [
		{
			query: userPromoCredits,
			preFetch: true,
			shouldPreFetch(config, { renderConfig }) {
				// Don't prefetch if using CDN caching
				return !renderConfig.useCDNCaching;
			},
			result({ data }) {
				this.isUserDataLoading = false;
				this.setPromoState(data);
				this.setPriorityBasketCredit(data);
			},
		},
		{
			query: promoCampaignInfo,
			preFetch: false,
			variables() {
				return {
					promoFundId: this.promoFundId ? String(this.promoFundId) : null,
				};
			},
			result({ data }) {
				this.promoCampaignData = data?.shop?.promoCampaign ?? null;
			}
		},
	],
	created() {
		const { useCDNCaching } = this.$renderConfig;
		this.isUserDataLoading = useCDNCaching;
	},
	computed: {
		bonusBalanceFormatted() {
			return numeral(this.bonusBalance).format('$0[.]00');
		},
		impactDashboardLink() {
			// return the impact dashboard link
			// get all query params and remove the fromContext
			const queryParams = { ...this.$route.query };
			delete queryParams.fromContext;
			// return the impact dashboard link with additional query params
			return `${this.$route.query?.fromContext}?${new URLSearchParams(queryParams).toString()}`;
		},
		isUpcCampaign() {
			return this.promoCampaignData?.managedAccount?.campaignInfo?.upc ?? false;
		},
		isFromImpactDashboard() {
			return isFromImpactDashboard(this.$route);
		},
		creditAvailable() {
			return this.priorityBasketCredit?.available ?? null;
		},
		partnerName() {
			return this.promoCampaignData?.managedAccount?.strategicPartner?.partnerName ?? null;
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
		upcCampaignLink() {
			const partnerPage = this.promoCampaignData?.managedAccount?.strategicPartner?.partnerContentfulPage ?? null;
			const upcCode = this.promoCampaignData?.managedAccount?.campaignInfo?.upc ?? null;
			if (!partnerPage || !upcCode) {
				return null;
			}
			// return the upc campaign link
			return `/impact-dashboard/${partnerPage}/upc/${upcCode}`;
		},
		showUpcCampaignBanner() {
			return this.isUpcCampaign && !!this.partnerName && !!this.upcCampaignLink;
		},
		setPromoCreditPillCookie() {
			return !this.showUpcCampaignBanner && !this.lendingRewardOffered
				&& this.bonusBalance > 0 && !this.managedAccountPageId;
		}
	},
	methods: {
		setPromoState(promotionData) {
			// set the bonus balance
			this.bonusBalance = bonusBalance(promotionData);

			// set other promo credit signifiers
			this.lendingRewardOffered = promotionData.shop?.lendingRewardOffered;
		},
		setPriorityBasketCredit(promotionData) {
			// get credits list
			const basketCredits = promotionData?.shop?.basket?.credits?.values ?? [];
			// establish precedence for credit types
			const sortBy = ['universal_code', 'redemption_code', 'bonus_credit', 'kiva_credit'];
			// copy and sort the credits
			// filter out credits with 0 available balance to prevent showing them in the banner
			const creditsArrayCopy = basketCredits.map(credit => credit).filter(credit => credit?.available > 0);
			creditsArrayCopy.sort(indexIn(sortBy, 'creditType'));
			// use the 1st credit for presentation
			this.priorityBasketCredit = creditsArrayCopy[0] ?? null;
		},
		onScroll() {
			this.isScrolled = window.scrollY > 0;
		}
	},
	mounted() {
		// set promo cookie to show pill in checkout
		if (this.setPromoCreditPillCookie) {
			setPromoCreditBannerCookie(this.cookieStore);
			showConfetti();
		}

		window.addEventListener('scroll', this.onScroll);
	},
	beforeUnmount() {
		window.removeEventListener('scroll', this.onScroll);
	},
};
</script>
