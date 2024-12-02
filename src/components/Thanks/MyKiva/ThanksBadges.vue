<template>
	<div
		ref="tyBadgeContainer"
		class="tw-bg-eco-green-1 tw-p-3 md:tw-py-4 tw-flex tw-flex-col tw-gap-2.5"
	>
		<!-- Opt In module -->
		<OptInModule
			v-if="!isGuest && !isOptedIn"
			:loans="loans"
			:is-guest="isGuest"
			:number-of-badges="numberOfBadges"
		/>
		<!-- Badges module -->
		<div
			v-if="hasBadgeData"
			class="content-box tw-flex tw-flex-col tw-items-center tw-gap-1.5 tw-text-center tw-overflow-hidden"
			:class="{ 'tw-relative' : showBadgeRays }"
		>
			<!-- BG Rays -->
			<div v-show="showBadgeRays" class="ray_box">
				<div class="ray ray1"></div>
				<div class="ray ray2"></div>
				<div class="ray ray3"></div>
				<div class="ray ray4"></div>
				<div class="ray ray5"></div>
				<div class="ray ray6"></div>
				<div class="ray ray7"></div>
				<div class="ray ray8"></div>
				<div class="ray ray9"></div>
				<div class="ray ray10"></div>
			</div>
			<!-- Borrower images -->
			<div v-if="isOptedIn && loansToDisplay.length" class="tw-flex tw-items-center">
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
						marginLeft: loansToDisplay.length > 1 && index === loansToDisplay.length - 1 ? '-22px' : '0',
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
			<KvButton
				class="continue-button tw-w-full tw-my-0.5" @click="handleContinue"
				v-kv-track-event="[
					'post-checkout',
					'click',
					'create-new-account',
					isGuest ? 'guest' : 'signed-in',
					numberOfBadges,
				]"
			>
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
					v-show="openCreateAccount"
					easing="ease-in-out"
				>
					<div>
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
					class="option-box"
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
		<KvLightbox
			:visible="showGuestAccountModal"
			title="Finish creating your account to see what's next"
			@lightbox-closed="showGuestAccountModal = false"
		>
			<GuestAccountCreation
				event-label="create-new-account"
				event-property="guest"
				:event-value="numberOfBadges"
			/>
		</KvLightbox>
	</div>
</template>

<script setup>
import _throttle from 'lodash/throttle';
import {
	onMounted, ref, computed, inject, onBeforeUnmount,
} from 'vue';
import confetti from 'canvas-confetti';
import KvMaterialIcon from '#kv-components/KvMaterialIcon';
import KvExpandable from '#src/components/Kv/KvExpandable';
import KvUserAvatar from '#kv-components/KvUserAvatar';
import KvLightbox from '#kv-components/KvLightbox';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';
import { mdiChevronDown, mdiArrowRight } from '@mdi/js';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';
import GuestAccountCreation from '#src/components/Forms/GuestAccountCreation';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import KvButton from '#kv-components/KvButton';
import useBadgeData, { MY_IMPACT_JOURNEYS_ID, MY_ACHIEVEMENTS_ID } from '#src/composables/useBadgeData';
import OptInModule from './OptInModule';

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
const showGuestAccountModal = ref(false);
const tyBadgeContainer = ref(null);
const hasScrolled = ref(false);

const $kvTrackEvent = inject('$kvTrackEvent');

const numberOfBadges = computed(() => props.badgesAchieved.length);

const loansToDisplay = computed(() => props.loans.slice(0, 3));

const moduleTitle = computed(() => {
	let title = '';
	if (props.isOptedIn) {
		title += 'Thank you!<br />';
	}
	title += numberOfBadges.value === 1 ? 'You reached a milestone' : `You reached ${numberOfBadges.value} milestones`;
	title += props.isOptedIn ? '.' : '!';
	return title;
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

const hasBadgeData = computed(() => !!badgeLevelName.value);

const badgeFunFact = computed(() => {
	// eslint-disable-next-line max-len
	return badgeData.value.contentfulData?.shareFact || 'Making a difference starts here. See your impact and achievements.';
});

const badgeFunFactFootnote = computed(() => badgeData.value.contentfulData?.shareFactFootnote ?? '');

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
			'open-account-creation-drawer',
			'guest',
			numberOfBadges.value,
		);
	} else {
		const hasBadges = numberOfBadges.value > 0;
		const sectionToScrollTo = numberOfBadges.value === 1 ? MY_IMPACT_JOURNEYS_ID : MY_ACHIEVEMENTS_ID;
		$kvTrackEvent(
			'post-checkout',
			'click',
			'continue-to-my-kiva',
			'guest',
			numberOfBadges.value,
		);

		// eslint-disable-next-line vue/no-mutating-props
		props.router?.push(`/portfolio${hasBadges ? `#${sectionToScrollTo}` : ''}`);
	}
};

