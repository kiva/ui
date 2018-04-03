<template>
	<form class="search-form" action="." autocomplete="off">
		<kv-icon class="search-icon" name="magnify-glass" />
		<input type="search"
			ref="input"
			v-model="term"
			@focus="onFocus"
			@keydown.up.prevent="listUp"
			@keydown.down.prevent="listDown"
			placeholder="Search all loans"
		>
		<ol v-show="sections.length > 0" class="search-results">
			<li v-for="section in sections" :key="section.name" class="section">
				<h2>{{ section.name }}</h2>
				<ol class="section-results">
					<li v-for="suggestion in section.suggestions"
						:key="suggestion.label"
						class="result"
						:class="{highlighted: suggestion.label === highlighted.label}"
					>
						<span v-html="formatResult(suggestion.label)"></span>
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
import KvIcon from '@/components/Kv/KvIcon';
import SearchEngine from '@/util/searchEngine';

const engine = new SearchEngine();

export default {
	components: {
		KvIcon
	},
	data() {
		return {
			term: '',
			sections: [],
			listIndex: -1,
		};
	},
	computed: {
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
		resultLength() {
			return this.sections.reduce((total, section) => total + section.suggestions.length, 0);
		},
	},
	methods: {
		focus() {
			this.$refs.input.focus();
		},
		onFocus() {
			this.$store.dispatch('getLoanSearchSuggestions').then(suggestions => {
				engine.reset(suggestions);
			});
		},
		listDown() {
			this.listIndex += 1;
			if (this.listIndex === this.resultLength) {
				this.listIndex = -1;
			}
		},
		listUp() {
			this.listIndex -= 1;
			if (this.listIndex === -2) {
				this.listIndex = this.resultLength - 1;
			}
		},
		formatResult(label) {
			// Find the part of the label that matches the searched term
			const match = label.match(new RegExp(`(^|\\s|\\()${this.term}`, 'i'));

			// Identify the beginning and ending indices of the term in the label
			const begin = match.index + match[1].length;
			const end = begin + this.term.length;

			// Split the label into the three parts
			const prefix = label.slice(0, begin);
			const matchingText = label.slice(begin, end);
			const suffix = label.slice(end);

			return `${prefix}<mark>${matchingText}</mark>${suffix}`;
		}
	},
	watch: {
		term(term) {
			if (term.length > 0) {
				engine.search(term).then(results => {
					// Group the results by their group name
					const groups = _groupBy(results, 'group');

					// From the groups, build the sections of suggestions to display
					this.sections = _map(groups, (groupResults, name) => {
						// Limit the displayed results to the first 5
						const suggestions = _take(groupResults, 5);

						// Construct the section, using the group name and sorted results
						return { name, suggestions };
					});
				});
			} else {
				this.sections = [];
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

	input[type="search"] {
		height: 100%;
		width: 100%;
		margin: 0;
	}

	.icon {
		position: absolute;
		left: 0.4rem;
		width: 1rem;
		height: 100%;
	}
}

.search-results {
	$spacing: 0.4rem;

	background-color: $white;
	border: 1px solid $gray;
	padding: $spacing;

	h2 {
		font-size: $small-text-font-size;
		font-weight: normal;
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
