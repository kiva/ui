<template>
	<div
		class="tw-w-full tw-relative tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col
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
			<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
				Your latest loan
			</span>
		</span>
		<KvMap
			class="tw-rounded tw-overflow-hidden !tw-pb-0 tw-z-base"
			style="height: 165px;"
			:use-leaflet="true"
			:lat="mapLat"
			:long="mapLong"
			:zoom-level="2.5"
			:allow-dragging="false"
			:show-labels="false"
			:countries-data="countriesData"
			:default-base-color="defaultBaseColor"
			:show-tooltips="false"
		/>
		<div class="tw-relative tw-flex tw-justify-center tw-z-1">
			<KvBorrowerImage
				class="bp-image tw-object-cover tw-rounded-full tw-border-4 tw-border-white
					tw-absolute tw--top-5 tw-drop-shadow-md"
				:alt="name"
				:hash="hash"
				:aspect-ratio="1 / 1"
				:default-image="{ width: 80 }"
				:images="[{ width: 80 }]"
				:photo-path="$appConfig.photoPath"
			/>
		</div>
		<div class="tw-flex tw-flex-col tw--mt-3.5 tw-justify-between tw-grow">
			<div>
				<h3>
					Step closer to {{ borrowerName }} story
				</h3>
				<p class="tw-font-medium tw-text-base tw-pt-0.5">
					See how your loan improves {{ pronoun }}.
				</p>
			</div>
			<KvButton
				variant="secondary"
				v-kv-track-event="['portfolio', 'click', 'next-step-impact-education']"
				class="tw-w-full tw-mt-1"
				@click="openModal"
			>
				View impact insights
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import {
	KvMaterialIcon, KvButton, KvBorrowerImage, KvMap,
} from '@kiva/kv-components';
import { mdiEarth } from '@mdi/js';
import { computed, inject, onMounted } from 'vue';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import kvTokensPrimitives from '@kiva/kv-tokens';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	loan: {
		type: Object,
		default: () => ({}),
	},
});

const defaultBaseColor = kvTokensPrimitives.colors?.brand[200] || null;

const mapLat = computed(() => {
	return props.loan?.geocode?.country?.geocode?.latitude || 0;
});

const mapLong = computed(() => {
	return props.loan?.geocode?.country?.geocode?.longitude || 0;
});

const pronoun = computed(() => {
	if (props.loan?.borrowerCount > 1 || props.loan?.themes?.includes('Social Enterprise')) {
		return 'their lives';
	}
	if (props.loan?.gender === 'male') {
		return 'him live';
	}
	return 'her live';
});

const borrowerName = computed(() => {
	return formatPossessiveName(props.loan?.name) || 'this borrower';
});

const name = computed(() => {
	return props.loan?.name || '';
});

const hash = computed(() => {
	return props.loan?.image?.hash || '';
});

const countriesData = computed(() => {
	return [{
		isoCode: props.loan?.geocode?.country?.isoCode || '',
		label: props.loan?.geocode?.country?.name || '',
		value: 100,
		lat: mapLat.value,
		long: mapLong.value,
	}];
});

const openModal = () => {
	// TODO: Implement modal opening logic
};

onMounted(() => {
	$kvTrackEvent('portfolio', 'view', 'next-step-impact-education');
});
</script>

<style lang="postcss" scoped>
:deep(#kv-map-holder-0), :deep(#kv-map-holder-0 div), :deep(.maplibregl-canvas) {
	height: 165px !important;
}

.bp-image, :deep(.bp-image img) {
	@apply !tw-pb-0;

	width: 78px;
	height: 78px;
}
</style>
