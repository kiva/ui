<template>
	<div>
		<ShareStepper
			:lender-name="lender.firstName"
			:calculate-people-qty-to-goal="calculatePeopleQtyToGoal()"
			:show-lender-name="!isGuest"
			:comments-mode="askForComments"
			:is-first-loan="isFirstLoan"
			:loan-name="loan.name"
		/>
		<!-- Image Section -->
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-2 tw-mb-4 hide-for-print">
					<template v-if="receipt">
						<div v-if="!calculatePeopleQtyToGoal()">
							<img :alt="`Fully funded image`" :src="kivaShare">
						</div>
						<borrower-image
							v-else
							class="
								tw-w-full
								tw-bg-black
								tw-rounded
								tw--mb-1.5
								md:tw--mb-1
							"
							data-testid="bp-story-borrower-image"
							:alt="loan.name"
							:aspect-ratio="1 / 2"
							:default-image="{ width: 612 }"
							:hash="loan.image.hash"
							:images="[
								{ width: 612, viewSize: 1024 },
								{ width: 580, viewSize: 768 },
								{ width: 416, viewSize: 480 },
								{ width: 374, viewSize: 414 },
								{ width: 335, viewSize: 375 },
								{ width: 280 },
							]"
						/>
						<div v-if="calculatePeopleQtyToGoal()" class="tw-flex-auto tw-mb-2">
							<figure>
								<figcaption class="tw-flex progress">
									<p
										class="tw-flex-auto tw-text-left tw-text-h4 tw-mt-2 tw-mx-0 tw-mb-0.5"
										data-testid="bp-summary-amount-to-go"
									>
										{{ $filters.numeral(loan.unreservedAmount, '$0,0[.]00') }} TO GO
									</p>
									<p
										class="tw-flex-auto tw-text-right tw-text-h4 tw-mt-2 tw-mx-0 tw-mb-0.5"
										data-testid="bp-summary-timeleft"
									>
										{{ loan.fundraisingTimeLeft }} remaining
									</p>
								</figcaption>
								<kv-progress-bar
									class="tw-mb-1.5 lg:tw-mb-1 tw-bg-tertiary"
									aria-label="Percent the loan has funded"
									:value="loan.fundraisingPercent * 100"
								/>
							</figure>
						</div>
					</template>
				</div>
			</kv-grid>
		</kv-page-container>
		<!-- First Time Deposit Section -->
		<kv-page-container v-if="isFirstLoan">
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-mb-4 hide-for-print">
					<h1	class="tw-mt-1 tw-mb-3 tw-text-left">
						Here’s ${{ ftdCreditAmount }} on us<span class="tw-text-brand">* toward your next loan</span>.
					</h1>
					<p class="tw-m-0 tw-text-subhead">
						<!-- eslint-disable-next-line max-len -->
						As a reward for joining the Kiva community we’d like to give you a leg up on your next loan in your inbox 🥇.
					</p>
					<p class="tw-text-brand tw-text-h3 tw-mt-0.5">
						* while funds last
					</p>
				</div>
			</kv-grid>
			<div class="tw-flex tw-flex-col tw-gap-y-2 tw-mt-2 tw-mb-4 tw-max-w-sm tw-mx-auto">
				<kv-button
					variant="primary"
					to="/portfolio"
					v-kv-track-event="['post-checkout', 'click', 'ftd-portfolio', null, loanId]"
				>
					Continue to portfolio
				</kv-button>
				<kv-button
					variant="secondary"
					:href="shareLink"
					v-kv-track-event="['post-checkout', 'share', 'ftd-sharing', null, loanId]"
				>
					Share this loan with others
				</kv-button>
				<kv-button
					variant="ghost"
					to="/lend-by-category"
					v-kv-track-event="['post-checkout', 'click', 'ftd-lending-home', null, loanId]"
				>
					Go to lending home
				</kv-button>
			</div>
			<hr>
		</kv-page-container>
		<!-- Comments Section -->
		<CommentAsk
			class="hide-for-print"
			v-if="askForComments"
			:loan-name="loan.name"
			:loan-id="loan.id"
			:is-guest="isGuest"
			:guest-username="guestUsername"
		/>
		<!-- Share Section -->
		<kv-page-container v-if="!hideShareSection">
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-pt-2 tw-mb-4 hide-for-print">
					<h1	class="tw-mt-1 tw-mb-3 tw-text-left">
						<!-- eslint-disable-next-line max-len -->
						<template v-if="!calculatePeopleQtyToGoal()">
							Can you share Kiva with one more person?
						</template>
						<template v-else>
							Can you share this loan with one more person?
						</template>
					</h1>
					<p class="tw-m-0 tw-text-subhead">
						{{ thanksPageBody }}
					</p>
					<div class="social tw-mt-4 tw-max-w-sm tw-mx-auto">
						<button
							data-testid="share-facebook-button"
							class="social__btn social__btn--facebook"
							@click="showSharePopUp(
								facebookShareUrl({utmCampaign, utmContent}),
								'Thanks for sharing to Facebook!')"
							v-kv-track-event="
								['post-checkout', 'share', 'facebook', utmCampaign, loanId]"
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
								['post-checkout', 'share', 'copy-link', utmCampaign, loanId]"
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
								['post-checkout', 'share', 'bluesky', utmCampaign, loanId]"
							@click="showSharePopUp(
								blueskyShareUrl({utmCampaign, utmContent}),
								'Thanks for sharing!')"
						>
							<kv-material-icon name="bluesky" :icon="KvBlueskyIcon" class="social__icon" />
							<span>Share to your followers</span>
						</button>
						<button
							data-testid="share-linkedin-button"
							class="social__btn social__btn--linkedin"
							v-kv-track-event="
								['post-checkout', 'share', 'linkedin', utmCampaign, loanId]"
							@click="showSharePopUp(
								linkedInShareUrl({utmCampaign, utmContent}),
								'Thanks for sharing to LinkedIn!')"
						>
							<kv-icon name="linkedin" title="LinkedIn" class="social__icon" />
							<span>Share on LinkedIn</span>
						</button>
					</div>
					<div class="tw-text-center tw-mt-2">
						<button
							class="tw-block tw-mx-auto tw-text-action
								tw-underline hover:tw-text-action-highlight"
							@click="emitGuestCreateAccount"
							v-if="isGuest"
							v-kv-track-event="['Thanks','click-create-account','Create my account']"
						>
							Create my account
						</button>
						<router-link
							class="tw-block tw-mx-auto tw-text-action
								tw-underline hover:tw-text-action-highlight"
							v-else
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
import { mdiCheckAll, mdiLink } from '@mdi/js';
import { getFullUrl } from '#src/util/urlUtils';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import ShareStepper from '#src/components/Thanks/ShareStepper';
import CommentAsk from '#src/components/Thanks/CommentAsk';
import KvIcon from '#src/components/Kv/KvIcon';
import socialSharingMixin from '#src/plugins/social-sharing-mixin';
import {
	KvMaterialIcon, KvProgressBar, KvGrid, KvPageContainer, KvButton, KvBlueskyIcon
} from '@kiva/kv-components';
import kivaShare from '#src/assets/images/thanks-page/kiva-share.png';

