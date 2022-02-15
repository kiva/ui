<template>
	<div>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="tags"
					:items="tagsWithSelected"
					:use-columns="true"
					@change="onChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from '@/pages/Autolending/CheckList';

export default {
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	props: {
		allTags: {
			type: Array,
			default: () => []
		},
		initialTags: {
			type: Array,
			default: () => []
		},
		selectedTags: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			currentTagIds: [],
		};
	},
	created() {
		this.setFilterState();
	},
	computed: {
		tagsWithSelected() {
			return this.eligibleTags.map(({ id, name }) => {
				return {
					id,
					name,
					selected: this.currentTagIds.indexOf(id) > -1,
				};
			});
		},
		eligibleTags() {
			// filters all tags against prescribed lsc loanTags
			const eligibleTags = this.allTags.filter(tag => {
				// omit reserved tags which are formatted with an underscore ie. "tag_named_tag"
				if (tag.name.indexOf('_') !== -1) {
					return false;
				}
				if (this.initialTags.length) {
					return this.initialTags.includes(tag.id) || false;
				}
				// omit private tags
				if (tag.vocabularyId === 3) {
					return false;
				}
				return true;
			});
			return eligibleTags || [];
		},
	},
	watch: {
		initialTags(next, prev) {
			if (!this.selectedTags && next !== prev) {
				this.setFilterState();
			}
		},
		selectedTags(next, prev) {
			if (next !== prev) {
				this.setFilterState();
			}
		}
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changeTags(this.getValues(checked, values, this.currentTagIds));
		},
		changeTags(tags) {
			this.currentTagIds = tags;
			this.$emit('updated-filters', {
				loanTags: tags.length ? tags : null
			});
		},
		setFilterState() {
			// set currently selected if present
			if (this.selectedTags) {
				this.currentTagIds = this.selectedTags;
				return true;
			}
			// fallback to initial settings if present
			if (this.initialTags) {
				this.currentTagIds = this.initialTags;
				return true;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
// @import 'settings';

</style>
