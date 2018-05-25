<template functional>
	<router-link to="/lend/freeCreditEligible" class="bonus-banner">
		<div class="content">
			Select a borrower to <br class="xxlu">
			<span class="call-to-action-text">
				lend your {{ props.bonusBalance | numeral('$0') }} free credit
			</span>
		</div>
	</router-link>
</template>

<style lang="scss">
@import 'settings';

.bonus-banner {
	.call-to-action-text {
		color: $white;
	}
}
</style>
