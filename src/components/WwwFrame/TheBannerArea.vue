<template>
	<div class="hide-for-print">
		<global-promo-contentful />
	</div>
</template>

<script>
import GlobalPromoContentful from './PromotionalBanner/GlobalPromotionalBannerContentful';

export default {
	name: 'TheBannerArea',
	components: {
		GlobalPromoContentful,
	},
};
</script>
