<template>
	<span class="tw-flex tw-items-center">
		<span
			class="
				tw-text-h4
				tw-mr-1
				tw-text-center
				tw-h-3
				tw-w-3
				tw-rounded-full
				tw-bg-brand-100
			"
			:style="{border: '1px solid #2AA967'}"
		>
			<img
				:src="partyEmoji"
				alt="matching icon"
				class="tw-m-auto"
				:style="{ padding: '4px 0 2px 0', height: '1.2rem'}"
			>
		</span>
		<h4 class="tw-inline-block">
			{{ constructedMatchingText }}
		</h4>
	</span>
</template>

<script>
const imgRequire = require.context('@/assets/images/', true);

export default {
	name: 'LoanMatchingText',
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
		partyEmoji() {
			return imgRequire('./party-emoji.png');
		}
	}
};
</script>
