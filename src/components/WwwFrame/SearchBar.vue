<template>
	<form class="search-form" action="." autocomplete="off">
		<kv-icon class="search-icon" name="magnify-glass" />
		<input type="search"
			ref="input"
			v-model="term"
			@focus="onFocus"
			placeholder="Search all loans"
		>
		<ol v-show="sections.length > 0" class="search-results">
			<li v-for="section in sections" :key="section.name" class="section">
				<h2>{{ section.name }}</h2>
				<ol class="section-results">
					<li v-for="suggestion in section.suggestions" :key="suggestion.label" class="result">
						{{ suggestion.label }}
					</li>
				</ol>
			</li>
		</ol>
		<input type="submit" class="hidden-submit">
	</form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	data() {
		return {
			term: '',
		};
	},
	computed: {
		...mapState({
			sections: state => state.loan.filteredSuggestions,
		})
	},
	methods: {
		...mapActions({
			onFocus: 'getLoanSearchSuggestions'
		}),
		focus() {
			this.$refs.input.focus();
		}
	},
	watch: {
		term(term) {
			this.$store.dispatch('enterLoanSearchTerm', term);
		}
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

		&:hover {
			color: $white;
			background-color: $kiva-accent-blue;
		}
	}

	.result:first-of-type {
		border-top: 1px solid $light-gray;
		margin-top: 0.2rem;
		padding-top: 0.4rem;
	}

	.tt-cursor {
		color: $white;
		background-color: $kiva-accent-blue;
	}

	.tt-highlight {
		text-decoration: underline;
	}
}
</style>
