<template>
	<div class="hide-for-xxlarge hide-for-print promo-banner-small">
		<promotional-banner :basket-state="basketState" />
	</div>
</template>
<script>
import PromotionalBanner from './PromotionalBanner';

export default {
	components: {
		PromotionalBanner,
	},
	props: {
		basketState: {
			type: Object,
			default: () => {},
		},
	},
};
</script>

<style lang='scss'>
@import 'settings';

.promo-banner-small {
	text-align: center;
	font-size: $small-text-font-size;

	a {
		text-decoration: none;
	}

	.content {
		line-height: 1.25;
		padding: rem-calc(3) 0;
		border-top: 1px solid $kiva-navdivider-green;
		border-bottom: 1px solid $divider-green;
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
