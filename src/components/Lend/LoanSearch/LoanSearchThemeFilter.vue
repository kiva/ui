<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" :selected-values="selectedThemeNames" @updated="updateThemes" />
		</fieldset>
	</form>
</template>

<script>
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedNumLoansFundraising, getCheckboxLabel } from '@/util/loanSearchUtils';

export default {
	name: 'LoanSearchThemeFilter',
	components: {
		KvCheckboxList,
	},
	props: {
		/**
		 * The themes list to display has checkboxes. Expected format:
		 * [{
		 *   id: 1,
		 *   name: '',
		 *   numLoansFundraising: 1,
		 * }]
		 */
		themes: {
			type: Array,
			default: () => []
		},
		themeNames: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			displayedThemes: this.themes,
			selectedThemeNames: this.themeNames,
		};
	},
	computed: {
		items() {
			return this.displayedThemes.map(t => ({
				// TODO: change to theme IDs when the theme ID filter is on prod
				value: t.name.toUpperCase(),
				title: getCheckboxLabel(t),
				disabled: t.numLoansFundraising === 0
			}));
		},
	},
	methods: {
		updateThemes({ values, changed }) {
			this.$emit('updated', { theme: values });

			// TODO: handle theme ID (converting to theme name) when theme ID filter used
			this.$kvTrackEvent?.(
				'Lending',
				'click-theme-filter',
				changed,
				values.includes(changed) ? 'selected' : 'deselected'
			);
		}
	},
	watch: {
		themes(nextThemes) {
			this.displayedThemes = getUpdatedNumLoansFundraising(this.displayedThemes, nextThemes);
		},
		themeNames(next) {
			if ([...next].sort().toString() !== [...this.selectedThemeNames].sort().toString()) {
				// Don't emit when value is changed via the component prop
				this.selectedThemeNames = next;
			}
		},
	},
};
</script>
