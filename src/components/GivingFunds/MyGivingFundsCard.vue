<template>
	<div
		class="giving-fund-card tw-rounded tw-bg-white tw-p-2 tw-w-full tw-flex tw-flex-col tw-gap-2 tw-items-stretch
			md:tw-flex-row md:tw-items-center md:tw-justify-between md:tw-gap-3 md:tw-p-2.5"
	>
		<h2 class="tw-text-center md:tw-text-left md:tw-flex-1 !tw-text-title">
			{{ titleCopy }}
		</h2>
		<div class="tw-text-center md:tw-text-left md:tw-flex-1">
			<transition name="kvfade">
				<p v-if="textCopy">
					{{ textCopy }}
				</p>
			</transition>
		</div>
		<KvButton
			class="tw-w-full md:tw-w-auto md:tw-ml-auto"
			variant="primary"
			:to="ctaTo"
			:aria-label="ctaCopy"
			v-kv-track-event="clickTrackEventProps"
		>
			<div class="tw-flex tw-items-center tw-w-full tw-gap-1 md:tw-w-auto">
				<span>{{ ctaCopy }}</span>
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
import { givingFundIds } from '#src/util/givingFundUtils';

import {
	computed,
	inject,
	ref,
	onMounted,
} from 'vue';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	userId: {
		type: [String, Number],
		required: false,
		default: null,
	},
	/**
	 * Whether the lender's only giving fund activity is supporting the disaster
	 * relief fund; renders the fund-specific variant of the card
	 */
	isDisasterReliefOnly: {
		type: Boolean,
		default: false,
	},
});

const {
	getFundsContributedToIds,
	fetchMyGivingFundsCount,
} = useGivingFund(apollo);

const myFundsCount = ref(0);
const contributedFundsCount = ref(0);

const titleCopy = computed(() => (props.isDisasterReliefOnly
	? 'Check in on the Colombia earthquake recovery fund'
	: 'Check in on your giving funds'));

const ctaCopy = computed(() => (props.isDisasterReliefOnly ? 'View fund' : 'See your giving funds'));

const ctaTo = computed(() => (
	props.isDisasterReliefOnly ? `/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}` : '/gfm'
));

const clickTrackEventProps = computed(() => (props.isDisasterReliefOnly
	? ['portfolio', 'click', 'see-your-giving-funds', 'disaster-relief']
	: ['portfolio', 'click', 'see-your-giving-funds']));

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
	if (props.isDisasterReliefOnly) {
		$kvTrackEvent?.('portfolio', 'view', 'see-your-giving-funds', 'disaster-relief');
		return;
	}

	// Fetch giving fund data
	fetchMyGivingFundsCount()
		.then(response => {
			myFundsCount.value = response?.givingFunds?.totalCount ?? 0;
		});

	getFundsContributedToIds(parseInt(props?.userId, 10) || null)
		.then(fundIds => {
			contributedFundsCount.value = fundIds?.length ?? 0;
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
