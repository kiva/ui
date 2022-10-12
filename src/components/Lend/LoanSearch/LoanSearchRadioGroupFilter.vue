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
			type: String,
			default: ''
		},
		filterKey: {
			type: String,
			required: true
		},
		eventAction: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			selectedOption: this.selected || '',
		};
	},
	computed: {
		displayedOptions() {
			return [
				// Don't show "all" until options have loaded
				...(this.options.length > 0 ? [{ title: ALL_LOANS_TITLE, name: '' }] : []),
				...this.options
			];
		}
	},
	methods: {
		setSelected(option) {
			if (option !== this.selectedOption) {
				this.selectedOption = option;

				// Return null as default to match GraphQL enum default
				this.$emit('updated', { [this.filterKey]: this.selectedOption || null });

				this.$kvTrackEvent?.('Lending', this.eventAction, this.selectedOption);
			}
		},
	},
	watch: {
		selected(next) {
			// The KvRadio component can't handle a null value
			const nextOption = this.options.map(o => o.name).includes(next) ? next : '';

			if (nextOption !== this.selectedOption) {
				// Don't emit when value is changed via the component prop
				this.selectedOption = nextOption;
			}
		},
	},
};
</script>
