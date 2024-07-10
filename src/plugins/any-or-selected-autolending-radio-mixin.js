import { gql } from '@apollo/client';

export default {
	props: {
		selectorShown: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			radio: 'all',
			currentFilterValues: []
		};
	},
	methods: {
		saveAny() {
			const filter = this.radioKey;
			this.apollo.mutate({
				mutation: gql`mutation saveAny($filters: LoanSearchFiltersInput!) {
							autolending @client {
								id
								editProfile(profile: {
									loanSearchCriteria: {
										filters: $filters
									}
								})
							}
						}`,
				variables: {
					filters: {
						[filter]: null
					}
				}
			});
		},
		emitChangeEvent(value) {
			this.$emit('change', {
				radioKey: this.radioKey,
				value
			});
		},
		selectedFiltersFormattedString(selectedFilters) {
			// the selected items limited to 10
			const selectedFiltersShortList = selectedFilters.slice(0, 10);

			// the count of items that aren't being displayed
			const itemsRemaining = selectedFilters.length - selectedFiltersShortList.length;

			const arrayOfSelectedThemeNames = selectedFiltersShortList.map(filter => filter.name).join(', ');
			const extra = itemsRemaining > 0 ? `, +${itemsRemaining} more` : '';
			return `${arrayOfSelectedThemeNames}${extra}`;
		},
	},
	watch: {
		selectorShown(value) {
			// If going 'back to all options' and no countries are selected, set value back to any
			if (!value && this.currentFilterValues.length === 0) {
				this.radio = 'all';
			}
		}
	}
};
