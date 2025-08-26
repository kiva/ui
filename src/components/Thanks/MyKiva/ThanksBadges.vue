<template>
	<div
		ref="tyBadgeContainer"
		class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5"
	>
		<!-- Opt In module -->
		<OptInModule
			v-if="showOptInModule"
			:loans="loans"
			:is-guest="isGuest"
			:number-of-badges="numberOfBadges"
			class="print:tw-hidden"
		/>
		<!-- Badges module -->
		<div
			v-if="showBadgeModule"
			class="
				content-box
				tw-flex
				tw-flex-col
				tw-items-center
				tw-gap-1.5
				tw-text-center
				tw-overflow-hidden
				print:tw-hidden
			"
			:class="{ 'tw-relative' : showBadgeRays }"
		>
			<!-- BG Rays -->
			<BgRays v-show="!isLoading && showBadgeRays" />
			<!-- Borrower images -->
			<KvLoadingPlaceholder v-if="isLoading" class="!tw-h-9 !tw-rounded" />
			<template v-else>
				<!-- Borrower images -->
				<div v-if="(isGuest || isOptedIn) && loansToDisplay.length" class="tw-flex tw-items-center">
					<KvUserAvatar
						v-for="(loan, index) in loansToDisplay"
						:key="loan.id"
						:lender-name="loan?.name"
						:lender-image-url="loan?.image?.url"
						class="tw-rounded-full tw-shadow tw-border-white tw-border-2 tw-w-auto"
						:class="{ 'smaller-borrower-avatar': loansToDisplay.length > 2 && index !== 1 }"
						:style="{
							zIndex: index === 1 ? 2 : 1,
							marginRight: loansToDisplay.length > 2 && index === 0 ? '-22px' : '0',
							marginLeft: loansToDisplay.length > 1&& index === loansToDisplay.length - 1
								? '-22px' : '0',
						}"
					/>
				</div>
				<h2 v-html="moduleTitle" style="line-height: 1.25;"></h2>
				<BadgeContainer
					:show-shine="showBadgeShine"
				>
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
			</template>
		</div>
		<!-- Miscellaneous module -->
		<div class="content-box">
			<div v-if="isGuest" class="tw-mb-2 print:tw-hidden">
				<div
					class="option-box"
					:class="{ 'open' : openCreateAccount }"
					@click="handleClickCreateAccount"
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
					easing="ease-in-out"
				>
					<div v-show="openCreateAccount">
						<h2>Before you go!</h2>
						<p>Finish setting up your account to track and relend your money as you are paid back.</p>
						<GuestAccountCreation
							class="tw-pt-3"
							event-category="post-checkout"
							event-label="create-new-account-from-drawer"
							event-property="guest"
							:event-value="numberOfBadges"
						/>
					</div>
				</KvExpandable>
			</div>
			<div class="tw-mb-2">
				<div
					class="option-box print:!tw-hidden"
					:class="{ 'open' : openOrderConfirmation }"
					@click="handleClickOrderConfirmation"
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
					easing="ease-in-out"
				>
					<CheckoutReceipt
						v-if="receipt"
						v-show="openOrderConfirmation"
						:lender="lender"
						:receipt="receipt"
					/>
				</KvExpandable>
			</div>
			<div
				class="option-box print:!tw-hidden"
				:class="{ 'open' : openShareModule }"
				@click="handleClickShareDrawer"
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
				easing="ease-in-out"
			>
				<SocialShareV2
					v-show="openShareModule"
					class="social-share"
					:lender="lender"
					:loans="loans"
				/>
			</KvExpandable>
		</div>
		<KvLightbox
			:visible="showGuestAccountModal"
			title="Finish creating your account to see what's next"
			@lightbox-closed="showGuestAccountModal = false"
		>
			<GuestAccountCreation
				event-label="create-new-account"
				event-property="guest"
				:event-value="numberOfBadges"
				:guest-username="guestUsername"
			/>
		</KvLightbox>
	</div>
</template>

