<template>
	<kv-lightbox
		:visible="visible"
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
				class="secondary smallest expanded copy-code"
				@click.native.prevent="copyToClipboard(mfaVerificationCode)"
			>
				Copy code
			</kv-button>
		</div>
		<div>
			<!-- Radio button
				This needs to be required before closing
				Need to prevent background click from closing lightbox -->
			<kv-radio
				id="codeVerify"
				class="verified-radio"
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
				@click.native.prevent="closeLightbox"
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
			isShown: false,
			visible: true,
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
		},
	},
	mounted() {
		this.isShown = this.visible;
	},
	methods: {
		closeLightbox() {
			this.visible = false;
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

	.lightbox-title {
		font-weight: bold;
	}

	.close-lightbox {
		display: none;
	}

	.verification-code {
		font-weight: bold;
		text-align: center;
		background-color: $kiva-bg-darkgray;
		border-radius: rem-calc(2);
	}

	.copy-code {
		font-size: 1rem;
	}

	.verified-radio {
		margin-bottom: 1rem;
	}
}

</style>
