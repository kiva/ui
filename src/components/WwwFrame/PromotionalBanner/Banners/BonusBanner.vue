<template functional>
	<router-link
		to="/lend/freeCreditEligible"
		class="bonus-banner"
		v-kv-track-event="['TopNav','click-Promo','Bonus Banner']"
	>
		<div class="content">
			<span class="leading-text">Select a borrower to</span> <br class="so xxlu">
			<span class="call-to-action-text">
				lend your {{ props.bonusBalance | numeral('$0.00') }} free credit
			</span>
		</div>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

a.bonus-banner:hover {
	text-decoration: none;
}

a.bonus-banner .content {
	color: $kiva-darkgreen;
	color: var(--kv-header-link-color, $kiva-darkgreen); // If we have a theme passed in to the header, use it.
	height: rem-calc(45);

	&:hover,
	&:active {
		color: $kiva-darkgreen;
		color: var(--kv-header-link-color, $kiva-darkgreen);
	}

	@include breakpoint(medium) {
		line-height: 2.5rem;
	}

	@include breakpoint(xxlarge) {
		line-height: 1.25rem;
	}

	@include breakpoint(medium) {
		.promo-banner-small & .content {
			padding: 0.75rem;
		}
	}

	.call-to-action-text {
		color: $white;
		color: var(--kv-header-link-color, $white);
	}
}
</style>
