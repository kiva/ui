<template>
	<www-page id="homepage">
		<hero-slideshow
			:mg-promo-exp="mgPromoExp"
			:double-arrow-button-exp="doubleArrowButtonExp"
			:promo-enabled="promoEnabled"
		/>
		<why-kiva />
		<category-grid />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import { settingEnabled } from '@/util/settingsUtils';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import promoQuery from '@/graphql/query/promotionalBanner.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';
import HeroSlideshow from './HeroSlideshow';
import CategoryGrid from '@/components/Homepage/CategoryGrid';

export default {
	components: {
		WwwPage,
		WhyKiva,
		HeroSlideshow,
		CategoryGrid,
	},
	data() {
		return {
			mgPromoExp: { id: null, version: null },
			doubleArrowButtonExp: { id: null, version: null },
			promoEnabled: false,
			holidayModeEnabled: false,
		};
	},
	inject: ['apollo'],
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

			this.lendingRewardOffered = _get(data, 'shop.lendingRewardOffered');
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

		// get exp assignment for double arrow button experiment
		this.doubleArrowButtonExp = this.apollo.readFragment({
			id: 'Experiment:double_arrow_button',
			fragment: experimentVersionFragment,
		}) || {};
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
		if (this.doubleArrowButtonExp.version !== null) {
			this.$kvTrackEvent(
				'Homepage',
				'EXP-CASH-1313-Oct2019',
				this.doubleArrowButtonExp.version === 'shown' ? 'b' : 'a'
			);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
