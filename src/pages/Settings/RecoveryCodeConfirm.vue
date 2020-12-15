<template>
	<kv-lightbox
		:visible="true"
		title="2-step verification is on"
		@lightbox-closed="closeLightbox"
	>
		<p>
			Copy this recovery code and keep it somewhere safe. You'll
			need it if you want to log in without your device.
		</p>
		<label>
			<input
				type="text"
				class="verification-code"
				name="verificationCode"
				:value="mfaVerificationCode"
			>
		</label>
		<div>
			<kv-button
				class="secondary smaller expanded"
				@click.native.prevent="copyToClipboard(mfaVerificationCode)"
			>
				Copy code
			</kv-button>
		</div>
		<div>
			<!-- Radio button required -->
			<kv-radio
				id="codeVerify"
				radio-value="I have safely recorded this code"
				v-model="verified"
			>
				I have safely recorded this code
			</kv-radio>
		</div>
		<div>
			<kv-button
				class="expanded smaller"
				:disabled="isDisabled"
				@click="closeLightbox"
				aria-label="Close"
			>
				Done
			</kv-button>
		</div>
	</kv-lightbox>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvRadio from '@/components/Kv/KvRadio';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	data() {
		return {
			verified: false,
		};
	},
	components: {
		KvButton,
		KvRadio,
		KvLightbox,
	},
	props: {
		mfaVerificationCode: {
			type: String,
			required: true
		},
	},
	computed: {
		isDisabled() {
			return !this.verified;
		}
	},
	methods: {
		closeLightbox() {
			console.log('closed triggered');
			this.isShown = false;
			this.$emit('lightbox-closed');
		},
		copyToClipboard(string) {
			try {
				navigator.clipboard.writeText(string);
			} catch (err) {
				console.error(err);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

::v-deep .kv-lightbox {
	max-width: rem-calc(580);

	.close-lightbox {
		display: none;
	}

	.verification-code {
		font-weight: bold;
		text-align: center;
		background-color: $kiva-bg-darkgray;
		border-radius: rem-calc(5);
	}
}

</style>
