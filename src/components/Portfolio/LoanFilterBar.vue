<template>
	<div>
		<div class="tw-flex tw-flex-col">
			<kv-text-input
				id="loan-filter-text-input"
				v-model="searchText"
				placeholder="Search by name, ID, partner or location"
			/>
			<div class="tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-gap-2 tw-mt-2">
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
				<div class="tw-flex tw-flex-row tw-items-center tw-gap-2">
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
				<div class="lg:tw-ml-auto">
					<kv-button
						class="tw-text-sm"
						variant="primary"
						v-kv-track-event="['portfolio', 'click', 'export-loans']"
						@click="handleExportClick"
					>
						Export {{ totalLoans }} loans
					</kv-button>
				</div>
			</div>
		</div>
		<div class="tw-text-secondary tw-mt-2">
			Sorted by date posted on Kiva
		</div>
	</div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { KvSelect, KvTextInput, KvButton } from '@kiva/kv-components';
import logReadQueryError from '#src/util/logReadQueryError';
import userIdQuery from '#src/graphql/query/userId.graphql';
import logFormatter from '#src/util/logFormatter';

const props = defineProps({
	totalLoans: {
		type: Number,
		default: 0
	}
});

const apollo = inject('apollo');
const searchText = ref('');
const selectedStatus = ref('all');
const selectedLocation = ref('all');
const selectedPartner = ref('all');

const handleExportClick = async () => {
	try {
		const { data } = await apollo.query({
			query: userIdQuery
		});

		const userId = data?.my?.userAccount?.id;
		if (!userId) {
			logFormatter('No user ID available for export');
			return;
		}

		const queryParams = new URLSearchParams({
			iDisplayStart: '0',
			iDisplayLength: props.totalLoans.toString(),
			user_id: userId.toString()
		});

		window.location.href = `/portfolio/loans/export?${queryParams.toString()}`;
	} catch (error) {
		logReadQueryError(error, 'LoanFilterBar userIdQuery');
	}
};
</script>
