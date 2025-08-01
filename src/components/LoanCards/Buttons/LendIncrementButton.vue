<template>
	<div class="tw-flex tw-justify-between tw-gap-1">
		<div class="tw-w-12" v-if="!loading">
			<kv-select
				id="lend-increment-amount"
				v-model="selectedOption"
				@update:model-value="trackLendAmountSelection"
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
			v-model:loading="loading"
			@add-to-basket="$emit('add-to-basket', $event)"
		>
			{{ buttonText }}
		</lend-button>
	</div>
</template>

<script>
/* eslint-disable vue/no-computed-properties-in-data */
import LendButton from '#src/components/LoanCards/Buttons/LendButton';
import {
	getDropdownPriceArray,
	isLessThan25,
	isBetween25And500
} from '#src/util/loanUtils';
import { KvSelect } from '@kiva/kv-components';

export default {
	name: 'LendIncrementButton',
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
	emits: ['add-to-basket'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		loan: {
			type: Object,
			default: () => {}
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		showNow: {
			type: Boolean,
			default: false
		},
		isVisitor: {
			type: Boolean,
			default: true
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
			// We don't want to open up $5 loan shares for loans with more than $25 at this time
			// IF we wanted to show this interface on loans with less than 25 remaining they would see the selector
			const minAmount = parseFloat(this.amountLeft < 25 ? this.loan.minNoteSize : 25); // 25_hard_coded
			// cap at 20 prices
			const priceArray = getDropdownPriceArray(this.amountLeft, minAmount, this.enableFiveDollarsNotes, false, !this.isVisitor); // eslint-disable-line
			const amountLeftFixed = Number(this.amountLeft).toFixed();
			if (this.isCompleteLoanActive && !priceArray.includes(amountLeftFixed)) {
				priceArray.push(amountLeftFixed);
			}
			return priceArray;
		},
		isCompleteLoanActive() {
			return isLessThan25(this.amountLeft) || isBetween25And500(this.amountLeft);
		},
		buttonText() {
			let str = '';

			str = 'Lend';
			if (this.showNow) {
				str += ' now';
			}

			return str;
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
	methods: {
		trackLendAmountSelection(selectedDollarAmount) {
			this.$kvTrackEvent(
				'Lending',
				'Modify lend amount',
				selectedDollarAmount
			);
		},
	}
};
</script>
