<template>
	<div class="tw-bg-secondary">
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
		</div>
	</div>
</template>

<script>
import iWD2024Badge from '@/assets/images/achievements/iwd_2024_badge.png';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export const KIVA_INVITER_ID = 'KIVA';

export default {
	name: 'IwdThanksPageVariations',
	components: {
		BorrowerImage,
		KvButton,
	},
	data() {
		return {
			iWD2024Badge,
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
</style>
