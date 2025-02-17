<template>
	<div>
		<div class="tw-flex tw-flex-col">
			<div class="tw-flex tw-justify-between tw-mb-2">
				<div class="tw-text-sm tw-text-h2">
					Filter loans
				</div>
				<kv-button
					class="tw-text-sm"
					variant="primary"
				>
					Export {{ totalLoans }} loans
				</kv-button>
			</div>
			<kv-text-input
				id="loan-filter-text-input"
				v-model="searchText"
				placeholder="Search by name, ID, partner or location"
			/>
			<div class="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-mt-2">
				<div class="tw-flex tw-items-center tw-gap-2">
					<span class="tw-text-secondary">Status:</span>
					<kv-select
						id="loan-filter-select"
						v-model="selectedStatus"
					>
						<option value="all">
							All statuses
						</option>
					</kv-select>
				</div>
				<div class="tw-flex tw-items-center tw-gap-2">
					<span class="tw-text-secondary">Filter by:</span>
					<kv-select
						v-model="selectedLocation"
					>
						<option value="all">
							All regions
						</option>
					</kv-select>
					<kv-select
						v-model="selectedPartner"
					>
						<option value="all">
							All partners
						</option>
					</kv-select>
				</div>
			</div>
		</div>
		<div class="tw-text-secondary tw-mt-2">
			Sorted by date posted on Kiva
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { KvSelect, KvTextInput, KvButton } from '@kiva/kv-components';

defineProps({
	totalLoans: {
		type: Number,
		default: 0
	}
});

const searchText = ref('');
const selectedStatus = ref('all');
const selectedLocation = ref('all');
const selectedPartner = ref('all');
</script>
