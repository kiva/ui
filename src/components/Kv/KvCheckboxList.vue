<template>
	<menu class="tw-flex tw-flex-col tw-gap-1.5 tw-my-.5 tw-mb-1">
		<li v-if="showSelectAll">
			<button class="tw-text-link" @click="toggleSelectAll()">
				{{ isAllSelected ? 'Deselect' : 'Select' }} all
			</button>
		</li>
		<li v-for="(item, i) in items" :key="i">
			<kv-checkbox :value="item.value" v-model="selected">
				{{ item.title }}
			</kv-checkbox>
		</li>
	</menu>
</template>

<script>
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	components: {
		KvCheckbox,
	},
	props: {
		/**
		 * Whether to show the select/deselect all link
		 */
		showSelectAll: {
			type: Boolean,
			default: false
		},
		/**
		 * The items to display in the checkbox list
		 * Expected format: { value: 'value', title: 'title' }
		 */
		items: {
			type: Array,
			required: true,
		},
		/**
		 * The initially selected items
		 * Expected format: { value: 'value', title: 'title' }
		 */
		initialSelected: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			selected: this.initialSelected,
		};
	},
	computed: {
		isAllSelected() {
			return this.items.every(item => this.selected.includes(item.value));
		},
	},
	methods: {
		toggleSelectAll() {
			const isAll = this.isAllSelected;
			this.items.forEach(item => {
				const index = this.selected.indexOf(item.value);
				const exists = index !== -1;
				if (isAll) {
					if (exists) this.selected.splice(index, 1);
				} else if (!exists) this.selected.push(item.value);
			});
		},
	},
	watch: {
		selected(next) {
			this.$emit('updated', next);
		}
	},
};
</script>
