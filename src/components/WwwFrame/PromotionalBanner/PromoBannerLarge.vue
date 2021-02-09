<template>
	<div class="show-for-xxlarge hide-for-print promo-banner-large">
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

		padding: 0;
		color: $kiva-darkgreen;
		color: var(--kv-header-text-color, $kiva-darkgreen);
		text-align: center;

		.call-to-action-text {
			text-decoration: underline;
		}
	}
}
</style>
