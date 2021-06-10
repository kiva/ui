<template>
	<span class="tw-z-1">
		<!-- eslint-disable-next-line max-len -->
		<div class="
					tw-bg-brand
					tw-fixed
					tw-left-0
					md:tw-relative
					md:tw-left-unset
					tw-bottom-0
					tw-right-0
					md:tw-rounded-b
					md:tw-rounded-t-none
					lg:tw-rounded-t
					tw-bg-white
					tw-border
					tw-bt-1
					tw-border-gray-300
					md:tw-border-none
					tw-pt-1
					tw-pl-2.5
					tw-pr-2.5
					lg:tw-pl-4
					lg:tw-pr-4"
		>
			<p class="tw-text-h3 tw-pt-3 lg:tw-mb-3 tw-hidden lg:tw-inline-block">
				{{ lgScreenheadline }}
			</p>
			<span class="tw-flex">
				<kv-ui-select
					id="LoanAmountDropdown"
					class="tw-pr-2.5 lg:tw-mb-3"
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
					class="tw-inline-flex tw-flex-1"
					@add-to-basket="$emit('add-to-basket', $event)"
				>
					{{ ctaButtonText }}
				</kv-ui-button>
			</span>
		</div>
		<!-- eslint-disable-next-line max-len -->
		<div class="tw-bg-brand-300
					tw-fixed
					md:tw-static
					tw-left-3
					tw-right-3
					tw-bottom-10
					tw-rounded
					tw-bg-white
					tw-h-5
					tw-text-h4
					tw-justify-center
					tw-mt-1
					md:tw-mr-3
					tw-flex
					md:tw-w-3/5
					lg:tw-w-full
					md:tw-float-right
					lg:tw-float-none
					tw-p-1"
		>
			<kv-material-icon
				class="tw-h-2.5 tw-pointer-events-none"
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
			type: String,
			default: '',
		},
		lentPreviously: {
			type: Boolean,
			default: false,
		},
		amountInBasket: {
			type: String,
			default: '',
		},
		minNoteSize: {
			type: String,
			default: '',
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
