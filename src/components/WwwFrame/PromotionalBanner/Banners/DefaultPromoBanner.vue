<template functional>
	<router-link to="/lend/refugees-and-i-d-ps" class="default-promo-banner">
		<div class="content">
			World Refugee Day is June 20 <br class="smo xxlu">
			<span class="call-to-action-text">Help refugees find hope beyond crisis.</span>
		</div>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

.default-promo-banner {
	display: block;
	color: $kiva-accent-green;
	font-weight: 700;
	background-color: $kiva-darkgreen;

	&:hover,
	&:active {
		color: $kiva-accent-green;
	}
}
</style>
