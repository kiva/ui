<template>
	<section class="tw-mt-10">
		<h2 class="tw-text-h3 tw-mb-4">
			Impact in action
		</h2>
		<KvCarousel
			:slide-max-width="'336px'"
			:multiple-slides-visible="true"
			class="blog-card-carousel tw-w-full"
		>
			<template v-for="(card, idx) in blogCards" #[`slide${idx}`] :key="card.slug || idx">
				<BlogCard
					:image="card.image"
					:category="card.category"
					:title="card.title"
					:date="card.date"
					:slug="card.slug"
					@track="trackBlogCard({ title: card.title, slug: card.slug, category: card.category })"
				/>
			</template>
		</KvCarousel>
	</section>
</template>

<script setup>
import { KvCarousel } from '@kiva/kv-components';
import BlogCard from '#src/components/MyKiva/BlogCard';
import { inject, watch } from 'vue';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	blogCards: {
		type: Array,
		required: true,
	},
});

watch(
	() => props.blogCards,
	newVal => {
		console.log('blogCards changed :', newVal);
	},
	{ deep: true }
);

function trackBlogCard({ title, slug, category }) {
	// Replace with your actual tracking function
	if (typeof $kvTrackEvent === 'function') {
		$kvTrackEvent('blog-carousel', 'click-card', `${category}:${title}`, slug);
	}
}
</script>
