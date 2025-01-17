<template>
	<div>
		<div class="tw-flex tw-flex-col tw-gap-2">
			<kv-text-input
				v-model="searchText"
				placeholder="Search by name, ID, partner or location"
			/>
			<div class="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
				<div class="tw-flex tw-items-center tw-gap-2">
					<span class="tw-text-secondary tw-text-sm">Status:</span>
					<kv-select
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
				<div class="tw-flex tw-items-center tw-gap-4">
					<span class="tw-text-sm">{{ totalLoans }} loans</span>
					<kv-button
						class="tw-text-sm"
					>
						Export
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvSelect from '#kv-components/KvSelect';
import KvTextInput from '#kv-components/KvTextInput';
import KvButton from '#kv-components/KvButton';

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
			default: 2
		}
	}
};
</script>
