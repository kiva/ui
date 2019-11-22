<template>
	<www-page id="homepage">
		<hero-slideshow
			:promo-enabled="promoEnabled"
		/>
		<why-kiva />
		<category-grid />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import { settingEnabled } from '@/util/settingsUtils';
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
			promoEnabled: false
		};
	},
	inject: ['apollo'],
	apollo: {
		query: promoQuery,
		variables() {
			return {
				contentType: 'uiSetting',
				contentKey: 'ui-homepage-promo',
			};
		},
		preFetch: true,
		result({ data }) {
			// returns the contentful content of the uiSetting key ui-homepage-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiPromoSetting = _get(data, 'contentfulCMS.items', []).find(item => item.key === 'ui-homepage-promo'); // eslint-disable-line max-len
			this.promoEnabled = settingEnabled(
				uiPromoSetting,
				'active',
				'startDate',
				'endDate'
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
