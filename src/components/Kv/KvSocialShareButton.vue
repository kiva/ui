<template>
	<div class="tw-w-full">
		<kv-button
			class="tw-w-full"
			data-testid="bp-share-cta-button"
			@click="isLightboxVisible = true;"
			v-kv-track-event="[
				trackingCategory,
				'show',
				'share-lightbox',
				utmCampaign
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
				class="tw-flex tw-mt-2.5 tw-flex-wrap"
			>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-facebook-button"
					v-kv-track-event="[trackingCategory, 'share', 'facebook', utmCampaign, loanId]"
					@click="showSharePopUp(facebookShareUrl, 'Thanks for sharing to Facebook!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--facebook"
						:icon="mdiFacebook"
					/>
					<span class="tw-font-medium">Facebook</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-twitter-button"
					v-kv-track-event="[trackingCategory, 'share', 'twitter', utmCampaign, loanId]"
					@click="showSharePopUp(twitterShareUrl, 'Thanks for tweeting!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--twitter"
						:icon="mdiTwitter"
					/>
					<span class="tw-font-medium">Twitter</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-linkedin-button"
					v-kv-track-event="[trackingCategory, 'share', 'linkedin', utmCampaign, loanId]"
					@click="showSharePopUp(linkedInShareUrl, 'Thanks for sharing to LinkedIn!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--linkedin"
						:icon="mdiLinkedin"
					/>
					<span class="tw-font-medium">LinkedIn</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button "
					data-testid="share-copy-link-button"
					:disabled="copyStatus.disabled"
					v-kv-track-event="[trackingCategory, 'share', 'copy-link', utmCampaign, loanId]"
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
		/** LoanId of loan we're sharing */
		loanId: {
			type: Number,
			required: false,
			default: null
		},
		/** Optional tracking category, defaults to 'borrower-profile' but allows for uses in other context */
		trackingCategory: {
			type: String,
			required: false,
			default: 'borrower-profile'
		},
	},
	data() {
		return {
			copyStatus: {
				disabled: false,
				text: 'Copy'
			},
			isLightboxVisible: this.openLightbox || false,
			mdiFacebook,
			mdiLinkedin,
			mdiTwitter,
			mdiLink,
		};
	},
	inject: ['apollo'],
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
			return getFullUrl('https://www.linkedin.com/sharing/share-offsite/', {
				url: `${this.shareLink}utm_source=linkedin.com&utm_medium=social${this.utmCampaignQueryParam}${this.utmContentQueryParam}${this.hashParams}` // eslint-disable-line max-len
			});
		},
		twitterShareUrl() {
			return getFullUrl('https://twitter.com/intent/tweet', {
				text: this.shareMessage,
				// eslint-disable-next-line max-len
				url: `${this.shareLink}utm_source=t.co&utm_medium=social${this.utmCampaignQueryParam}${this.utmContentQueryParam}${this.hashParams}`,
				hashtags: 'microloan,kivalove',
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
					this.$kvTrackEvent(this.trackingCategory, 'fail', 'share-facebook');
				} else {
					this.$showTipMsg('Thanks for sharing to Facebook!');
				}
			}
		},
		async copyLink() {
			// eslint-disable-next-line max-len
			const url = `${this.shareLink}utm_source=social_share_link&utm_medium=referral${this.utmCampaignQueryParam}${this.utmContentQueryParam}`;
			try {
				await clipboardCopy(`${this.shareMessage} ${url}`);
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
						text: 'Copy'
					};
				}, 500);
			}
		},
		/** displays the share pop up window for whatever service we are sharing on.  */
		showSharePopUp(destinationUrl, thanksText) {
			// This code taken from the twitter example in the docs
			const width = 600;
			const height = 420;
			const winHeight = window.innerHeight;
			const winWidth = window.innerWidth;
			const left = Math.round((winWidth / 2) - (width / 2));
			let top = 0;

			if (winHeight > height) {
				top = Math.round((winHeight / 2) - (height / 2));
			}
			window.open(
				destinationUrl,
				'intent',
				// eslint-disable-next-line max-len
				`scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=${width},height=${height},left=${left},top=${top}`
			);
			this.$showTipMsg(thanksText);
		}
	},
	mounted() {
		this.handleFacebookResponse();
	},
};
</script>

<style lang="postcss" scoped>
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
