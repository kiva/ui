<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" :selected-values="selectedValues" @updated="update" />
		</fieldset>
	</form>
</template>

<script>
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedNumLoansFundraising, getCheckboxLabel } from '@/util/loanSearch/filterUtils';

export default {
	name: 'LoanSearchCheckboxListFilter',
	components: {
		KvCheckboxList,
	},
	props: {
		options: {
			type: Array,
			default: () => []
		},
		ids: {
			type: Array,
			default: () => []
		},
		filterKey: {
			type: String,
			required: true
		},
		eventAction: {
			type: String,
			required: true
		},
	},
	data() {
		return {
			displayed: this.options,
			selectedIds: this.ids,
		};
	},
	computed: {
		items() {
			return this.displayed.map(d => ({
				value: d.id.toString(),
				title: getCheckboxLabel(d),
				disabled: d.numLoansFundraising === 0
			}));
		},
		selectedValues() {
			return this.selectedIds.map(s => s.toString());
		}
	},
	methods: {
		update({ values, changed }) {
			this.$emit('updated', { [this.filterKey]: values.map(v => +v) });

			const option = this.displayed.find(d => d.id === +changed);

			if (option) {
				this.$kvTrackEvent(
					'Lending',
					this.eventAction,
					option.name,
					values.includes(option.id.toString()) ? 'selected' : 'deselected'
				);
			}
		}
	},
	watch: {
		options(next) {
			this.displayed = getUpdatedNumLoansFundraising(this.displayed, next);
		},
		ids(next) {
			if ([...next].sort().toString() !== [...this.selectedIds].sort().toString()) {
				// Don't emit when value is changed via the component prop
				this.selectedIds = next;
			}
		},
	},
};
</script>
