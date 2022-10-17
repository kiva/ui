<template>
	<fieldset class="tw-flex tw-flex-col tw-gap-2 tw-my-2">
		<kv-radio
			v-for="option in displayedOptions"
			:key="option.name"
			:value="option.name"
			v-model="selectedOption"
			@change="setSelected"
		>
			{{ option.title }}
		</kv-radio>
	</fieldset>
</template>

<script>
import { getFilterKeyFromValue } from '@/util/loanSearch/filterUtils';
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';

export const ALL_LOANS_TITLE = 'All loans';

export default {
	name: 'LoanSearchRadioGroupFilter',
	components: {
		KvRadio,
	},
	props: {
		options: {
			type: Array,
			default: () => ([])
		},
		selected: {
			type: [String, Boolean, Object],
			default: ''
		},
		filterKey: {
			type: String,
			required: true
		},
		eventAction: {
			type: String,
			required: true
		},
		allOptionTitle: {
			type: String,
			default: ALL_LOANS_TITLE
		},
		valueMap: {
			type: Object,
			default: null
		},
	},
	data() {
		return {
			selectedOption: this.getOptionFromValue(this.selected),
		};
	},
	computed: {
		displayedOptions() {
			return [
				// Don't show "all" until options have loaded
				...(this.options.length > 0 ? [{ title: this.allOptionTitle, name: '', value: null }] : []),
				...this.options
			];
		}
	},
	methods: {
		getOptionFromValue(value) {
			const filterKey = this.valueMap ? getFilterKeyFromValue(value, this.valueMap) : value;

			// The KvRadio component can't handle a null value
			return this.options.find(o => o.name === filterKey)?.name ?? '';
		},
		setSelected(nextName) {
			if (nextName !== this.selectedOption) {
				const next = this.displayedOptions.find(o => o.name === nextName);

				if (next) {
					this.selectedOption = next.name;

					this.$emit('updated', { [this.filterKey]: next.value });

					this.$kvTrackEvent('Lending', this.eventAction, next.value);
				}
			}
		},
	},
	watch: {
		selected(nextValue) {
			const nextOption = this.getOptionFromValue(nextValue);

			if (nextOption !== this.selectedOption) {
				// Don't emit when value is changed via the component prop
				this.selectedOption = nextOption;
			}
		},
	},
};
</script>
