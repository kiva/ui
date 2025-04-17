<template>
	<div>
		<KvLoadingPlaceholder
			v-if="isLoading"
			class="tw-my-2 lg:tw-mb-4 !tw-w-full md:!tw-w-1/2 !tw-h-6"
		/>
		<h2
			v-else
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
				<!-- Loading placeholder for the carousel -->
				<KvLoadingPlaceholder
					v-if="isLoading"
					class="!tw-rounded journey-card"
				/>

				<!-- Journey card slide -->
				<div
					v-else
					class="tw-w-full tw-relative tw-rounded tw-bg-cover tw-bg-center journey-card"
					:style="{ backgroundImage: `url(${backgroundImg(slide)})` }"
				>
					<div
						class="
							slide
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
						:style="[
							{ 'height': overlayHeight(slide) },
						]"
					>
						<div class="tw-flex tw-flex-col tw-justify-end tw-h-full !tw-gap-1.5">
							<div class="tw-flex tw-items-center tw-gap-1 tw-w-full">
								<img
									class="tw-h-6"
									:src="badgeUrl(slide)"
								>
								<div class="tw-text-primary-inverse">
									<h2 class="tw-text-h3">
										{{ title(slide) }}
									</h2>
									<p
										v-if="subTitle(slide)"
										class="tw-text-small tw-font-medium"
									>
										{{ subTitle(slide) }}
									</p>
								</div>
							</div>
							<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-1.5 md:tw-gap-2.5">
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
									variant="secondary"
								>
									{{ primaryCtaText(slide) }}
								</KvButton>
							</div>
						</div>
					</div>
				</div>
			</template>
		</KvCarousel>
	</div>
</template>

<script setup>
import {
	computed,
	ref,
	watch,
	inject
} from 'vue';
import { useRouter } from 'vue-router';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import { formatUiSetting } from '#src/util/contentfulUtils';
import { defaultBadges } from '#src/util/achievementUtils';
import { KvCarousel, KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';

const PLACEHOLDER_SLIDES_LENGTH = 2;

const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const props = defineProps({
	slides: {
		type: Array,
		default: () => ([]),
	},
	badgesData: {
		type: Array,
		default: () => ([])
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const isLoading = ref(true);
const currentIndex = ref(0);

const getRichTextContent = slide => slide.fields?.richText?.content ?? [];
const getRichTextUiSettingsData = slide => {
	const richTextContent = getRichTextContent(slide);
	const uiSettings = richTextContent.find(
		item => item.nodeType === 'embedded-entry-block'
	);
	const uiSettingsTarget = uiSettings?.data?.target ?? {};
	const uiSettingsData = formatUiSetting(uiSettingsTarget);

	return uiSettingsData?.dataObject ?? {};
};

const orderedSlides = computed(() => {
	let showedSlides = Array(PLACEHOLDER_SLIDES_LENGTH).fill({ milestoneDiff: 0 });
	const achievementSlides = [];

	defaultBadges.forEach(badgeKey => {
		const achievementContent = props.badgesData.find(achievement => badgeKey === achievement.id);
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

			achievementSlides.push({
				...slideData,
				milestoneDiff,
				target: tier.target,
				totalProgressToAchievement: achievementContent.achievementData?.totalProgressToAchievement,
				badgeImgUrl: contentfulData?.imageUrl,
			});
		}
	});

	if (achievementSlides.length > 0) {
		showedSlides = achievementSlides;
	}

	const sortedSlides = showedSlides.sort((a, b) => {
		return a.milestoneDiff - b.milestoneDiff;
	});

	return sortedSlides;
});

const backgroundImg = slide => {
	const richTextContent = getRichTextContent(slide);
	const backgroundImage = richTextContent.find(
		item => item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
	);
	return backgroundImage?.data?.target?.fields?.file?.url || '';
};

const title = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.title || '';
};

const subTitle = slide => `Progress: ${slide.totalProgressToAchievement}/${slide.target} loans complete`;

const badgeUrl = slide => slide?.badgeImgUrl || '';

const primaryCtaText = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.primaryCtaText || '';
};

const goToPrimaryCtaUrl = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	const primaryCtaUrl = richTextUiSettingsData.primaryCtaUrl || '';
	$kvTrackEvent('portfolio', 'click', `primary-cta-${primaryCtaText(slide)}`, richTextUiSettingsData.achievementKey);
	router.push(primaryCtaUrl);
};

const secondaryCtaText = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richTextUiSettingsData.secondaryCtaText || '';
};

const goToSecondaryCtaUrl = slide => {
	const richTextUiSettingsData = getRichTextUiSettingsData(slide);
	const secondaryCtaUrl = richTextUiSettingsData.secondaryCtaUrl || '';
	// eslint-disable-next-line max-len
	$kvTrackEvent('portfolio', 'click', `secondary-cta-${secondaryCtaText(slide)}`, richTextUiSettingsData.achievementKey);
	router.push(secondaryCtaUrl);
};

const showSecondaryCta = slide => secondaryCtaText(slide);

const overlayHeight = slide => {
	return showSecondaryCta(slide) && isMobile.value ? '60%' : '50%';
};

const singleSlideWidth = computed(() => {
	if (isMobile.value) {
		return '90%';
	}
	return '520px';
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

// Watch orderedSlides to update isLoading
watch(orderedSlides, (newSlides, oldSlides) => {
	if (oldSlides && JSON.stringify(oldSlides) !== JSON.stringify(newSlides)) {
		isLoading.value = false;
	}
}, { immediate: true, deep: true });
</script>

<style lang="postcss" scoped>
.journey-card {
	height: 402px;

	@screen md {
		height: 390px;
	}
}

.journey-card-carousel:deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex tw-gap-x-4 tw-py-1.5 tw-w-full tw-overflow-visible;
}

.journey-card-carousel:deep(.kv-carousel__controls > button) {
	@apply tw-w-5 tw-h-5 tw-border-0;

	box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
}

.journey-card-carousel:deep(.kv-carousel__controls > div) {
	@apply tw-hidden;
}

.journey-card-carousel:deep(div:first-child) {
	@apply tw-gap-2;
}

.slide {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgba(0 0 0 / 0%) 100%);
}
</style>
