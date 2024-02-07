<template>
	<div class="tw-bg-secondary">
		<div v-if="!iwdValetInviterId" class="tw-bg-eco-green-1 tw-py-0.5">
			<div class="row page-content">
				<div class="tw-w-full tw-text-center">
					confirmation
				</div>
			</div>
		</div>
		<div class="row page-content !tw-pt-0">
			<template v-if="iwdValetInviterId">
				<div
					class="
						tw-flex
						tw-bg-white
						tw-shadow-lg
						tw-mt-0
						md:tw-mt-2
						tw-rounded-b
						md:tw-rounded-t
						tw-p-1.5
						tw-gap-1
						tw-items-center
					"
				>
					<div class="tw-shrink-0">
						<img :src="iWD2024Badge" alt="IWD Badge" class="tw-w-10 md:tw-w-6">
					</div>
					<div class="md:tw-font-medium">
						<span>Thank you! Your support for </span>
						<span
							v-if="iwdValetInviterName"
							class="data-hj-suppress"
						>
							{{ iwdValetInviterName }} &
						</span>
						<!-- eslint-disable-next-line max-len -->
						<span>Kiva is invaluable to our mission and to our borrowers around the world. We’ve sent a receipt to your email.</span>
					</div>
				</div>
				<div
					class="
						tw-flex
						tw-flex-col
						md:tw-flex-row
						tw-w-full
						tw-pt-2
						md:tw-pt-3
						tw-gap-1.5
						md:tw-gap-3.5
						tw-items-normal
						md:tw-items-center
						tw-p-2
						md:tw-p-0
					"
				>
					<div v-if="iwdBorrowerName && iwdBorrowerLocation" class="tw-font-medium tw-block md:tw-hidden">
						<span class="tw-text-brand">Meet </span>
						<span class="tw-text-brand data-hj-suppress">{{ iwdBorrowerName }}</span>
						<span> from the </span>
						<!-- eslint-disable-next-line max-len -->
						<span class="tw-text-brand">{{ iwdBorrowerLocation }}</span><span>, the borrower</span><span class="tw-text-brand"> you just lent to</span><span>! This loan is special because...</span>
					</div>
					<div class="iwd-borrower-image tw-basis-auto md:tw-basis-1/2">
						<borrower-image
							v-if="iwdLoan"
							class="tw-h-full tw-w-full tw-bg-black data-hj-suppress !tw-p-0 tw-rounded"
							:alt="iwdBorrowerName"
							:default-image="{ width: 548 }"
							:hash="iwdLoanImageHash"
							:images="[{ width: 548 }]"
						/>
					</div>
					<div class="tw-flex tw-flex-col tw-basis-auto md:tw-basis-1/2 tw-gap-1.5">
						<div v-if="iwdBorrowerName && iwdBorrowerLocation" class="tw-font-medium tw-hidden md:tw-block">
							<span class="tw-text-brand">Meet </span>
							<span class="tw-text-brand data-hj-suppress">{{ iwdBorrowerName }}</span>
							<span> from the </span>
							<!-- eslint-disable-next-line max-len -->
							<span class="tw-text-brand">{{ iwdBorrowerLocation }}</span><span>, the borrower</span><span class="tw-text-brand"> you just lent to</span><span>! This loan is special because...</span>
						</div>
						<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-1 tw-px-2 md:tw-px-0">
							<kv-button
								v-if="iwdLoanId"
								:href="`/lend/${iwdLoanId}`"
								v-kv-track-event="['Thanks', 'click-read-borrower-story']"
							>
								<span>Read </span>
								<span v-if="iwdBorrowerName" class="data-hj-suppress">
									{{ `${iwdBorrowerName}'s ` }}
								</span>
								<span>story</span>
							</kv-button>
							<kv-button
								href="/about/how"
								variant="secondary"
								v-kv-track-event="['Thanks', 'click-more-about-kiva']"
							>
								More about Kiva
							</kv-button>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="tw-flex tw-flex-col tw-w-full tw-pb-2">
					<div class="tw-text-center tw-pt-1.5 tw-pb-2 tw-mx-auto" style="max-width: 685px;">
						<h2 class="tw-pb-1.5">
							Spread the word. Multiply your impact.
						</h2>
						<!-- eslint-disable-next-line max-len -->
						<p>We’re more powerful together. International Women’s Day is the perfect time to bring your community into ours.</p>
					</div>
					<div
						class="
							tw-bg-white
							tw-shadow-lg
							tw-rounded
							tw-p-2
							md:tw-p-4
							tw-flex
							tw-flex-col
							md:tw-flex-row
							tw-gap-1.5
							md:tw-gap-3
						"
					>
						<div class="tw-flex tw-flex-col tw-basis-auto md:tw-basis-1/2">
							<div class="tw-flex tw-gap-1.5">
								<div class="tw-shrink-0">
									<img
										v-if="lenderImage"
										:src="lenderImage"
										alt="Lender"
										class="
											data-hj-suppress
											tw-inline-block
											tw-rounded-full
											tw-overflow-hidden
											tw-object-fill
										"
										style="width: 64px;"
									>
								</div>
								<!-- eslint-disable-next-line max-len -->
								<h3><span class="tw-text-brand">Help <span>{{ lenderFirstName || 'Kiva' }}</span> support 4,000 women</span> this International Women’s Day!</h3>
							</div>
							<div class="tw-flex tw-pt-3 tw-gap-1.5">
								<button
									class="tw-flex tw-items-center tw-gap-1"
									@click="showSharePopUp(
										facebookShareUrl({ utmCampaign, utmContent }),
										'Thanks for sharing to Facebook!'
									)"
									v-kv-track-event="[
										'post-checkout',
										'share',
										'facebook',
										utmCampaign,
										iwdLoanId
									]"
								>
									<kv-icon
										name="facebook-round"
										title="Facebook"
										style="width: 28px; fill: #1877F2;"
									/>
									<span>Facebook</span>
								</button>
								<button
									class="tw-flex tw-items-center tw-gap-1"
									v-kv-track-event="[
										'post-checkout',
										'share',
										'linkedin',
										utmCampaign,
										iwdLoanId
									]"
									@click="showSharePopUp(
										linkedInShareUrl({ utmCampaign, utmContent }),
										'Thanks for sharing to LinkedIn!'
									)"
								>
									<kv-icon name="linkedin" title="LinkedIn" style="width: 26px; fill: #0A66C2;" />
									<span>LinkedIn</span>
								</button>
								<button
									class="tw-flex tw-items-center tw-gap-1"
									:class="copyStatus.class"
									:disabled="copyStatus.disabled"
									v-kv-track-event="[
										'post-checkout',
										'share',
										'copy-link',
										utmCampaign,
										iwdLoanId
									]"
									@click="copyLink({ utmCampaign, utmContent }, copyStatus.text)"
								>
									<kv-material-icon
										:icon="mdiLink"
										style="width: 28px;"
										class="tw-bg-secondary tw-p-0.5 tw-rounded"
									/>
									<span>{{ copyStatus.text }}</span>
								</button>
							</div>
						</div>
						<div class="tw-basis-auto md:tw-basis-1/2">
							<img id="badge-image" :src="iWD2024Badge" alt="IWD Badge" class="tw-mx-0 md:tw-mx-auto">
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import iWD2024Badge from '@/assets/images/achievements/iwd_2024_badge.png';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import socialSharingMixin from '@/plugins/social-sharing-mixin';
import KvIcon from '@/components/Kv/KvIcon';
import { mdiLink } from '@mdi/js';
import { getFullUrl } from '@/util/urlUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export const KIVA_INVITER_ID = 'KIVA';

