<template functional>
	<router-link to="/lend/freeCreditEligible">
		<div class="content">
			Select a borrower to <br class="xxlu">
			<span class="call-to-action-text">
				lend your {{ props.bonusBalance | numeral('$0') }} free credit
			</span>
		</div>
	</router-link>
</template>
