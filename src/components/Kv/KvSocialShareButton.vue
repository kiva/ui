<template>
	<div class="tw-w-full">
		<kv-button
			class="tw-w-full"
			data-testid="bp-share-cta-button"
			@click="isLightboxVisible = true;"
			v-kv-track-event="[
				'Lending',
				'click-share-cta',
				'Share'
			]"
			:variant="variant"
		>
			<slot>Share</slot>
		</kv-button>
		<kv-lightbox
			:visible="isLightboxVisible"
			:title="modalTitle"
			@lightbox-closed="isLightboxVisible = false"
		>
			<slot name="modal-content"></slot>
			<div
				class="tw-inline-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-1 tw-mt-2.5"
			>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-facebook-button"
					:href="facebookShareUrl"
					target="_blank"
					rel="noopener"
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-Facebook-share', loanId]"
					@click="$showTipMsg('Thanks for sharing to Facebook!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--facebook"
						:icon="mdiFacebook"
					/>
					<span class="tw-font-medium">Share on Facebook</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-twitter-button"
					:href="twitterShareUrl"
					target="_blank"
					rel="noopener"
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-Twitter-share', loanId]"
					@click="$showTipMsg('Thanks for tweeting!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--twitter"
						:icon="mdiTwitter"
					/>
					<span class="tw-font-medium">Share on Twitter</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-linkedin-button"
					:href="linkedInShareUrl"
					target="_blank"
					rel="noopener"
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-LinkedIn-share', loanId]"
					@click="$showTipMsg('Thanks for sharing to LinkedIn!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--linkedin"
						:icon="mdiLinkedin"
					/>
					<span class="tw-font-medium">Share on LinkedIn</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button "
					data-testid="share-copy-link-button"
					:disabled="copyStatus.disabled"
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-Copy-link-share', loanId]"
					@click="copyLink"
				>
					<kv-material-icon
						class="tw-w-4.5 tw-h-4.5 tw-pointer-events-none tw-inline-block tw-align-middle"
						:icon="mdiLink"
					/>
					<span class="tw-font-medium">{{ copyStatus.text }}</span>
				</kv-button>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
/**
 * TODO - refactor duplicate code
 * A lot of these computed properties and methods are duplicated in
 * other components that share to social media, for example:
 * SocialShareV2 and ThanksPageShare
 */

