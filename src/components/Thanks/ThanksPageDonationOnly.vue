<template>
	<div>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12 tw-my-8">
				<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-2 tw-mb-4 hide-for-print">
					<h1 class="tw-text-h1 tw-text-center tw-mb-2" data-testid="thanks-message">
						{{ headerMsg }}
					</h1>
					<p v-if="showDafThanks" class="tw-text-center tw-mb-2 tw-text-subhead">
						<!--eslint-disable-next-line max-len-->
						As a donor, you’re <b class="tw-text-eco-green-3">helping create opportunities that improve peoples’ livelihoods</b>. Interested in learning more about supporting Kiva? Reach out to the team at <a href="mailto:majorgiving@kiva.org">majorgiving@kiva.org</a>
					</p>
					<p v-else class="tw-text-center tw-mb-2 tw-text-subhead">
						<!--eslint-disable-next-line max-len-->
						As a donor, you help Kiva provide loans to underserved communities and unlock financial access. Watch Manal’s story:
					</p>
					<div class="tw-my-4">
						<h2 v-if="showDafThanks" class="tw-mb-2">
							Watch Manal’s story:
						</h2>
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
					<h2 class="tw-text-h2 tw-my-2">
						How a Kiva loan helped Manal grow her business in Palestine
					</h2>
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
					<div class="social tw-mt-4 tw-max-w-sm tw-mx-auto">
						<button
							data-testid="share-facebook-button"
							class="social__btn social__btn--facebook"
							@click="showSharePopUp(
								facebookShareUrl({utmCampaign, utmContent}),
								'Thanks for sharing to Facebook!')"
							v-kv-track-event="
								['post-checkout', 'share', 'facebook', utmCampaign]"
						>
							<kv-icon name="facebook-round" title="Facebook" class="social__icon" />
							<span>Share on Facebook</span>
						</button>
						<button
							data-testid="share-copy-link-button"
							class="social__btn social__btn--link
										tw-border-action tw-border"
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
						<button
							data-testid="share-bluesky-button"
							class="social__btn social__btn--bluesky"
							v-kv-track-event="
								['post-checkout', 'share', 'bluesky', utmCampaign]"
							@click="showSharePopUp(
								blueskyShareUrl({utmCampaign, utmContent}),
								'Thanks for sharing to Bluesky!')"
						>
							<kv-material-icon :icon="KvBlueskyIcon" name="bluesky" class="social__icon" />
							<span>Share to your followers</span>
						</button>
						<button
							data-testid="share-linkedin-button"
							class="social__btn social__btn--linkedin"
							v-kv-track-event="
								['post-checkout', 'share', 'linkedin', utmCampaign]"
							@click="showSharePopUp(
								linkedInShareUrl({utmCampaign, utmContent}),
								'Thanks for sharing to LinkedIn!')"
						>
							<kv-icon name="linkedin" title="LinkedIn" class="social__icon" />
							<span>Share on LinkedIn</span>
						</button>
					</div>
					<div class="tw-text-center tw-mt-2">
						<router-link
							class="tw-block tw-mx-auto tw-text-action
									tw-underline hover:tw-text-action-highlight"
							v-if="!isGuest"
							to="/portfolio"
							v-kv-track-event="['Thanks','click-portfolio-cta','No, continue to my portfolio']"
						>
							No, continue to my portfolio
						</router-link>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>