const handleClickCreateAccount = () => {
	$kvTrackEvent(
		'post-checkout',
		'click',
		'open-account-creation-drawer',
		'guest',
		numberOfBadges.value,
	);

	openCreateAccount.value = !openCreateAccount.value;
};

const handleClickOrderConfirmation = () => {
	$kvTrackEvent(
		'post-checkout',
		'click',
		'open-order-confirmation-drawer',
		props.isGuest ? 'guest' : 'signed-in',
		numberOfBadges.value,
	);

	openOrderConfirmation.value = !openOrderConfirmation.value;
};

onMounted(() => {
	if (props.isOptedIn) {
		confetti({
			origin: {
				y: 0.2
			},
			particleCount: 150,
			spread: 200,
			colors: ['#6AC395', '#223829', '#95D4B3'],
			disableForReducedMotion: true,
		});
	} else {
		window.addEventListener('scroll', throttledScroll);

		handleScroll();
	}
});

onBeforeUnmount(() => {
	if (!props.isOptedIn) {
		window.removeEventListener('scroll', throttledScroll);
	}
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

.smaller-borrower-avatar :deep(img) {
	height: 36px;
	width: 36px;
}

/** Rays */
.ray_box {
	@apply tw-absolute tw-mx-auto tw-left-0 tw-right-0 tw-bottom-0 tw-aspect-square tw-top-5;
	width: 250px;
}

.ray {
	background: linear-gradient(180deg, rgba(241, 179, 67, 0.09) 0%,
		rgba(241, 179, 67, 0.5) 50%, rgba(241, 179, 67, 0.03) 100%);
    border-radius:80% 80% 0 0;
	animation: ray_anim 2.5s ease-in-out infinite;
	@apply tw-absolute tw-ml-1;
}

.ray1 {
	transform: rotate(180deg);
	height: 130px;
    width: 30px;
	top: -15%;
    left: 42%;
	@screen md {
		height: 80px;
		top: -12%;
	}
}
.ray2 {
	transform: rotate(220deg);
	animation-delay: 1s;
	height: 140px;
    width: 8px;
	top: -5%;
	left: 85%;
	@screen md {
		height: 130px;
		top: -15%;
		left: 85%;
	}
}
.ray3 {
	transform: rotate(250deg);
	animation-delay: 1.5s;
	height: 80px;
    width: 20px;
	top: 45%;
	left: 88%;
	@screen md {
		height: 180px;
		top: 15%;
		left: 105%;
	}
}
.ray4 {
	transform: rotate(305deg);
	animation-delay: 0.5s;
	height: 90px;
    width: 14px;
	top: 80%;
    left: 90%;
	@screen md {
		height: 180px;
		top: 65%;
		left: 98%;
	}
}
.ray5 {
	transform: rotate(-15deg);
	animation-delay: 1s;
	height: 110px;
    width: 30px;
	top: 110%;
    left: 60%;
	@screen md {
		height: 130px;
		top: 100%;
		left: 58%;
	}
}
.ray6 {
	transform: rotate(30deg);
	animation-delay: 2s;
	height: 110px;
    width: 25px;
	top: 105%;
    left: 18%;
	@screen md {
		height: 130px;
		top: 98%;
		left: 15%;
	}
}
.ray7 {
	transform: rotate(70deg);
	animation-delay: 1.5s;
	height: 90px;
    width: 10px;
	top: 80%;
    left: 0%;
	@screen md {
		height: 180px;
		top: 63%;
		left: -15%;
	}
}
.ray8 {
	transform: rotate(100deg);
	animation-delay: 0.5s;
	height: 80px;
    width: 28px;
	top: 55%;
    left: -5%;
	@screen md {
		height: 180px;
		top: 25%;
		left: -20%;
	}
}
.ray9 {
	transform: rotate(120deg);
	animation-delay: 2s;
	height: 80px;
    width: 10px;
	top: 30%;
    left: 1%;
	@screen md {
		height: 180px;
		top: -5%;
		left: -15%;
	}
}
.ray10 {
	transform: rotate(150deg);
	animation-delay: 1s;
	height: 120px;
    width: 23px;
	top: -2%;
    left: 12%;
	@screen md {
		height: 90px;
		top: -5%;
		left: 12%;
	}
}

@keyframes ray_anim {
	0% {
		opacity: 0.4;
	}
	25% {
		opacity: 1;
	}
	75% {
		opacity: 1;
	}
    100% {
		opacity: 0.4;
	}
}
</style>
