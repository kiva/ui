<template>
	<div class="tw-flex tw-justify-between sm:tw-gap-1 md:tw-gap-2">
		<div class="tw-w-12" v-if="!loading">
			<kv-select
				id="lend-increment-amount"
				v-model="selectedOption"
			>
				<option
					v-for="price in prices"
					:key="price"
					:value="price"
				>
					${{ price }}
				</option>
			</kv-select>
		</div>

		<lend-button
			class="tw-grow"
			:class="{ 'tw-w-full': loading }"
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
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export default {
	components: {
		KvSelect,
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
