<template>
	<section class="tw-bg-primary tw-p-3 tw-mb-3">
		<h2 class="tw-text-h3 tw-mb-2">
			Repayment settings
		</h2>
		<p class="tw-text-secondary tw-mb-2">
			When my loans are repaid:
		</p>

		<fieldset :disabled="disabled">
			<kv-radio
				id="repayment-deposit"
				name="repayment-setting"
				value="deposit"
				v-model="localSelection"
				class="tw-mb-1"
			>
				Deposit my repayments in my Kiva account so I can relend
			</kv-radio>
			<kv-radio
				id="repayment-donate"
				name="repayment-setting"
				value="donate"
				v-model="localSelection"
			>
				Donate my repayments to Kiva’s operating expenses
			</kv-radio>
		</fieldset>
	</section>
</template>

<script>
import { KvRadio } from '@kiva/kv-components';

const VALUE_DONATE = 'donate';
const VALUE_DEPOSIT = 'deposit';

export default {
	name: 'CreditSettingsRepayment',
	components: { KvRadio },
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue'],
	computed: {
		localSelection: {
			get() {
				if (this.modelValue === true) return VALUE_DONATE;
				if (this.modelValue === false) return VALUE_DEPOSIT;
				return null;
			},
			set(val) {
				this.$emit('update:modelValue', val === VALUE_DONATE);
			},
		},
	},
};
</script>
