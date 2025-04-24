<template>
	<div>
		<KvLightbox
			:visible="isVisible"
			title="Invite a friend to Kiva!"
			@lightbox-closed="closeLightbox"
		>
			<div class="tw-relative">
				<textarea
					class="tw-w-full tw-border tw-border-tertiary tw-rounded-sm tw-h-12 tw-p-2"
					style="height: 10rem;"
					v-model="shareMessage"
				>
				</textarea>
				<KvMaterialIcon
					class="tw-w-2.5 tw-h-2.5 tw-absolute tw-bottom-2 tw-right-2"
					:icon="mdiPencilOutline"
				/>
			</div>
			<div
				class="tw-flex tw-mt-2.5 tw-flex-wrap"
			>
				<KvButton
					variant="ghost"
					class="social-button"
					v-kv-track-event="['portfolio', 'share', 'facebook', utmCampaign]"
					@click="showSharePopUp(
						facebookShareUrl({utmCampaign, utmContent}),
						'Thanks for sharing to Facebook!')"
				>
					<KvMaterialIcon
						class="social-button__icon social-button__icon--facebook"
						:icon="mdiFacebook"
					/>
					<span class="tw-font-medium">Facebook</span>
				</KvButton>
				<KvButton
					variant="ghost"
					class="social-button"
					v-kv-track-event="['portfolio', 'share', 'twitter', utmCampaign]"
					@click="showSharePopUp(
						twitterShareUrl({utmCampaign, utmContent}),
						'Thanks for tweeting!')"
				>
					<KvMaterialIcon
						class="social-button__icon social-button__icon--twitter"
						:icon="mdiTwitter"
					/>
					<span class="tw-font-medium">Twitter</span>
				</KvButton>
				<KvButton
					variant="ghost"
					class="social-button"
					v-kv-track-event="['portfolio', 'share', 'linkedin', utmCampaign]"
					@click="showSharePopUp(
						linkedInShareUrl({utmCampaign, utmContent}),
						'Thanks for sharing to LinkedIn!')"
				>
					<KvMaterialIcon
						class="social-button__icon social-button__icon--linkedin"
						:icon="mdiLinkedin"
					/>
					<span class="tw-font-medium">LinkedIn</span>
				</KvButton>
				<KvButton
					variant="ghost"
					class="social-button"
					:disabled="copyStatus.disabled"
					v-kv-track-event="['portfolio', 'share', 'copy-link', utmCampaign]"
					@click="copyLink({utmCampaign, utmContent}, 'Copy')"
				>
					<KvMaterialIcon
						class="tw-w-4.5 tw-h-4.5 tw-pointer-events-none tw-inline-block tw-align-middle"
						:icon="mdiLink"
					/>
					<span class="tw-font-medium">{{ copyStatus.text }}</span>
				</KvButton>
			</div>
		</KvLightbox>
	</div>
</template>

<script>
import {
	mdiPencilOutline,
	mdiFacebook,
	mdiLinkedin,
	mdiTwitter,
	mdiLink,
} from '@mdi/js';
import socialSharingMixin from '#src/plugins/social-sharing-mixin';
import { KvButton, KvLightbox, KvMaterialIcon } from '@kiva/kv-components';

const SHARE_MESSAGE = 'Join me and make lasting change on Kiva!';
const SHARE_CAMPAIGN = 'social_share_mykiva';

export default {
	name: 'MyKivaSharingModal',
	components: {
		KvButton,
		KvLightbox,
		KvMaterialIcon,
	},
	mixins: [socialSharingMixin],
	emits: ['close-modal'],
	props: {
		isVisible: {
			type: Boolean,
			default: false,
		},
		lender: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			shareMessage: SHARE_MESSAGE,
			mdiPencilOutline,
			mdiFacebook,
			mdiLinkedin,
			mdiTwitter,
			mdiLink,
			copyStatus: {
				disabled: false,
				text: 'Copy'
			},
		};
	},
	computed: {
		utmContent() {
			if (this.lender?.public && this.lender?.inviterName) return this.lender.inviterName;
			return 'anonymous';
		},
		utmCampaign() {
			return SHARE_CAMPAIGN;
		},
		shareLink() {
			const shareUrl = this.lender?.inviterName ? `/invitedby/${this.lender.inviterName}` : `${this.$route.path}`;
			const base = `https://${this.$appConfig.host}`;

			return `${base}${shareUrl}`;
		},
	},
	methods: {
		closeLightbox() {
			this.$emit('close-modal');
		},
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
