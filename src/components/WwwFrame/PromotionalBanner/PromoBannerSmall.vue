<template>
	<div class="hide-for-xxlarge promo-banner-small">
		<promotional-banner />
	</div>
</template>
<script>
import PromotionalBanner from './PromotionalBanner';

export default {
	components: {
		PromotionalBanner,
	}
};
</script>

<style lang='scss'>
@import 'settings';

.promo-banner-small {
	text-align: center;
	font-size: $small-text-font-size;
	border-top: 1px solid $kiva-navdivider-green;
	border-bottom: 1px solid $divider-green;

	a {
		text-decoration: none;
	}

	.content {
		line-height: 1.25;
		padding: rem-calc(3) 0;
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
