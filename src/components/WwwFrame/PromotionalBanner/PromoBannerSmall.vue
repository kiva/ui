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
	background: $kiva-darkgreen;
	font-size: $small-text-font-size;

	a {
		text-decoration: none;
		color: $kiva-accent-green;
	}

	.content {
		line-height: 1.5;
		padding: 0.25rem 0;
		border: 1px solid $kiva-navdivider-green;
		border-left: none;
		border-right: none;
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
