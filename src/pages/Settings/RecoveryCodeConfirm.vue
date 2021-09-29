<template>
	<div class="recovery-code-confirm">
		<h2 class="recovery-code-confirm__heading">
			2-step verification is on
		</h2>
		<p class="recovery-code-confirm__description">
			Copy this recovery code and keep it somewhere safe. You'll
			need it if you want to log in without your device.
		</p>
		<div class="recovery-code fs-exclude">
			{{ mfaRecoveryCode }}
		</div>
		<div>
			<kv-button
				class="secondary smallest expanded copy-code"
				@click.native.prevent="copyToClipboard(mfaRecoveryCode)"
			>
				Copy code
			</kv-button>
		</div>
		<div>
			<kv-checkbox
				id="codeVerify"
				class="verified-checkbox"
				radio-value="I have safely recorded this code"
				v-model="verified"
			>
				I have safely recorded this code
			</kv-checkbox>
		</div>
		<div>
			<kv-button
				class="expanded smaller"
				:disabled="isDisabled"
				@click.native.prevent="$emit('done')"
			>
				Done
			</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
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

<style lang="scss" scoped>
@import 'settings';

.recovery-code-confirm {
	&__heading {
		font-weight: bold;
		text-align: left;
	}

	&__description {
		text-align: left;
	}

	.recovery-code {
		text-align: center;
		font-weight: bold;
		line-height: 2.5;
		cursor: text;
		background-color: $kiva-bg-darkgray;
		border-radius: rem-calc(2);
		border: 1px solid black;
		margin-bottom: rem-calc(15);
	}

	.copy-code {
		font-size: 1rem;
	}

	.verified-checkbox {
		margin-bottom: 1rem;
	}
}
</style>
