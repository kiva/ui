<template>
	<ul class="check-list" :class="rowClasses">
		<li
			:class="columnClasses"
			:key="id"
			v-for="{ id, name, selected } in items"
		>
			<kv-toggle
				class="list-item"
				:name="id"
				:value="selected"
				@input="$emit('change', $event, id)"
			>
				<span class="list-item-label">{{ name }}</span>
			</kv-toggle>
		</li>
	</ul>
</template>

<script>
import KvToggle from '@/components/Kv/KvToggle';

export default {
	props: {
		items: {
			type: Array,
			default: () => [],
		},
		useBlockGrid: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		KvToggle,
	},
	computed: {
		columnClasses() {
			return this.useBlockGrid ? ['column'] : [];
		},
		rowClasses() {
			return this.useBlockGrid ? ['row', 'collapse', 'small-up-1', 'medium-up-2', 'large-up-3'] : [];
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.check-list {
	list-style: none;
	margin: 0;

	.list-item {
		line-height: 1;
		margin: 0 0 0.75rem;
	}

	.list-item-label {
		margin-left: 0.75rem;
		vertical-align: middle;
	}
}
</style>
