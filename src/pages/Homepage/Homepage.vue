<template>
	<www-page id="homepage">
		<hero-slideshow v-if="showSlideShow"
			:promo-enabled="promoEnabled"
		/>
		<why-kiva />
		<category-grid />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import contentfulCMS from '@/graphql/query/contentfulCMS.graphql';
import { settingEnabled } from '@/util/settingsUtils';
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
			promoEnabled: false,
			showSlideShow: null
		};
	},
	inject: ['apollo'],
	mounted() {
		this.apollo.query({
			query: contentfulCMS,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-homepage-promo',
			}
		}).then(({ data }) => {
			// returns the contentful content of the uiSetting key ui-homepage-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			const uiPromoSetting = _get(data, 'contentfulCMS.items', []).find(item => item.key === 'ui-homepage-promo'); // eslint-disable-line max-len
			this.promoEnabled = settingEnabled(
				uiPromoSetting,
				'active',
				'startDate',
				'endDate'
			);
		}).finally(() => {
			this.showSlideShow = true;
		});
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
