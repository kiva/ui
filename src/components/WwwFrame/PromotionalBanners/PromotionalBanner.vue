<template>
	<component :is="currentActivePromo" />
</template>

<script>
import { mapState } from 'vuex';
import BonusBanner from './BonusBanner';
// import WomensDayBanner from './WomensDayBanner';
// import GiftBanner from './GiftBanner';
// import LendingRewardsBanner from './LendingRewardsBanner';

export default {
	computed: {
		...mapState({
			holidayModeEnabled: state => state.setting.promotionalBannerEnabled,
		}),
		currentActivePromo() {
			return BonusBanner;
			// if (this.promoEnabled) {
			// 	return WomensDayBanner;
			// } else if (BonusBanner) {
			// 	return BonusBanner;
			// } else if (this.holidayModeEnabled) {
			// 	return GiftBanner;
			// }
		}
	},
	asyncData({ store }) {
		return store.dispatch('getPromotionEnabled');
	},

};
</script>
