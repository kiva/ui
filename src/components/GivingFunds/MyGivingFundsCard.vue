<template>
	<div
		class="giving-fund-card tw-rounded tw-bg-white tw-p-2 tw-w-full tw-flex tw-flex-col tw-gap-2 tw-items-stretch
			md:tw-flex-row md:tw-items-center md:tw-justify-between md:tw-gap-3 md:tw-p-2.5"
	>
		<h3 class="tw-text-center md:tw-text-left md:tw-flex-1">
			Check in on your giving funds
		</h3>
		<p class="tw-font-medium tw-text-center md:tw-text-left md:tw-flex-1">
			{{ textCopy }}
		</p>
		<KvButton
			class="tw-w-full md:tw-w-auto md:tw-ml-auto"
			variant="primary"
			to="/gfm"
			aria-label="See your giving funds"
			v-kv-track-event="['portfolio', 'click', 'see-your-giving-funds']"
		>
			<div class="tw-flex tw-items-center tw-w-full tw-gap-1 md:tw-w-auto">
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
	let copy = '';
	if (myFundsCount.value > 0 && contributedFundsCount.value > 0) {
		copy = `You have ${myFundsCount.value} ${
			myFundsCount.value === 1 ? 'fund' : 'funds'
		} making an impact and have contributed to ${contributedFundsCount.value} ${
			contributedFundsCount.value === 1 ? 'fund' : 'funds'
		}.`;
	} else if (contributedFundsCount.value > 0) {
		copy = `You have contributed to ${contributedFundsCount.value} ${
			contributedFundsCount.value === 1 ? 'fund' : 'funds'
		}.`;
	} else if (myFundsCount.value > 0) {
		copy = `You have ${myFundsCount.value} ${
			myFundsCount.value === 1 ? 'fund' : 'funds'
		} making an impact.`;
	}
	return copy;
});
</script>

<style lang="postcss" scoped>
.giving-fund-card {
	@apply tw-w-full;
}
</style>
