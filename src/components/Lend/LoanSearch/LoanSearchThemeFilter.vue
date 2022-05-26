<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" @updated="updateThemes" />
		</fieldset>
	</form>
</template>

<script>
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedThemes, getCheckboxLabel } from '@/util/loanSearchUtils';

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
		}
	},
	data() {
		return {
			displayedThemes: this.themes,
		};
	},
	computed: {
		items() {
			return this.displayedThemes.map(c => ({
				value: c.name,
				title: getCheckboxLabel(c),
				disabled: c.numLoansFundraising === 0
			}));
		}
	},
	methods: {
		updateThemes(themes) {
			this.$emit('updated', { theme: themes });
		}
	},
	watch: {
		themes(nextThemes) {
			this.displayedThemes = getUpdatedThemes(this.displayedThemes, nextThemes);
		},
	},
};
</script>
