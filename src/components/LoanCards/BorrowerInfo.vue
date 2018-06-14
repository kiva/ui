<template>
	<div class="borrower-info-wrapper">
		<a class="name">Bobert { name }</a>
		<div class="country">U.S.A. { country }</div>
		<div class="loan-use">A loan of { loanAmount } helps this dude to buy hotdogs
		and redsox tickets. { loanUse }
			<a class="borrower-page-link" href="">Read more</a>
		</div>
	</div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
@import 'settings';

.borrower-info-wrapper {
	text-align: center;
}
</style>
