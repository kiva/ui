<template>
	<div>
		<h2 class="tw-text-h3 tw-mb-4">
			Impact in action
		</h2>
		<KvCarousel
			:slide-max-width="singleSlideWidth"
			class="blog-card-carousel tw-w-full"
			:embla-options="{
				loop: false,
				align: 'start',
			}"
			:multiple-slides-visible="true"
		>
			<template v-for="(card, idx) in blogCards" #[`slide${idx}`] :key="card.slug || idx">
				<BlogCard
					:image="card.image"
					:category="card.category"
					:title="card.title"
					:date="card.date"
					:slug="card.slug"
					@track="() => trackBlogCard(card)"
				/>
			</template>
		</KvCarousel>
	</div>
</template>

<script setup>
import { KvCarousel } from '@kiva/kv-components';
import BlogCard from '#src/components/MyKiva/BlogCard';
import { inject, computed } from 'vue';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';

const $kvTrackEvent = inject('$kvTrackEvent');

defineProps({
	blogCards: {
		type: Array,
		required: true,
	},
});

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const singleSlideWidth = computed(() => {
	if (isMobile.value) {
		return '90%';
	}
	return '336px';
});

function trackBlogCard(card) {
	$kvTrackEvent('portfolio', 'click', `Blog-${card.category}`);
}
</script>
<style lang="postcss" scoped>

.blog-card-carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex tw-justify-start tw-mt-2;
}

.blog-card-carousel :deep(.kv-carousel__controls) div {
	@apply tw-invisible tw-mx-0 tw-w-2;
}

.blog-card-carousel:deep(div:first-child) {
	@apply tw-gap-2 lg:tw-gap-4;
}

.slide-gradient {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgb(0 0 0 / 0%) 100%);
}
</style>
