<template functional>
	<div class="content lending-rewards-banner">
		Make a Kiva loan <br class="so xxlu">and receive a $25 free credit to lend again.
	</div>
</template>

<style lang="scss">
@import 'settings';

.lending-rewards-banner {
	background-color: $kiva-green;
	color: $kiva-darkgreen;

	@include breakpoint(medium) {
		.promo-banner-small &.content {
			padding: 0.75rem 0;
		}
	}

	@include breakpoint(xxlarge) {
		background: none;
	}
}
</style>
