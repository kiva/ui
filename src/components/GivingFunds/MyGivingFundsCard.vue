<template>
	<div class="tw-rounded tw-bg-white tw-p-2 giving-fund-card">
		<h3>Check in on your giving funds</h3>
		<p class="tw-my-2 tw-font-medium tw-line-clamp-1">
			{{ textCopy }}
		</p>
		<KvButton
			class="tw-w-full"
			variant="primary"
			to="/gfm"
			aria-label="See your giving funds"
			v-kv-track-event="['portfolio', 'click', 'see-your-giving-funds']"
		>
			<div class="tw-flex tw-items-center tw-w-full tw-gap-1">
				<span>See your giving funds</span>
				<KvMaterialIcon
					class="tw-w-3 tw-h-3"
					:icon="mdiArrowTopRight"
				/>
			</div>
		</KvButton>
	</div>
</template>

<script setup>
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';

import {
	computed,
	toRefs,
	defineProps,
} from 'vue';

const props = defineProps({
	count: {
		type: Number,
		required: true,
	},
});

const { count } = toRefs(props);

const textCopy = computed(() => {
	if (count.value === 1) {
		return 'You have 1 fund making an impact.';
	}
	return `You have ${count.value} funds making an impact.`;
});
</script>

<style lang="postcss" scoped>
.giving-fund-card {
	@apply tw-max-w-xs;

	min-width: 353px;
}
</style>