export default {
	name: 'ThanksPageCommentAndShare',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvMaterialIcon,
		BorrowerImage,
		KvProgressBar,
		KvIcon,
		ShareStepper,
		CommentAsk,
		KvGrid,
		KvPageContainer,
		KvButton
	},
	emits: ['guest-create-account'],
	props: {
		receipt: {
			type: Object,
			default: () => ({}),
		},
		lender: {
			type: Object,
			default: () => ({}),
		},
		loan: {
			type: Object,
			default: () => ({}),
		},
		isGuest: {
			type: Boolean,
			default: false
		},
		askForComments: {
			type: Boolean,
			default: false
		},
		isFirstLoan: {
			type: Boolean,
			default: false
		},
		ftdCreditAmount: {
			type: String,
			default: ''
		},
		hideShareSection: {
			type: Boolean,
			default: false,
		},
		guestUsername: {
			type: String,
			default: '',
		},
	},
	mixins: [socialSharingMixin],
	head() {
		return {
			title: 'Thank you!'
		};
	},
	data() {
		return {
			mdiCheckAll,
			mdiLink,
			message: '',
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy Link'
			},
			utmCampaign: 'social_share_checkout',
			kivaShare,
			KvBlueskyIcon
		};
	},
	computed: {
		loanId() {
			return this.loan?.id ?? undefined;
		},
		suggestedMessage() {
			if (this.loan.name) {
				const location = this.loan?.geocode?.city || this.loan?.geocode?.country?.name;
				return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${this.loan.name} ${location ? `in ${location} ` : ''}to pursue their dream?`; // eslint-disable-line max-len
			}
			return '';
		},
		isSuggestedMessage() {
			return this.message.trim() === this.suggestedMessage;
		},
		shareMessage() {
			return this.message.trim() || this.suggestedMessage;
		},
		utmContent() {
			if (this.isGuest) return 'guest';
			if (this.lender?.public && this.lender?.inviterName) return this.lender?.inviterName;
			return 'anonymous';
		},
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			const args = {
			};

			if (!this.calculatePeopleQtyToGoal() && !this.isGuest) {
				if (this.lender.public && this.lender.publicName) {
					args.lender = this.lender.publicName;
				}
				args.funded_share = 1;
				return getFullUrl(`${base}/invitedby/${this.lender.inviterName}`, args);
			}

			// There should always be a loan for the guest version of this.
			// Share specific loan URL
			if (this.loan.id) {
				if (this.isGuest) {
					return getFullUrl(`${base}/lend/${this.loan.id}`, args);
				}
				return getFullUrl(`${base}/invitedby/${this.lender.inviterName}/for/${this.loan.id}`, args);
			}
			// Share generic Kiva URL
			return getFullUrl(base, args);
		},
		thanksPageBody() {
			if (!this.calculatePeopleQtyToGoal()) {
				return '1.4 billion people are currently unbanked with no access to basic financial services. '
					+ 'Sharing Kiva with others can help inspire them to give people '
					+ 'the funds they need to improve their lives.';
			}
			// eslint-disable-next-line max-len
			return `${this.loan.name} only needs ${this.calculatePeopleQtyToGoal()} more people to lend $25 and they could be fully funded in a matter of hours!`;
		},
	},
	methods: {
		calculatePeopleQtyToGoal() {
			const remainingAmount = parseFloat(this.loan.unreservedAmount);
			return remainingAmount === 0 ? 0 : Math.ceil(remainingAmount / 25);
		},
		emitGuestCreateAccount() {
			this.$emit('guest-create-account');
		},
	},
	mounted() {
		if (this.receipt) {
			this.handleFacebookResponse('post-checkout');
		}
		if (this.askForComments) {
			this.$kvTrackEvent('post-checkout', 'show', 'loan-commenting-view', this.isGuest ? 'guest' : 'signed-in');
		} else {
			this.$kvTrackEvent('post-checkout', 'show', 'share-this-loan-view', this.isGuest ? 'guest' : 'signed-in');
		}
	},
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