import clipboardCopy from 'clipboard-copy';
import {
	mdiFacebook, mdiLinkedin, mdiTwitter, mdiLink
} from '@mdi/js';
import { getFullUrl } from '@/util/urlUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'KvSocialShareButton',
	components: {
		KvButton,
		KvLightbox,
		KvMaterialIcon
	},
	props: {
		/**
		 * Title in the pop up modal
		 */
		modalTitle: {
			type: String,
			default: 'Help spread the word'
		},
		/**
		 * Linked in supports a title attribute
		 */
		linkedInTitle: {
			type: String,
			default: ''
		},
		/**
		 * Button variant style
		 */
		variant: {
			type: String,
			validator: value => {
				return ['primary', 'secondary', 'link', 'ghost', 'danger', 'caution'].indexOf(value) !== -1;
			},
			default: 'caution'
		},
		/**
		 * String for utm_campaign parameter
		 */
		utmCampaign: {
			type: String,
			required: true
		},
		/**
		 * String for utm_content parameter
		 */
		utmContent: {
			type: String,
			default: ''
		},
		/**
		 * Relative url for the link being shared
		 */
		shareUrl: {
			type: String,
			required: true
		},
		/**
		 * The share message to be used in the social media posts
		 */
		shareMessage: {
			type: String,
			required: true
		},
		/** Force lightbox visibility on load */
		openLightbox: {
			type: Boolean,
			required: false
		},
		loanId: {
			type: Number,
			required: false,
			default: null
		},
	},
	data() {
		return {
			copyStatus: {
				disabled: false,
				text: 'Copy Link'
			},
			isLightboxVisible: this.openLightbox || false,
			mdiFacebook,
			mdiLinkedin,
			mdiTwitter,
			mdiLink,
		};
	},
	computed: {
		utmCampaignQueryParam() {
			return `&utm_campaign=${this.utmCampaign}`;
		},
		utmContentQueryParam() {
			return this.utmContent ? `&utm_content=${this.utmContent}` : '';
		},
		hashParams() {
			return this.shareUrl.split('#')[1] ? `#${this.shareUrl.split('#')[1]}` : '';
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			// Get query param string from shareUrl
			const shareUrlSuffix = this.shareUrl.split('?')[1] ? `?${this.shareUrl.split('?')[1]}&` : '?';
			const shareUrlWithoutHash = this.shareUrl.split('#')[0];
			return `${base}${shareUrlWithoutHash}${shareUrlSuffix}`;
		},
		facebookShareUrl() {
			const pageUrl = `https://${this.$appConfig.host}${this.$route.path}`;
			return getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: this.$appConfig.fbApplicationId,
				display: 'page',
				// eslint-disable-next-line max-len
				href: `${this.shareLink}utm_source=facebook.com&utm_medium=social${this.utmCampaignQueryParam}${this.utmContentQueryParam}${this.hashParams}`,
				redirect_uri: `${pageUrl}`,
				quote: this.shareMessage,
			});
		},
		linkedInShareUrl() {
			return getFullUrl('https://www.linkedin.com/shareArticle', {
				mini: 'true',
				source: `https://${this.$appConfig.host}`,
				summary: this.shareMessage.substring(0, 256),
				title: this.linkedInTitle ? this.linkedInTitle : this.modalTitle,
				// eslint-disable-next-line max-len
				url: `${this.shareLink}utm_source=linkedin.com&utm_medium=social${this.utmCampaignQueryParam}${this.utmContentQueryParam}${this.hashParams}`
			});
		},
		twitterShareUrl() {
			return getFullUrl('https://twitter.com/intent/tweet', {
				text: this.shareMessage,
				// eslint-disable-next-line max-len
				url: `${this.shareLink}utm_source=t.co&utm_medium=social${this.utmCampaignQueryParam}${this.utmContentQueryParam}${this.hashParams}`,
				via: 'Kiva',
			});
		},
	},
	methods: {
		handleFacebookResponse() {
			// Check for the route hash that facebook adds to the request
			if (this.$route.hash === '#_=_') {
				// Check for an error
				const { error_code: code, error_message: message } = this.$route.query;
				if (code) {
					// The 4201 error code means the user pressed 'Cancel', so can be ignored
					if (code !== '4201') {
						this.$showTipMsg(`There was a problem sharing to Facebook: ${message}`, 'warning');
					}
					this.$kvTrackEvent(
						'thanks',
						'click-Facebook-share',
						'error-Social-Share-Lightbox',
						this.loanId
					);
				} else {
					this.$showTipMsg('Thanks for sharing to Facebook!');
				}
			}
		},
		async copyLink() {
			// eslint-disable-next-line max-len
			const url = `${this.shareLink}utm_source=social_share_link&utm_medium=referral${this.utmCampaignQueryParam}${this.utmContentQueryParam}`;
			try {
				await clipboardCopy(url);
				this.copyStatus = {
					disabled: true,
					text: 'Copied!'
				};
			} catch (err) {
				this.copyStatus = {
					disabled: true,
					text: 'Error'
				};
			} finally {
				setTimeout(() => {
					this.copyStatus = {
						disabled: false,
						text: 'Copy Link'
					};
				}, 500);
			}
		}
	},
	mounted() {
		this.handleFacebookResponse();
	},
};
</script>

<style lang="postcss" scoped>
.social-button {
	@apply tw-mb-2.5 tw-w-fit;
}

.social-button__icon {
	@apply tw-w-5 tw-h-5 tw-pointer-events-none tw-inline-block tw-align-middle;
}
</style>

<style lang="scss" scoped>
$color-facebook: #3b5998;
$color-twitter: #08a0e9;
$color-linkedin: #0077b5;

.social-button {
	&__icon {
		&--linkedin {
			color: $color-linkedin;
		}

		&--twitter {
			color: $color-twitter;
		}

		&--facebook {
			color: $color-facebook;
		}
	}
}
</style>
