<template functional>
	<router-link to="/lend/refugees-and-i-d-ps" class="generic-promo-banner">
		<div class="content">
			World Refugee Day is June 20 <br class="smo xxlu">
			<span class="call-to-action-text">Help refugees find hope beyond crisis.</span>
		</div>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

.generic-promo-banner {
	.content,
	.content:hover,
	.content:active {
		color: $kiva-darkgreen;
	}

	@include breakpoint(large) {
		.promo-banner-small & .content {
			padding: 0.75rem 0;
		}
	}
}
</style>
