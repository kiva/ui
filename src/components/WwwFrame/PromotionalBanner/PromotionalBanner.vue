<template>
	<component :is="currentActivePromo" :bonus-balance="bonusBalance" />
</template>

<script>
import numeral from 'numeral';
import { isWithinRange } from 'date-fns';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
import BonusBanner from './Banners/BonusBanner';
import GiftBanner from './Banners/GiftBanner';
import LendingRewardsBanner from './Banners/LendingRewardsBanner';
import DefaultPromoBanner from './Banners/DefaultPromoBanner';

export default {
	data() {
		return {
			bonusBalance: 0,
			lendingRewardOffered: false,
			holidayModeEnabled: false,
			promoEnabled: false,
		};
	},
	computed: {
		currentActivePromo() {
			if (this.lendingRewardOffered) {
				return LendingRewardsBanner;
			} else if (this.bonusBalance > 0) { // TODO: skip if on a checkout/basket page
				return BonusBanner;
			} else if (this.holidayModeEnabled && this.$route.path !== '/gifts') {
				return GiftBanner;
			} else if (this.promoEnabled) {
				return DefaultPromoBanner;
			}
		}
	},
	apollo: {
		initial: {
			query: promoQuery,
			manual: true,
			prefetch: true,
			result({ data }) {
				const promoBalance = numeral(data.my.userAccount.promoBalance).value();
				const basketPromoBalance = numeral(data.shop.totals.redemptionCodeAvailableTotal).value();
				this.bonusBalance = promoBalance + basketPromoBalance;

				this.lendingRewardOffered = data.shop.lendingRewardOffered;

				this.holidayModeEnabled = this.settingEnabled(
					data.holiday_enabled.value,
					data.holiday_start_time.value,
					data.holiday_end_time.value
				);

				this.promoEnabled = this.settingEnabled(
					data.promo_enabled,
					data.promo_start_time,
					data.promo_end_time
				);
			}
		}
	},
	methods: {
		settingEnabled(enabled, startTime, endTime) {
			return enabled === 'true' && isWithinRange(new Date(), new Date(startTime), new Date(endTime));
		}
	},
};
</script>
