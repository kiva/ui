<template>
	<form class="search-form"
		action="/lend"
		method="get"
		autocomplete="off"
		@submit.prevent="onSubmit"
	>
		<kv-icon class="search-icon" name="magnify-glass" />
		<input type="search"
			ref="input"
			name="queryString"
			:value="displayTerm"
			@input="term = $event.target.value"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.up.prevent="listUp"
			@keydown.down.prevent="listDown"
			placeholder="Search all loans"
		>
		<ol v-show="showResults" class="search-results">
			<li v-for="section in sections" :key="section.name" class="section">
				<h2>{{ section.name }}</h2>
				<ol class="section-results">
					<li v-for="suggestion in section.suggestions"
						:key="suggestion.label"
						@mousedown.prevent
						@click="runSearch(suggestion)"
						class="result"
						:class="{highlighted: suggestion.label === highlighted.label}"
					>
						<span v-html="formatResult(suggestion)"></span>
					</li>
				</ol>
			</li>
		</ol>
		<input type="submit" class="hidden-submit">
	</form>
</template>

<script>
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _zip from 'lodash/zip';
import KvIcon from '@/components/Kv/KvIcon';
import SearchEngine from '@/util/searchEngine';
import { indexIn } from '@/util/comparators';

const engine = new SearchEngine();

export default {
	components: {
		KvIcon
	},
	data() {
		return {
			term: '',
			listIndex: -1,
			hasFocus: false,
			searching: false,
			rawResults: [],
		};
	},
	computed: {
		displayTerm() {
			return this.highlighted.label ? this.highlighted.label : this.term;
		},
		highlighted() {
			if (this.listIndex > -1) {
				let wanted = this.listIndex;
				for (let i = 0; i < this.sections.length; i += 1) {
					if (this.sections[i].suggestions.length > wanted) {
						return this.sections[i].suggestions[wanted];
					}
					wanted -= this.sections[i].suggestions.length;
				}
			}
			return {};
		},
		showResults() {
			return this.sections.length > 0 && this.hasFocus && !this.searching;
		},
		sections() {
			// Group the results by their group name
			const groups = _groupBy(this.rawResults, 'group');

			// From the groups, build the sections of suggestions to display
			const unsortedSections = _map(groups, (groupResults, name) => {
				// Limit the displayed results to the first 5
				const suggestions = _take(groupResults, 5);

				// Construct the section, using the group name and sorted results
				return { name, suggestions };
			});

			// Hard-coded display-order for the sections.
			const sectionOrder = [
				'Gender',
				'Regions',
				'Countries and Territories',
				'United States',
				'U.S. cities',
				'Sectors',
				'Group or Individual',
				'Attributes',
				'User tags',
				'Partners'
			];
			return unsortedSections.sort(indexIn(sectionOrder, 'name'));
		}
	},
	methods: {
		focus() {
			this.$refs.input.focus();
		},
		onFocus() {
			this.hasFocus = true;
			this.$store.dispatch('getLoanSearchSuggestions').then(suggestions => {
				engine.reset(suggestions);
			});
		},
		onBlur() {
			this.hasFocus = false;
			this.listIndex = -1;
		},
		listDown() {
			// Highlight the next item down in the result list.
			this.listIndex += 1;
			// Loop back to nothing (-1) if there are no items left in the list.
			if (this.listIndex === this.rawResults.length) {
				this.listIndex = -1;
			}
		},
		listUp() {
			// Jump to the end to the list if nothing was highlighted previously.
			if (this.listIndex === -1) {
				this.listIndex = this.rawResults.length;
			}
			// Highlight the previous item up in the result list.
			this.listIndex -= 1;
		},
		onSubmit() {
			if (this.listIndex > -1) {
				this.runSearch(this.highlighted);
			} else {
				this.runSearch(this.term);
			}
		},
		runSearch(suggestion) {
			let query;
			if (suggestion.query) {
				const [key, value] = suggestion.query.split('=');
				query = { [key]: value };
			} else {
				query = { queryString: suggestion };
			}
			this.searching = true;
			this.$router.push({ path: '/lend', query });
		},
		formatResult({ label, matches }) {
			// If no match is found, just return the label, unmarked
			if (!matches || !matches.length) {
				return label;
			}

			// Take array like [[2, 3], [6, 9], [11, 14]] and turn it into two separate arrays,
			// [2, 6, 11] and [3, 9, 14], named 'starts' and 'ends', respectively.
			// 'starts' is the indices of the label where a match starts, and thus should
			// have a '<mark>' tag inserted.
			// 'ends' is the indices of the label where a match ends, and thus should
			// have a '</mark>' tag inserted.
			const [starts, ends] = _zip(...matches);

			// Build an array of strings, inserting the <mark> tags at the appropriate indices
			const charArray = _map(label, (character, index) => {
				const prefix = starts.indexOf(index) > -1 ? '<mark>' : '';
				const suffix = ends.indexOf(index) > -1 ? '</mark>' : '';
				return `${prefix}${character}${suffix}`;
			});

			// Return all the the strings in the array concatenated together
			return charArray.join('');
		},
	},
	watch: {
		term(term) {
			// Reset the result list index, since the list is about to change
			this.listIndex = -1;

			// Only search if there actually is a term entered
			if (term.length > 0) {
				engine.search(term).then(results => {
					this.rawResults = results;
				});
			} else {
				// No search term entered, so reset the result list
				this.rawResults = [];
			}
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

form.search-form {
	position: relative;
	height: 100%;
	width: 100%;
	z-index: 20;

	input[type="search"] {
		height: 100%;
		width: 100%;
		margin: 0;
	}

	.search-icon {
		position: absolute;
		left: 0.4rem;
		width: 1rem;
		height: 100%;
	}
}

.search-results {
	$spacing: 0.4rem;

	position: relative;
	z-index: 10;
	background-color: $white;
	border: 1px solid $gray;
	padding: $spacing;

	h2 {
		font-size: $small-text-font-size;
		font-weight: normal;
		margin: 0.3rem 0 0.4rem;
	}

	&,
	ol {
		margin: 0;
		list-style: none;
		text-align: left;
	}

	.result {
		cursor: pointer;
		padding: $spacing $spacing $spacing 1rem;
		font-size: $small-text-font-size;
		line-height: 1.2;
		font-weight: $global-weight-normal;

		mark {
			background: none;
			color: $body-font-color;
			font-weight: bold;
			text-decoration: underline;
		}

		&:hover,
		&:hover mark,
		&.highlighted,
		&.highlighted mark {
			color: $white;
			background-color: $kiva-accent-blue;
		}
	}

	.result:first-of-type {
		border-top: 1px solid $light-gray;
		margin-top: 0.2rem;
		padding-top: 0.4rem;
	}
}
</style>
