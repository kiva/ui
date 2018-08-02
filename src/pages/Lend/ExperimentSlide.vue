<template>
	<div class="experiment-slide">
		<div class="sidebar">
			<slot></slot>
		</div>
		<category-set :categories.sync="list" v-bind="$attrs" />
	</div>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import CategorySet from './CategorySet';

export default {
	components: {
		CategorySet,
	},
	inheritAttrs: false,
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			list: [],
		};
	},
	watch: {
		list: {
			handler(list) {
				if (!_isEqual(this.categories, list)) {
					this.$emit('update:categories', list);
				}
			},
			deep: true,
		},
		categories: {
			handler(categories) {
				if (!_isEqual(this.list, categories)) {
					this.list = _cloneDeep(categories);
				}
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.experiment-slide {
	display: flex;
	justify-content: space-between;
	margin: 0.5rem 0;
	padding: 0.5rem;
	border: 1px solid $kiva-stroke-gray;
	background-color: $kiva-bg-lightgray;

	label {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;

		input {
			width: auto;
			margin: 0 0.25rem;
		}
	}
}
</style>
