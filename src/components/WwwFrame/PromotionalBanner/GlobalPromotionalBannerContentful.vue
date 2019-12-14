<template>
	<div class="global-promo-bar">
		<generic-promo-banner
			v-if="isPromoEnabled"
			:promo-banner-content="promoBannerContent"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import contentfulCMS from '@/graphql/query/contentfulCMS.graphql';
import { settingEnabled } from '@/util/settingsUtils';
import GenericPromoBanner from './Banners/GenericPromoBanner';

export default {
	inject: ['apollo'],
	components: {
		GenericPromoBanner,
	},
	data() {
		return {
			isPromoEnabled: false,
			promoBannerContent: {},
		};
	},
	mounted() {
		this.apollo.query({
			query: contentfulCMS,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-global-promo',
			}
		}).then(({ data }) => {
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
		});
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
