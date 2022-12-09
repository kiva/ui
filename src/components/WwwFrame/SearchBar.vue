<template>
	<form
		class="search-form tw-relative"
		autocomplete="off"
		@submit.prevent="onSubmit"
	>
		<label for="top-nav-search" class="tw-sr-only">Search all loans</label>
		<kv-text-input
			type="text"
			id="top-nav-search"
			ref="input"
			name="queryString"
			data-testid="header-search-text-input"
			:icon="mdiMagnify"
			:model-value="displayTerm"
			:can-clear="true"
			class="tw-w-full"
			@input="onInput"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.up.prevent="listUp"
			@keydown.down.prevent="listDown"
			placeholder="Search all loans"
		/>

		<ol
			v-show="showResults"
			:style="searchResultsStyle"
			class="
				search-results
				tw-w-full
				tw-bg-primary
				tw-p-2.5
				tw-border
				tw-border-tertiary

				tw-fixed
				tw-z-popover
				tw-right-0
				tw-bottom-0
				tw-left-0
				tw-overflow-auto

				md:tw-absolute
				md:tw-bottom-auto
				md:tw-top-auto
				md:tw-rounded-b
			"
		>
			<li
				v-for="section in sections" :key="section.name" class="section"
				:data-testid="`header-search-results-${section.name}`"
			>
				<h2 class="tw-text-base tw-py-0.5">
					{{ section.name }}
				</h2>
				<ol>
					<li
						v-for="suggestion in section.suggestions"
						:key="suggestion.label"
						@mousedown.prevent
						@click="runSearch(suggestion)"
						data-testid="header-search-result-item"
						class="
							tw-pl-1.5 tw-py-0.5 tw-rounded-sm
							tw-font-medium tw-cursor-pointer
							hover:tw-bg-secondary hover:tw-underline
						"
						:class="{'tw-bg-secondary tw-underline': suggestion.label === highlighted.label}"
					>
						<span v-html="formatResult(suggestion)"></span>
					</li>
				</ol>
			</li>
		</ol>
		<input type="submit" class="tw-sr-only" aria-hidden="true" tabindex="-1">
	</form>
</template>

<script>
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _zip from 'lodash/zip';
import suggestionsQuery from '@/graphql/query/loanSearchSuggestions.graphql';
import SearchEngine from '@/util/searchEngine';
import { indexIn } from '@/util/comparators';
import { mdiMagnify } from '@mdi/js';
import lockScrollUtils from '@/plugins/lock-scroll';
import getCacheKey from '@/util/getCacheKey';
import { hasExcludedQueryParams } from '@/util/loanSearch/queryParamUtils';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const engine = new SearchEngine();

export default {
	name: 'SearchBar',
	serverCacheKey: () => getCacheKey('SearchBar'),
	components: {
		KvTextInput,
	},
	inject: ['apollo'],
	mixins: [
		lockScrollUtils,
	],
	data() {
		return {
			term: '',
			listIndex: -1,
			hasFocus: false,
			searching: false,
			rawResults: [],
			searchResultsStyle: null,
			mdiMagnify,
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
				'Partners',
				'Gifts'
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
			this.apollo.query({ query: suggestionsQuery }).then(({ data }) => {
				if (data && data.lend) {
					engine.reset([
						...data.lend.loanSearchSuggestions,
						{
							group: 'Gifts',
							label: 'Kiva Cards',
							keywords: ['gift card', 'kiva card', 'gift', 'gift certificate'],
							url: 'https://www.kiva.org/gifts/kiva-cards',
						},
						{
							group: 'Gifts',
							label: 'Kiva Store',
							keywords: ['gift card', 'kiva card', 'gift', 'gift certificate'],
							url: 'https://store.kiva.org',
						},
					]);
				}
			});
		},
		onBlur() {
			this.hasFocus = false;
			this.listIndex = -1;
		},
		onInput(value) {
			this.term = value;
		},
		onSubmit() {
			if (this.listIndex > -1) {
				this.runSearch(this.highlighted);
			} else {
				this.runSearch(this.term);
			}
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
		runSearch(suggestion) {
			let query;
			this.searching = true;

			if (suggestion.url) {
				window.location = suggestion.url;
			} else {
				if (suggestion.query) {
					const [key, value] = suggestion.query.split('=');
					query = { [key]: value };
				} else {
					query = { queryString: suggestion };
				}

				// Fallback to legacy filter if there's an unsupported query param
				let filterUrl = '/lend/filter';
				if (hasExcludedQueryParams(query)) {
					filterUrl = '/lend';
				}

				window.location.href = `${filterUrl}?${new URLSearchParams(query).toString()}`;
			}
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
				const prefix = starts.indexOf(index) > -1
					? '<mark class="tw-bg-tertiary tw-rounded-sm tw-mix-blend-multiply tw-p-0.5 tw--m-0.5">' : '';
				const suffix = ends.indexOf(index) > -1 ? '</mark>' : '';
				return `${prefix}${character}${suffix}`;
			});

			// Return all the the strings in the array concatenated together
			return charArray.join('');
		},
	},
	watch: {
		hasFocus(hasFocus) {
			if (hasFocus) {
				// Get the bottom coordinate of the search input for positioning the results
				// on mobile. This can vary depending on if promo banners are pushing it down.
				const bottomEdgeOfSearchInput = this.$refs.input.$el.getBoundingClientRect().bottom;
				this.searchResultsStyle = { '--search-input-bottom': `${bottomEdgeOfSearchInput}px` };
				this.lockScrollSmallOnly();
			} else {
				this.unlockScrollSmallOnly();
			}
		},
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

<style lang="postcss" scoped>
	.search-results {
		top: calc(var(--search-input-bottom) + 1rem);
	}

	@screen md {
		.search-results {
			top: auto;
		}
	}
</style>
