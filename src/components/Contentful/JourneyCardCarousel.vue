<template>
	<div>
		<h2
			v-if="!userInHomepage"
			class="tw-mb-3"
		>
			Take the <u>next step</u> on your impact journey
		</h2>

		<!-- Mobile-->
		<div
			v-if="isMobile && inLendingStats"
			class="tw-flex tw-flex-col tw-gap-2"
		>
			<component
				v-if="showGoalCard(0)"
				:is="goalCardComponent"
				:goal-progress="goalProgress"
				:hero-slides="slides"
				:loading="goalProgressLoading"
				:user-goal="userGoal"
				:prev-year-loans="womenLoansLastYear"
				@open-goal-modal="$emit('open-goal-modal')"
			/>
			<transition
				name="fade"
				mode="out-in"
				key="transition"
				enter-active-class="tw-transition-all tw-duration-500"
				enter-from-class="tw-opacity-0"
				enter-to-class="tw-opacity-full"
				leave-active-class="tw-transition-all tw-duration-500"
				leave-from-class="tw-opacity-full"
				leave-to-class="tw-opacity-0"
			>
				<MyKivaEmailUpdatesCard
					v-if="shouldShowEmailMarketingCard && !acceptedEmailMarketingUpdates"
					key:="acceptEmails"
					v-kv-track-event="['portfolio', 'view', 'next-step-email-option']"
					:loans="loans"
					:loan-id="loanId"
					@accept-email-updates="acceptedEmailMarketingUpdates = true"
				/>
				<ThankYouCard
					v-else
					key:="tkYouCard"
				>
					<template #header>
						<span
							class="tw-inline-flex tw-items-center tw-gap-1
									tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
						>
							<KvMaterialIcon
								class="tw-w-2 tw-h-2 tw-shrink-0"
								:icon="mdiEmailOutline"
							/>
							<span
								class="tw-text-primary tw-font-medium tw-align-middle"
								style="font-size: 0.875rem;"
							>
								Email updates
							</span>
						</span>
					</template>
					<template #content>
						<span>We’ll keep you updated. Change your <a
							href="/settings/email"
							target="_blank"
							v-kv-track-event="['portfolio', 'click', 'email-preferences-settings']"
						>email preferences</a> at any time.</span>
					</template>
				</ThankYouCard>
			</transition>
		</div>

		<!-- Desktop-->
		<KvCarousel
			v-else
			:key="orderedSlides.length"
			:embla-options="{
				loop: false,
				align: 'start',
				...(props.disableDrag && {
					watchDrag: false,
				}),
			}"
			:controls-top-right="controlsTopRight"
			:slide-max-width="singleSlideWidth"
			:multiple-slides-visible="true"
			class="journey-card-carousel tw-w-full"
			@change="handleChange"
		>
			<template
				v-for="(slide, index) in orderedSlides"
				#[`slide${index}`]
				:key="index"
			>
				<component
					v-if="showGoalCard(index)"
					:is="goalCardComponent"
					:goal-progress="goalProgress"
					:hero-slides="slides"
					:loading="goalProgressLoading"
					:user-goal="userGoal"
					:prev-year-loans="womenLoansLastYear"
					@open-goal-modal="$emit('open-goal-modal')"
				/>
				<template
					v-else-if="isEmailUpdatesSlide(slide)"
				>
					<transition
						name="fade"
						mode="out-in"
						key="transition"
						enter-active-class="tw-transition-all tw-duration-500"
						enter-from-class="tw-opacity-0"
						enter-to-class="tw-opacity-full"
						leave-active-class="tw-transition-all tw-duration-500"
						leave-from-class="tw-opacity-full"
						leave-to-class="tw-opacity-0"
					>
						<MyKivaEmailUpdatesCard
							v-if="shouldShowEmailMarketingCard && !acceptedEmailMarketingUpdates"
							key:="acceptEmails"
							v-kv-track-event="['portfolio', 'view', 'next-step-email-option']"
							:loans="loans"
							:loan-id="loanId"
							@accept-email-updates="acceptedEmailMarketingUpdates = true"
						/>
						<ThankYouCard
							v-else
							key:="tkYouCard"
						>
							<template #header>
								<span
									class="tw-inline-flex tw-items-center tw-gap-1
									tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
								>
									<KvMaterialIcon
										class="tw-w-2 tw-h-2 tw-shrink-0"
										:icon="mdiEmailOutline"
									/>
									<span
										class="tw-text-primary tw-font-medium tw-align-middle"
										style="font-size: 0.875rem;"
									>
										Email updates
									</span>
								</span>
							</template>
							<template #content>
								<span>We’ll keep you updated. Change your <a
									href="/settings/email"
									target="_blank"
									v-kv-track-event="['portfolio', 'click', 'email-preferences-settings']"
								>email preferences</a> at any time.</span>
							</template>
						</ThankYouCard>
					</transition>
				</template>
				<MyKivaCard
					v-else-if="isCustomCard(slide)"
					class="kiva-card"
					:title="slide.title"
					:show-cta-icon="true"
					:primary-cta-text="slide.ctaText"
					primary-cta-variant="primary"
					:is-full-width-primary-cta="true"
					:is-title-font-sans="true"
					title-color="tw-text-action-highlight"
					:loans="slide.loans"
					:tag-text="slide.tagText"
					:show-tag-icon="slide.showTagIcon"
					@primary-cta-clicked="slide.primaryCta"
				/>
				<MyKivaCard
					v-else
					class="tw-w-full tw-h-full"
					:bg-image="backgroundImg(slide)"
					:is-bg-top-aligned="isNonBadgeSlide(slide)"
					:has-gradient="!isNonBadgeSlide(slide)"
					:title="title(slide)"
					:subtitle="subTitle(slide)"
					:is-black-subtitle="isNonBadgeSlide(slide)"
					:secondary-cta-text="secondaryCtaText(slide)"
					:primary-cta-text="primaryCtaText(slide)"
					:primary-cta-variant="primaryCtaVariant(slide)"
					:is-full-width-primary-cta="isNonBadgeSlide(slide)"
					:is-title-font-sans="isTitleFontSans(slide)"
					:title-color="titleColor(slide)"
					@primary-cta-clicked="goToPrimaryCtaUrl(slide)"
					@secondary-cta-clicked="goToSecondaryCtaUrl(slide)"
				/>
			</template>
		</KvCarousel>
		<MyKivaSharingModal
			:lender="lender"
			:is-visible="isSharingModalVisible"
			@close-modal="isSharingModalVisible = false"
		/>
	</div>
