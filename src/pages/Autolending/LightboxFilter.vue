<template>
	<div class="lightbox-filter">
		<h3>{{ name | changeCase('title') }}</h3>
		<kv-radio
			class="filter-radio"
			:label-set="`${name}-radio-all`"
			radio-value="all"
			v-model="radio"
		>
			All {{ name }}
		</kv-radio>
		<kv-radio
			class="filter-radio"
			:label-set="`${name}-radio-some`"
			radio-value="some"
			v-model="radio"
		>
			Specific {{ name }} only.
			<button
				v-if="selectedItems.length > 0"
				class="edit-button"
				@click="openLightbox"
			>
				Edit <kv-icon name="pencil" title="edit" />
			</button>
		</kv-radio>
		<p class="selected-items">
			{{ selectedItemString }}
		</p>
		<kv-lightbox
			:visible="lightboxOpen"
			:no-padding-top="true"
			:no-padding-sides="true"
			:no-padding-bottom="true"
			@lightbox-closed="closeLightbox"
		>
			<slot :on-change="onChange">
				<h2>Select {{ name }}</h2>
				<check-list
					:items="itemsWithSelected"
					:use-block-grid="true"
					@change="onChange"
				/>
			</slot>
		</kv-lightbox>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import _union from 'lodash/union';
import _without from 'lodash/without';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvRadio from '@/components/Kv/KvRadio';
import CheckList from './CheckList';

export default {
	props: {
		allItems: {
			type: Array,
			default: () => [],
		},
		currentIds: {
			type: Array,
			default: () => [],
		},
		pluralName: {
			type: String,
			required: true,
		},
	},
	components: {
		CheckList,
		KvIcon,
		KvLightbox,
		KvRadio,
	},
	data() {
		return {
			lightboxOpen: false,
			radio: 'all',
		};
	},
	computed: {
		// lowercase version of the name
		name() {
			return this.pluralName.toLowerCase();
		},
		// all items but with an additinal 'selected' property
		itemsWithSelected() {
			return _map(this.allItems, ({ id, ...props }) => {
				return {
					id,
					...props,
					selected: this.currentIds.indexOf(id) > -1,
				};
			});
		},
		// only the items that have been selected
		selectedItems() {
			return _filter(this.itemsWithSelected, 'selected');
		},
		// the selected items limited to 10
		selectedItemShortList() {
			return this.selectedItems.slice(0, 10);
		},
		// the count of items that aren't being displayed
		itemsRemaining() {
			return this.selectedItems.length - this.selectedItemShortList.length;
		},
		// string of names of selected items
		selectedItemString() {
			const items = _map(this.selectedItemShortList, 'name').join(', ');
			const extra = this.itemsRemaining > 0 ? `, +${this.itemsRemaining} more` : '';
			return `${items}${extra}`;
		},
	},
	methods: {
		onChange(checked, values) {
			const codes = Array.isArray(values) ? values : [values];
			if (checked) {
				// Add the values to the current ids
				this.$emit('change', _union(this.currentIds, codes));
			} else {
				// Remove the values from the current ids
				this.$emit('change', _without(this.currentIds, ...codes));
			}
		},
		openLightbox() {
			this.lightboxOpen = true;
		},
		closeLightbox() {
			this.lightboxOpen = false;
			if (this.selectedItems.length === 0) {
				this.radio = 'all';
			}
		},
	},
	created() {
		if (this.currentIds.length) {
			this.radio = 'some';
		} else {
			this.radio = 'all';
		}
	},
	watch: {
		radio(value, oldValue) {
			if (value !== oldValue) {
				if (value === 'all' && this.currentIds.length) {
					// 'All ...' has been selected and we still have items, so change to an empty array
					this.$emit('change', []);
				} else if (value === 'some' && this.currentIds.length === 0) {
					// 'Some ...' has been selected and we don't have any items, so show the lightbox
					this.openLightbox();
				}
			}
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.lightbox-filter {
	h3 {
		font-size: 1rem;
		color: $kiva-text-light;
	}

	.filter-radio {
		display: block;
		margin: 0 0 0 -0.875rem;
	}

	.edit-button {
		color: $kiva-textlink;
		font-weight: 300;

		.icon {
			width: 0.75rem;
			height: 0.75rem;
		}
	}

	.selected-items {
		color: $kiva-text-light;
		margin-left: 1.5rem;
	}

	.kv-lightbox-wrap .kv-lightbox .lightbox-row .lightbox-columns .lightbox-content {
		padding: 1rem;
	}

	h2 {
		margin-bottom: 1rem;
	}
}
</style>
