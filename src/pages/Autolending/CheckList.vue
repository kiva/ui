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
				<div class="list-item-label">
					{{ name }}
				</div>
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
		font-size: 1rem;

		@include breakpoint(large) {
			font-size: rem-calc(18);
		}
	}

	.list-item-label {
		margin-left: 2.75rem;
	}
}
</style>
