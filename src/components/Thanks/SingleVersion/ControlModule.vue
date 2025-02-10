<template>
	<div
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8
			tw-py-4 tw-flex tw-flex-col tw-text-center tw-gap-3 tw-mb-2.5"
	>
		<div
			class="
				tw-flex
				tw-flex-col
				tw-items-center
				tw-gap-1.5
				tw-text-center
				tw-overflow-hidden
				print:tw-hidden
				tw-relative
				tw-justify-between
			"
		>
			<h2 v-html="title" class="tw-text-center" style="line-height: 1.25;"></h2>
			<div class="tw-relative">
				<BgRays style="top: -70px; left: -30px" />
				<Globe class="tw-z-1 tw-my-2" style="width: 194px; height: 189px;" />
			</div>
			<KvButton
				class="tw-w-full"
				@click="emit('continue')"
			>
				<div class="tw-flex tw-items-center tw-gap-1">
					Continue
					<KvMaterialIcon
						class="tw-w-2 tw-h-2"
						:icon="mdiArrowRight"
					/>
				</div>
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import Globe from '#src/assets/inline-svgs/thanks/globe.svg';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowRight } from '@mdi/js';
import BgRays from '#src/components/Thanks/BgRays';

defineEmits(['continue']);

const props = defineProps({
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	onlyKivaCards: {
		type: Boolean,
		default: false,
	},
});

const title = computed(() => {
	const msg = 'Stay up to date with your lending history, stats, and more';
	return props.isOptedIn && !props.onlyKivaCards
		? `Thank you!<br>${msg}.`
		: `${msg}!`;
});

</script>
