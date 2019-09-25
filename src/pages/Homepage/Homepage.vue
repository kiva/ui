<template>
	<www-page id="homepage">
		<hero-slideshow
			:mg-promo-exp="mgPromoExp"
			:double-arrow-button-exp="doubleArrowButtonExp"
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
			doubleArrowButtonExp: { id: null, version: null }
		};
	},
	inject: ['apollo'],
	created() {
		// get exp assignment for monthly good promo
		this.mgPromoExp = this.apollo.readFragment({
			id: 'Experiment:mg_promo',
			fragment: experimentVersionFragment,
		}) || {};

		// get exp assignment for double arrow button experiment
		this.doubleArrowButtonExp = this.apollo.readFragment({
			id: 'Experiment:double_arrow_button',
			fragment: experimentVersionFragment,
		}) || {};
	},
	mounted() {
		if (this.mgPromoExp.version !== null) {
			this.$kvTrackEvent(
				'Lending',
				'EXP-CASH-129-Sept2019',
				this.mgPromoExp.version === 'shown' ? 'b' : 'a'
			);
		}
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
