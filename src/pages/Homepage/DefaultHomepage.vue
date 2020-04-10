<template>
	<div>
		<hero-slideshow v-if="showSlideShow"
			:promo-enabled="promoEnabled" :promo-content="promoContent"
		/>
		<monthly-good-explained v-if="isMonthlyGoodPromoActive" />
		<why-kiva />
		<category-grid />
	</div>
</template>

<script>
import _get from 'lodash/get';
import contentful from '@/graphql/query/contentful.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import WhyKiva from '@/components/Homepage/WhyKiva';
import HeroSlideshow from './HeroSlideshow';
import MonthlyGoodExplained from '@/components/Homepage/MonthlyGoodExplained';
import CategoryGrid from '@/components/Homepage/CategoryGrid';
import { processContent } from '@/util/contentfulUtils';

export default {
	components: {
		WhyKiva,
		HeroSlideshow,
		MonthlyGoodExplained,
		CategoryGrid,
	},
	data() {
		return {
			promoEnabled: false,
			showSlideShow: null,
			promoContent: {}
		};
	},
	inject: ['apollo', 'federation'],
	created() {
		this.federation.query({
			query: contentful,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-homepage-promo',
			}
		}).then(({ data }) => {
			// returns the contentful content of the uiSetting key ui-homepage-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiPromoSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-homepage-promo'); // eslint-disable-line max-len
			// exit if missing setting or fields
			if (!uiPromoSetting || !uiPromoSetting.fields) {
				return false;
			}
			this.promoEnabled = settingEnabled(
				uiPromoSetting.fields,
				'active',
				'startDate',
				'endDate'
			);
			this.promoContent = processContent(uiPromoSetting.fields.content);
		}).finally(() => {
			this.showSlideShow = true;
		});
	},
	computed: {
		isMonthlyGoodPromoActive() {
			try {
				return this.promoEnabled && this.promoContent.genericContentBlock.key === 'monthlyGoodPromoHomepage';
			} catch {
				return false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
