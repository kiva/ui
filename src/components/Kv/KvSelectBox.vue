<template>
	<div>
		<kv-text-input ref="input" :id="id" v-model="search" :can-clear="true" autocomplete="off" @focus="open" />
		<div
			ref="dropdown"
			:class="{ 'tw-hidden': !this.show }"
			class="
				tw-border
				tw-border-tertiary
				tw-py-0.5
				tw-rounded-sm
				tw-bg-white
				tw-overflow-auto"
			:style="{ 'max-height': '200px' }"
		>
			<ul>
				<li
					v-for="(item, i) in filteredItems"
					:key="i"
					class="tw-py-0.5 tw-px-1.5"
					:class="{
						'tw-pb-1': item.isHeader,
						'tw-cursor-pointer hover:tw-bg-action-highlight hover:tw-text-white': !item.isHeader
					}"
					@click="clickItem(item)"
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
		}
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
	},
	beforeDestroy() {
		document.removeEventListener('click', this.clickDocument);

		if (this.popper) {
			this.popper.destroy();
		}
	},
	computed: {
		filteredItems() {
			// Lower case search non-header items
			const filtered = this.items
				.filter(i => i.isHeader || i.name.toLowerCase().includes(this.search.toLowerCase().trim()));

			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < filtered.length; ++i) {
				// Remove headers that have no filtered items
				if (filtered[i].isHeader && (i + 1 === filtered.length || filtered?.[i + 1]?.isHeader)) {
					// eslint-disable-next-line no-plusplus
					filtered.splice(i--, 1);
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
	},
};
</script>
