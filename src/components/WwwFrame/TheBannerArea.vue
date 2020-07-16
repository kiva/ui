<template>
	<div>
		<global-promo-contentful
			v-if="!showAppeal"
			:has-promo-session="hasPromoSession"
			:appeal-match-enabled="appealMatchEnabled"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import GlobalPromoContentful from './PromotionalBanner/GlobalPromotionalBannerContentful';

export default {
	inject: ['apollo'],
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
			try {
				this.appealEnabled = JSON.parse(_get(data, 'general.appeal_enabled.value', false));
			} catch (e) {
				this.appealEnabled = false;
			}

			try {
				this.appealMatchEnabled = JSON.parse(_get(data, 'general.appeal_match_enabled.value', false));
			} catch (e) {
				this.appealMatchEnabled = false;
			}

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
			// If the have any of the above, we hide the banner area
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
