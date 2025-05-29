<template>
	<div
		class="content lending-rewards-banner"
		v-kv-track-event="['TopNav','click-Promo','Lending Reward Banner']"
	>
		Make a Kiva loan <br class="so xxlu">and receive a $25 free credit to lend again.
	</div>
</template>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

.lending-rewards-banner {
	background-color: $kiva-green;
	background-color: var(--kv-header-background-color, $kiva-green);
	color: #fff;
	color: var(--kv-header-text-color, #fff);

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
