<template>
	<span class="tw-flex tw-items-center">
		<span
			class="
				tw-text-h4
				tw-mr-1
				tw-pl-0.5
				tw-h-3
				tw-w-3
				tw-rounded-full
				tw-bg-brand-100
				tw-border-2
				tw-border-brand
			"
		>
			🎉
		</span>
		<h4 class="tw-inline-block ">
			{{ constructedMatchingText }}
		</h4>
	</span>
</template>

<script>

export default {
	props: {
		matcherName: {
			type: String,
			default: '',
		},
		matchRatio: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			default: '',
		},
		fundedAmount: {
			type: String,
			default: '',
		},
		reservedAmount: {
			type: String,
			default: '',
		},
		loanAmount: {
			type: String,
			default: '',
		}
	},
	computed: {
		amountLeft() {
			return this.loanAmount - this.fundedAmount - this.reservedAmount;
		},
		isFunded() {
			return this.status === 'funded';
		},
		isExpired() {
			return this.status === 'expired';
		},
		isBasketedByAnotherUser() {
			return this.amountLeft <= 0 && !this.isFunded;
		},
		constructedMatchingText() {
			if (this.isFunded || this.isBasketedByAnotherUser || this.isExpired) {
				return '';
			}
			return `${this.matchRatio + 1}x matching by ${this.matcherName}`;
		},
	}
};
</script>
