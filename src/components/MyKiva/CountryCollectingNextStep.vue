<template>
	<div
		v-if="recommendedRegion"
		ref="cardElement"
		class="tw-bg-white tw-rounded tw-shadow tw-flex tw-flex-col tw-h-full tw-overflow-hidden tw-relative"
	>
		<span
			class="tw-inline-flex tw-items-center tw-gap-1
				tw-rounded tw-bg-eco-green-1 tw-px-1.5 tw-py-1
				tw-absolute tw-m-2.5 tw-z-1 tw-text-small"
		>
			<KvMaterialIcon
				:icon="mdiEarth"
				class="tw-w-2.5 tw-h-2.5 tw-align-middle"
			/>
			<span class="tw-text-primary tw-font-medium tw-align-middle">
				Make a global impact
			</span>
		</span>

		<div class="tw-w-full tw-relative tw-p-2" style="height: 250px;">
			<div
				:style="{ backgroundImage: `url(${regionImage})` }"
				class="tw-w-full tw-h-full tw-bg-center tw-bg-cover tw-bg-no-repeat tw-rounded"
			></div>
		</div>

		<div class="tw-p-2 tw-flex tw-flex-col tw-gap-2 tw-mt-auto">
			<h3 class="tw-text-2xl tw-font-medium tw-text-primary tw-leading-tight tw-pb-0.5 tw-px-1">
				Help your first person in {{ recommendedRegion.name }}
			</h3>

			<KvButton
				variant="secondary"
				class="tw-w-full"
				@click="handleClick"
			>
				Support a new region
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import {
	computed,
	ref,
	onMounted,
	onBeforeUnmount,
	inject,
} from 'vue';
import { mdiEarth } from '@mdi/js';
import { KvMaterialIcon, KvButton } from '@kiva/kv-components';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';

import Africa from '#src/assets/images/my-kiva/Africa.png';
import Asia from '#src/assets/images/my-kiva/Asia.png';
import CentralAmerica from '#src/assets/images/my-kiva/Central America.png';
import EasternEurope from '#src/assets/images/my-kiva/Eastern Europe.png';
import MiddleEast from '#src/assets/images/my-kiva/Middle East.png';
import NorthAmerica from '#src/assets/images/my-kiva/North America.png';
import Oceania from '#src/assets/images/my-kiva/Oceania.png';
import SouthAmerica from '#src/assets/images/my-kiva/South America.png';

defineOptions({ name: 'CountryCollectingNextStep' });

const props = defineProps({
	regionsData: {
		type: Array,
		default: () => [],
	},
});

const REGION_PRIORITY = [
	'Africa',
	'Asia',
	'South America',
	'Central America',
	'Oceania',
	'Middle East',
	'Eastern Europe',
	'North America',
];

const regionImages = {
	Africa,
	Asia,
	'Central America': CentralAmerica,
	'Eastern Europe': EasternEurope,
	'Middle East': MiddleEast,
	'North America': NorthAmerica,
	Oceania,
	'South America': SouthAmerica,
};

const $kvTrackEvent = inject('$kvTrackEvent');
const cardElement = ref(null);
let disconnectObserver = null;

const recommendedRegion = computed(() => {
	let found = null;
	REGION_PRIORITY.some(regionName => {
		const region = props.regionsData.find(r => r.name === regionName && !r.hasLoans);
		if (region) {
			found = region;
			return true;
		}
		return false;
	});
	return found;
});

const regionImage = computed(() => regionImages[recommendedRegion.value?.name] || '');

const handleClick = () => {
	const region = recommendedRegion.value;
	if (!region) return;
	$kvTrackEvent('portfolio', 'click', 'next-step-intro-lending-stats', region.name);
	window.location.href = `/lend/filter?country=${region.countries.join(',')}`;
};

onMounted(() => {
	if (!recommendedRegion.value) return;
	const { delayUntilVisible, disconnect } = useDelayUntilVisible();
	delayUntilVisible(() => {
		$kvTrackEvent('portfolio', 'view', 'next-step-intro-lending-stats', recommendedRegion.value?.name);
	}, [cardElement.value]);
	disconnectObserver = disconnect;
});

onBeforeUnmount(() => {
	if (disconnectObserver) disconnectObserver();
});
</script>
