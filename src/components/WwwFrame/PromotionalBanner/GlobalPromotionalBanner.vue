<template>
	<div class="global-promo-bar">
		<div class="row align-center">
			<!-- <component :is="currentActivePromo" :bonus-balance="bonusBalance" /> -->
			<component :is="currentActivePromo" class="global-promo" />
		</div>
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
	color: $kiva-green;

	.row {
		margin: 0;
		max-width: 100%;
	}

	a {
		color: $kiva-green;
		text-decoration: none;
		text-align: center;

		&:hover,
		&:active {
			color: $kiva-darkgreen;
		}
	}

	.content {
		text-align: center;
		display: inline-block;
		line-height: 1.25;
		padding: 0.4rem 0;

		@include breakpoint(medium) {
			padding: 0.2rem 0;
		}
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
