<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" @updated="updateAttributes" />
		</fieldset>
	</form>
</template>

<script>
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedAttributes, getCheckboxLabel } from '@/util/loanSearchUtils';

export default {
	components: {
		KvCheckboxList,
	},
	props: {
		/**
		 * The attributes list to display has checkboxes. Expected format:
		 * [{
		 *   id: 1,
		 *   name: '',
		 *   numLoansFundraising: 1,
		 * }]
		 */
		attributes: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			displayedAttributes: this.attributes,
		};
	},
	computed: {
		items() {
			return this.displayedAttributes.map(c => ({
				value: c.name,
				title: getCheckboxLabel(c),
				disabled: c.numLoansFundraising === 0
			}));
		}
	},
	methods: {
		updateAttributes(attributes) {
			this.$emit('updated', { attribute: attributes });
		}
	},
	watch: {
		attributes(nextAttributes) {
			this.displayedAttributes = getUpdatedAttributes(this.displayedAttributes, nextAttributes);
		},
	},
};
</script>
