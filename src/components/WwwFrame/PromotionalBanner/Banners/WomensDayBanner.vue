<template functional>
	<router-link to="/lend/international-womens-day" class="iwd-banner">
		<div class="content">
			This International Women's Day<br class="smo xxlu">
			<span class="call-to-action-text">let's rally to support 10,000 women</span>
		</div>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

.iwd-banner {
	@include breakpoint(large) {
		.promo-banner-small & .content {
			padding: 0.75rem 0;
		}
	}
}
</style>
