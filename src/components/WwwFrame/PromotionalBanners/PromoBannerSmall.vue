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
	background: $dark-green;
	font-size: $small-font-size;

	a {
		color: $kiva-accent-green;
	}

	.call-to-action-text {
		text-decoration: underline;
	}
}
</style>
