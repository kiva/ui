<template>
	<div class="lend-increment-container">
		<div class="lend-increment-dropdown-container" v-if="!loading">
			<select
				class="lend-increment-dropdown"
				v-model="selectedOption"
			>
				<option
					v-for="price in prices"
					:key="price"
					:value="price"
				>
					${{ price }}
				</option>
			</select>
		</div>
		<lend-button
			class="lend-increment-button smaller"
			:class="{ 'is-loading': loading }"
			:price="selectedOption"
			:loan-id="loanId"
			:loading.sync="loading"
			@add-to-basket="$emit('add-to-basket', $event)"
		/>
	</div>
</template>

<script>
import LendButton from '@/components/LoanCards/Buttons/LendButton';
import { buildPriceArray } from '@/util/loanUtils';

export default {
	components: {
		LendButton,
	},
	data() {
		return {
			defaultSelectorAmount: 25,
			selectedOption: this.amountLeft
				? Math.min(this.defaultSelectorAmount, this.amountLeft)
				: this.defaultSelectorAmount,
			loading: false,
		};
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		loan: {
			type: Object,
			default: () => {}
		},
	},
	computed: {
		amountLeft() {
			const { loanAmount, loanFundraisingInfo } = this.loan;
			const { isExpiringSoon, fundedAmount, reservedAmount } = loanFundraisingInfo;

			let remainingAmount = parseFloat(loanAmount) - parseFloat(fundedAmount);
			// subtract reservedAmount
			// - only do this for loans that are not ending soon
			// - for loans ending soon we just show remaining shares which are all un-reserved
			if (!isExpiringSoon) {
				remainingAmount -= parseFloat(reservedAmount);
			}

			return parseInt(remainingAmount, 10);
		},
		prices() {
			const minAmount = parseFloat(this.loan.minNoteSize || 25); // 25_hard_coded
			// cap at 20 prices
			return buildPriceArray(this.amountLeft, minAmount).slice(0, 20);
		}
	},
	watch: {
		loan: {
			handler() {
				this.selectedOption = Math.min(this.defaultSelectorAmount, this.amountLeft);
			},
			immediate: true,
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-increment-container {
	display: flex;
	justify-content: space-between;

	.lend-increment-dropdown-container {
		width: 6rem;

		.lend-increment-dropdown {
			margin: 0;
			height: 54px;
			box-shadow: 0 2px #333;
			border: 1px solid #333;
			border-bottom: none;
			color: #484848;
		}

		@include breakpoint(340px down) {
			width: 4.75rem;
		}

		@include breakpoint(medium) {
			width: 5rem;
		}
	}

	.lend-increment-button {
		margin-bottom: 0;
		flex-grow: 1;
		margin-left: 0.8rem;
		// override only left + right padding
		padding-right: 1rem;
		padding-left: 1rem;

		&.is-loading {
			width: 100%;
		}
	}
}
</style>
