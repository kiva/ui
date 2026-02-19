import { ref } from 'vue';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

// Max upload size in MB; matches backend (media-service ImageProperties.maxSizeMb).
export const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * Composable for uploading images to /img/upload. In local dev (e.g. app at kiva-ui.local), a relative
 * /img/upload would hit the UI server and return HTML. So we send the upload to the app host URL instead
 * (e.g. https://www.development.kiva.org/img/upload) so it reaches the backend and returns JSON.
 *
 * @param {Object} kvAuth0 - Auth0 instance (injected in components that need it)
 * @param {string} [appHost] - App host from config (e.g. www.development.kiva.org). Used when current origin differs.
 * @returns {{ uploadImage: Function, uploadingImage: Ref<boolean>, uploadError: Ref<string> }}
 */
export default function useImageUpload(kvAuth0, appHost = '') {
	const uploadingImage = ref(false);
	const uploadError = ref('');

	const uploadImage = async file => {
		if (!kvAuth0) {
			uploadError.value = 'Authentication is required to upload images.';
			return null;
		}

		uploadingImage.value = true;
		uploadError.value = '';

		try {
			await kvAuth0.checkSession();
			const token = kvAuth0.accessToken;

			if (!file || !ALLOWED_TYPES.includes(file.type)) {
				uploadError.value = 'Invalid file type. Please upload a PNG, JPEG, or GIF image.';
				return null;
			}

			if (file.size > MAX_IMAGE_SIZE_BYTES) {
				uploadError.value = `File is too large. Maximum size is ${MAX_IMAGE_SIZE_MB} MB.`;
				return null;
			}

			const formData = new FormData();
			formData.append('image', file);

			const headers = {
				Authorization: token ? `Bearer ${token}` : '',
			};

			const fakeAuthInfo = kvAuth0.getFakeAuthCookieValue?.();
			if (fakeAuthInfo?.userId) {
				headers['x-fa-user-id'] = String(fakeAuthInfo.userId);
			}

			const appOrigin = appHost ? `https://${appHost}` : '';
			const isViewingFromDifferentOrigin = typeof window !== 'undefined' && appOrigin
				&& window.location.origin !== appOrigin;
			const uploadEndpoint = isViewingFromDifferentOrigin ? `${appOrigin}/img/upload` : '/img/upload';
			const response = await fetch(uploadEndpoint, {
				method: 'POST',
				headers,
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text();
				if (response.status === 413) {
					let message = `File is too large. Maximum size is ${MAX_IMAGE_SIZE_MB} MB.`;
					try {
						const body = JSON.parse(errorText);
						if (body?.detail) message = body.detail;
					} catch {
						// use default message
					}
					uploadError.value = message;
					return null;
				}
				throw new Error(errorText || `Upload failed (${response.status})`);
			}

			const result = await response.json();

			if (!result?.id) {
				uploadError.value = 'Failed to upload image.';
				return null;
			}

			return result.id;
		} catch (error) {
			uploadError.value = error instanceof Error ? error.message : 'Failed to upload image';
			return null;
		} finally {
			uploadingImage.value = false;
		}
	};

	return {
		uploadImage,
		uploadingImage,
		uploadError,
	};
}
