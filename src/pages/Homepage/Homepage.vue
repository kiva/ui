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
import WwwPage from '@/components/WwwFrame/WwwPage';
import WhyKiva from '@/components/Homepage/WhyKiva';
import HeroSlideshow from './HeroSlideshow';
import CategoryGrid from '@/components/Homepage/CategoryGrid';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import promoSettingFragment from '@/graphql/fragments/promoSetting.graphql';

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
			promoStart: null,
			promoEnd: null,
			promoSetting: null,
		};
	},
	inject: ['apollo'],
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

		this.promoSetting = this.apollo.readFragment({
			id: 'Setting:promo.topNav_promo.enabled',
			fragment: promoSettingFragment,
		}) || {};

		this.promoStart = this.apollo.readFragment({
			id: 'Setting:promo.topnav_promo.start_time',
			fragment: promoSettingFragment,
		}) || {};

		this.promoEnd = this.apollo.readFragment({
			id: 'Setting:promo.topnav_promo.end_time',
			fragment: promoSettingFragment,
		}) || {};
	},
	computed: {
		promoEnabled() {
			const settingData = {
				promoSetting: this.promoSetting,
				promoStart: this.promoStart,
				promoEnd: this.promoEnd,
			};
			return settingEnabled(settingData, settingData.promoSetting, settingData.promoStart, settingData.promoEnd);
		}
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