</template>

<script setup>
import { mdiEmailOutline } from '@mdi/js';
import { parseISO, differenceInDays } from 'date-fns';
import {
	computed,
	ref,
	inject,
} from 'vue';
import { useRouter } from 'vue-router';
import useBreakpoints from '#src/composables/useBreakpoints';
import { formatUiSetting } from '#src/util/contentfulUtils';
import { defaultBadges } from '#src/util/achievementUtils';
import { TRANSACTION_LOANS_KEY } from '#src/util/myKivaUtils';
import useBadgeData from '#src/composables/useBadgeData';
import { KvCarousel, KvMaterialIcon } from '@kiva/kv-components';
import MyKivaSharingModal from '#src/components/MyKiva/MyKivaSharingModal';
import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import GoalCard from '#src/components/MyKiva/GoalCard';
import { optimizeContentfulUrl } from '#src/util/imageUtils';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';
import useGoalData from '#src/composables/useGoalData';
import MyKivaEmailUpdatesCard from '#src/components/MyKiva/MyKivaEmailUpdatesCard';
import useOptIn, { MAIL_UPDATES_OPT_COOKIE_NAME } from '#src/composables/useOptIn';
import ThankYouCard from '../MyKiva/ThankYouCard';

const JOURNEY_MODAL_KEY = 'journey';
const REFER_FRIEND_MODAL_KEY = 'refer-friend';
const TRANSACTION_DAYS_LIMIT = 30;

const apollo = inject('apollo');
const cookieStore = inject('cookieStore');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	getContentfulLevelData,
	combineBadgeData,
	getJourneysByLoan,
} = useBadgeData(apollo);

const { getCategoryLoansLastYear } = useGoalData();

const emit = defineEmits(['update-journey', 'open-goal-modal']);

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: () => ({})
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	userInHomepage: {
		type: Boolean,
		default: false
	},
	slides: {
		type: Array,
		default: () => ([]),
	},
	heroContentfulData: {
		type: Array,
		default: () => ([]),
	},
	heroTieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	slidesNumber: {
		type: Number,
		default: 0,
	},
	heroSlides: {
		type: Array,
		default: () => ([]),
	},
	inLendingStats: {
		type: Boolean,
		default: false,
	},
	userGoalEnabled: {
		type: Boolean,
		default: false,
	},
	userGoal: {
		type: Object,
		default: () => ({}),
	},
	userGoalAchieved: {
		type: Boolean,
		default: false,
	},
	disableDrag: {
		type: Boolean,
		default: false,
	},
	goalProgress: {
		type: Number,
		default: 0,
	},
	goalProgressLoading: {
		type: Boolean,
		default: false,
	},
	controlsTopRight: {
		type: Boolean,
		default: false,
	},
	goalsEntrypointEnable: {
		type: Boolean,
		default: false
	},
	hideGoalCard: {
		type: Boolean,
		default: false
	},
	postLendingNextStepsEnable: {
		type: Boolean,
		default: false
	}
});

