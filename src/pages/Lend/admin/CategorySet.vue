<template>
	<draggable
		v-model="list"
		element="ul"
		class="category-list"
	>
		<li
			class="category-item"
			v-for="(category, index) in list"
			:key="index"
		>
			<kv-icon name="list" class="icon" />
			<span>{{ index + 1 }}.</span>
			<select v-model="category.id">
				<option
					v-for="option in categoryOptions"
					:key="option.value"
					:value="option.value"
					:disabled="option.value === ''"
				>
					{{ option.label }}
				</option>
			</select>
			<kv-icon class="icon icon-x" name="x" @click.native="removeCategory(category)" :from-sprite="true" />
		</li>
		<template #footer>
			<kv-button class="add-button setting" @click.native="addCategory">
				+ Add category
			</kv-button>
		</template>
	</draggable>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _filter from 'lodash/filter';
import draggable from 'vuedraggable';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'CategorySet',
	components: {
		draggable,
		KvButton,
		KvIcon,
	},
	props: {
		categories: {
			type: Array,
			default: () => []
		},
		options: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			selected: '',
			list: [],
		};
	},
	computed: {
		categoryOptions() {
			return [{ label: 'Select category', value: '' }].concat(this.options);
		},
		filtered() {
			return _filter(this.list, ({ id }) => id !== '');
		},
	},
	watch: {
		filtered: {
			handler(filtered) {
				if (!_isEqual(this.categories, filtered)) {
					this.$emit('update:categories', filtered);
				}
			},
			deep: true,
		},
		categories: {
			handler(categories) {
				if (categories && categories.length) {
					if (!_isEqual(this.filtered, categories)) {
						this.list = _cloneDeep(categories);
					}
				} else {
					this.list = [{ id: '' }];
				}
			},
			immediate: true,
		},
	},
	methods: {
		addCategory() {
			this.list.push({ id: '' });
		},
		removeCategory(category) {
			this.list.splice(this.list.indexOf(category), 1);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.category-list {
	background-color: $kiva-bg-lightgray;
	margin: 0.5rem 0;
	padding: 0.5rem;
}

.category-item {
	display: flex;
	align-items: center;
	background-color: $kiva-bg-darkgray;
	padding: 0.25rem;

	& + & {
		margin-top: 0.25rem;
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
		margin: 0.5rem;
	}

	.icon-list {
		cursor: move;
	}

	.icon-x {
		cursor: pointer;
		stroke: $kiva-text-light;
	}

	&:hover .icon-x {
		stroke: $kiva-text-dark;
	}

	select {
		width: auto;
		margin: 0 0.5rem;
	}
}

.sortable-ghost {
	visibility: hidden;
}

.add-button {
	margin: 0.25rem 0 0;
}
</style>