export default {
	name: 'IwdThanksPageVariations',
	components: {
		BorrowerImage,
		KvButton,
		KvIcon,
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [socialSharingMixin],
	data() {
		return {
			iWD2024Badge,
			copyStatus: {
				class: '',
				disabled: false,
				text: 'Copy link'
			},
			utmCampaign: 'social_share_checkout', // TODO: update with correct campaign
			mdiLink,
		};
	},
	props: {
		iwdValetInviterId: {
			type: String,
			default: undefined,
		},
		iwdValetInviter: {
			type: Object,
			default: () => ({}),
		},
		iwdLoan: {
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
	},
	computed: {
		iwdValetInviterName() {
			return this.iwdValetInviter?.name ?? '';
		},
		iwdLoanId() {
			return this.iwdLoan?.id ?? '';
		},
		iwdLoanImageHash() {
			return this.iwdLoan?.image?.hash;
		},
		iwdBorrowerName() {
			return this.iwdLoan?.name ?? '';
		},
		iwdBorrowerLocation() {
			return this.iwdLoan?.geocode?.country?.name ?? '';
		},
		lenderImage() {
			return this.lender?.imageUrl ?? '';
		},
		lenderFirstName() {
			return this.lender?.firstName ?? '';
		},
		lenderPublicId() {
			if (!this.lender?.public) {
				return '';
			}
			return this.lender?.publicId ?? '';
		},
		utmContent() {
			if (this.isGuest) return 'guest';
			if (this.lender?.public && this.lender?.inviterName) return this.lender?.inviterName;
			return 'anonymous';
		},
		// Expected by social-sharing-mixin (used by all socials)
		shareLink() {
			const base = `https://${this.$appConfig.host}`;
			return getFullUrl(`${base}/iwd2024${this.lenderPublicId ? `/${this.lenderPublicId}` : ''}`);
		},
		// Expected by social-sharing-mixin (used by X/Twitter and "copy link")
		shareMessage() {
			return `Kiva is an easy way to make a real difference in someone's life.${
				this.iwdBorrowerName && this.iwdBorrowerLocation
					// eslint-disable-next-line max-len
					? ` Will you join me in helping ${this.iwdBorrowerName} in ${this.iwdBorrowerLocation} to pursue their dream?`
					: ''}`;
		}
	},
};
</script>

<style lang="scss" scoped>
// Using SCSS allows matching parent ThanksPage.vue component
@import 'settings';

.iwd-borrower-image {
	height: 289px;

	@include breakpoint(medium) {
		height: 420px;
	}

	::v-deep img {
		object-fit: cover;
		height: 289px;

		@include breakpoint(medium) {
			height: 420px;
		}
	}
}

#badge-image {
	width: 75px;

	@include breakpoint(medium) {
		width: 210px;
	}
}
</style>