<script setup>
import _throttle from 'lodash/throttle';
import {
	onMounted,
	ref,
	computed,
	inject,
	watch,
	onBeforeUnmount,
} from 'vue';
import confetti from 'canvas-confetti';
import {
	KvMaterialIcon, KvUserAvatar, KvLightbox, KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import { useRouter } from 'vue-router';
import KvExpandable from '#src/components/Kv/KvExpandable';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import { mdiChevronDown, mdiArrowRight } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import useBadgeData, { ID_EQUITY } from '#src/composables/useBadgeData';
import BgRays from '#src/components/Thanks/BgRays';
import OptInModule from './OptInModule';

const router = useRouter();

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
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
	/**
	 * [{
	 *   achievementId: string,
	 * }]
	 */
	badgesAchieved: {
		type: Array,
		default: () => ([]),
	},
	guestUsername: {
		type: String,
		default: '',
	},
	myKivaEnabled: {
		type: Boolean,
		default: false,
	},
});

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeContentfulData,
	badgeData,
	getHighestPriorityDisplayBadge,
	getLastCompletedBadgeLevelData,
	getTierBadgeDataByLevel,
} = useBadgeData();

const badgeIdsAchieved = ref(props.badgesAchieved.map(b => b.achievementId));
const badgeDataAchieved = ref();
const openCreateAccount = ref(false);
const openOrderConfirmation = ref(false);
const openShareModule = ref(false);
const showGuestAccountModal = ref(false);
const tyBadgeContainer = ref(null);
const hasScrolled = ref(false);

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');

const isLoading = computed(() => !badgeDataAchieved.value);

// Handle when a guest doesn't have access to achievement data but at least achieved the equity badge
const numberOfBadges = computed(() => (props.badgesAchieved.length || 1));

const loansToDisplay = computed(() => props.loans.slice(0, 3));

const moduleTitle = computed(() => {
	let title = '';
	if (props.isGuest || props.isOptedIn) {
		title += 'Thank you';

		if (numberOfBadges.value === 1) {
			title += ' and congrats';
		}
		title += '! <br />';
	}

	title += 'You\'ve reached a new achievement';
	title += props.isOptedIn ? '.' : '!';
	return title;
});

const continueButtonText = computed(() => {
	return numberOfBadges.value === 1 ? 'Continue' : `See all ${numberOfBadges.value} milestones`;
});

const displayedBadgeData = computed(() => {
	if (badgeDataAchieved.value?.length) {
		if (props.isGuest) {
			return badgeDataAchieved.value[0];
		}
		const displayedBadge = getHighestPriorityDisplayBadge(badgeDataAchieved.value);
		return getLastCompletedBadgeLevelData(displayedBadge);
	}
	return {};
});

const badgeImageUrl = computed(() => displayedBadgeData.value.contentfulData?.imageUrl ?? '');

const badgeLevelName = computed(() => {
	const levelData = getTierBadgeDataByLevel(displayedBadgeData.value, displayedBadgeData.value.level);
	return levelData.tierName;
});

const hasBadgeData = computed(() => !!badgeLevelName.value);

const badgeFunFact = computed(() => {
	// eslint-disable-next-line max-len
	return displayedBadgeData.value.contentfulData?.shareFact || 'Making a difference starts here. See your impact and achievements.';
});

const badgeFunFactFootnote = computed(() => displayedBadgeData.value.contentfulData?.shareFactFootnote ?? '');

const showBadgeShine = computed(() => {
	if (props.isOptedIn) {
		return true;
	}
	if (hasScrolled.value) {
		return true;
	}
	return false;
});

const showBadgeRays = computed(() => {
	if (!props.isOptedIn && hasScrolled.value) {
		return true;
	}
	return false;
});

const showOptInModule = computed(() => !props.isOptedIn);

const showBadgeModule = computed(() => {
	return (props.badgesAchieved.length || props.isGuest) && (isLoading.value || hasBadgeData.value);
});

const handleScroll = () => {
	const { top } = tyBadgeContainer.value.getBoundingClientRect();
	if (top < -50 && !hasScrolled.value) {
		hasScrolled.value = true;
	}
};

const throttledScroll = _throttle(handleScroll, 200);

