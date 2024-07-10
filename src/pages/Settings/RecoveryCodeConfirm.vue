<template>
	<div class="recovery-code-confirm">
		<h2 class="tw-mb-2">
			2-step verification is on
		</h2>
		<p class="tw-mb-2">
			Copy this recovery code and keep it somewhere safe. You'll
			need it if you want to log in without your device.
		</p>
		<!-- eslint-disable-next-line max-len -->
		<div class="data-hj-suppress tw-mb-2 tw-text-center tw-font-medium tw-p-2 tw-bg-tertiary tw-rounded-sm tw-border">
			{{ mfaRecoveryCode }}
		</div>
		<div>
			<kv-button
				variant="secondary"
				class="tw-w-full tw-mb-2 copy-code"
				@click="copyToClipboard(mfaRecoveryCode)"
			>
				Copy code
			</kv-button>

			<kv-checkbox
				id="codeVerify"
				class="verified-checkbox tw-mb-2"
				v-model="verified"
			>
				I have safely recorded this code
			</kv-checkbox>

			<kv-button
				class="tw-w-full"
				:state="isDisabled ? 'disabled' : ''"
				@click="$emit('done')"
			>
				Done
			</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	name: 'RecoveryCodeConfirm',
	inject: ['apollo'],
	data() {
		return {
			verified: false,
		};
	},
	components: {
		KvButton,
		KvCheckbox,
	},
	props: {
		mfaRecoveryCode: {
			type: String,
			required: true
		},
	},
	computed: {
		isDisabled() {
			return !this.verified;
		},
	},
	methods: {
		copyToClipboard(string) {
			try {
				navigator.clipboard.writeText(string);
				// Tip message letting user know code successfully copied to clipboard
				this.$showTipMsg('Recovery code copied.');
			} catch (err) {
				console.error(err);
			}
		}
	}
};
</script>
