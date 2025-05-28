<template>
	<div class="bonus-banner-holder">
		<a
			v-if="promoData && !promoData.pageId"
			href="/lend/freeCreditEligible"
			class="bonus-banner"
			v-kv-track-event="['TopNav','click-Promo','Bonus Banner']"
		>
			<div class="content">
				<span class="leading-text">Select a borrower to</span> <br class="so xxlu">
				<span class="call-to-action-text">
					lend your {{ $filters.numeral(promoData.bonusBalance, '$0.00') }} free credit
				</span>
			</div>
		</a>
		<router-link
			v-if="promoData && promoData.pageId"
			:to="`/cc/${promoData.pageId}`"
			class="bonus-banner"
			v-kv-track-event="['TopNav','click-Promo','MVP Bonus Banner']"
		>
			<div class="content">
				<span class="call-to-action-text">
					You have {{ $filters.numeral(promoData.available, '$0.00') }}
				</span>
				<br class="so xxlu">
				<span class="call-to-action-text">
					from {{ promoData.displayName }} to lend!
				</span>
			</div>
		</router-link>
	</div>
</template>

<script>
export default {
	name: 'BonusBanner',
	props: {
		promoData: {
			type: Object,
			default: () => ({}),
		},
	},
};
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

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
