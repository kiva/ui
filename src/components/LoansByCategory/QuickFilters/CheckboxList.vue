<template>
	<div class="tw-my-.5 tw-mb-1">
		<div class="tw-flex tw-justify-between tw-mb-1">
			<button class="tw-text-link" @click="toggleSelectAll()">
				{{ isAllSelected ? 'Deselect' : 'Select' }} all
			</button>

			<button class="tw-hidden lg:tw-block" @click="$emit('closeRegions')">
				<kv-material-icon
					class="tw-w-3 tw-h-3 tw-cursor-pointer"
					:icon="mdiClose"
				/>
			</button>
		</div>
		<div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-1.5 tw-mb-1">
			<div v-for="(item, i) in items" :key="i">
				<kv-checkbox
					:value="item.value"
					:key="item.value"
					:disabled="item.disabled"
					v-model="selected"
					@change="updateSelected($event, item.value)"
				>
					{{ item.title }}
				</kv-checkbox>
			</div>
		</div>
	</div>
</template>

<script>
import { mdiClose } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	name: 'CheckboxList',
	components: {
		KvCheckbox,
		KvMaterialIcon
	},
	props: {
		/**
		 * The items to display in the checkbox list
		 * Expected format: { value: 'value', title: 'title', disabled: true }
		 */
		items: {
			type: Array,
			required: true,
		},
		/**
		 * The selected values (array of strings)
		 */
		selectedValues: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			mdiClose,
			selected: this.selectedValues,
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
			this.updateSelected(this.selected, undefined, true);
		},
		updateSelected(values, changed, wasSelectAll) {
			this.$emit('updated', { values: [...values], changed, wasSelectAll });
		},
	},
	watch: {
		selectedValues(next) {
			if ([...next].sort().toString() !== [...this.selected].sort().toString()) {
				// Don't emit when value is changed via the component prop
				this.selected = next;
			}
		},
	}
};
</script>