const handleContinue = () => {
	if (props.isGuest) {
		showGuestAccountModal.value = true;
		$kvTrackEvent(
			'post-checkout',
			'click',
			'continue-to-my-kiva',
			'guest',
			numberOfBadges.value,
		);
	} else {
		$kvTrackEvent(
			'post-checkout',
			'click',
			'continue-to-my-kiva',
			'signed-in',
			numberOfBadges.value,
		);

		router?.push(props.myKivaEnabled ? '/mykiva' : '/portfolio');
	}
};

const handleClickCreateAccount = () => {
	openCreateAccount.value = !openCreateAccount.value;

	if (openCreateAccount.value) {
		$kvTrackEvent(
			'post-checkout',
			'click',
			'open-account-creation-drawer',
			'guest',
			numberOfBadges.value,
		);
	}
};

const handleClickOrderConfirmation = () => {
	openOrderConfirmation.value = !openOrderConfirmation.value;

	if (openOrderConfirmation.value) {
		$kvTrackEvent(
			'post-checkout',
			'click',
			'open-order-confirmation-drawer',
			props.isGuest ? 'guest' : 'signed-in',
			numberOfBadges.value,
		);
	}
};

const handleClickShareDrawer = () => {
	openShareModule.value = !openShareModule.value;

	if (openShareModule.value) {
		$kvTrackEvent(
			'post-checkout',
			'click',
			'open-share-drawer',
			props.isGuest ? 'guest' : 'signed-in',
			numberOfBadges.value,
		);
	}
};

const showConfetti = () => {
	confetti({
		origin: {
			y: 0.2
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
};

onMounted(async () => {
	// Load combined badge data, since badgesAchieved prop only contains the badge IDs
	fetchContentfulData(apollo);

	if (!props.isGuest) {
		// Achievement data can't be loaded for guests
		await fetchAchievementData(apollo);
	}

	if (!props.isOptedIn) {
		window.addEventListener('scroll', throttledScroll);

		handleScroll();
	}

	const eventProperty = props.isGuest ? 'guest' : 'signed-in';
	if (showBadgeModule.value) {
		if (showOptInModule.value) {
			$kvTrackEvent('post-checkout', 'show', 'opt-in-then-badge', eventProperty, numberOfBadges.value);
		} else {
			$kvTrackEvent('post-checkout', 'show', 'badge-only', eventProperty, numberOfBadges.value);
		}
	} else if (showOptInModule.value) {
		$kvTrackEvent('post-checkout', 'show', 'opt-in-only', eventProperty, numberOfBadges.value);
	} else {
		$kvTrackEvent('post-checkout', 'show', 'my-kiva-fallback', eventProperty, numberOfBadges.value);
	}
});

onBeforeUnmount(() => {
	if (!props.isOptedIn) {
		window.removeEventListener('scroll', throttledScroll);
	}
});

watch(() => badgeContentfulData.value, () => {
	// Guests don't have access to achievement data, so we only show the equity badge
	if (props.isGuest && badgeContentfulData.value?.length) {
		const equityBadge = badgeContentfulData.value.find(b => b.id === ID_EQUITY);
		if (equityBadge) {
			badgeDataAchieved.value = [
				{
					levelName: equityBadge.challengeName,
					contentfulData: { ...equityBadge },
				},
			];

			showConfetti();
		}
	}
});

watch(() => badgeData.value, () => {
	if (!props.isGuest && badgeData.value.length) {
		badgeDataAchieved.value = badgeData.value.filter(b => badgeIdsAchieved.value.includes(b.id));

		// Show confetti only after the badge data has been loaded and displayed and is opted in
		if (props.isOptedIn) {
			showConfetti();
		}
	}
}, { immediate: true });
</script>

<style lang="postcss" scoped>
.content-box {
	@apply tw-rounded md:tw-rounded-xl tw-mx-auto tw-bg-white tw-shadow-lg tw-p-3 tw-w-full
		print:tw-shadow-transparent;

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

.smaller-borrower-avatar :deep(img), .smaller-borrower-avatar :deep(.loading-placeholder) {
	height: 36px;
	width: 36px;
}

</style>
