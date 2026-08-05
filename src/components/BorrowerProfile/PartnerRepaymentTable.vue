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
							<repayment-comment :tone="row.comment.tone" :text="row.comment.text" />
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
						<repayment-comment :tone="row.comment.tone" :text="row.comment.text" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import RepaymentComment from '#src/components/BorrowerProfile/RepaymentComment';

export default {
	name: 'PartnerRepaymentTable',
	components: {
		RepaymentComment,
	},
	props: {
		rows: {
			type: Array,
			default: () => [],
		},
	},
};
</script>

<style lang="postcss" scoped>
.table-heading-spacing {
	@apply tw-py-2.5 tw-px-1.5;
}

.table-data-spacing {
	@apply tw-p-1.5;
}
</style>
