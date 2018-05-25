<template functional>
	<router-link to="/lend/freeCreditEligible" class="bonus-banner">
		<div class="content">
			Select a borrower to <br class="so xxlu">
			<span class="call-to-action-text">
				lend your {{ props.bonusBalance | numeral('$0') }} free credit
			</span>
		</div>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

.bonus-banner {
	background-color: $kiva-green;
	color: $kiva-darkgreen;

	@include breakpoint(medium) {
		.promo-banner-small & .content {
			padding: 0.75rem;
		}
	}

	.call-to-action-text {
		color: $white;
	}
}
</style>
