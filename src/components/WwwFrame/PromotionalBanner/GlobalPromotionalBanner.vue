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
// import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import GiftBanner from './Banners/GiftBanner';
// import DefaultPromoBanner from './Banners/DefaultPromoBanner';
// import IWDPromoBanner from './Banners/IWDPromoBanner';
// import WRDBanner from './Banners/WRDBanner';

// --------------------
// Uncomment when the Billion To Women Campaign ends on Oct. 13th 2019
// ---------------------
// import MonthlyGoodPromoBanner from './Banners/MonthlyGoodPromoBanner';
import BillionToWomenPromoBanner from './Banners/BillionToWomenBanner';

export default {
	inject: ['apollo'],
	data() {
		return {
			holidayModeEnabled: false,
			promoEnabled: false,
			lendingRewardOffered: false,
			bonusBalance: 0,
			hasFreeCredits: false,
			// mgPromoExp: { id: null, version: null }
		};
	},
	computed: {
		currentActivePromo() {
			// --------------------
			// Uncomment when the Billion To Women Campaign ends on Oct. 13th 2019
			// ---------------------

			// check for monthly good promo exp first, it's ok if any other bonus credit states are active
			// if (this.monthlyGoodActive) {
			// 	return MonthlyGoodPromoBanner;
			// }

			// Temporarily remove holiday or default banner if either of these are true.
			// Each of these will render their own banners in the near future.
			// TODO: Consider adding route based exclude list for pages that shouldn't show banners
			if (this.lendingRewardOffered || this.bonusBalance > 0 || this.hasFreeCredits) {
				return '';
			}
			if (this.holidayModeEnabled && this.$route.path !== '/gifts') {
				return GiftBanner;
			}
			if (this.promoEnabled) {
				return BillionToWomenPromoBanner;
			}
			return '';
		},
		// --------------------
		// Uncomment when the Billion To Women Campaign ends on Oct. 13th 2019
		// ---------------------

		// monthlyGoodActive() {
		// 	return this.mgPromoExp.version === 'shown';
		// }
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
	created() {
		// --------------------
		// Uncomment when the Billion To Women Campaign ends on Oct. 13th 2019
		// ---------------------

		// get exp assignment for monthly good promo
		// this.mgPromoExp = this.apollo.readFragment({
		// 	id: 'Experiment:mg_promo',
		// 	fragment: experimentVersionFragment,
		// }) || {};
	},
	mounted() {
		// --------------------
		// Uncomment when the Billion To Women Campaign ends on Oct. 13th 2019
		// ---------------------

		// if (this.mgPromoExp.version !== null) {
		// 	this.$kvTrackEvent(
		// 		'Lending',
		// 		'EXP-CASH-129-Sept2019',
		// 		this.mgPromoExp.version === 'shown' ? 'b' : 'a'
		// 	);
		// }

		if (this.promoEnabled) {
			this.$kvTrackEvent(
				'Header',
				'billion-to-women-2019',
				'shown'
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

	.gift-banner {
		background-image: url('~@/assets/images/backgrounds/tipbar-bg-small.jpg');
		background-position: bottom;

		.banner-link {
			display: flex;
			align-items: center;
		}
	}

	.iwd-banner {
		background-image: none;
		background-color: #edf7ed;

		.banner-link {
			display: flex;
			align-items: center;
			color: #6e1947;
		}
	}

	.wrd-banner {
		background-image: none;
		background-color: #edf7ed;

		.banner-link {
			display: flex;
			align-items: center;
			color: #484848;

			&:hover {
				color: #63669D;
			}
		}
	}

	.gift-banner .present-icon,
	.gift-banner .monthly-good-icon,
	.iwd-banner .iwd-flower-icon {
		display: block;
		height: rem-calc(22);
		width: rem-calc(22);
		margin-right: rem-calc(10);
		margin-top: -0.2rem;
	}

	.gift-banner .monthly-good-icon {
		fill: $kiva-darkgreen;
	}

	.gift-banner .banner-link:hover {
		.present-icon {
			stroke: $kiva-darkgreen;
		}
	}
}
</style>
