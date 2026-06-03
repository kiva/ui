<template>
	<div
		ref="cardElement"
		class="tw-bg-white tw-rounded tw-shadow tw-flex tw-flex-col tw-h-full tw-overflow-hidden tw-relative"
	>
		<span
			class="tw-inline-flex tw-items-center tw-gap-1
				tw-rounded tw-bg-eco-green-1 tw-px-1.5 tw-py-1
				tw-absolute tw-m-2.5 tw-z-1 tw-text-small"
		>
			<KvMaterialIcon
				:icon="mdiCircleSlice7"
				class="tw-w-2.5 tw-h-2.5 tw-align-middle"
				style="color: #CE4A00;"
			/>
			<span class="tw-font-medium tw-align-middle" style="color: #CE4A00;">
				Almost funded!
			</span>
		</span>

		<div
			:style="{ backgroundImage: `url(${cardBg})` }"
			class="tw-w-full tw-bg-center tw-bg-cover tw-relative tw-flex-1
				tw-flex tw-items-center tw-justify-center tw-p-4 tw-pt-8"
			style="min-height: 180px;"
		>
			<img
				:src="borrowerSvg"
				alt="Almost funded borrower"
				class="tw-max-h-full tw-object-contain"
			>
		</div>

		<div class="tw-p-2 tw-pt-0 tw-flex tw-flex-col tw-gap-2">
			<h3
				class="tw-text-title tw-text-2xl tw-font-medium tw-text-primary
					tw-leading-tight tw-text-center tw-pb-0.5 tw-px-1"
			>
				Help these borrowers over the finish line
			</h3>

			<KvButton
				variant="secondary"
				class="tw-w-full"
				@click="handleClick"
			>
				See almost funded loans
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	onBeforeUnmount,
	inject,
} from 'vue';
import { mdiCircleSlice7 } from '@mdi/js';
import { KvMaterialIcon, KvButton } from '@kiva/kv-components';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import cardBg from '#src/assets/images/my-kiva/almost-funded-card-bg.png';
import borrowerSvg from '#src/assets/images/my-kiva/almost-funded-borrower.svg?url';

defineOptions({ name: 'AlmostFundedNextStep' });

const $kvTrackEvent = inject('$kvTrackEvent');
const cardElement = ref(null);
let disconnectObserver = null;

const handleClick = () => {
	$kvTrackEvent('portfolio', 'click', 'next-step-almost-funded');
	window.location.href = '/lend/filter?sortBy=amountLeft';
};

onMounted(() => {
	const { delayUntilVisible, disconnect } = useDelayUntilVisible();
	delayUntilVisible(() => {
		$kvTrackEvent('portfolio', 'view', 'next-step-almost-funded');
	}, [cardElement.value]);
	disconnectObserver = disconnect;
});

onBeforeUnmount(() => {
	if (disconnectObserver) disconnectObserver();
});
</script>
