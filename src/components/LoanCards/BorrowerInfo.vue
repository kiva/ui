<template functional>
	<div class="borrower-info-wrapper">
		<a class="name">{{ props.name }}</a>
		<div class="country">{{ props.country }}</div>
		<div class="loan-use">
			<span v-if="props.use.length">
				A loan of {{ props.amount | numeral('$0,0') }} helps {{ props.name }} {{ props.use }}
			</span>
			<span v-else>
				For the borrower's privacy, this loan has been made anonymous.
			</span>
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
	line-height: rem-calc(22);
	flex-grow: 1;

	.name {
		font-size: rem-calc(22);
		font-weight: 400;
	}

	.country {
		color: $kiva-text-light;
		font-weight: 400;
		margin-bottom: rem-calc(10);
	}
}
</style>
