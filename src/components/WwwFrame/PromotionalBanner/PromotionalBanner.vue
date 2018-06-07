<template>
	<component :is="currentActivePromo" :bonus-balance="bonusBalance" />
</template>

<script>
import numeral from 'numeral';
import { mapState } from 'vuex';
import BonusBanner from './Banners/BonusBanner';
import GiftBanner from './Banners/GiftBanner';
import LendingRewardsBanner from './Banners/LendingRewardsBanner';
// import WomensDayBanner from './Banners/WomensDayBanner';
import GenericPromoBanner from './Banners/GenericPromoBanner';

export default {
	computed: {
		...mapState({
			bonusBalance: state => {
				const promoBalance = numeral(state.my.userAccount.promoBalance).value();
				const basketPromoBalance = numeral(state.shop.totals.redemptionCodeAvailableTotal).value();
				return promoBalance + basketPromoBalance;
			},
			lendingRewardOffered: state => state.shop.lendingRewardOffered,
			holidayModeEnabled: state => state.setting.holidayModeEnabled,
			promoEnabled: state => state.setting.promotionalBannerEnabled,
		}),
		currentActivePromo() {
			if (this.lendingRewardOffered) {
				return LendingRewardsBanner;
			} else if (this.bonusBalance > 0) { // TODO: skip if on a checkout/basket page
				return BonusBanner;
			} else if (this.holidayModeEnabled && this.$route.path !== '/gifts') {
				return GiftBanner;
			} else if (this.promoEnabled) {
				// return WomensDayBanner;
				return GenericPromoBanner;
			}
		}
	},
	asyncData({ store }) {
		return store.dispatch('getPromotionEnabled');
	},

};
</script>
