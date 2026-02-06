<template>
	<div class="tw-flex tw-items-start tw-gap-4 tw-mb-4">
		<div
			class="tw-flex tw-flex-shrink-0 tw-w-14 tw-h-14 tw-items-center tw-justify-center
				tw-rounded tw-bg-tertiary tw-overflow-hidden"
		>
			<img
				v-if="profileImageUrl"
				:src="profileImageUrl"
				:alt="alt"
				class="tw-w-14 tw-h-14 tw-min-w-0 tw-min-h-0 tw-max-w-14 tw-max-h-14 tw-object-cover"
			>
			<KvMaterialIcon
				v-else
				class="tw-w-12 tw-h-12 tw-shrink-0 tw-text-secondary"
				:icon="mdiAccount"
			/>
		</div>
		<div class="tw-flex tw-flex-col tw-gap-2">
			<input
				ref="fileInput"
				type="file"
				accept="image/png,image/jpeg,image/jpg,image/gif"
				class="tw-hidden"
				@change="handleFileChange"
			>
			<kv-button
				variant="secondary"
				:disabled="disabled || uploadingImage"
				class="tw-self-start"
				@click="openFileInput"
			>
				{{ uploadingImage ? 'Uploading...' : buttonLabel }}
			</kv-button>
			<p
				v-if="uploadError"
				class="tw-text-small tw-text-danger-highlight"
				role="alert"
			>
				{{ uploadError }}
			</p>
			<p
				v-else
				class="tw-text-small tw-text-secondary"
			>
				{{ hintText }}
			</p>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue';
import { mdiAccount } from '@mdi/js';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import useImageUpload from '#src/composables/useImageUpload';

export default {
	name: 'ProfileImageUpload',
	components: {
		KvButton,
		KvMaterialIcon,
	},
	props: {
		/** Current image URL to display (from server/loaded data) */
		imageUrl: {
			type: String,
			default: '',
		},
		/** Disable the upload button (e.g. when parent form is saving) */
		disabled: {
			type: Boolean,
			default: false,
		},
		/** Button label when not uploading */
		buttonLabel: {
			type: String,
			default: 'Choose image',
		},
		/** Hint text below the button */
		hintText: {
			type: String,
			default: '(Must be a .gif, .jpg or .png)',
		},
		/** Alt text for the image */
		alt: {
			type: String,
			default: 'Profile',
		},
	},
	emits: ['update:imageId'],
	inject: ['kvAuth0'],
	data() {
		const imageUpload = this.kvAuth0
			? useImageUpload(this.kvAuth0, this.$appConfig?.host)
			: null;
		return {
			pendingImagePreviewUrl: null,
			uploadImage: imageUpload?.uploadImage ?? (() => null),
			uploadingImage: imageUpload?.uploadingImage ?? ref(false),
			uploadError: imageUpload?.uploadError ?? ref(''),
			mdiAccount,
		};
	},
	computed: {
		profileImageUrl() {
			return this.pendingImagePreviewUrl || this.imageUrl || '';
		},
	},
	watch: {
		imageUrl(newUrl) {
			// When parent provides updated URL (e.g. after save/refetch), clear local preview
			if (newUrl && this.pendingImagePreviewUrl) {
				URL.revokeObjectURL(this.pendingImagePreviewUrl);
				this.pendingImagePreviewUrl = null;
			}
		},
	},
	methods: {
		openFileInput() {
			this.$refs.fileInput?.click();
		},
		async handleFileChange(event) {
			const input = event.target;
			const file = input?.files?.[0];
			if (!file) return;

			// Revoke previous object URL if any
			if (this.pendingImagePreviewUrl) {
				URL.revokeObjectURL(this.pendingImagePreviewUrl);
				this.pendingImagePreviewUrl = null;
			}

			// Show immediate preview
			this.pendingImagePreviewUrl = URL.createObjectURL(file);

			const imageId = await this.uploadImage(file);
			input.value = '';

			if (imageId) {
				this.$emit('update:imageId', imageId);
			}
		},
	},
	beforeUnmount() {
		if (this.pendingImagePreviewUrl) {
			URL.revokeObjectURL(this.pendingImagePreviewUrl);
		}
	},
};
</script>
