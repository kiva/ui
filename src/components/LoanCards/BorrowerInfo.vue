<template functional>
	<div class="borrower-info-wrapper">
		<a class="name">{{ props.name }}</a>
		<div class="country">{{ props.country }}</div>
		<div class="loan-use">A loan of {{ props.amount | numeral('$0.00') }} helps {{ props.name }} {{ props.use }}
			<a class="borrower-page-link" href="">Read more</a>
		</div>
	</div>
</template>

<style lang="scss">
@import 'settings';

.borrower-info-wrapper {
	text-align: center;
	margin-top: rem-calc(20);
	padding: 0 rem-calc(20);
	line-height: 1.375rem;

	.name {
		font-size: 1.375rem;
		font-weight: 400;
	}

	.country {
		color: $kiva-text-light;
		font-weight: 400;
		margin-bottom: rem-calc(20);
	}
}
</style>
