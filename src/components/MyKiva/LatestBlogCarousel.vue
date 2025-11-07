<template>
	<div>
		<h2 class="tw-text-h3 tw-mb-4">
			Impact in action
		</h2>
		<KvCarousel
			:controls-top-right="controlsTopRight"
			:slide-max-width="singleSlideWidth"
			class="blog-card-carousel tw-w-full tw--mt-8"
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
import useBreakpoints from '#src/composables/useBreakpoints';

const $kvTrackEvent = inject('$kvTrackEvent');

defineProps({
	blogCards: {
		type: Array,
		required: true,
	},
	controlsTopRight: {
		type: Boolean,
		default: false,
	},
});

const { isMedium, isLarge } = useBreakpoints();

const singleSlideWidth = computed(() => {
	if (isLarge.value) {
		return 'calc((100% - 32px) / 3)';
	}
	if (isMedium.value) {
		return '336px';
	}
	return '90%';
});

function trackBlogCard(card) {
	$kvTrackEvent('portfolio', 'click', `Blog-${card.category}`);
}
</script>
<style lang="postcss" scoped>
.slide-gradient {
	background: linear-gradient(0deg, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 100%) 28%, rgb(0 0 0 / 0%) 100%);
}
</style>
