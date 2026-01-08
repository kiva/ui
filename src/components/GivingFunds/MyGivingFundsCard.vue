<template>
	<div
		class="giving-fund-card tw-rounded tw-bg-white tw-p-2 tw-w-full tw-flex tw-flex-col tw-gap-2 tw-items-stretch
			md:tw-flex-row md:tw-items-center md:tw-justify-between md:tw-gap-3 md:tw-p-2.5"
	>
		<h3 class="tw-text-center md:tw-text-left md:tw-flex-1">
			Check in on your giving funds
		</h3>
		<div class="tw-font-medium tw-text-center md:tw-text-left md:tw-flex-1">
			<transition name="kvfade">
				<p v-if="textCopy">
					{{ textCopy }}
				</p>
			</transition>
		</div>
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
import useGivingFund from '#src/composables/useGivingFund';

import {
	computed,
	inject,
	ref,
	onMounted,
} from 'vue';

const apollo = inject('apollo');

const props = defineProps({
	userId: {
		type: [String, Number],
		required: false,
		default: null,
	},
});

const {
	getFundsContributedToIds,
	fetchMyGivingFundsCount,
} = useGivingFund(apollo);

const myFundsCount = ref(0);
const contributedFundsCount = ref(0);

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

onMounted(() => {
	// Fetch giving fund data
	fetchMyGivingFundsCount()
		.then(response => {
			myFundsCount.value = response.givingFunds.totalCount;
		});

	getFundsContributedToIds(parseInt(props?.userId, 10) || null)
		.then(fundIds => {
			contributedFundsCount.value = fundIds.length;
		});
});
</script>

<style lang="postcss" scoped>
.kvfade-enter-active,
.kvfade-leave-active {
	transition: opacity 0.8s ease;
}

.kvfade-enter-from,
.kvfade-leave-to {
	opacity: 0;
}
</style>
