<template>
	<fieldset class="tw-flex tw-items-center tw-justify-center tw-my-3" aria-label="Results per page">
		<label class="tw-text-secondary tw-whitespace-nowrap tw-mr-2">
			Loans per page
		</label>
		<kv-select id="results-per-page" v-model="selectedOption" @change="handleChanged">
			<option v-for="(option, i) in options" :key="i" :value="option" :aria-label="`${option} per page`">
				{{ option }}
			</option>
		</kv-select>
	</fieldset>
</template>

<script>
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export const defaultOptions = [15, 25, 50];

export default {
	name: 'KvResultsPerPage',
	components: {
		KvSelect,
	},
	props: {
		options: {
			type: Array,
			default: () => defaultOptions,
			validator: value => value.length > 0,
		},
		selected: {
			type: Number,
			default: undefined
		},
		scrollToTop: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			selectedOption: this.selected || this.options?.[0],
		};
	},
	methods: {
		handleChanged(pageLimit) {
			if (this.scrollToTop && window.scrollTo) {
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
			}

			this.$emit('updated', { pageLimit: +pageLimit });

			this.$kvTrackEvent?.('Lending', 'click-results-per-page', pageLimit);
		}
	},
	watch: {
		selected(next) {
			// Ensure the value is a valid option
			const nextSelected = this.options.includes(next) ? next : this.options?.[0];

			if (nextSelected !== this.selectedOption) {
				// Don't emit when value is changed via the component prop
				this.selectedOption = nextSelected;
			}
		},
	},
};
</script>
