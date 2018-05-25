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
	margin-top: 0.6875rem;

	a,
	a:hover,
	a:focus {
		text-decoration: none;
	}

	.content {
		@include small-text();

		font-weight: bold;
		color: $kiva-darkgreen;
		text-align: center;

		.call-to-action-text {
			text-decoration: underline;
		}
	}
}
</style>
