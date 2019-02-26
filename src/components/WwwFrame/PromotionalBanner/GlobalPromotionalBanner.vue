<template>
	<div class="global-promo-bar">
		<component :is="currentActivePromo" />
	</div>
</template>

<script>
import numeral from 'numeral';
import _get from 'lodash/get';
import { settingEnabled } from '@/util/settingsUtils';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
import GiftBanner from './Banners/GiftBanner';
// import DefaultPromoBanner from './Banners/DefaultPromoBanner';
import IWDPromoBanner from './Banners/IWDPromoBanner';

export default {
	inject: ['apollo'],
	data() {
		return {
			holidayModeEnabled: false,
			promoEnabled: false,
			lendingRewardOffered: false,
			bonusBalance: 0,
			hasFreeCredits: false
		};
	},
	computed: {
		currentActivePromo() {
			// Temporarily remove holiday or default banner if either of these are true.
			// Each of these will render their own banners in the near future.
			// TODO: Consider adding route based exclude list for pages that shouldn't show banners
			if (this.lendingRewardOffered || this.bonusBalance > 0 || this.hasFreeCredits) {
				return '';
			}
			if (this.holidayModeEnabled && this.$route.path !== '/gifts') {
				return GiftBanner;
			} else if (this.promoEnabled) {
				return IWDPromoBanner;
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

			const promoBalance = numeral(_get(data, 'my.userAccount.promoBalance')).value();
			const basketPromoBalance = numeral(_get(data, 'shop.totals.redemptionCodeAvailableTotal')).value();
			this.bonusBalance = promoBalance + basketPromoBalance;

			this.lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');
			this.hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
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

	.gift-banner {
		background-image: url('~@/assets/images/backgrounds/tipbar-bg-small.jpg');
		background-position: bottom;

		.banner-link {
			display: flex;
			align-items: center;

			.present-icon {
				display: block;
				height: rem-calc(22);
				width: rem-calc(22);
				margin-right: rem-calc(10);
				margin-top: -0.2rem;
			}
		}
	}

	.iwd-banner {
		background-image: none;
		background-color: #edf7ed;

		.banner-link {
			display: flex;
			align-items: center;
			color: #6e1947;

			.iwd-flower-icon {
				display: block;
				height: rem-calc(22);
				width: rem-calc(22);
				margin-right: rem-calc(10);
				margin-top: -0.2rem;
				// Temporary Until we fix icon import
				fill: orange;
				stroke: #edf7ed;
				stroke-width: 2px;
			}
		}
	}

	.gift-banner .banner-link:hover {
		.present-icon {
			stroke: $kiva-darkgreen;
		}
	}
}
</style>
