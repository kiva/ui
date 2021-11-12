<template>
	<div class="hide-for-print">
		<global-promo-contentful
			:has-promo-session="hasPromoSession"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import GlobalPromoContentful from './PromotionalBanner/GlobalPromotionalBannerContentful';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		GlobalPromoContentful,
	},
	data() {
		return {
			lendingRewardOffered: false,
			bonusBalance: 0,
			hasFreeCredits: false,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			// Used for calculating if the user has a promotional balance
			const promoBalance = numeral(_get(data, 'my.userAccount.promoBalance')).value();
			const basketPromoBalance = numeral(_get(data, 'shop.totals.redemptionCodeAvailableTotal')).value();
			this.bonusBalance = promoBalance + basketPromoBalance;
			this.lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');
			this.hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');
		},
	},
	computed: {
		hasPromoSession() {
			// Check if the user has Promo Credit
			// (lending reward credit, bonus credit, or free credit)
			// If they have any of the above, we hide the banner area
			if (this.lendingRewardOffered || this.bonusBalance > 0 || this.hasFreeCredits) {
				return true;
			}
			return false;
		},
	},
};
</script>

<style lang="scss">
</style>
