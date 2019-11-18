<template>
	<div class="global-promo-bar">
		<generic-promo-banner
			v-if="isPromoEnabled && isPromotionalBannerShown"
			:promo-banner-content="promoBannerContent"
		/>
	</div>
</template>

<script>
import numeral from 'numeral';
import _get from 'lodash/get';
import { settingEnabled } from '@/util/settingsUtils';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
import GenericPromoBanner from './Banners/GenericPromoBanner';

export default {
	inject: ['apollo'],
	components: {
		GenericPromoBanner,
	},
	data() {
		return {
			isPromoEnabled: false,
			lendingRewardOffered: false,
			bonusBalance: 0,
			hasFreeCredits: false,
			promoBannerContent: {},
		};
	},
	computed: {
		isPromotionalBannerShown() {
			if (this.lendingRewardOffered || this.bonusBalance > 0 || this.hasFreeCredits) {
				return false;
			}
			return true;
		},
	},
	apollo: {
		query: promoQuery,
		preFetch: true,
		variables() {
			return {
				contentType: 'uiSetting',
				contentKey: 'ui-global-promo',
			};
		},
		result({ data }) {
			const promoBalance = numeral(_get(data, 'my.userAccount.promoBalance')).value();
			const basketPromoBalance = numeral(_get(data, 'shop.totals.redemptionCodeAvailableTotal')).value();
			this.bonusBalance = promoBalance + basketPromoBalance;
			this.lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');
			this.hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');

			// returns the contentful content of the uiSetting key ui-global-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiGlobalPromoSetting = _get(data, 'contentfulCMS.items', []).find(item => item.key === 'ui-global-promo'); // eslint-disable-line max-len

			// uiGlobalPromoSetting can contain an array of different banners with
			// different start/end dates first determine if setting is enabled.
			const isGlobalSettingEnabled = settingEnabled(
				uiGlobalPromoSetting,
				'active',
				'startDate',
				'endDate'
			);

			// if setting is enabled determine which banner to display
			if (isGlobalSettingEnabled) {
				const activePromoBanner = uiGlobalPromoSetting.content.find(promoContent => {
					return settingEnabled(
						promoContent.fields,
						'active',
						'startDate',
						'endDate'
					);
				});
				if (activePromoBanner) {
					this.promoBannerContent = activePromoBanner.fields;
					this.isPromoEnabled = true;
				}
			}
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
}
</style>
