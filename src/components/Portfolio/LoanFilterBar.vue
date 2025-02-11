<template>
	<div>
		<div class="tw-flex tw-flex-col">
			<div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
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
					<span class="tw-text-secondary tw-text-sm">Status:</span>
					<kv-select
						id="loan-filter-select"
						v-model="selectedStatus"
						class="tw-min-w-[120px]"
					>
						<option value="all">
							All loans
						</option>
					</kv-select>
				</div>
				<div class="tw-flex tw-items-center tw-gap-2">
					<span class="tw-text-secondary tw-text-sm">Filter by:</span>
					<kv-select
						v-model="selectedLocation"
						class="tw-min-w-[120px]"
					>
						<option value="all">
							Location
						</option>
					</kv-select>
					<kv-select
						v-model="selectedPartner"
						class="tw-min-w-[120px]"
					>
						<option value="all">
							Partner
						</option>
					</kv-select>
				</div>
			</div>
		</div>
		<div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
			<div class="tw-text-secondary">
				Sorted by date posted on Kiva
			</div>
		</div>
	</div>
</template>

<script>
import { KvSelect, KvTextInput, KvButton } from '@kiva/kv-components';

export default {
	name: 'LoanFilterBar',
	components: {
		KvSelect,
		KvTextInput,
		KvButton,
	},
	data() {
		return {
			searchText: '',
			selectedStatus: 'all',
			selectedLocation: 'all',
			selectedPartner: 'all'
		};
	},
	props: {
		totalLoans: {
			type: Number,
			default: 0
		}
	}
};
</script>
