<template>
	<div>
		<div
			v-if="!isMobile"
			class="tw-grid tw-grid-cols-1 tw-gap-4"
			:class="gridColsClass"
		>
			<component
				v-for="(item, index) in items"
				:key="item.key || index"
				:is="item.component"
				v-bind="item.props"
				v-on="item.events || {}"
			/>
		</div>
		<div
			v-else
			class="carousel"
			:class="{ 'carousel-single': items.length === 1 }"
		>
			<KvCarousel
				:key="items.length"
				:embla-options="{
					loop: false,
					align: 'start',
				}"
				controls-top-right
				:slide-max-width="slideMaxWidth"
				:multiple-slides-visible="true"
				class="tw-w-full"
			>
				<template
					v-for="(item, index) in items"
					#[`slide${index}`]
					:key="item.key || index"
				>
					<component
						:is="item.component"
						v-bind="item.props"
						v-on="item.events || {}"
					/>
				</template>
			</KvCarousel>
		</div>
	</div>
</template>

<script setup>
import { KvCarousel } from '@kiva/kv-components';
import useBreakpoints from '#src/composables/useBreakpoints';

defineOptions({ name: 'MyKivaCardGrid' });

defineProps({
	items: {
		type: Array,
		default: () => [],
		validator: items => items.every(item => item.component),
	},
	gridColsClass: {
		type: String,
		default: 'md:tw-grid-cols-2 lg:tw-grid-cols-3',
	},
	slideMaxWidth: {
		type: String,
		default: '90%',
	},
});

const { isMobile } = useBreakpoints();
</script>

<style lang="postcss" scoped>
.carousel-single > :deep(section > div > div) {
	@apply !tw-min-w-full;
}

.carousel,
.carousel > :deep(section),
.carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full tw-mt-0;
}

.carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden;
}

.carousel :deep(.kv-carousel) {
	@apply tw-pt-0;
}
</style>
