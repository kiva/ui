<template>
	<div
		class="
			tw-rounded md:tw-rounded-xl tw-bg-white
			tw-shadow-lg tw-p-2.5 tw-py-2.5 md:tw-px-2.5 md:tw-py-4
			tw-flex tw-flex-col tw-gap-0 lg:tw-gap-1 print:tw-hidden
			tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<KvLoadingPlaceholder v-if="loading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<HandsPlant
				v-if="!isThanksPage"
				class="lg:tw-mb-1 tw-w-10 lg:tw-w-auto"
			/>

			<h2
				class="tw-px-4 lg:tw-px-0"
				style="line-height: 125%;"
				v-html="titleText"
			>
			</h2>

			<div class="tw-text-base lg:tw-text-subhead tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2">
				{{ subtitleText }}
			</div>

			<ThumbUp
				v-if="isThanksPage"
				class="tw-w-16 tw-h-16 lg:tw-w-auto lg:tw-h-auto"
			/>

			<div
				v-else
				class="tw-w-full tw-flex tw-flex-col lg:tw-flex-row tw-gap-1 lg:tw-gap-2 tw-my-1"
			>
				<GoalSelector />
				<GoalSelector
					:selected="true"
					highlighted-text="More Impact"
				/>
				<GoalSelector />
			</div>

			<KvButton
				class="tw-w-full tw-mt-1.5"
			>
				{{ buttonText }}
			</KvButton>

			<KvButton
				v-if="!isThanksPage"
				variant="ghost"
				class="edit-goal-button tw-w-full"
			>
				Edit goal category
				<KvMaterialIcon
					:icon="mdiPencilOutline"
					class="tw-ml-0.5"
				/>
			</KvButton>
		</template>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { mdiPencilOutline } from '@mdi/js';
import {
	KvMaterialIcon,
	KvButton,
	KvLoadingPlaceholder,
} from '@kiva/kv-components';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.svg';
import ThumbUp from '#src/assets/images/thanks-page/thumbs-up.svg';
import GoalSelector from '#src/components/Thanks/SingleVersion/GoalSelector';

const props = defineProps({
	loading: {
		type: Boolean,
		default: false,
	},
	isThanksPage: {
		type: Boolean,
		default: true,
	},
});

const titleText = computed(() => {
	return props.isThanksPage
		? 'Thank you!'
		: 'Last year, you helped <span class="tw-text-eco-green-3">2 women</span> shape their futures!';
});

const subtitleText = computed(() => {
	return props.isThanksPage
		? 'Your 2026 commitment means more lives transformed!'
		: 'How many loans will you make this year?';
});

const buttonText = computed(() => (props.isThanksPage ? 'Track my progress' : 'Set 2026 goal'));
</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}
</style>
