<template>
	<div class="tw-bg-secondary">
		<kv-page-container data-testid="share-challenge">
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 lg:tw-col-span-8 lg:tw-col-start-3 tw-py-4 hide-for-print">
					<div
						class="
							tw-flex
							tw-flex-col
							tw-items-center
							tw-w-full
							tw-bg-white
							tw-rounded
							tw-px-2.5
							tw-py-3.5
							md:tw-px-4
							md:tw-pt-3
							md:tw-pb-7
							tw-shadow-lg
						"
					>
						<div
							class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-w-full tw-mb-2.5"
						>
							<div class="tw-flex tw-items-center tw-justify-center tw-relative">
								<kv-progress-circle
									class="tw-w-10 tw-z-2 tw-h-10"
									:stroke-width="20"
									:value="percentageFunded"
									:arc-scale=".8"
									:rotate="36"
									:show-number="false"
								/>
								<div class="tw-absolute">
									<rewards-icon class="tw-h-7 tw-w-6" />
								</div>
							</div>
							<h4>
								Challenge
								<a
									:href="teamChallengePath"
									data-testid="percentage-funded"
									class="tw-text-eco-green-3"
								>
									{{ percentageFunded }}% complete
								</a>
							</h4>
						</div>
						<h2 class="tw-text-center tw-mb-2.5">
							Help your team complete this challenge by sharing it with a friend!
						</h2>
						<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-gap-1 tw-w-full">
							<!-- eslint-disable max-len -->
							<button
								class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-border tw-border-gray-800 tw-rounded tw-py-1 tw-basis-1/3"
								@click="showSharePopUp(
									facebookShareUrl({ utmCampaign, utmContent }),
									'Thanks for sharing to Facebook!'
								)"
								v-kv-track-event="[
									'post-checkout',
									'share',
									'facebook',
									utmCampaign,
									loanId
								]"
							>
								<kv-icon
									name="facebook-round"
									title="Facebook"
									style="width: 28px; fill: #1877F2;"
								/>
								<span class="tw-font-medium">Facebook</span>
							</button>
							<button
								class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-border tw-border-gray-800 tw-rounded tw-py-1 tw-basis-1/3"
								@click="showSharePopUp(
									blueskyShareUrl({utmCampaign, utmContent}),
									'Thanks for sharing to Bluesky!')"
								v-kv-track-event="[
									'post-checkout',
									'share',
									'bluesky',
									utmCampaign,
									selectedLoanId]"
							>
								<kv-material-icon name="bluesky" :icon="KvBlueskyIcon" style="width: 28px; color: #1185FE" />
								<span class="tw-font-medium">Share</span>
							</button>
							<button
								class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-border tw-border-gray-800 tw-rounded tw-py-1 tw-basis-1/3"
								v-kv-track-event="[
									'post-checkout',
									'share',
									'linkedin',
									utmCampaign,
									loanId
								]"
								@click="showSharePopUp(
									linkedInShareUrl({ utmCampaign, utmContent }),
									'Thanks for sharing to LinkedIn!'
								)"
							>
								<kv-icon name="linkedin" title="LinkedIn" style="width: 26px; fill: #0A66C2;" />
								<span class="tw-font-medium">LinkedIn</span>
							</button>
							<button
								class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-border tw-border-gray-800 tw-rounded tw-py-1 tw-basis-1/3"
								:class="copyStatus.class"
								:disabled="copyStatus.disabled"
								v-kv-track-event="[
									'post-checkout',
									'share',
									'copy-link',
									utmCampaign,
									loanId
								]"
								@click="copyUrl({ utmCampaign, utmContent }, copyStatus.text)"
							>
								<kv-material-icon
									:icon="mdiLink"
									style="width: 28px;"
									class="tw-bg-secondary tw-p-0.5 tw-rounded"
								/>
								<span class="tw-font-medium">{{ copyStatus.text }}</span>
							</button>
						<!-- eslint-enable max-len -->
						</div>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>
import teamGoalInfo from '#src/plugins/team-goal-mixin';
import RewardsIcon from '#src/assets/icons/inline/rewards.svg';
import socialSharingMixin from '#src/plugins/social-sharing-mixin';
import { mdiLink } from '@mdi/js';
import { getFullUrl } from '#src/util/urlUtils';
import clipboardCopy from 'clipboard-copy';
import KvIcon from '#src/components/Kv/KvIcon';
import {
	KvPageContainer,
	KvGrid,
	KvMaterialIcon,
	KvBlueskyIcon,
	KvProgressCircle,
} from '@kiva/kv-components';

export default {
	name: 'ShareChallenge',
	inject: ['apollo'],
	mixins: [socialSharingMixin, teamGoalInfo],
	components: {
		KvProgressCircle,
		KvMaterialIcon,
		RewardsIcon,
		KvIcon,
		KvPageContainer,
		KvGrid
	},
	props: {
		teamPublicId: {
			type: String,
			default: '',
		},
		loan: {
			type: Object,
			default: () => ({}),
		},
		lender: {
			type: Object,
			default: () => ({}),
		},
		isGuest: {
			type: Boolean,
			default: false
		},
		teamName: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			utmCampaign: 'teamschallenge',
			mdiLink,
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy link'
			},
			KvBlueskyIcon
		};
	},
	computed: {
		loanId() {
			return this.loan?.id ?? '';
		},
		borrowerName() {
			return this.loan?.name ?? '';
		},
		teamChallengePath() {
			return this.teamPublicId ? `/lend/filter?team=${this.teamPublicId}` : '/teams';
		},
		utmContent() {
			if (this.isGuest) return 'guest';
			if (this.lender?.public && this.lender?.publicId) return this.lender?.publicId;
			return 'anonymous';
		},
		// Expected by social-sharing-mixin (used by all socials)
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			const args = {
				team: this.teamPublicId,
				lender: this.lender?.publicId ? `${this.lender.publicId}` : '',
			};
			let invitedBy = '';
			if (this.loan.id && this.lender?.inviterName) {
				invitedBy = `invitedby/${this.lender.inviterName}/for/${this.loan.id}`;
			}
			return getFullUrl(`${base}/${invitedBy}`, args);
		},
		// Expected by social-sharing-mixin (used by Bluesky and "copy link")
		shareMessage() {
			return `Kiva is an easy way to make a real difference in someone's life.${
				this.borrowerName && this.borrowerLocation
					? ` Support ${this.borrowerName} and help ${this.teamName} hit their goal.`
					: ''}`;
		}
	},
	methods: {
		// Behavior mirrors social sharing mixin but excludes the share message
		async copyUrl({ utmCampaign, utmContent }, text) {
			const url = getFullUrl(this.shareLink, {
				utm_source: 'social_share_link',
				utm_medium: 'referral',
				utm_campaign: utmCampaign,
				utm_content: utmContent,
			});
			try {
				await clipboardCopy(url);
				if (this.copyStatus) {
					this.copyStatus = {
						class: 'tw-transition-colors tw-border-action-highlight tw-text-action-highlight',
						disabled: true,
						text: 'Copied!'
					};
				}
			} catch (err) {
				if (this.copyStatus) {
					this.copyStatus = {
						class: 'tw-transition-colors tw-border-danger-highlight tw-text-danger-highlight',
						disabled: true,
						text: 'Error'
					};
				}
			} finally {
				setTimeout(() => {
					if (this.copyStatus) {
						this.copyStatus = {
							class: '',
							disabled: false,
							text
						};
					}
				}, 500);
			}
		}
	},
	mounted() {
		this.$kvTrackEvent('post-checkout', 'view challenge complete', this.teamName);
	}
};
</script>
