<template>
	<div class="show-for-xxlarge promo-banner-large">
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

.promo-banner-large {
	position: relative;
	top: rem-calc(-66);
	margin-top: 0.6875rem;

	a {
		text-decoration: none;
		color: $light-green;
	}

	.content {
		font-size: $small-font-size;
		font-weight: bold;
		color: $dark-green;
		text-align: center;
		line-height: 1.357rem; // I want to use $small-line-height here
		max-width: 95%;
		z-index: 10;

		.call-to-action-text {
			text-decoration: underline;
		}

		span {
			display: block;
		}
	}
}
</style>
