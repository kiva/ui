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
							{{ row.dueFromBorrower }}
						</p>
						<hr class="tw-mb-1.5 tw-mx-1.5">
						<p class="tw-mb-1.5">
							Total amount due: {{ row.amountDue }}
						</p>
						<p class="tw-mb-1.5">
							Amount paid: {{ row.amountPaid || emptyAmount }}
						</p>
						<p class="tw-bg-primary tw-inline-block tw-px-2 tw-py-1 tw-rounded">
							{{ row.statusLabel }}
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Table for medium and up screens -->
		<table class="tw-table-auto tw-hidden md:tw-table tw-w-full">
			<thead class="tw-bg-secondary tw-text-left">
				<tr>
					<th class="table-heading-spacing">
						Total amount due
					</th>
					<th class="table-heading-spacing">
						Amount paid
					</th>
					<th class="table-heading-spacing">
						Due from borrower
					</th>
					<th class="table-heading-spacing">
						Status
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in rows"
					:key="row.dueDate"
					class="tw-mb-1"
				>
					<td class="table-data-spacing">
						{{ row.amountDue }}
					</td>
					<td class="table-data-spacing">
						{{ row.amountPaid || emptyAmount }}
					</td>
					<td class="table-data-spacing">
						{{ row.dueFromBorrower }}
					</td>
					<td class="table-data-spacing">
						{{ row.statusLabel }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name: 'DirectRepaymentTable',
	props: {
		rows: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			emptyAmount: '—',
		};
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