const { isMobile, isMedium, isLarge } = useBreakpoints();
const currentIndex = ref(0);
const isSharingModalVisible = ref(false);
const { userHasMailUpdatesOptOut } = useOptIn(apollo, cookieStore);
const acceptedEmailMarketingUpdates = ref(false);
const shouldShowEmailMarketingCard = computed(
	() => props.postLendingNextStepsEnable && props.inLendingStats
		&& userHasMailUpdatesOptOut()
);
const isEmailUpdatesSlide = slide => slide?.isEmailUpdates === true;
const loanId = computed(() => cookieStore.get(MAIL_UPDATES_OPT_COOKIE_NAME)?.trim()?.split('|')?.[1] || '');

const badgesData = computed(() => {
	const badgeContentfulData = (props.heroContentfulData ?? [])
		.map(entry => getContentfulLevelData(entry));

	return combineBadgeData(props.heroTieredAchievements, badgeContentfulData);
});

const getRichTextContent = slide => slide?.fields?.richText?.content ?? [];
const getRichTextUiSettingsData = slide => {
	const richTextContent = getRichTextContent(slide);
	const uiSettings = richTextContent.find(
		item => item.data?.target?.sys?.contentType?.sys?.id === 'uiSetting'
	);
	const uiSettingsTarget = uiSettings?.data?.target ?? {};
	const uiSettingsData = formatUiSetting(uiSettingsTarget);

	return uiSettingsData?.dataObject ?? {};
};

const isNonBadgeSlide = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return !defaultBadges.includes(richTextUiSettingsData.achievementKey);
};

const shouldShowGoalCard = computed(() => {
	if (!props.inLendingStats) return false;

	return props.userGoalEnabled
	&& (!props.userGoal || !props.userGoalAchieved || (props.userGoalAchieved && props.goalsEntrypointEnable))
	&& !props.hideGoalCard;
});

const orderedSlides = computed(() => {
	const achievementSlides = [];
	let loanJourneys = [];
	let sortedSlides = [];

	const transactionLoans = props.userInfo?.transactions?.values?.filter(t => {
		const diffInDays = differenceInDays(new Date(), parseISO(t.createTime));
		return t.type === TRANSACTION_LOANS_KEY && diffInDays <= TRANSACTION_DAYS_LIMIT;
	});

	if (transactionLoans?.length) {
		const transactionLoan = transactionLoans?.[0]?.loan ?? {};
		loanJourneys = getJourneysByLoan(transactionLoan);
	}

	defaultBadges.forEach(badgeKey => {
		const achievementContent = badgesData.value.find(achievement => badgeKey === achievement.id);

		if (achievementContent) {
			// eslint-disable-next-line no-unsafe-optional-chaining
			const lastTierIndex = achievementContent.achievementData?.tiers?.length - 1;
			const lastTier = achievementContent.achievementData?.tiers[lastTierIndex];
			// Hidden slide for completed journeys
			if (lastTier?.completedDate) {
				return;
			}

			const tier = achievementContent.achievementData?.tiers?.find(t => !t.completedDate);
			const milestoneDiff = tier.target - achievementContent.achievementData.totalProgressToAchievement;
			const contentfulData = achievementContent.contentfulData.find(cData => cData.level === tier.level);

			const slideData = props.slides.find(slide => {
				const richTextSlideData = getRichTextUiSettingsData(slide);
				return richTextSlideData?.achievementKey === badgeKey;
			});

			if (slideData) {
				achievementSlides.push({
					...slideData,
					milestoneDiff,
					target: tier.target,
					totalProgressToAchievement: achievementContent.achievementData?.totalProgressToAchievement,
					badgeImgUrl: contentfulData?.imageUrl,
					badgeKey,
				});
			}
		}
	});

	sortedSlides = achievementSlides.sort((a, b) => {
		return a.milestoneDiff - b.milestoneDiff;
	});

	if (loanJourneys.length) {
		sortedSlides.sort((a, b) => loanJourneys.indexOf(b.badgeKey) - loanJourneys.indexOf(a.badgeKey)); // eslint-disable-line max-len
	}

	const nonBadgesSlides = props.slides.filter(slide => {
		return isNonBadgeSlide(slide);
	});

	if (nonBadgesSlides.length > 0) {
		sortedSlides = [
			...sortedSlides,
			...nonBadgesSlides,
		];
	}

	if (shouldShowGoalCard.value) {
		// Add empty slide at start for goal card
		sortedSlides.unshift({});
	}

	if (shouldShowEmailMarketingCard.value) {
		sortedSlides.splice(1, 0, { isEmailUpdates: true });
	}

	if (props.slidesNumber) {
		sortedSlides = sortedSlides.slice(0, props.slidesNumber);
	}

	return sortedSlides;
});

