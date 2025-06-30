<template>
	<div>
		<h2
			v-if="!userInHomepage"
			class="tw-mb-3"
		>
			Take the <u>next step</u> on your impact journey
		</h2>
		<KvCarousel
			:key="orderedSlides.length"
			:embla-options="{
				loop: false,
				align: 'start',
			}"
			:slide-max-width="singleSlideWidth"
			:multiple-slides-visible="true"
			class="journey-card-carousel tw-w-full tw-overflow-visible"
			@change="handleChange"
		>
			<template
				v-for="(slide, index) in orderedSlides"
				#[`slide${index}`]
				:key="index"
			>
				<!-- Journey card slide -->
				<div
					class="tw-w-full tw-relative tw-rounded tw-bg-cover tw-bg-center journey-card"
					:class="{ '!tw-bg-left-top': isNonBadgeSlide(slide) }"
					:style="{ backgroundImage: `url(${backgroundImg(slide)})` }"
				>
					<div
						class="
							tw-absolute
							tw-w-full
							tw-bottom-0
							tw-pb-1.5
							tw-px-1.5
							md:tw-pb-2
							md:tw-px-2
							tw-align-bottom
							tw-rounded-b
						"
						:class="{ 'slide-gradient': !isNonBadgeSlide(slide) }"
						:style="[
							{ 'height': overlayHeight(slide) },
						]"
					>
						<div class="tw-flex tw-flex-col tw-justify-end tw-h-full !tw-gap-1.5">
							<div class="tw-text-primary-inverse">
								<h2
									class="tw-text-h3"
									:class="titleClass(slide)"
								>
									{{ title(slide) }}
								</h2>
								<p
									v-if="subTitle(slide)"
									class="tw-text-small tw-font-medium"
									:class="{
										'tw-my-1 lg:tw-my-1.5 !tw-text-base !tw-text-gray-800':
											isNonBadgeSlide(slide)
									}"
								>
									{{ subTitle(slide) }}
								</p>
							</div>
							<div class="tw-flex tw-flex-col tw-gap-1.5">
								<button
									v-if="showSecondaryCta(slide)"
									@click="goToSecondaryCtaUrl(slide)"
									variant="tertiary"
									class="tw-inline-flex tw-justify-center tw-items-center tw-rounded tw-py-1 tw-px-3
									tw-border tw-border-white tw-font-medium tw-text-center tw-text-white"
								>
									{{ secondaryCtaText(slide) }}
								</button>
								<KvButton
									@click="goToPrimaryCtaUrl(slide)"
									:variant="primaryCtaVariant(slide)"
									:class="{ 'tw-w-full': isNonBadgeSlide(slide) }"
								>
									{{ primaryCtaText(slide) }}
								</KvButton>
							</div>
						</div>
					</div>
				</div>
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
import { parseISO, differenceInDays } from 'date-fns';
import {
	computed,
	ref,
	inject,
} from 'vue';
import { useRouter } from 'vue-router';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import { formatUiSetting } from '#src/util/contentfulUtils';
import { defaultBadges } from '#src/util/achievementUtils';
import useBadgeData from '#src/composables/useBadgeData';
import { KvCarousel, KvButton } from '@kiva/kv-components';
import MyKivaSharingModal from '#src/components/MyKiva/MyKivaSharingModal';

const JOURNEY_MODAL_KEY = 'journey';
const REFER_FRIEND_MODAL_KEY = 'refer-friend';
const AVOID_TRANSACTION_LOANS_KEY = 'loan_repayment';
const TRANSACTION_DAYS_LIMIT = 30;

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	getContentfulLevelData,
	combineBadgeData,
	getJourneysByLoan,
} = useBadgeData(apollo);

const emit = defineEmits(['update-journey']);

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: () => ({})
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
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const currentIndex = ref(0);
const isSharingModalVisible = ref(false);

const badgesData = computed(() => {
	const badgeContentfulData = (props.heroContentfulData ?? [])
		.map(entry => getContentfulLevelData(entry));

	return combineBadgeData(props.heroTieredAchievements, badgeContentfulData);
});

const getRichTextContent = slide => slide.fields?.richText?.content ?? [];
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

const orderedSlides = computed(() => {
	const achievementSlides = [];
	let loanJourneys = [];
	let sortedSlides = [];

	const transactionLoans = props.userInfo?.transactions?.values?.filter(t => {
		const diffInDays = differenceInDays(new Date(), parseISO(t.createTime));
		return t.type !== AVOID_TRANSACTION_LOANS_KEY && diffInDays <= TRANSACTION_DAYS_LIMIT;
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

	if (props.slidesNumber) {
		sortedSlides = sortedSlides.slice(0, props.slidesNumber);
	}

	return sortedSlides;
});

const getMediaImgUrl = media => {
	return media?.data?.target?.fields?.contentLight?.[0]?.fields?.file?.url || '';
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
	return backgroundImage?.data?.target?.fields?.file?.url || '';
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
	return richTextUiSettingsData.titleColor;
};

const titleClass = slide => {
	let className = '';

	if (isTitleFontSans(slide)) {
		className += 'tw-font-sans';
	}

	if (titleColor(slide)) {
		className += ` ${titleColor(slide)}`;
	} else if (isNonBadgeSlide(slide)) {
		className += ' tw-text-action';
	}

	if (!subTitle(slide)) {
		className += ' tw-mb-1.5';
	}

	return className;
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

const showSecondaryCta = slide => secondaryCtaText(slide);

const overlayHeight = slide => {
	return showSecondaryCta(slide) && isMobile.value ? '60%' : '50%';
};

const singleSlideWidth = computed(() => {
	if (isMobile.value) {
		return '90%';
	}
	return '336px';
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
</script>

<style lang="postcss" scoped>
.journey-card {
	box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
	height: 382px;

	@screen md {
		height: 340px;
	}
}

.journey-card-carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex tw-justify-start tw-mt-2;
}

.journey-card-carousel :deep(.kv-carousel__controls) div {
	@apply tw-invisible tw-mx-0 tw-w-2;
}

.journey-card-carousel:deep(div:first-child) {
	@apply tw-gap-2 lg:tw-gap-4;
}

.slide-gradient {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgb(0 0 0 / 0%) 100%);
}
</style>
