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
			variant="caution"
		>
			Share
		</kv-button>
		<kv-lightbox
			:visible="isLightboxVisible"
			:title="`Help ${name} spread the word.`"
			@lightbox-closed="isLightboxVisible = false"
		>
			<!-- eslint-disable-next-line max-len -->
			<p>You can make change happen faster for {{ name }} by getting the word out. Each lender that supports {{ name }} brings them one step closer to being live for all to see on Kiva.org. Share their loan now.</p>
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
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-Facebook-share']"
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
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-Twitter-share']"
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
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-LinkedIn-share']"
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
					v-kv-track-event="['Lending', 'Social-Share-Lightbox', 'click-Copy-link-share']"
					@click="copyLink"
				>
					<kv-material-icon
						class="tw-w-4.5 tw-h-4.5 tw-pointer-events-none tw-inline-block tw-align-middle"
						:icon="mdiLink"
					/>
					<span class="tw-font-medium">{{ this.copyStatus.text }}</span>
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
	name: 'SocialShareButton',
	components: {
		KvButton,
		KvLightbox,
		KvMaterialIcon
	},
	props: {
		lender: {
			type: Object,
			default: () => {}
		},
		loan: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			copyStatus: {
				disabled: false,
				text: 'Copy Link'
			},
			isLightboxVisible: false,
			mdiFacebook,
			mdiLinkedin,
			mdiTwitter,
			mdiLink,
		};
	},
	computed: {
		name() {
			if (this.loan.name && this.loan.anonymization !== 'full') {
				return this.loan.name;
			}
			return 'this lender';
		},
		shareMessage() {
			if (this.loan.name) {
				const location = this.loan?.geocode?.city || this.loan?.geocode?.country?.name;
				return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${this.loan.name} ${location ? `in ${location} ` : ''}to pursue their dream?`; // eslint-disable-line max-len
			}
			return '';
		},
		utmContent() {
			if (this.lender?.public && this.lender?.inviterName) return this.lender.inviterName;
			return 'anonymous';
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			if (this.loan.id && this.lender?.inviterName) {
				return `${base}/invitedby/${this.lender.inviterName}/for/${this.loan.id}?utm_content=${this.utmContent}`; // eslint-disable-line max-len
			}
			return `${base}${this.$route.path}?utm_content=${this.utmContent}`;
		},
		facebookShareUrl() {
			const pageUrl = `https://${this.$appConfig.host}${this.$route.path}`;
			return getFullUrl('https://www.facebook.com/dialog/share', {
				app_id: this.$appConfig.fbApplicationId,
				display: 'page',
				href: `${this.shareLink}&utm_source=facebook.com&utm_medium=social&utm_campaign=social_share_bp_pfp`,
				redirect_uri: `${pageUrl}`,
				quote: this.shareMessage,
			});
		},
		linkedInShareUrl() {
			return getFullUrl('https://www.linkedin.com/shareArticle', {
				mini: 'true',
				source: `https://${this.$appConfig.host}`,
				summary: this.shareMessage.substring(0, 256),
				title: `A loan for ${this.loan.name}`,
				url: `${this.shareLink}&utm_source=linkedin.com&utm_medium=social&utm_campaign=social_share_bp_pfp`
			});
		},
		twitterShareUrl() {
			return getFullUrl('https://twitter.com/intent/tweet', {
				text: this.shareMessage,
				url: `${this.shareLink}&utm_source=t.co&utm_medium=social&utm_campaign=social_share_bp_pfp`,
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
				} else {
					this.$showTipMsg('Thanks for sharing to Facebook!');
				}
			}
		},
		async copyLink() {
			const url = `${this.shareLink}&utm_source=social_share_link&utm_campaign=social_share_bp_pfp`;
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
