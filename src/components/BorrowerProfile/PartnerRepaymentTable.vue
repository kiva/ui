<template>
	<div>
		<!-- Cards for small screens -->
		<table class="md:tw-hidden tw-w-full">
			<tbody>
				<tr
					v-for="row in rows"
					:key="row.dueDate"
					class="tw-mb-1"
				>
					<td
						class="
						tw-inline-block tw-w-full tw-bg-secondary tw-rounded tw-text-center
						tw-mb-2 tw-pb-1.5"
					>
						<p class="tw-text-upper tw-py-1.5">
							{{ row.periodLabel }}
						</p>
						<hr class="tw-mb-1.5 tw-mx-1.5">
						<p class="tw-mb-1.5">
							Expected: {{ row.expected }}
						</p>
						<p class="tw-mb-1.5">
							Actual: {{ row.actual }}
						</p>
						<p
							v-if="row.comment.text"
							class="tw-bg-primary tw-inline-block tw-px-2 tw-mx-auto tw-py-1 tw-rounded"
						>
							<kv-material-icon
								v-if="row.comment.tone"
								:icon="commentIcon(row.comment.tone)"
								class="tw-w-3 tw-h-3 tw-align-middle"
								:class="commentIconClass(row.comment.tone)"
							/>
							{{ row.comment.text }}
						</p>
						<p v-if="row.currencyLoss" class="tw-mt-1.5 tw-mx-1.5 tw-text-small">
							{{ row.currencyLoss }}
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Table for medium and up screens -->
		<table class="tw-table-auto tw-hidden md:tw-table tw-w-full">
			<thead class="tw-bg-secondary tw-text-left">
				<tr>
					<th><span class="tw-sr-only">Date</span></th>
					<th class="table-heading-spacing">
						Expected
					</th>
					<th class="table-heading-spacing">
						Actual
					</th>
					<th class="table-heading-spacing">
						Comments
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in rows"
					:key="row.dueDate"
					class="tw-mb-1"
				>
					<td class="table-data-spacing tw-font-medium">
						{{ row.periodLabel }}
					</td>
					<td class="table-data-spacing">
						{{ row.expected }}
					</td>
					<td class="table-data-spacing">
						{{ row.actual }}
					</td>
					<td class="table-data-spacing">
						<span v-if="row.comment.text">
							<kv-material-icon
								v-if="row.comment.tone"
								:icon="commentIcon(row.comment.tone)"
								class="tw-w-3 tw-h-3 tw-align-middle"
								:class="commentIconClass(row.comment.tone)"
							/>
							{{ row.comment.text }}
						</span>
						<span v-if="row.currencyLoss" class="tw-block">
							{{ row.currencyLoss }}
						</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import { DELINQUENT, REPAID } from '#src/util/repaymentSchedule';

export default {
	name: 'PartnerRepaymentTable',
	components: {
		KvMaterialIcon,
	},
	props: {
		rows: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		commentIcon(tone) {
			return tone === REPAID ? mdiCheckboxMarkedCircle : mdiMinusCircle;
		},
		commentIconClass(tone) {
			return tone === DELINQUENT ? 'tw-text-danger' : 'tw-text-brand-700';
		},
	},
};
</script>

<style lang="postcss" scoped>
.table-heading-spacing {
	@apply tw-py-2.5 tw-pl-1.5;
}

.table-data-spacing {
	@apply tw-p-1.5;
}
</style>
