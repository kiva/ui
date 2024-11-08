<template>
	<div class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5">
		<!-- Badges module -->
		<div class="content-box tw-flex tw-flex-col tw-items-center tw-gap-1.5 tw-text-center">
			<h2>{{ moduleTitle }}</h2>
			<BadgeContainer>
				<img
					v-if="badgeImageUrl"
					:src="badgeImageUrl"
					alt="Badge"
					style="height: 250px; width: 250px;"
				>
			</BadgeContainer>
			<h3>{{ badgeLevelName }} unlocked</h3>
			<p>{{ badgeFunFact }}{{ badgeFunFactFootnote ? '*' : '' }}</p>
			<KvButton class="continue-button tw-w-full tw-my-0.5" @click="handleContinue">
				{{ continueButtonText }}
				<KvMaterialIcon :icon="mdiArrowRight" class="tw-ml-0.5" />
			</KvButton>
			<p v-if="badgeFunFactFootnote" class="tw-text-small">
				*{{ badgeFunFactFootnote }}
			</p>
		</div>
		<!-- Miscellaneous module -->
		<div class="content-box">
			<div v-if="isGuest" class="tw-mb-2">
				<div
					class="option-box"
					:class="{ 'open' : openCreateAccount }"
					@click="openCreateAccount = !openCreateAccount"
				>
					<p class="tw-font-medium">
						Create your account
					</p>
					<KvMaterialIcon
						:icon="mdiChevronDown"
						class="expandable-button"
						:class="{ 'tw-rotate-180' : openCreateAccount }"
					/>
				</div>
				<KvExpandable
					v-show="openCreateAccount"
					easing="ease-in-out"
				>
					<div>
						<h2>Before you go!</h2>
						<p>Finish setting up your account to track and relend your money as you are paid back.</p>
						<GuestAccountCreation
							class="tw-pt-3"
							event-category="thanks"
							event-label="open-account-creation-drawer"
						/>
					</div>
				</KvExpandable>
			</div>
			<div class="tw-mb-2">
				<div
					class="option-box"
					:class="{ 'open' : openOrderConfirmation }"
					@click="openOrderConfirmation = !openOrderConfirmation"
				>
					<p class="tw-font-medium">
						Show confirmation
					</p>
					<KvMaterialIcon
						:icon="mdiChevronDown"
						class="expandable-button"
						:class="{ 'tw-rotate-180' : openOrderConfirmation }"
					/>
				</div>
				<KvExpandable
					v-show="openOrderConfirmation"
					easing="ease-in-out"
				>
					<CheckoutReceipt
						v-if="receipt"
						:lender="lender"
						:receipt="receipt"
					/>
				</KvExpandable>
			</div>
			<div
				class="option-box"
				:class="{ 'open' : openShareModule }"
				@click="openShareModule = !openShareModule"
			>
				<p class="tw-font-medium">
					Share
				</p>
				<KvMaterialIcon
					:icon="mdiChevronDown"
					class="expandable-button"
					:class="{ 'tw-rotate-180' : openShareModule }"
				/>
			</div>
			<KvExpandable
				v-show="openShareModule"
				easing="ease-in-out"
			>
				<SocialShareV2
					v-if="receipt"
					class="social-share"
					:lender="lender"
					:loans="loans"
				/>
			</KvExpandable>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import confetti from 'canvas-confetti';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import KvExpandable from '#src/components/Kv/KvExpandable';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import { mdiChevronDown, mdiArrowRight } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import KvButton from '@kiva/kv-components/vue/KvButton';
import useBadgeData from '#src/composables/useBadgeData';

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	receipt: {
		type: Object,
		default: () => ({}),
	},
	badgesAchieved: {
		type: Array,
		default: () => ([]),
	},
	router: {
		type: Object,
		default: () => ({}),
	},
});

const { getHighestPriorityDisplayBadge, getLastCompletedBadgeLevelData } = useBadgeData();

const openCreateAccount = ref(false);
const openOrderConfirmation = ref(false);
const openShareModule = ref(false);

const numberOfBadges = computed(() => props.badgesAchieved.length);

const moduleTitle = computed(() => {
	return numberOfBadges.value === 1 ? 'You reached a milestone.' : `You reached ${numberOfBadges.value} milestones.`;
});

const continueButtonText = computed(() => {
	return numberOfBadges.value === 1 ? 'Continue' : `See all ${numberOfBadges.value} milestones`;
});

const badgeData = computed(() => {
	const displayedBadge = getHighestPriorityDisplayBadge(props.badgesAchieved);
	return getLastCompletedBadgeLevelData(displayedBadge);
});

const badgeImageUrl = computed(() => badgeData.value.contentfulData?.imageUrl ?? '');

const badgeLevelName = computed(() => badgeData.value.levelName ?? '');

const badgeFunFact = computed(() => {
	// eslint-disable-next-line max-len
	return badgeData.value.contentfulData?.shareFact || 'Making a difference starts here. See your impact and achievements.';
});

const badgeFunFactFootnote = computed(() => badgeData.value.contentfulData?.shareFactFootnote ?? '');

const handleContinue = () => {
	if (props.isGuest) {
		openCreateAccount.value = true;
	} else {
		// eslint-disable-next-line vue/no-mutating-props
		props.router?.push('/portfolio');
	}
};

onMounted(() => {
	confetti({
		origin: {
			y: 0.2
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
});
</script>

<style lang="postcss" scoped>
.content-box {
	@apply tw-rounded md:tw-rounded-lg tw-mx-auto tw-bg-white tw-shadow-lg tw-p-3 tw-w-full;

	max-width: 620px;
}

.option-box {
	@apply tw-border tw-rounded tw-flex tw-justify-between tw-cursor-pointer tw-py-2 tw-px-3;

	transition: border 0.2s ease, border-radius 0.5s ease;
}

.option-box.open {
	@apply tw-border-t-transparent tw-border-l-transparent tw-border-r-transparent tw-rounded-none;
}

.expandable-button {
	@apply tw-transition-transform tw-ease-in-out tw-duration-500;
}

.social-share :deep(.share__social.social) {
	@apply tw-w-full;
}

.continue-button :deep(span) {
	@apply tw-flex;
}
</style>
