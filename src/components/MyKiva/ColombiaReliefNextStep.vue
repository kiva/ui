<template>
	<div
		ref="cardElement"
		class="next-step-card tw-w-full tw-relative tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col
			tw-bg-white tw-shrink-0 tw-overflow-hidden tw-h-full tw-select-none"
	>
		<span
			class="tw-inline-flex tw-items-center tw-gap-1 tw-mb-2
						tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5
						tw-absolute tw-top-2.5 tw-left-2.5 tw-z-1"
		>
			<KvMaterialIcon
				class="tw-w-2 tw-h-2 tw-shrink-0"
				:icon="mdiEarth"
			/>
			<span class="tw-text-primary tw-text-label tw-align-middle">
				Support today
			</span>
		</span>
		<div class="tw-rounded tw-overflow-hidden !tw-pb-0 tw-z-base">
			<img
				:src="colombiaEarthquake"
				alt="Photo of disaster relief worker in Colombia"
				class="tw-rounded tw-object-cover tw-aspect-square tw-w-full"
				style="height: 211px;"
			>
		</div>
		<div class="tw-relative tw-flex tw-justify-center tw-z-1">
			<img
				:src="colombiaFlag"
				alt="Flag of Colombia"
				class="circle-icon tw-object-cover tw-rounded-full tw-border-4 tw-border-white
					tw-absolute tw--top-5 tw-drop-shadow-md"
			>
		</div>
		<div class="tw-flex tw-flex-col tw-justify-end tw-grow tw-pt-5">
			<h3 class="tw-text-h4 tw-text-primary tw-text-center tw-pb-0.5 tw-px-1">
				Support Colombia earthquake disaster relief
			</h3>
			<KvButton
				variant="secondary"
				class="tw-w-full tw-mt-1"
				@click="handleClick"
			>
				<span class="tw-inline-flex tw-items-center tw-justify-center tw-gap-1">
					Go to fundraiser
					<KvMaterialIcon class="tw-w-2.5 tw-h-2.5" :icon="mdiArrowRight" />
				</span>
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import {
	KvMaterialIcon, KvButton,
} from '@kiva/kv-components';
import { mdiEarth, mdiArrowRight } from '@mdi/js';
import {
	ref,
	onMounted,
	onBeforeUnmount,
	inject,
} from 'vue';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import { givingFundIds } from '#src/util/givingFundUtils';
import { MY_KIVA_CARD_HEIGHT } from '#src/util/myKivaUtils';
import colombiaFlag from '#src/assets/images/my-kiva/colombia-recovery-fund.jpg';
import colombiaEarthquake from '#src/assets/images/my-kiva/colombia-earthquake-recovery-fund.jpg';

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

<style lang="postcss" scoped>
.circle-icon, :deep(.circle-icon img) {
	@apply !tw-pb-0 !tw--mt-0.5 tw-w-10 tw-h-10;
}

.next-step-card {
	@screen md {
		min-height: v-bind('`${MY_KIVA_CARD_HEIGHT}px`');
	}
}
</style>
