<template>
	<div
		v-if="showCard"
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
			:key="`giving-funds-cta-${isDisasterReliefOnly}`"
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
	watch,
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
	 * When true (MyKiva), the card is not rendered at all for lenders whose only
	 * giving fund activity is supporting the disaster relief fund
	 */
	hideDisasterReliefOnly: {
		type: Boolean,
		default: false,
	},
});

const {
	getFundsContributedToIds,
	fetchMyGivingFundsCount,
} = useGivingFund(apollo);

const myFundsCount = ref(0);
const contributedFundIds = ref([]);
const fundsCountLoaded = ref(false);
const contributedFundsLoaded = ref(false);

const contributedFundsCount = computed(() => contributedFundIds.value.length);

const dataLoaded = computed(() => fundsCountLoaded.value && contributedFundsLoaded.value);

// Lender supports the disaster relief fund and no other giving funds
const isDisasterReliefOnly = computed(() => dataLoaded.value
	&& myFundsCount.value === 0
	&& contributedFundIds.value.length === 1
	&& contributedFundIds.value[0] === givingFundIds.COLOMBIA_DISASTER_RELIEF);

const showCard = computed(() => {
	if (!props.hideDisasterReliefOnly) {
		return true;
	}
	// Wait for fund data so the card never flashes in before being hidden
	return dataLoaded.value && !isDisasterReliefOnly.value;
});

const titleCopy = computed(() => (isDisasterReliefOnly.value
	? 'Check in on the Colombia earthquake recovery fund'
	: 'Check in on your giving funds'));

const ctaCopy = computed(() => (isDisasterReliefOnly.value ? 'View fund' : 'See your giving funds'));

const ctaTo = computed(() => (
	isDisasterReliefOnly.value ? `/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}` : '/gfm'
));

const clickTrackEventProps = computed(() => (isDisasterReliefOnly.value
	? ['portfolio', 'click', 'see-your-giving-funds', 'disaster-relief']
	: ['portfolio', 'click', 'see-your-giving-funds']));

const textCopy = computed(() => {
	let copy = '';
	if (isDisasterReliefOnly.value) {
		return copy;
	}
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

let viewEventTracked = false;

watch(isDisasterReliefOnly, value => {
	// Track views of the disaster relief variant, which only renders when not hidden (MP-3121)
	if (value && !props.hideDisasterReliefOnly && !viewEventTracked) {
		viewEventTracked = true;
		$kvTrackEvent?.('portfolio', 'view', 'see-your-giving-funds', 'disaster-relief');
	}
});

onMounted(() => {
	// Fetch giving fund data
	fetchMyGivingFundsCount()
		.then(response => {
			myFundsCount.value = response?.givingFunds?.totalCount ?? 0;
		})
		.finally(() => {
			fundsCountLoaded.value = true;
		});

	getFundsContributedToIds(parseInt(props?.userId, 10) || null)
		.then(fundIds => {
			contributedFundIds.value = fundIds ?? [];
		})
		.finally(() => {
			contributedFundsLoaded.value = true;
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
