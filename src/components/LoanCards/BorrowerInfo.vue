<template>
	<div class="borrower-info-wrapper">
		<a class="name">{{ name }}</a>
		<div class="country">{{ country }}</div>
		<div class="loan-use">
			<span>
				A loan of {{ amount | numeral('$0,0') }} helps {{ name }} {{ shortenedLoanUse }}
			</span>
			<a class="borrower-page-link" href="">Read more</a>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		use: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		country: {
			type: String,
			default: ''
		},
		amount: {
			type: String,
			default: ''
		}
	},
	computed: {
		shortenedLoanUse() {
			const maxLength = 100;
			if (this.use.length === 0) {
				return 'For the borrower\'s privacy, this loan has been made anonymous.';
			} else if (this.use.length > maxLength) {
				return `${this.use.substring(0, maxLength)}...`;
			} else if (this.use.length < maxLength) {
				return this.use;
			}
		},
	}
};
</script>

<style lang="scss" scoped>
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
