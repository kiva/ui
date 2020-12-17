<template>
	<kv-lightbox
		:visible="visible"
		title="2-step verification is on"
		@lightbox-closed="closeLightbox"
		prevent-close="true"
	>
		<p>
			Copy this recovery code and keep it somewhere safe. You'll
			need it if you want to log in without your device.
		</p>
		<div class="recovery-code">
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
				class="expanded smaller show-for-small-only"
				:disabled="isDisabled"
				@click.native.prevent="closeLightbox"
			>
				Continue
			</kv-button>

			<kv-button
				class="expanded smaller show-for-medium"
				:disabled="isDisabled"
				@click.native.prevent="closeLightbox"
			>
				Done
			</kv-button>
		</div>
	</kv-lightbox>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvCheckbox from '@/components/Kv/KvCheckbox';
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
		KvCheckbox,
		KvLightbox,
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

// reaching into the KvLightbox component to apply custom styles
::v-deep .kv-lightbox {
	max-width: rem-calc(580);

	.lightbox-title {
		font-weight: bold;
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
