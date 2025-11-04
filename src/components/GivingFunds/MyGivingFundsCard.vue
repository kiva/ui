<template>
	<div class="tw-rounded tw-bg-white tw-p-2 giving-fund-card">
		<h3>Check in on your giving funds</h3>
		<p class="tw-my-2 tw-font-medium">
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
	myFundsCount: {
		type: Number,
		required: true,
	},
	contributedFundsCount: {
		type: Number,
		required: true,
	},
});

const { myFundsCount, contributedFundsCount } = toRefs(props);

const textCopy = computed(() => {
	let copy = `You have ${myFundsCount.value} ${
		myFundsCount.value === 1 ? 'fund' : 'funds'
	} making an impact`;

	if (contributedFundsCount.value > 0) {
		copy += ` and have contributed to ${contributedFundsCount.value} ${
			contributedFundsCount.value === 1 ? 'fund' : 'funds'
		}`;
	}
	return `${copy}.`;
});
</script>

<style lang="postcss" scoped>
.giving-fund-card {
	@apply tw-max-w-xs;

	min-width: 353px;
}
</style>
