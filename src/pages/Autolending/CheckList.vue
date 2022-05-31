<template>
	<div>
		<button class="tw-text-link tw-mb-1" @click="emitAll(true)">
			Select All
		</button>
		&nbsp;
		<button class="tw-text-link tw-mb-1" @click="emitAll(false)">
			Deselect All
		</button>
		<ul class="check-list" :class="{ 'use-columns': useColumns }">
			<li
				:key="id"
				v-for="{ id, name, selected } in items"
				class="tw-mb-0.5"
			>
				<kv-checkbox
					:id="`${name}-${id}` | changeCase('paramCase')"
					:checked="selected"
					@change="$emit('change', $event, id);"
				>
					{{ name }}
				</kv-checkbox>
			</li>
		</ul>
	</div>
</template>

<script>
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
	name: 'CheckList',
	props: {
		items: {
			type: Array,
			default: () => [],
		},
		useColumns: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		KvCheckbox,
	},
	methods: {
		emitAll(checked) {
			const ids = this.items.map(x => x.id);
			this.$emit('change', checked, ids);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.check-list {
	&.use-columns {
		li {
			-webkit-column-break-inside: avoid;
			page-break-inside: avoid;
			break-inside: avoid;
		}

		@include breakpoint(medium) {
			column-count: 2;
		}

		@include breakpoint(large) {
			column-count: 3;
		}
	}
}
</style>