import { mdiLink } from '@mdi/js';
import numeral from 'numeral';
import socialSharingMixin from '#src/plugins/social-sharing-mixin';
import KvIcon from '#src/components/Kv/KvIcon';
import { getFullUrl } from '#src/util/urlUtils';
import { gql } from 'graphql-tag';
import { formatContentGroupsFlat } from '#src/util/contentfulUtils';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import {
	KvBlueskyIcon,
	KvGrid,
	KvMaterialIcon,
	KvPageContainer,
} from '@kiva/kv-components';

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
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: gql`query OnlyDonationThanksPageContentful {
				contentful {
					entries(contentType: "contentGroup", contentKey: "thanks-page-only-donation")
				}
			}
		`,
		preFetch: true,
		result({ data }) {
			const contentfulData = data?.contentful?.entries?.items ?? null;
			this.contentfulContent = contentfulData ? formatContentGroupsFlat(contentfulData) : {};
		}
	},
	components: {
		KvIcon,
		KvMaterialIcon,
		KvPageContainer,
		KvGrid,
	},
	props: {
		monthlyDonationAmount: {
			type: String,
			default: ''
		},
		showDafThanks: {
			type: Boolean,
			default: false
		},
	},
	mixins: [socialSharingMixin, smoothScrollMixin],
	data() {
		return {
			lender: null,
			mdiLink,
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy Link'
			},
			youtubeId: 'Mpp2ZH7os4Q',
			isGuest: false,
			message: "Kiva is an easy way to make a real difference in someone's life.",
			utmCampaign: 'social_share_checkout',
			contentfulContent: null,
			KvBlueskyIcon
		};
	},
	computed: {
		shareMessage() {
			return this.message.trim();
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			const args = {
			};

			if (!this.isGuest) {
				if (this.lender?.public && this.lender?.firstName) {
					args.lender = this.lender.firstName;
				}

				return getFullUrl(`${base}/invitedby/${this.lender?.inviterName}`, args);
			}

			return getFullUrl(base, args);
		},
		headerMsg() {
			if (this.isGuest || !this.lender?.firstName) return 'Thank you for supporting our mission';
			return `${this.lender?.firstName}, thank you for supporting our mission`;
		},
		utmContent() {
			if (this.isGuest) return 'guest';
			if (this.lender?.public && this.lender?.inviterName) return this.lender?.inviterName;
			return 'anonymous';
		},
	},
	methods: {
		gatherCurrentUserData() {
			this.apollo.query({
				query: userQuery,
			}).then(({ data }) => {
				this.isGuest = !data?.my?.userAccount;
				this.lender = data?.my?.userAccount ?? {};
			});
		},
	},
	created() {
		const monthlyAmountNumeral = numeral(this.monthlyDonationAmount);
		if ((monthlyAmountNumeral.value() ?? 0) > 0) {
			// eslint-disable-next-line max-len
			const msg = `Thanks! Every month you'll get an email confirming your ${monthlyAmountNumeral.format('$0,0[.]00')} donation. View your <a target="_blank" href="/settings/subscriptions">subscription settings</a> to review, make changes, or cancel.`;
			this.$showTipMsg(msg, 'confirmation', true);
		}
		this.gatherCurrentUserData();
		this.$kvTrackEvent('post-checkout', 'show', 'donations-only-view', this.isGuest ? 'guest' : 'signed-in');
	}
};
</script>

<style lang="postcss" scoped>
.social__btn {
	@apply tw-w-full tw-rounded tw-flex tw-items-center tw-justify-center tw-mb-2 tw-p-1.5 tw-font-medium;
}

.social__icon {
	@apply tw-h-3 tw-w-3 tw-mr-1 tw-shrink-0;
}
</style>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

$color-facebook: #3b5998;
$color-bluesky: #1185FE;
$color-linkedin: #0077b5;
$color-copy-link: #2B7C5F;

.social {
	&__btn {
		&--facebook {
			@include button-style($color-facebook, auto, #fff);

			.social__icon {
				fill: #fff;
			}
		}

		&--bluesky {
			border: 1px solid $color-bluesky;

			.social__icon {
				color: $color-bluesky;
			}
		}

		&--linkedin {
			border: 1px solid $color-linkedin;

			.social__icon {
				fill: $color-linkedin;
			}
		}

		&--link {
			.social__icon {
				color: $color-copy-link;
			}
		}
	}
}
</style>
