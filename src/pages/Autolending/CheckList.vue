<template>
	<ul class="check-list" :class="{ 'use-columns': useColumns }">
		<li
			:key="id"
			v-for="{ id, name, selected } in items"
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
</template>

<script>
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
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
};
</script>

<style lang="scss" scoped>
@import 'settings';

.check-list {
	list-style: none;
	margin: 0;

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
