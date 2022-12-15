<template>
	<div :class="{ 'tw-w-full': isFullWidth }">
		<kv-text-input
			ref="input"
			:id="id"
			v-model="search"
			:placeholder="placeholder"
			:can-clear="true"
			autocomplete="off"
			:class="{ 'tw-w-full': isFullWidth }"
			@focus="open"
		/>
		<div
			ref="dropdown"
			:class="{ 'tw-hidden': !this.show }"
			class="
				tw-border
				tw-border-tertiary
				tw-py-0.5
				tw-rounded-sm
				tw-bg-white
				tw-overflow-auto
				tw-z-2"
			:style="{ 'max-height': '200px' }"
		>
			<ul>
				<li
					v-for="(item, i) in filteredItems"
					:key="i"
					class="tw-py-0.5 tw-px-1.5"
					:class="{
						'tw-pb-1': item.isHeader,
						'tw-cursor-pointer hover:tw-bg-action-highlight hover:tw-text-white': !item.isHeader,
						'tw-bg-tertiary tw-pointer-events-none': itemSelected(item.id),
					}"
					@click="!item.isHeader && !itemSelected(item.id) && clickItem(item)"
				>
					<span :class="{ 'tw-border-b tw-pb-0.5': item.isHeader }">
						{{ item.name }}
					</span>
				</li>
				<li v-if="filteredItems.length === 0" class="tw-py-0.5 tw-px-1.5">
					{{ NO_RESULTS }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import _orderBy from 'lodash/orderBy';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export const NO_RESULTS = 'No results found';

export default {
	name: 'KvSelectBox',
	components: {
		KvTextInput,
	},
	props: {
		id: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			default: () => ([])
		},
		headerKey: {
			type: String,
			default: null
		},
		shouldSort: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default: ''
		},
		isFullWidth: {
			type: Boolean,
			default: false
		},
		selectedIds: {
			type: Array,
			default: () => ([])
		},
	},
	data() {
		return {
			NO_RESULTS,
			popper: null,
			show: false,
			search: '',
		};
	},
	mounted() {
		document.addEventListener('click', this.clickDocument);
		document.addEventListener('touchstart', this.clickDocument);
	},
	beforeDestroy() {
		document.removeEventListener('click', this.clickDocument);
		document.removeEventListener('touchstart', this.clickDocument);

		if (this.popper) {
			this.popper.destroy();
		}
	},
	computed: {
		filteredItems() {
			// Lowercase search the items
			let filtered = this.items.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase().trim()));

			if (this.shouldSort) {
				// Sort the items based on header key and name property
				filtered = _orderBy(filtered, this.headerKey ? [this.headerKey, 'name'] : ['name']);
			}

			if (this.headerKey) {
				// eslint-disable-next-line no-plusplus
				for (let i = 0; i < filtered.length; ++i) {
					const current = filtered[i];
					const next = filtered[i + 1];

					const currentHeader = current?.[this.headerKey];
					const nextHeader = next?.[this.headerKey];

					if (i === 0) {
						filtered.splice(0, 0, { name: currentHeader, isHeader: true });
					} else if (i < filtered.length - 1 && currentHeader !== nextHeader) {
						// Add header entry for the next item
						filtered.splice(i + 1, 0, { name: nextHeader, isHeader: true });

						// Move current index to new header entry
						i += 1;
					}
				}
			}

			return filtered;
		},
	},
	methods: {
		async open() {
			await this.initPopper();

			this.show = true;
		},
		close() {
			this.show = false;
		},
		async initPopper() {
			if (this.popper) return;

			const { default: Popper } = await import('popper.js');

			// In case popper was initialized in another callback while importing
			if (this.popper) return;

			this.popper = new Popper(this.$refs.input.$el, this.$refs.dropdown, { placement: 'bottom-start' });
		},
		clickDocument(e) {
			if (!this.$refs.input.$el.contains(e.target) && !this.$refs.dropdown.contains(e.target)) {
				this.close();
			}
		},
		clickItem({ id }) {
			this.$emit('selected', { id });
		},
		itemSelected(id) {
			return this.selectedIds.includes(id);
		},
	},
};
</script>
