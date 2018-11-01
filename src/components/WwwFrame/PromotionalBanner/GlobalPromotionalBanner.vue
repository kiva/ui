<template>
	<div class="global-promo-bar">
		<!-- <component :is="currentActivePromo" :bonus-balance="bonusBalance" /> -->
		<component :is="currentActivePromo" />
	</div>
</template>

<script>
// import numeral from 'numeral';
// import _get from 'lodash/get';
import { settingEnabled } from '@/util/settingsUtils';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
// import BonusBanner from './Banners/BonusBanner';
import GiftBanner from './Banners/GiftBanner';
// import LendingRewardsBanner from './Banners/LendingRewardsBanner';
import DefaultPromoBanner from './Banners/DefaultPromoBanner';

export default {
	inject: ['apollo'],
	data() {
		return {
			// bonusBalance: 0,
			// lendingRewardOffered: false,
			holidayModeEnabled: false,
			promoEnabled: false,
			someVar: 'sayit'
		};
	},
	computed: {
		currentActivePromo() {
			// if (this.lendingRewardOffered) {
			// 	return LendingRewardsBanner;
			// } else if (this.bonusBalance > 0) { // TODO: skip if on a checkout/basket page
			// 	return BonusBanner;
			// } else
			if (this.holidayModeEnabled && this.$route.path !== '/gifts') {
				return GiftBanner;
			} else if (this.promoEnabled) {
				return DefaultPromoBanner;
			}
		},
		textlength() {
			return this.someVar.length;
		}
	},
	apollo: {
		query: promoQuery,
		preFetch: true,
		result({ data }) {
			// const promoBalance = numeral(_get(data, 'my.userAccount.promoBalance')).value();
			// const basketPromoBalance = numeral(_get(data, 'shop.totals.redemptionCodeAvailableTotal')).value();
			// this.bonusBalance = promoBalance + basketPromoBalance;

			// this.lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');

			this.holidayModeEnabled = settingEnabled(
				data,
				'general.holiday_enabled.value',
				'general.holiday_start_time.value',
				'general.holiday_end_time.value'
			);

			this.promoEnabled = settingEnabled(
				data,
				'general.promo_enabled.value',
				'general.promo_start_time.value',
				'general.promo_end_time.value'
			);
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.global-promo-bar {
	background: white;
	font-weight: 300;
	color: $kiva-icon-green;

	.row {
		margin: 0;
		max-width: 100%;
	}

	.banner-link {
		color: $kiva-icon-green;
		text-decoration: none;
		text-align: center;
		padding: 0.625rem;
		line-height: 1.25;

		&:hover,
		&:active {
			color: $kiva-darkgreen;
		}
	}

	.content {
		text-align: center;
		display: block;
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
