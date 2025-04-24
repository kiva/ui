<template>
	<div class="tw-w-full">
		<kv-button
			v-if="variant !== 'hidden'"
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
			@lightbox-closed="closeLightbox"
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
					@click="showSharePopUp(
						facebookShareUrl({utmCampaign, utmContent}),
						'Thanks for sharing to Facebook!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--facebook"
						:icon="mdiFacebook"
					/>
					<span class="tw-font-medium">Facebook</span>
				</kv-button>
				<button
					class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-rounded tw-py-1 tw-basis-1/3
					tw-text-primary tw-border-transparent hover:tw-bg-secondary"
					@click="showSharePopUp(
						blueskyShareUrl({utmCampaign, utmContent}),
						'Thanks for sharing to Bluesky!')"
					v-kv-track-event="[trackingCategory, 'share', 'bluesky', utmCampaign, loanId]"
				>
					<kv-icon name="bluesky" title="Bluesky" style="width: 28px; fill: #1877F2;" />
					<span class="tw-font-medium">Bluesky</span>
				</button>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-linkedin-button"
					v-kv-track-event="[trackingCategory, 'share', 'linkedin', utmCampaign, loanId]"
					@click="showSharePopUp(
						linkedInShareUrl({utmCampaign, utmContent}),
						'Thanks for sharing to LinkedIn!')"
				>
					<kv-material-icon
						class="social-button__icon social-button__icon--linkedin"
						:icon="mdiLinkedin"
					/>
					<span class="tw-font-medium">LinkedIn</span>
				</kv-button>
				<kv-button
					variant="ghost"
					class="social-button"
					data-testid="share-copy-link-button"
					:disabled="copyStatus.disabled"
					v-kv-track-event="[trackingCategory, 'share', 'copy-link', utmCampaign, loanId]"
					@click="copyLink({utmCampaign, utmContent}, copyStatus.text)"
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
import {
	mdiFacebook,
	mdiLinkedin,
	mdiLink,
} from '@mdi/js';
import socialSharingMixin from '#src/plugins/social-sharing-mixin';
import { KvButton, KvLightbox, KvMaterialIcon } from '@kiva/kv-components';
import KvIcon from '#src/components/Kv/KvIcon';

export default {
	name: 'KvSocialShareButton',
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
		KvMaterialIcon,
	},
	emits: ['lightbox-closed'],
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
				return ['primary', 'secondary', 'link', 'ghost', 'danger', 'caution', 'hidden'].indexOf(value) !== -1;
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
			KvIcon,
			mdiFacebook,
			mdiLinkedin,
			mdiLink,
		};
	},
	mixins: [socialSharingMixin],
	inject: ['apollo'],
	computed: {
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			return `${base}${this.shareUrl}`;
		},
	},
	methods: {
		closeLightbox() {
			this.isLightboxVisible = false;
			this.$emit('lightbox-closed');
		},
	},
	watch: {
		openLightbox() {
			if (this.openLightbox) {
				this.isLightboxVisible = true;
			}
		},
	},
	mounted() {
		this.handleFacebookResponse(this.trackingCategory);
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
$color-bluesky: #1185FE;
$color-linkedin: #0077b5;

.social-button {
	&__icon {
		&--linkedin {
			color: $color-linkedin;
		}

		&--facebook {
			color: $color-facebook;
		}
	}
}
</style>
