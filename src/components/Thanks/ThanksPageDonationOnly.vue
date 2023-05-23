<template>
	<div>
		<generic-promo-banner
			v-show="monthlyDonationAmount"
			:promo-banner-content="promoBannerContent"
		/>
		<div class="row page-content">
			<div class="large-2"></div>
			<div class="small-12 large-8 columns thanks">
				<div class="hide-for-print">
					<h1 class="tw-text-h1 tw-text-center tw-mb-2">
						{{ headerMsg }}
					</h1>
					<p class="tw-text-center tw-mb-2">
						As a donor, you help us bring more loans to people in need. Watch Manal’s story:
					</p>
					<div class="tw-my-4">
						<iframe
							class="tw-aspect-video tw-mx-auto tw-rounded tw-w-full tw--mb-1.5 md:tw--mb-1"
							width="560"
							height="315"
							:src="`https://www.youtube.com/embed/${youtubeId}?rel=0`"
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
							allowfullscreen
						></iframe>
					</div>
					<p class="tw-my-2">
						How a Kiva loan helped Manal grow her business in Palestine
					</p>
					<p class="tw-mb-2">
						As an entrepreneur, Manal faces the usual challenges - finding customers, stocking up on
						materials, and keeping up with the competition. But as a woman, Manal has also had to shut
						down those in her community that disapprove of her running a business.<br><br>
						When she opened her own sewing workshop five years ago in a village just south of Jenin,
						Palestine, Manal was met with some tart criticism about her work.<br><br>
						“It was the competitiveness, which was expected,” recalls the 49 year-old mother of seven.
						“Belittling my business, most people would say ‘how is your business even supposed to succeed
						across this town?”<br><br>
						With the help of a Kiva loan, Manal has not only succeeded but expanded—showing the naysayers
						that she has a firm handle on her ventures and her livelihood.
					</p>
					<h3	class="tw-mt-1 tw-mb-3 tw-text-left">
						Share this story and your impact
					</h3>
					<div class="row tw-mt-3">
						<div class="large-2"></div>
						<div class="small-12 large-8 columns">
							<div class="share__social social">
								<a
									data-testid="share-facebook-button"
									class="social__btn social__btn--facebook"
									:href="facebookShareUrl({utmCampaign, utmContent})"
									v-kv-track-event="
										['post-checkout', 'share', 'facebook', utmCampaign]"
								>
									<kv-icon name="facebook-round" title="Facebook" class="social__icon" />
									<span>Share on Facebook</span>
								</a>
								<button
									data-testid="share-copy-link-button"
									class="social__btn social__btn--link tw-text-link tw-border-tertiary tw-border"
									:class="copyStatus.class"
									:disabled="copyStatus.disabled"
									v-kv-track-event="
										['post-checkout', 'share', 'copy-link', utmCampaign]"
									@click="copyLink({utmCampaign, utmContent}, copyStatus.text)"
								>
									<kv-material-icon
										name="clipboard"
										class="social__icon"
										:icon="mdiLink"
									/>
									<span>{{ copyStatus.text }}</span>
								</button>
								<a
									data-testid="share-twitter-button"
									class="social__btn social__btn--twitter"
									:href="twitterShareUrl({utmCampaign, utmContent})"
									target="_blank"
									rel="noopener"
									v-kv-track-event="
										['post-checkout', 'share', 'twitter', utmCampaign]"
									@click="$showTipMsg('Thanks for tweeting!')"
								>
									<kv-icon name="twitter" title="Twitter" class="social__icon" />
									<span>Tweet your followers</span>
								</a>
								<a
									data-testid="share-linkedin-button"
									class="social__btn social__btn--linkedin"
									:href="linkedInShareUrl({utmCampaign, utmContent})"
									target="_blank"
									rel="noopener"
									v-kv-track-event="
										['post-checkout', 'share', 'linkedin', utmCampaign]"
									@click="$showTipMsg('Thanks for sharing to LinkedIn!')"
								>
									<kv-icon name="linkedin" title="LinkedIn" class="social__icon" />
									<span>Share on LinkedIn</span>
								</a>
							</div>
						</div>
						<div class="large-2"></div>
					</div>
					<div v-if="!isGuest" class="continue-link">
						<router-link
							to="/portfolio"
							v-kv-track-event="['Thanks','click-portfolio-cta','No, continue to my portfolio']"
						>
							No, continue to my portfolio
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mdiLink } from '@mdi/js';
import socialSharingMixin from '@/plugins/social-sharing-mixin';
import KvIcon from '@/components/Kv/KvIcon';
import { getFullUrl } from '@/util/urlUtils';
import GenericPromoBanner from '@/components/WwwFrame/PromotionalBanner/Banners/GenericPromoBanner';
import { gql } from '@apollo/client';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const userQuery = gql`query userQuery {
	my {
		id
		userAccount {
			id
			firstName
			inviterName
			public
		}
	}
}`;

