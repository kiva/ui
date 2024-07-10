<template>
	<div class="lg:tw-columns-2 tw-gap-x-4 tw-mb-4">
		<table class="tw-w-full">
			<thead class="tw-sr-only">
				<tr>
					<th>{{ measureName }}</th>
					<th>Percent of portfolio</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="row in rows"
					:key="row.label"
					class="odd:tw-bg-secondary"
				>
					<td class="tw-px-1 tw-py-0.5">
						{{ row.label }}
					</td>
					<td class="tw-px-1 tw-py-0.5 tw-text-right">
						{{ row.percent }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import numeral from 'numeral';

export default {
	name: 'DistributionTable',
	props: {
		measureName: {
			type: String,
			required: true,
		},
		values: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		rows() {
			return this.values.map(value => ({
				...value,
				percent: numeral(value.percent).format('0.00%')
			}));
		},
	},
};
</script>
