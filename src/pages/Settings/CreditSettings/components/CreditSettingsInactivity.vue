<template>
	<section class="tw-py-3 tw-border-b tw-border-secondary">
		<h2 class="tw-text-h3 tw-mb-2">
			Inactivity settings
		</h2>
		<p class="tw-text-secondary tw-mb-2">
			If my account becomes inactive:
		</p>

		<fieldset :disabled="disabled">
			<kv-radio
				id="inactive-kiva"
				name="inactivity-setting"
				value="kiva"
				v-model="localRecipient"
				class="tw-mb-1"
			>
				Donate my remaining credit to Kiva’s operating expenses
			</kv-radio>
			<kv-radio
				id="inactive-paypal"
				name="inactivity-setting"
				value="email_address"
				v-model="localRecipient"
			>
				Return my remaining credit to my PayPal account
			</kv-radio>

			<div v-if="localRecipient === 'email_address'" class="tw-mt-2">
				<label class="tw-block tw-mb-1" for="paypal-email">
					PayPal email address
				</label>
				<kv-text-input
					id="paypal-email"
					class="data-hj-suppress"
					type="email"
					autocomplete="email"
					placeholder="name@example.com"
					v-model="localEmail"
				/>
			</div>
		</fieldset>
	</section>
</template>

<script>
import { KvRadio, KvTextInput } from '@kiva/kv-components';

const ALLOWED_RECIPIENTS = ['kiva', 'email_address'];
const DEFAULT_RECIPIENT = 'kiva';

export default {
	name: 'CreditSettingsInactivity',
	components: { KvRadio, KvTextInput },
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		inactiveCreditRecipient: {
			type: String,
			default: 'kiva',
		},
		paypalEmailAddress: {
			type: String,
			default: '',
		},
	},
	emits: [
		'update:inactive-credit-recipient',
		'update:paypal-email-address',
	],
	computed: {
		localRecipient: {
			get() {
				return this.inactiveCreditRecipient;
			},
			set(val) {
				this.$emit('update:inactive-credit-recipient', val);
			},
		},
		localEmail: {
			get() {
				return this.paypalEmailAddress;
			},
			set(val) {
				this.$emit('update:paypal-email-address', val);
			},
		},
	},
	watch: {
		inactiveCreditRecipient: {
			immediate: false,
			handler(val) {
				if (val && !ALLOWED_RECIPIENTS.includes(val)) {
					this.$emit('update:inactive-credit-recipient', DEFAULT_RECIPIENT);
				}
			},
		},
	},
};
</script>