const getMediaImgUrl = media => {
	const baseUrl = media?.data?.target?.fields?.contentLight?.[0]?.fields?.file?.url || '';
	return optimizeContentfulUrl(baseUrl, 336);
};

const backgroundImg = slide => {
	const richTextContent = getRichTextContent(slide);
	if (isNonBadgeSlide(slide)) {
		const mobileMediaData = richTextContent.find(
			item => item.data?.target?.sys?.contentType?.sys?.id === 'media'
			&& item.data?.target?.fields?.key.includes('mobile')
		);
		const desktopMediaData = richTextContent.find(
			item => item.data?.target?.sys?.contentType?.sys?.id === 'media'
			&& item.data?.target?.fields?.key.includes('desktop')
		);

		if (isMobile.value) {
			return getMediaImgUrl(mobileMediaData);
		}
		return getMediaImgUrl(desktopMediaData);
	}

	const backgroundImage = richTextContent.find(
		item => item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
	);
	const baseUrl = backgroundImage?.data?.target?.fields?.file?.url || '';
	return optimizeContentfulUrl(baseUrl, 336);
};

const title = slide => {
	if (slide.totalProgressToAchievement) {
		return `Your progress: ${slide.totalProgressToAchievement}/${slide.target} loans`;
	}
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);

	return richTextUiSettingsData?.title || '';
};

const subTitle = slide => {
	if (isNonBadgeSlide(slide)) {
		const richTextUiSettingsData = getRichTextUiSettingsData(slide);

		return richTextUiSettingsData.contentText || '';
	}

	if (slide.totalProgressToAchievement) {
		return 'Keep lending to reach your next achievement';
	}

	return 'Get started to reach your first achievement';
};

const primaryCtaText = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.primaryCtaText || '';
};

const primaryCtaVariant = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.primaryCtaVariant || 'secondary';
};

const secondaryCtaText = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.secondaryCtaText || '';
};

const isTitleFontSans = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.titleSans === 'true';
};

const titleColor = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	if (!richTextUiSettingsData.titleColor && isNonBadgeSlide(slide)) {
		return 'tw-text-action';
	}
	return richTextUiSettingsData.titleColor;
};

const getUrlParamsFromString = string => {
	const urlSplit = string.split('?');
	return urlSplit[1];
};

const goToPrimaryCtaUrl = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	const primaryCtaUrl = richTextUiSettingsData.primaryCtaUrl || '';
	$kvTrackEvent('portfolio', 'click', `primary-cta-${primaryCtaText(slide)}`, richTextUiSettingsData.achievementKey);
	const urlParams = getUrlParamsFromString(primaryCtaUrl);

	if (urlParams && urlParams.includes(REFER_FRIEND_MODAL_KEY)) {
		const paramsSplit = urlParams.split('=');
		if (paramsSplit && paramsSplit[1] === 'true') {
			// open sharing modal
			isSharingModalVisible.value = true;
		}
	} else {
		router.push(primaryCtaUrl);
	}
};

const goToSecondaryCtaUrl = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	const secondaryCtaUrl = richTextUiSettingsData.secondaryCtaUrl || '';
	// eslint-disable-next-line max-len
	$kvTrackEvent('portfolio', 'click', `secondary-cta-${secondaryCtaText(slide)}`, richTextUiSettingsData.achievementKey);
	const urlParams = getUrlParamsFromString(secondaryCtaUrl);

	if (urlParams && urlParams.includes(JOURNEY_MODAL_KEY)) {
		const { achievementKey } = richTextUiSettingsData;
		emit('update-journey', achievementKey);
	} else {
		router.push(secondaryCtaUrl);
	}
};

const singleSlideWidth = computed(() => {
	if (isLarge.value) {
		return 'calc((100% - 64px) / 3)';
	}
	if (isMedium.value) {
		return '336px';
	}
	return '90%';
});

const handleChange = interaction => {
	const direction = currentIndex.value > interaction.value ? 'prev' : 'next';
	currentIndex.value = interaction.value;

	$kvTrackEvent(
		'portfolio',
		'click',
		`${direction}-step-carousel`,
	);
};

const isCustomCard = slide => !!slide?.isCustomCard;

const showGoalCard = idx => {
	if (!props.inLendingStats) return false;

	return idx === 0 && shouldShowGoalCard.value;
};

const womenLoansLastYear = computed(() => {
	return getCategoryLoansLastYear(props.heroTieredAchievements);
});

const goalCardComponent = computed(() => {
	if (props.goalsEntrypointEnable) {
		return NextYearGoalCard;
	}
	return GoalCard;
});

</script>

<style lang="postcss" scoped>
.kiva-card :deep(h2) {
	font-size: 22px !important;
}
</style>
