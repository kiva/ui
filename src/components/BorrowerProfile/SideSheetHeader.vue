<template>
	<div>
		<div class="tw-relative !tw-overflow-y-hidden !tw-p-0">
			<KvLoadingPlaceholder v-if="loading" style="aspect-ratio: 8 / 5" class="tw-w-full tw-h-full" />
			<KvBorrowerImage
				v-else
				class="tw-w-full tw-bg-black lg:tw-rounded tw--mb-1.5 md:tw--mb-1"
				:alt="name"
				:hash="hash"
				:aspect-ratio="5 / 8"
				:photo-path="photoPath"
				:default-image="{ width: 480 }"
				:images="[
					{ width: 480, viewSize: 1024 },
					{ width: 480, viewSize: 768 },
					{ width: 416, viewSize: 480 },
					{ width: 374, viewSize: 414 },
					{ width: 335, viewSize: 375 },
				]"
			/>
			<div
				v-if="!loading"
				class="tw-flex tw-items-center tw-gap-1 tw-rounded-full tw-px-1 tw-py-0.5
				tw-bg-white tw-absolute tw-bottom-1 md:tw-bottom-2 tw-left-2"
			>
				<KvMaterialIcon :icon="mdiMapMarker" class="tw-text-primary tw-w-2 tw-h-2" />
				<h5 style="line-height: 1;">
					{{ country }}
				</h5>
			</div>
		</div>
		<KvLoadingPlaceholder v-if="loading" class="!tw-w-1/2 lg:!tw-w-full tw-mx-auto tw-mt-3" style="height: 3rem;" />
		<h1 v-else class="tw-text-h2 tw-text-center tw-py-2 tw-px-2.5 lg:tw-px-0">
			{{ name }}
		</h1>
	</div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { mdiMapMarker } from '@mdi/js';
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';

import { KvBorrowerImage, KvLoadingPlaceholder, KvMaterialIcon } from '@kiva/kv-components';

const $appConfig = inject('$appConfig');
const { photoPath } = $appConfig;

const { name, hash, country } = useBorrowerProfileData();
const loading = computed(() => !name.value || !hash.value || !country.value);
</script>
