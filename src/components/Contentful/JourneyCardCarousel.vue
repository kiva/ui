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
			:key="slides.length"
			:embla-options="{
				loop: false,
				align: slidesAligmment,
				slidesToScroll,
			}"
			:multiple-slides-visible="true"
			class="journey-card-carousel tw-w-full md:tw-overflow-visible"
		>
			<template
				v-for="(slide, index) in slides"
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
						class="slide tw-absolute tw-w-full tw-bottom-0 tw-pb-1.5 tw-px-1.5 tw-align-bottom tw-rounded-b"
						:style="[
							{ 'height': overlayHeight(slide) },
						]"
					>
						<div class="tw-flex tw-flex-col tw-justify-end tw-h-full">
							<div class="tw-flex tw-items-center tw-gap-1 tw-w-full tw-mb-1.5">
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
										class="tw-text-small"
									>
										{{ subTitle(slide) }}
									</p>
								</div>
							</div>
							<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-1.5 md:tw-gap-2.5">
								<button
									v-if="showSecondaryCta(slide)"
									:to="secondaryCtaUrl(slide)"
									variant="tertiary"
									class="tw-inline-flex tw-justify-center tw-items-center tw-rounded tw-py-1 tw-px-3
									tw-border tw-border-white tw-font-medium tw-text-center tw-text-white"
								>
									{{ secondaryCtaText(slide) }}
								</button>
								<KvButton
									:to="primaryCtaUrl(slide)"
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
import { computed } from 'vue';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import { formatUiSetting } from '#src/util/contentfulUtils';
import { KvCarousel, KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';

defineProps({
	isLoading: {
		type: Boolean,
		default: false,
	},
	slides: {
		type: Array,
		default: () => ([{}, {}]),
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const slidesAligmment = computed(() => {
	return isMobile.value ? 'start' : 'center';
});

const slidesToScroll = computed(() => {
	return isMobile.value ? 1 : 2;
});

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

const backgroundImg = slide => {
	const richTextContent = getRichTextContent(slide);
	const backgroundImage = richTextContent.find(
		item => item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url
	);
	return backgroundImage?.data?.target?.fields?.file?.url || '';
};
const title = slide => {
	const richtTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richtTextUiSettingsData.title || '';
};
const subTitle = slide => {
	const richtTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richtTextUiSettingsData.subtitle || '';
};
const badgeUrl = slide => slide?.badgeUrl || '';
const primaryCtaText = slide => {
	const richtTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richtTextUiSettingsData.primaryCtaText || '';
};
const primaryCtaUrl = slide => {
	const richtTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richtTextUiSettingsData.primaryCtaUrl || '';
};
const secondaryCtaText = slide => {
	const richtTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richtTextUiSettingsData.secondaryCtaText || '';
};
const secondaryCtaUrl = slide => {
	const richtTextUiSettingsData = getRichTextUiSettingsData(slide);
	return richtTextUiSettingsData.secondaryCtaUrl || '';
};

const showSecondaryCta = slide => secondaryCtaText(slide) && secondaryCtaUrl(slide);
const overlayHeight = slide => {
	return showSecondaryCta(slide) && isMobile.value ? '60%' : '50%';
};
</script>

<style lang="postcss" scoped>
.journey-card {
	width: 322px;
	height: 402px;

	@screen md {
		width: 520px;
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

.slide {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgba(0 0 0 / 0%) 100%);
}
</style>
