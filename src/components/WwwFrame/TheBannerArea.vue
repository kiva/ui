<template>
	<div v-if="isBannerAreaShown">
		<appeal-banner v-if="showAppeal" :appeal-match-enabled="appealMatchEnabled" />
		<!-- <global-promo /> -->
		<global-promo-contentful v-if="!showAppeal" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import AppealBanner from './EndOfYearAppealBanner/AppealBanner';
import GlobalPromoContentful from './PromotionalBanner/GlobalPromotionalBannerContentful';
// import GlobalPromo from './PromotionalBanner/GlobalPromotionalBanner';

export default {
	inject: ['apollo'],
	components: {
		AppealBanner,
		GlobalPromoContentful,
		// GlobalPromo,
	},
	data() {
		return {
			appealEnabled: false,
			appealMatchEnabled: false,
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
		isBannerAreaShown() {
			// Check if the user has Promo Credit
			// (lending reward credit, bonus credit, or free credit)
			// If the have any of the above, we hide the banner area
			if (this.lendingRewardOffered || this.bonusBalance > 0 || this.hasFreeCredits) {
				return false;
			}
			return true;
		},
		showAppeal() {
			// make sure the appeal is enable + we're not on certain blacklisted pages
			const blacklist = [
				'/checkout',
				'/error',
				'/join-team',
				'/register/social',
				'/possibility/giving-tuesday',
				'/possibility/12-days-of-lending',
				'/possibility/year-end'
			];
			// First check if Appeal Banner or Appeal Banner Matching
			// is active and the user is not on a blacklisted page URL
			if ((this.appealEnabled || this.appealMatchEnabled) && !blacklist.includes(this.$route.path)) {
				return true;
			}
			return false;
		},
	},
};
</script>

<style lang="scss">
</style>