export default {
	name: 'ThanksPageDonationOnly',
	inject: ['apollo'],
	components: {
		KvIcon,
		KvMaterialIcon,
		GenericPromoBanner,
	},
	props: {
		shareAskCopyVersion: {
			type: String,
			default: 'a'
		},
		monthlyDonationAmount: {
			type: String,
			default: ''
		}
	},
	mixins: [socialSharingMixin],
	data() {
		return {
			name: '',
			mdiLink,
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy Link'
			},
			youtubeId: 'Mpp2ZH7os4Q',
			isGuest: false
		};
	},
	computed: {
		promoBannerContent() {
			return {
				link: 'https://www.kiva.org/settings/subscriptions',
				// eslint-disable-next-line max-len
				richText: `<p>Thanks! Every month you’ll get an email confirming your $${this.monthlyDonationAmount} donation.View your <u>subscription settings</u> to review, make changes, or cancel</p>`,
				iconKey: ''
			};
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			const args = {
			};

			return getFullUrl(base, args);
		},
		headerMsg() {
			if (this.isGuest) return 'Thank you for supporting our mission';
			return `${this.name}, thank you for supporting our mission`;
		},
		utmContent() {
			if (this.isGuest) return 'guest';
			if (this.lender?.public && this.lender?.inviterName) return this.lender?.inviterName;
			return 'anonymous';
		},
		utmCampaign() {
			if (this.shareAskCopyVersion === 'b') {
				return 'social_share_checkout_variant';
			}
			return 'social_share_checkout_control';
		},
	},
	methods: {
		gatherCurrentUserData() {
			this.apollo.query({
				query: userQuery,
			}).then(({ data }) => {
				this.isGuest = !data?.my?.userAccount;
				this.name = data?.my?.userAccount?.public ? data?.my?.userAccount?.firstName : '';
			});
		}
	},
	created() {
		this.gatherCurrentUserData();
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import "foundation";

$color-facebook: #3b5998;
$color-twitter: #08a0e9;
$color-linkedin: #0077b5;
$color-copy-link: #2B7C5F;
$color-text: #212121;

.page-content {
	padding: 1.625rem 0 0 0;

	@media print {
		padding: 0;
	}

	&:last-child {
		padding-bottom: 5rem;
	}
}

.thanks {
	&__social-share {
		margin-bottom: 0.5rem;
	}
}

.share {
	width: 100%;
	max-width: rem-calc(600);
	margin: 0 auto;

	&__social {
		@include breakpoint(large) {
			width: rem-calc(135);
		}
	}
}

.social {
	width: 100%;
	flex-wrap: wrap;
	flex-shrink: 0;

	@include breakpoint(large) {
		flex-direction: column;
	}

	&__icon {
		width: rem-calc(24);
		height: rem-calc(24);
		flex-shrink: 0;
		margin-right: rem-calc(9);
		fill: #fff;
	}

	&__btn {
		align-items: center;
		margin: 0 0 1rem 0;
		padding: 1rem rem-calc(9) 1rem 1rem;
		font-weight: $button-font-weight;
		line-height: 1;
		flex-shrink: 0;

		&:nth-child(2n) {
			margin-right: 0;
		}

		@include breakpoint(large) {
			width: 100%;
			margin-right: 0;

			&:last-child {
				margin-bottom: 0;
			}
		}

		&--facebook {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			@include button-style($color-facebook, auto, #fff);
		}

		&--twitter {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			color: $color-text;
			border: 1px solid $color-twitter;

			.social__icon {
				fill: $color-twitter;
			}
		}

		&--linkedin {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			color: $color-text;
			border: 1px solid $color-linkedin;

			.social__icon {
				fill: $color-linkedin;
			}
		}

		&--link {
			display: flex;
			justify-content: center;
			border-radius: 15px;
			color: $color-text;
			border: 1px solid $color-copy-link;
			width: 100%;
			transition:
				background-color 0.25s ease-in,
				border-color 0.25s ease-in,
				color 0.25s ease-in;

			.social__icon {
				color: $color-copy-link;
				transition: fill 0.25s ease-in;
			}
		}

		&--success {
			background-color: rgb(var(--bg-brand));
			border-color: rgb(var(--bg-brand));
		}

		&--error {
			background-color: rgb(var(--bg-danger));
			border-color: rgb(var(--bg-danger));
		}

		&--success,
		&--error {
			color: #fff;
			cursor: default;
			transition:
				background-color 0.25s ease-out,
				border-color 0.25s ease-out,
				color 0.25s ease-out;

			&:hover {
				color: #fff;
				text-decoration: none;
			}

			.social__icon {
				transition: fill 0.25s ease-out;
				fill: #fff;
			}
		}
	}
}

.continue-link {
	margin-top: 25px;
	text-align: center;
	text-decoration: underline;
	text-underline-offset: 3px;
}
</style>
