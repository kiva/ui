<template>
	<div
		ref="cardElement"
		class="tw-bg-white tw-rounded tw-shadow tw-flex tw-flex-col tw-h-full tw-overflow-hidden tw-relative"
	>
		<span
			class="tw-inline-flex tw-items-center tw-gap-1
				tw-absolute tw-m-2.5 tw-z-1 tw-text-label tw-text-primary"
		>
			<!-- Kiva K logo, same white-on-brand-green treatment SupporterDetails uses -->
			<span
				class="tw-w-3 tw-h-3 tw-rounded-full tw-bg-brand
					tw-flex tw-items-center tw-justify-center tw-shrink-0"
			>
				<img :src="kivaKUrl" alt="Kiva logo" class="tw-h-1.5">
			</span>
			<span class="tw-align-middle">
				Recovery fund
			</span>
		</span>

		<div
			class="tw-w-full tw-relative tw-flex-1
				tw-flex tw-items-center tw-justify-center tw-p-4 tw-pt-8"
			style="min-height: 180px;"
		>
			<img
				:src="colombiaFlag"
				alt="Flag of Colombia"
				class="tw-rounded-full tw-object-cover tw-aspect-square"
				style="width: 116px;"
			>
		</div>

		<div class="tw-p-2 tw-pt-0 tw-flex tw-flex-col tw-gap-2">
			<h3 class="tw-text-h4 tw-text-primary tw-text-center tw-pb-0.5 tw-px-1">
				Donate to communities impacted by the Colombia earthquake
			</h3>

			<KvButton
				variant="secondary"
				class="tw-w-full"
				@click="handleClick"
			>
				Donate
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
import { KvButton } from '@kiva/kv-components';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import { givingFundIds } from '#src/util/givingFundUtils';
import colombiaFlag from '#src/assets/images/my-kiva/colombia-recovery-fund.jpg';
import kivaKUrl from '#src/assets/images/kiva_k.svg?url';

defineOptions({ name: 'ColombiaReliefNextStep' });

const $kvTrackEvent = inject('$kvTrackEvent');
const cardElement = ref(null);
let disconnectObserver = null;

const handleClick = () => {
	$kvTrackEvent('portfolio', 'click', 'next-step-co-recovery-fund');
	window.location.href = `/gf/${givingFundIds.COLOMBIA_DISASTER_RELIEF}`;
};

onMounted(() => {
	const { delayUntilVisible, disconnect } = useDelayUntilVisible();
	delayUntilVisible(() => {
		$kvTrackEvent('portfolio', 'view', 'next-step-co-recovery-fund');
	}, [cardElement.value]);
	disconnectObserver = disconnect;
});

onBeforeUnmount(() => {
	if (disconnectObserver) disconnectObserver();
});
</script>
