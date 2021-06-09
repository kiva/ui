<template>
	<span>
		<div class="rounded bg-white pl-4">
			<p class="text-h3 pt-3 mb-3">{{ lgScreenheadline }}</p>
			<kv-ui-select
				id="LoanAmountDropdown"
				class="pr-2.5 mb-3"
				v-model="selectedOption"
			>
				<option
					v-for="price in prices"
					:key="price"
					:value="price"
				>
					${{ price }}
				</option>
			</kv-ui-select>
			<kv-ui-button
				@add-to-basket="$emit('add-to-basket', $event)"
			>
				{{ ctaButtonText }}
			</kv-ui-button>
		</div>
		<div class="rounded bg-white h-5 text-h4 justify-center mt-1 align-middle flex">
			<kv-material-icon
				class="h-2.5 pointer-events-none"
				:icon="mdiLightningBolt"
			/>
			powered by {{ numLenders }} lenders
		</div>
	</span>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import { buildPriceArray } from '@/util/loanUtils';
import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		KvUiSelect,
		KvUiButton,
		KvMaterialIcon,
	},
	props: {
		loanAmount: {
			type: String,
			default: '',
		},
		isExpiringSoon: {
			type: Boolean,
			default: false,
		},
		fundedAmount: {
			type: String,
			default: '',
		},
		reservedAmount: {
			type: Number,
			default: 0,
		},
		lentPreviously: {
			type: Boolean,
			default: false,
		},
		amountInBasket: {
			type: Number,
			default: 0,
		},
		minNoteSize: {
			type: Number,
			default: 25,
		},
		status: {
			type: String,
			default: 'fundraising'
		},
		numLenders: {
			type: Number,
			default: 0,
		}
	},
	data() {
		return {
			mdiLightningBolt,
			basketed: false,
			defaultSelectorAmount: 25,
			selectedOption: this.amountLeft
				? Math.min(this.defaultSelectorAmount, this.amountLeft)
				: this.defaultSelectorAmount,
		};
	},
	methods: {
		freeCreditState() {
			'not eligile for lending Credit';
		},
		loanInBasket() {
			if (this.amountInBasket > 0) {
				this.basketed = true;
			}
		}
	},
	computed: {
		amountLeft() {
			let remainingAmount = parseFloat(this.loanAmount) - parseFloat(this.fundedAmount);
			// subtract reservedAmount
			// - only do this for loans that are not ending soon
			// - for loans ending soon we just show remaining shares which are all un-reserved
			if (!this.isExpiringSoon) {
				remainingAmount -= parseFloat(this.reservedAmount);
				console.log('remaining amount altered', remainingAmount -= parseFloat(this.reservedAmount));
			}

			console.log('remaining amount', remainingAmount);
			console.log('parsed remaining amount', parseInt(remainingAmount, 10));
			return parseInt(remainingAmount, 10);
		},
		prices() {
			const minAmount = parseFloat(this.minNoteSize);
			// limit at 20 price options
			return buildPriceArray(this.amountLeft, minAmount).slice(0, 20);
		},
		lgScreenheadline() {
			// check fundraising status
			console.log('STATUS of loan', this.status);
			// fund raising & in basket
			if (this.status === 'fundraising') {
				return 'Help fund this loan';
			}
			// funded
			if (this.status === 'funded') {
				return 'Help more borrowers like this';
			}
			// refuned, expired
			if (this.status === 'refuned' || this.status === 'expired') {
				return 'Help fund other borrowers';
			}
			return 'no status testing';
		},
		ctaButtonText() {
			// check fundraising status
			// fund raising
			if (this.status === 'fundraising') {
				return 'Lend now';
			}
			// IS THIS CHECK RIGHT?
			if (this.status === 'fundraising' && this.amountInBasket > 0) {
				return 'Continue to checkout';
			}
			// funded
			if (this.status === 'funded') {
				return 'Find another loan like this';
			}
			// refuned, expired
			if (this.status === 'refuned' || this.status === 'expired') {
				return 'Find another loan';
			}
			return 'no status testing';
		},
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
